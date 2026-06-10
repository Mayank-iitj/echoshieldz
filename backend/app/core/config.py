from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "EchoShield API"
    app_version: str = "2.0.0"
    debug: bool = False

    # Database
    database_url: str = "postgresql://echo:echo@localhost:5432/echoshield"
    redis_url: str = "redis://localhost:6379"

    # ML Models
    model_dir: str = "/app/models"
    asr_model_id: str = "openai/whisper-large-v3"
    scambert_model_path: str = "/app/models/scambert_final"
    deepfake_model_path: str = "/app/models/lightcnn9_audio.pth"
    embedding_model: str = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"

    # RAG
    chroma_persist_dir: str = "/app/data/embeddings/chroma"

    # Inference
    chunk_duration_sec: int = 5
    overlap_sec: int = 1
    sample_rate: int = 16000

    # Risk scoring weights
    weight_nlp: float = 0.30
    weight_stress: float = 0.15
    weight_synthetic: float = 0.20
    weight_deepfake: float = 0.10
    weight_caller_reputation: float = 0.15
    weight_script_match: float = 0.10

    # Thresholds
    deepfake_threshold: float = 0.65
    script_match_threshold: float = 0.65
    safe_threshold: float = 30.0
    suspicious_threshold: float = 60.0
    high_risk_threshold: float = 80.0

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()