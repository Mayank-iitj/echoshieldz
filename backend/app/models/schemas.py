from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class AlertLevel(str, Enum):
    SAFE = "SAFE"
    SUSPICIOUS = "SUSPICIOUS"
    HIGH_RISK = "HIGH_RISK"
    CRITICAL = "CRITICAL"


# Request schemas
class CallerInfo(BaseModel):
    phone_number: str
    call_id: str
    timestamp: float
    duration_sec: float = 0.0
    time_of_day_hour: int = Field(default_factory=lambda: datetime.now().hour)


class AnalysisRequest(BaseModel):
    phone_number: str = ""
    call_id: str = ""
    duration_sec: float = 0.0


class FeedbackRequest(BaseModel):
    call_id: str
    phone_number: Optional[str] = None
    was_scam: bool
    user_notes: str = ""
    predicted_risk_score: Optional[float] = None
    predicted_scam_label: Optional[str] = None


class WebSocketAudioMessage(BaseModel):
    type: str = "audio_chunk"
    data: str  # base64 encoded PCM
    sample_rate: int = 16000
    phone_number: str = ""


class WebSocketCallEndMessage(BaseModel):
    type: str = "call_end"


# Response schemas
class AnalysisResponse(BaseModel):
    call_id: str
    risk_score: float
    alert_level: str
    scam_type: str
    transcript: str
    explanation: str
    latency_ms: float
    top_signals: dict


class ReputationResponse(BaseModel):
    phone_number: str
    reputation_score: float
    reported_count: int
    top_scam_type: Optional[str] = None
    analysis_cache: dict = {}


class FeedbackResponse(BaseModel):
    success: bool
    message: str


class RiskSignalsResponse(BaseModel):
    scam_label: str
    nlp_confidence: float
    stress_score: float
    synthetic_probability: float
    deepfake_probability: float
    caller_reputation_score: float
    reported_count: int
    script_match_score: float
    matched_template: Optional[str] = None


class WebSocketRiskUpdate(BaseModel):
    type: str = "risk_update"
    call_id: str
    risk_score: float
    alert_level: str
    scam_type: str
    transcript: str
    explanation: str
    top_signals: dict


class WebSocketSessionClosed(BaseModel):
    type: str = "session_closed"
    call_id: str


# Voice stress response
class VoiceStressReport(BaseModel):
    stress_score: float
    speaking_rate_wpm: float
    pitch_variance: float
    pause_ratio: float
    jitter: float
    shimmer: float
    synthetic_probability: float
    flags: List[str] = []


# Deepfake response
class DeepfakeResponse(BaseModel):
    real_probability: float
    fake_probability: float
    is_deepfake: bool


# Script match response
class ScriptMatchResponse(BaseModel):
    score: float
    template: Optional[str] = None
    matched_excerpt: Optional[str] = None