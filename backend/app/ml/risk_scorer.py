from dataclasses import dataclass
from enum import Enum
from typing import Optional
import math
import logging

logger = logging.getLogger("echoshield.risk_scorer")


class AlertLevel(str, Enum):
    SAFE = "SAFE"
    SUSPICIOUS = "SUSPICIOUS"
    HIGH_RISK = "HIGH_RISK"
    CRITICAL = "CRITICAL"


# Signal weights — tune via A/B feedback
WEIGHTS = {
    "nlp": 0.30,
    "stress": 0.15,
    "synthetic": 0.20,
    "deepfake": 0.10,
    "caller_reputation": 0.15,
    "script_match": 0.10
}

# Label-specific risk multipliers
SCAM_LABEL_MULTIPLIERS = {
    "SAFE": 0.0,
    "SYNTHETIC_URGENCY": 0.85,
    "KYC_FRAUD": 1.0,
    "OTP_THEFT": 1.0,
    "FAKE_AUTHORITY": 1.0,
    "UPI_SCAM": 0.95,
    "INVESTMENT_SCAM": 0.80,
    "LOTTERY_SCAM": 0.75,
    "THREAT_EXTORTION": 0.90,
    "ACCOUNT_FREEZE": 0.90,
}


@dataclass
class RiskSignals:
    # NLP Classifier output
    scam_label: str  # e.g. "KYC_FRAUD"
    nlp_confidence: float  # 0.0–1.0

    # Voice Stress output
    stress_score: float  # 0.0–1.0
    synthetic_probability: float  # 0.0–1.0

    # DeepFake Detector output
    deepfake_probability: float  # 0.0–1.0

    # Caller Reputation
    caller_reputation_score: float  # 0.0 (known scammer) to 1.0 (clean)
    reported_count: int  # Times reported across India

    # RAG Pattern Matcher
    script_match_score: float  # 0.0–1.0 (match to known scam scripts)
    matched_template: Optional[str]  # e.g. "SBI_KYC_SCRIPT_V3"

    # Temporal signals
    call_duration_sec: float
    time_of_day_hour: int  # 0–24


@dataclass
class RiskScoreResult:
    risk_score: float
    alert_level: str
    scam_type: str
    top_signals: dict
    matched_template: Optional[str]
    explanation: str


def compute_risk_score(signals: RiskSignals) -> RiskScoreResult:
    """
    Weighted fusion of all signals → scalar risk score 0–100.

    Formula:
      base_score = weighted sum of normalised signals
      label_boost = scam_label_multiplier × nlp_confidence × 0.20 (max 20pt boost)
      reputation_penalty = (1 - caller_reputation) × 15 (max 15pt)
      temporal_boost = 0–5 (calls between 22:00–06:00 are +5)
      final = sigmoid-smoothed clamp to 0–100
    """

    # Invert reputation (low rep = high risk)
    rep_risk = 1.0 - signals.caller_reputation_score

    # Base weighted score
    base = (
        WEIGHTS["nlp"] * signals.nlp_confidence *
        SCAM_LABEL_MULTIPLIERS.get(signals.scam_label, 0.5) +
        WEIGHTS["stress"] * signals.stress_score +
        WEIGHTS["synthetic"] * signals.synthetic_probability +
        WEIGHTS["deepfake"] * signals.deepfake_probability +
        WEIGHTS["caller_reputation"] * rep_risk +
        WEIGHTS["script_match"] * signals.script_match_score
    )  # 0.0 – 1.0

    # Bonuses (uncapped before final normalisation)
    label_boost = SCAM_LABEL_MULTIPLIERS.get(signals.scam_label, 0.0) * signals.nlp_confidence * 0.20
    rep_penalty = rep_risk * 0.15

    # Temporal: late-night calls (10PM–6AM) are higher risk
    temporal_boost = 0.05 if (signals.time_of_day_hour >= 22 or signals.time_of_day_hour <= 6) else 0.0

    # High report count boost
    report_boost = min(signals.reported_count / 100.0, 1.0) * 0.10

    combined = base + label_boost + rep_penalty + temporal_boost + report_boost

    # Apply sigmoid-like smoothing to prevent extreme clustering at 0/1
    smoothed = 1 / (1 + math.exp(-8 * (combined - 0.5)))

    risk_score = round(min(smoothed * 100, 100), 1)

    # Alert level
    if risk_score <= 30:
        alert_level = AlertLevel.SAFE
    elif risk_score <= 60:
        alert_level = AlertLevel.SUSPICIOUS
    elif risk_score <= 80:
        alert_level = AlertLevel.HIGH_RISK
    else:
        alert_level = AlertLevel.CRITICAL

    return RiskScoreResult(
        risk_score=risk_score,
        alert_level=alert_level.value,
        scam_type=signals.scam_label,
        top_signals={
            "nlp_confidence": round(signals.nlp_confidence, 3),
            "voice_stress": round(signals.stress_score, 3),
            "synthetic_voice": round(signals.synthetic_probability, 3),
            "caller_reputation": round(signals.caller_reputation_score, 3),
            "script_match": round(signals.script_match_score, 3),
        },
        matched_template=signals.matched_template,
        explanation=_generate_explanation(signals, alert_level)
    )


def _generate_explanation(signals: RiskSignals, level: AlertLevel) -> str:
    reasons = []
    if signals.nlp_confidence > 0.6 and signals.scam_label != "SAFE":
        reasons.append(f"transcript matches {signals.scam_label.replace('_', ' ').lower()} pattern")
    if signals.stress_score > 0.6:
        reasons.append("caller voice shows stress/script-reading patterns")
    if signals.synthetic_probability > 0.7:
        reasons.append("possible AI-synthesised voice detected")
    if signals.caller_reputation_score < 0.3:
        reasons.append(f"number reported {signals.reported_count} times nationally")
    if signals.script_match_score > 0.6:
        reasons.append(f"matches known script: {signals.matched_template}")

    if not reasons:
        return "No significant risk signals detected."
    return "Flagged because: " + "; ".join(reasons) + "."