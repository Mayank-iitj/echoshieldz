import torch
import torch.nn as nn
import numpy as np
from typing import Optional
from dataclasses import dataclass
import logging

logger = logging.getLogger("echoshield.deepfake")

try:
    import librosa
    import cv2
    LIBROSA_AVAILABLE = True
except ImportError:
    LIBROSA_AVAILABLE = False


class MFM(nn.Module):
    """Max-Feature-Map activation used in LightCNN."""

    def __init__(self, in_channels: int):
        super().__init__()
        self.in_channels = in_channels

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        assert x.shape[1] % 2 == 0
        x1, x2 = torch.chunk(x, 2, dim=1)
        return torch.max(x1, x2)


class LightCNN9_Audio(nn.Module):
    """
    LightCNN-9 adapted for audio deepfake detection.
    Input: (batch, 1, 128, 128) mel-spectrogram patch
    Output: (batch, 2) — [real_logit, fake_logit]
    """

    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 96, kernel_size=5, padding=2),
            MFM(96),
            nn.MaxPool2d(kernel_size=2, stride=2),

            nn.Conv2d(48, 192, kernel_size=1),
            MFM(192),
            nn.Conv2d(96, 192, kernel_size=3, padding=1),
            MFM(192),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.BatchNorm2d(96),

            nn.Conv2d(96, 384, kernel_size=1),
            MFM(384),
            nn.Conv2d(192, 256, kernel_size=3, padding=1),
            MFM(256),
            nn.Conv2d(128, 256, kernel_size=1),
            MFM(256),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            MFM(128),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 16 * 16, 512),
            MFM(512),
            nn.Dropout(0.5),
            nn.Linear(256, 2)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.classifier(self.features(x))


@dataclass
class DeepfakeResult:
    real_probability: float
    fake_probability: float
    is_deepfake: bool


class DeepFakeVoiceDetector:
    """
    Wraps LightCNN-9 for inference.
    Accepts raw PCM audio, returns fake probability.
    """

    def __init__(self, checkpoint_path: str = None):
        self.checkpoint_path = checkpoint_path
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.is_loaded = False
        self.sample_rate = 16000

    def load(self):
        """Load LightCNN-9 model."""
        logger.info("Loading LightCNN-9 deepfake detector")
        self.model = LightCNN9_Audio()

        if self.checkpoint_path:
            try:
                self.model.load_state_dict(
                    torch.load(self.checkpoint_path, map_location=self.device)
                )
                logger.info(f"Loaded checkpoint from {self.checkpoint_path}")
            except Exception as e:
                logger.warning(f"Could not load checkpoint: {e}. Using random weights.")

        self.model.to(self.device)
        self.model.eval()
        self.is_loaded = True

    def _audio_to_melspectrogram(self, audio: np.ndarray, sr: int = 16000) -> np.ndarray:
        """Convert audio to mel-spectrogram for model input."""
        if not LIBROSA_AVAILABLE:
            raise ImportError("librosa not installed")

        # Ensure audio is the right length (take first 3 seconds if too long)
        max_samples = sr * 3
        if len(audio) > max_samples:
            audio = audio[:max_samples]

        mel = librosa.feature.melspectrogram(
            y=audio,
            sr=sr,
            n_mels=128,
            n_fft=1024,
            hop_length=160,
            fmin=20,
            fmax=8000
        )
        mel_db = librosa.power_to_db(mel, ref=np.max)
        mel_db = (mel_db - mel_db.mean()) / (mel_db.std() + 1e-8)

        # Resize to 128x128
        try:
            import cv2
            mel_db = cv2.resize(mel_db.astype(np.float32), (128, 128), interpolation=cv2.INTER_LINEAR)
        except ImportError:
            # Fallback: simple resize
            from scipy.ndimage import zoom
            zoom_factors = (128 / mel_db.shape[0], 128 / mel_db.shape[1])
            mel_db = zoom(mel_db, zoom_factors)

        return mel_db

    @torch.no_grad()
    def predict(self, audio: np.ndarray, sr: int = 16000) -> DeepfakeResult:
        """
        Predict if audio is synthetic (deepfake/TTS).
        Args:
            audio: PCM audio as float32 numpy array
            sr: Sample rate (default 16000)
        Returns:
            DeepfakeResult with probabilities
        """
        if not self.is_loaded:
            self.load()

        if not LIBROSA_AVAILABLE:
            return DeepfakeResult(
                real_probability=0.5,
                fake_probability=0.5,
                is_deepfake=False
            )

        try:
            mel = self._audio_to_melspectrogram(audio, sr)
            tensor = torch.tensor(mel).unsqueeze(0).unsqueeze(0).to(self.device)
            logits = self.model(tensor)
            probs = torch.softmax(logits, dim=1)[0].cpu().numpy()

            return DeepfakeResult(
                real_probability=float(probs[0]),
                fake_probability=float(probs[1]),
                is_deepfake=bool(probs[1] > 0.65)
            )
        except Exception as e:
            logger.error(f"Deepfake detection error: {e}")
            return DeepfakeResult(
                real_probability=0.5,
                fake_probability=0.5,
                is_deepfake=False
            )