import numpy as np
import librosa
from dataclasses import dataclass
from typing import List
import logging

logger = logging.getLogger("echoshield.voice_stress")


@dataclass
class VoiceStressReport:
    stress_score: float
    speaking_rate_wpm: float
    pitch_variance: float
    pause_ratio: float
    jitter: float
    shimmer: float
    synthetic_probability: float
    flags: List[str]


class VoiceStressAnalyzer:
    """
    Extracts prosodic and voice quality features from audio segment.
    High stress_score + low pitch_variance → likely scripted scam call.
    High synthetic_probability → AI-generated voice (vishing bot).
    """

    SAMPLE_RATE = 16000

    # Thresholds (calibrated on real call data)
    SCRIPTED_PITCH_VAR_THRESHOLD = 15.0  # Hz; below = robotic
    HIGH_SPEAKING_RATE_WPM = 180  # Above = pressuring
    HIGH_PAUSE_RATIO = 0.45  # Above = scripted reads

    def __init__(self):
        self.sample_rate = self.SAMPLE_RATE

    def analyze(self, audio: np.ndarray, word_count: int = 0) -> VoiceStressReport:
        """
        Analyze audio for voice stress indicators.
        Args:
            audio: PCM audio as float32 numpy array (16kHz)
            word_count: Number of words spoken (for speaking rate)
        Returns:
            VoiceStressReport with scores and flags
        """
        y = audio.astype(np.float32)
        sr = self.sample_rate
        flags = []

        # Handle empty or very short audio
        if len(y) < sr * 0.5:  # Less than 0.5 seconds
            return VoiceStressReport(
                stress_score=0.0,
                speaking_rate_wpm=0.0,
                pitch_variance=0.0,
                pause_ratio=0.0,
                jitter=0.0,
                shimmer=0.0,
                synthetic_probability=0.0,
                flags=["INSUFFICIENT_AUDIO"]
            )

        # --- Fundamental Frequency (F0) ---
        try:
            f0, voiced_flag, _ = librosa.pyin(
                y,
                fmin=librosa.note_to_hz('C2'),
                fmax=librosa.note_to_hz('C7'),
                sr=sr,
                frame_length=1024,
                hop_length=256
            )
            f0_voiced = f0[voiced_flag & ~np.isnan(f0)]
            pitch_variance = float(np.std(f0_voiced)) if len(f0_voiced) > 10 else 0.0
        except Exception:
            pitch_variance = 0.0

        # --- Speaking Rate ---
        duration_sec = len(y) / sr
        wpm = (word_count / duration_sec * 60.0) if duration_sec > 0 and word_count > 0 else 0.0

        # --- Silence / Pause Ratio ---
        try:
            intervals = librosa.effects.split(y, top_db=25)
            speech_samples = sum(end - start for start, end in intervals)
            pause_ratio = 1.0 - (speech_samples / len(y)) if len(y) > 0 else 0.0
        except Exception:
            pause_ratio = 0.0

        # --- MFCC-based Jitter/Shimmer proxy ---
        try:
            rms = librosa.feature.rms(y=y, frame_length=512, hop_length=128)[0]
            shimmer = float(np.std(rms) / (np.mean(rms) + 1e-8))

            zcr = librosa.feature.zero_crossing_rate(y, frame_length=512, hop_length=128)[0]
            jitter = float(np.std(zcr))
        except Exception:
            shimmer = 0.0
            jitter = 0.0

        # --- Spectral Flatness (synthetic voice detection proxy) ---
        try:
            spectral_flatness = librosa.feature.spectral_flatness(y=y, hop_length=256)[0]
            synthetic_probability = float(np.mean(spectral_flatness) * 10)
            synthetic_probability = min(1.0, max(0.0, synthetic_probability))
        except Exception:
            synthetic_probability = 0.0

        # --- Flag Generation ---
        if pitch_variance < self.SCRIPTED_PITCH_VAR_THRESHOLD and pitch_variance > 0:
            flags.append("LOW_PITCH_VARIANCE: Possibly scripted or TTS")
        if wpm > self.HIGH_SPEAKING_RATE_WPM:
            flags.append(f"FAST_SPEECH: {wpm:.0f} WPM — pressuring pattern")
        if pause_ratio > self.HIGH_PAUSE_RATIO:
            flags.append("HIGH_PAUSE_RATIO: Script-reading pauses detected")
        if synthetic_probability > 0.7:
            flags.append("SYNTHETIC_VOICE: High probability of AI-generated voice")

        # --- Composite Stress Score ---
        # Normalised and weighted
        stress_score = (
            0.30 * (1 - min(pitch_variance / 50.0, 1.0)) +  # Low variance → stress
            0.20 * min(wpm / 250.0, 1.0) +  # High WPM → stress
            0.20 * pause_ratio +  # High pause → scripted
            0.30 * synthetic_probability  # TTS proxy
        )

        return VoiceStressReport(
            stress_score=round(min(stress_score, 1.0), 3),
            speaking_rate_wpm=round(wpm, 1),
            pitch_variance=round(pitch_variance, 2),
            pause_ratio=round(pause_ratio, 3),
            jitter=round(jitter, 4),
            shimmer=round(shimmer, 4),
            synthetic_probability=round(synthetic_probability, 3),
            flags=flags
        )