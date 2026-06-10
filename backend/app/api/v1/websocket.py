from fastapi import APIRouter, WebSocket, WebSocketDisconnect, WebSocketException
import asyncio
import json
import base64
import numpy as np
import logging

from app.models.schemas import WebSocketRiskUpdate, WebSocketSessionClosed

logger = logging.getLogger("echoshield.api.websocket")

router = APIRouter(prefix="/ws", tags=["WebSocket"])


def _run_inference(app, audio_np: np.ndarray, phone_number: str):
    """Run inference pipeline - same as REST but synchronous."""
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

    # 5. Caller Reputation
    from app.db import redis_client
    import asyncio
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    reputation = loop.run_until_complete(
        redis_client.get_caller_reputation(phone_number)
    )
    loop.close()

    # 6. Script Match
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
        call_duration_sec=0.0,
        time_of_day_hour=__import__("datetime").datetime.now().hour
    )
    risk = compute_risk_score(signals)

    return {
        "transcript": transcript,
        "risk": risk
    }


@router.websocket("/call/{call_id}")
async def call_analysis_stream(websocket: WebSocket, call_id: str):
    """
    WebSocket /api/v1/ws/call/{call_id}

    Protocol:
    - Client sends: { "type": "audio_chunk", "data": "<base64 PCM>", "sample_rate": 16000 }
    - Server sends: { "type": "risk_update", "risk_score": 72, "alert_level": "HIGH_RISK", ... }
    """
    await websocket.accept()
    app = websocket.app

    logger.info(f"WebSocket connected for call: {call_id}")
    chunk_count = 0

    try:
        async for message in websocket.iter_text():
            try:
                payload = json.loads(message)
            except json.JSONDecodeError:
                continue

            if payload.get("type") == "audio_chunk":
                chunk_count += 1
                phone_number = payload.get("phone_number", "")

                # Decode base64 PCM
                try:
                    pcm_bytes = base64.b64decode(payload["data"])
                    audio_np = np.frombuffer(pcm_bytes, dtype=np.float32)
                except Exception as e:
                    logger.error(f"Audio decode error: {e}")
                    await websocket.send_json({"type": "error", "message": str(e)})
                    continue

                # Non-blocking inference via thread pool
                try:
                    loop = asyncio.get_event_loop()
                    result = await loop.run_in_executor(
                        None,
                        lambda: _run_inference(app, audio_np, phone_number)
                    )

                    risk = result["risk"]

                    await websocket.send_json({
                        "type": "risk_update",
                        "call_id": call_id,
                        "risk_score": risk.risk_score,
                        "alert_level": risk.alert_level,
                        "scam_type": risk.scam_type,
                        "transcript": result["transcript"],
                        "explanation": risk.explanation,
                        "top_signals": risk.top_signals,
                        "chunk_number": chunk_count
                    })
                except Exception as e:
                    logger.error(f"Inference error: {e}")
                    await websocket.send_json({"type": "error", "message": str(e)})

            elif payload.get("type") == "call_end":
                logger.info(f"Call ended: {call_id}")
                await websocket.send_json({
                    "type": "session_closed",
                    "call_id": call_id,
                    "total_chunks": chunk_count
                })
                break

            elif payload.get("type") == "ping":
                await websocket.send_json({"type": "pong", "call_id": call_id})

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {call_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.close(code=1011, reason=str(e))
        except:
            pass