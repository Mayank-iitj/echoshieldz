from fastapi import APIRouter, UploadFile, File, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import numpy as np
import soundfile as sf
import io
import time
import logging

from app.models.schemas import AnalysisResponse, AnalysisRequest
from app.db.postgres import get_db
from app.db import redis_client

logger = logging.getLogger("echoshield.api.call_analysis")

router = APIRouter(prefix="/calls", tags=["Call Analysis"])


def _run_inference_sync(app, audio_np: np.ndarray, phone_number: str, duration_sec: float):
    """Synchronous inference pipeline for thread pool execution."""
    from app.ml.asr_engine import ASREngine
    from app.ml.scam_classifier import ScamClassifier
    from app.ml.voice_stress_analyzer import VoiceStressAnalyzer
    from app.ml.deepfake_detector import DeepFakeVoiceDetector
    from app.ml.rag_matcher import ScamScriptMatcher
    from app.ml.risk_scorer import RiskSignals, compute_risk_score

    asr: ASREngine = app.state.asr
    scam_clf: ScamClassifier = app.state.scam_clf
    stress_analyzer: VoiceStressAnalyzer = app.state.stress_analyzer
    deepfake_detector: DeepFakeVoiceDetector = app.state.deepfake_detector
    rag_matcher: ScamScriptMatcher = app.state.rag_matcher

    # 1. ASR
    asr_result = asr.feed_chunk(audio_np)
    transcript = asr_result.transcript
    word_count = len(transcript.split()) if transcript else 0

    # 2. Scam NLP Classifier
    scam_result = scam_clf.predict(transcript) if transcript else type('obj', (object,), {'label': 'SAFE', 'confidence': 0.0})()

    # 3. Voice Stress
    stress_result = stress_analyzer.analyze(audio_np, word_count)

    # 4. DeepFake Voice
    deepfake_result = deepfake_detector.predict(audio_np)

    # 5. Caller Reputation (sync Redis lookup)
    import asyncio
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    reputation = loop.run_until_complete(
        redis_client.get_caller_reputation(phone_number)
    )
    loop.close()

    # 6. Script Match (RAG)
    script_match = rag_matcher.match_sync(transcript) if transcript else type('obj', (object,), {'score': 0.0, 'template': None})()

    # 7. Risk Score
    signals = RiskSignals(
        scam_label=scam_result.label,
        nlp_confidence=scam_result.confidence,
        stress_score=stress_result.stress_score,
        synthetic_probability=stress_result.synthetic_probability,
        deepfake_probability=deepfake_result.fake_probability,
        caller_reputation_score=reputation.get("score", 0.5),
        reported_count=reputation.get("reported_count", 0),
        script_match_score=script_match.score,
        matched_template=script_match.template,
        call_duration_sec=duration_sec,
        time_of_day_hour=__import__("datetime").datetime.now().hour
    )
    risk = compute_risk_score(signals)

    return {
        "transcript": transcript,
        "risk": risk,
        "scam_result": scam_result,
        "stress_result": stress_result,
        "deepfake_result": deepfake_result,
        "reputation": reputation,
        "script_match": script_match
    }


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_call_segment(
    request: Request,
    audio_file: UploadFile = File(...),
    phone_number: str = "",
    call_id: str = "",
    duration_sec: float = 0.0,
    db: Session = Depends(get_db)
):
    """
    POST /api/v1/calls/analyze
    Accept 5–10s WAV/PCM audio segment, return risk analysis.
    Called by Android app every 5 seconds during active call.
    """
    t0 = time.time()

    # --- Load audio ---
    audio_bytes = await audio_file.read()
    try:
        audio_np, sr = sf.read(io.BytesIO(audio_bytes), dtype="float32")
        if sr != 16000:
            import librosa
            audio_np = librosa.resample(audio_np, orig_sr=sr, target_sr=16000)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid audio: {e}")

    # --- Run inference pipeline ---
    try:
        future = request.app.state.executor.submit(
            _run_inference_sync, request.app, audio_np, phone_number, duration_sec
        )
        result = future.result(timeout=30)
    except Exception as e:
        logger.error(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")

    risk = result["risk"]

    latency_ms = (time.time() - t0) * 1000

    # Update call session in Redis
    try:
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(
            redis_client.set_call_session(
                call_id or f"temp_{int(time.time())}",
                risk.risk_score,
                result["transcript"],
                1,
                3600
            )
        )
        loop.close()
    except Exception as e:
        logger.warning(f"Redis update failed: {e}")

    return AnalysisResponse(
        call_id=call_id or f"temp_{int(time.time())}",
        risk_score=risk.risk_score,
        alert_level=risk.alert_level,
        scam_type=risk.scam_type,
        transcript=result["transcript"],
        explanation=risk.explanation,
        latency_ms=round(latency_ms, 1),
        top_signals=risk.top_signals
    )


@router.get("/session/{call_id}")
async def get_call_session(call_id: str):
    """Get active call session state."""
    session = await redis_client.get_call_session(call_id)
    if not session:
        return {"error": "Session not found"}
    return session