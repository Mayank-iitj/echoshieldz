from contextlib import asynccontextmanager
from concurrent.futures import ThreadPoolExecutor
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import get_settings
from app.core.logging import setup_logging
from app.api.v1.router import router as v1_router
from app.db.postgres import init_db
from app.db.redis_client import init_redis

settings = get_settings()
setup_logging()
logger = logging.getLogger("echoshield")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("EchoShield v2 starting up...")

    # Initialize thread pool for inference
    app.state.executor = ThreadPoolExecutor(max_workers=4)

    # Load ML models
    logger.info("Loading ML models...")

    try:
        from app.ml.asr_engine import ASREngine
        app.state.asr = ASREngine(model_id=settings.asr_model_id)
        app.state.asr.load()
        logger.info("ASR engine loaded")
    except Exception as e:
        logger.error(f"Failed to load ASR: {e}")
        app.state.asr = None

    try:
        from app.ml.scam_classifier import ScamClassifier
        app.state.scam_clf = ScamClassifier(model_path=settings.scambert_model_path)
        app.state.scam_clf.load()
        logger.info("Scam classifier loaded")
    except Exception as e:
        logger.error(f"Failed to load ScamBERT: {e}")
        app.state.scam_clf = None

    try:
        from app.ml.voice_stress_analyzer import VoiceStressAnalyzer
        app.state.stress_analyzer = VoiceStressAnalyzer()
        logger.info("Voice stress analyzer loaded")
    except Exception as e:
        logger.error(f"Failed to load voice stress analyzer: {e}")
        app.state.stress_analyzer = None

    try:
        from app.ml.deepfake_detector import DeepFakeVoiceDetector
        app.state.deepfake_detector = DeepFakeVoiceDetector(checkpoint_path=settings.deepfake_model_path)
        app.state.deepfake_detector.load()
        logger.info("Deepfake detector loaded")
    except Exception as e:
        logger.error(f"Failed to load deepfake detector: {e}")
        app.state.deepfake_detector = None

    try:
        from app.ml.rag_matcher import ScamScriptMatcher, DEFAULT_SCRIPTS
        app.state.rag_matcher = ScamScriptMatcher(persist_dir=settings.chroma_persist_dir)
        app.state.rag_matcher.load()
        # Index default scam scripts if empty
        app.state.rag_matcher.index_scam_scripts(DEFAULT_SCRIPTS)
        logger.info("RAG matcher loaded")
    except Exception as e:
        logger.error(f"Failed to load RAG matcher: {e}")
        app.state.rag_matcher = None

    # Initialize databases
    try:
        await init_redis()
        logger.info("Redis connected")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")

    try:
        await init_db()
        logger.info("PostgreSQL initialized")
    except Exception as e:
        logger.error(f"PostgreSQL init failed: {e}")

    logger.info("EchoShield backend ready")

    yield

    # Cleanup
    logger.info("Shutting down...")
    if hasattr(app.state, 'executor'):
        app.state.executor.shutdown(wait=True)


app = FastAPI(
    title=settings.app_name,
    description="Real-time scam call detection backend",
    version=settings.app_version,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "asr": app.state.asr is not None,
            "scam_clf": app.state.scam_clf is not None,
            "stress_analyzer": app.state.stress_analyzer is not None,
            "deepfake_detector": app.state.deepfake_detector is not None,
            "rag_matcher": app.state.rag_matcher is not None
        }
    }