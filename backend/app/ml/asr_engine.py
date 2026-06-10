import torch
import numpy as np
from typing import Optional
from dataclasses import dataclass
import logging

logger = logging.getLogger("echoshield.asr")

try:
    from transformers import WhisperProcessor, WhisperForConditionalGeneration
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False


@dataclass
class ASRResult:
    transcript: str
    is_partial: bool
    language: Optional[str] = None
    confidence: Optional[float] = None


class ASREngine:
    """
    Streaming ASR using Whisper.
    Accepts 16kHz PCM float32 numpy arrays as chunks.
    Returns running transcript + confidence.
    """

    def __init__(self, model_id: str = "openai/whisper-large-v3"):
        self.model_id = model_id
        self.processor = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.buffer: list[np.ndarray] = []
        self.chunk_duration_sec = 5
        self.overlap_sec = 1
        self.sample_rate = 16000
        self.is_loaded = False

    def load(self):
        """Load Whisper model."""
        if not TRANSFORMERS_AVAILABLE:
            raise ImportError("transformers not installed. Install with: pip install transformers")

        logger.info(f"Loading Whisper model: {self.model_id}")
        self.processor = WhisperProcessor.from_pretrained(self.model_id)
        self.model = WhisperForConditionalGeneration.from_pretrained(
            self.model_id,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
        ).to(self.device)
        self.model.eval()
        self.is_loaded = True
        logger.info(f"Whisper loaded on {self.device}")

    def feed_chunk(self, audio_chunk: np.ndarray) -> ASRResult:
        """
        Feed a PCM chunk (16kHz, float32). Returns partial transcript.
        """
        if not self.is_loaded:
            self.load()

        self.buffer.append(audio_chunk)
        total_samples = sum(len(c) for c in self.buffer)

        min_samples = self.chunk_duration_sec * self.sample_rate
        if total_samples < min_samples:
            return ASRResult(transcript="", is_partial=True, language="unknown")

        audio = np.concatenate(self.buffer)
        inputs = self.processor(
            audio,
            sampling_rate=self.sample_rate,
            return_tensors="pt",
        )

        input_features = inputs["input_features"].to(self.device)

        with torch.no_grad():
            forced_decoder_ids = self.processor.get_decoder_prompt_ids(
                language=None,  # Auto-detect
                task="transcribe"
            )
            predicted_ids = self.model.generate(
                input_features,
                forced_decoder_ids=forced_decoder_ids,
                return_timestamps=True
            )

        transcript = self.processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

        # Keep 1s overlap for continuity
        overlap_samples = self.overlap_sec * self.sample_rate
        if len(audio) > overlap_samples:
            self.buffer = [audio[-overlap_samples:]]
        else:
            self.buffer = []

        return ASRResult(
            transcript=transcript.strip(),
            is_partial=False,
            language=self.processor.tokenizer.language if self.processor else "unknown"
        )

    def reset(self):
        """Reset the audio buffer."""
        self.buffer = []


class ASREngineLite:
    """
    Lightweight on-device ASR using quantized Whisper-tiny.
    Placeholder for TFLite conversion - requires actual model file.
    """

    def __init__(self, model_path: str = None):
        self.model_path = model_path
        self.is_loaded = False

    def load(self):
        """Load TFLite model for on-device inference."""
        # Placeholder - would use TFLite runtime
        logger.info("Loading Whisper-tiny TFLite model")
        self.is_loaded = True

    def feed_chunk(self, audio_chunk: np.ndarray) -> ASRResult:
        """Transcribe audio chunk."""
        if not self.is_loaded:
            self.load()
        # Placeholder - returns empty for now
        return ASRResult(transcript="", is_partial=True)