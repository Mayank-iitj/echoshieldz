import torch
import numpy as np
from typing import Optional
from dataclasses import dataclass
import logging

logger = logging.getLogger("echoshield.scam_classifier")

try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False


LABEL2ID = {
    "SAFE": 0, "KYC_FRAUD": 1, "OTP_THEFT": 2, "FAKE_AUTHORITY": 3,
    "UPI_SCAM": 4, "INVESTMENT_SCAM": 5, "LOTTERY_SCAM": 6,
    "THREAT_EXTORTION": 7, "ACCOUNT_FREEZE": 8, "SYNTHETIC_URGENCY": 9
}
ID2LABEL = {v: k for k, v in LABEL2ID.items()}


@dataclass
class ScamClassificationResult:
    label: str
    confidence: float
    all_scores: dict


class ScamClassifier:
    """
    Fine-tuned DistilBERT for scam type classification.
    Supports Hindi/English code-mixed text.
    """

    def __init__(self, model_path: str = None):
        self.model_path = model_path or "models/scambert_final"
        self.tokenizer = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.is_loaded = False

    def load(self):
        """Load fine-tuned ScamBERT model."""
        if not TRANSFORMERS_AVAILABLE:
            raise ImportError("transformers not installed")

        try:
            logger.info(f"Loading ScamBERT from {self.model_path}")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            self.model = AutoModelForSequenceClassification.from_pretrained(
                self.model_path,
                num_labels=len(LABEL2ID),
                id2label=ID2LABEL,
                label2id=LABEL2ID
            ).to(self.device)
            self.model.eval()
            self.is_loaded = True
            logger.info("ScamBERT loaded successfully")
        except Exception as e:
            logger.warning(f"Could not load model from {self.model_path}: {e}")
            logger.info("Using base distilbert-multilingual-cased as fallback")
            self.tokenizer = AutoTokenizer.from_pretrained("distilbert-base-multilingual-cased")
            self.model = AutoModelForSequenceClassification.from_pretrained(
                "distilbert-base-multilingual-cased",
                num_labels=len(LABEL2ID),
                id2label=ID2LABEL,
                label2id=LABEL2ID
            ).to(self.device)
            self.model.eval()
            self.is_loaded = True

    def predict(self, text: str) -> ScamClassificationResult:
        """
        Classify text into scam type.
        Returns label and confidence scores.
        """
        if not self.is_loaded:
            self.load()

        if not text or len(text.strip()) < 3:
            return ScamClassificationResult(
                label="SAFE",
                confidence=1.0,
                all_scores={k: 0.0 for k in LABEL2ID.keys()}
            )

        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=256,
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probs = torch.softmax(logits, dim=-1)[0]

        scores = {ID2LABEL[i]: float(probs[i]) for i in range(len(probs))}
        predicted_idx = torch.argmax(probs).item()
        predicted_label = ID2LABEL[predicted_idx]
        confidence = float(probs[predicted_idx])

        return ScamClassificationResult(
            label=predicted_label,
            confidence=confidence,
            all_scores=scores
        )

    def predict_batch(self, texts: list[str]) -> list[ScamClassificationResult]:
        """Predict scam type for multiple texts."""
        if not self.is_loaded:
            self.load()

        if not texts:
            return []

        inputs = self.tokenizer(
            texts,
            return_tensors="pt",
            truncation=True,
            max_length=256,
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probs = torch.softmax(logits, dim=-1)

        results = []
        for i in range(len(texts)):
            scores = {ID2LABEL[j]: float(probs[i][j]) for j in range(probs.shape[1])}
            predicted_idx = torch.argmax(probs[i]).item()
            results.append(ScamClassificationResult(
                label=ID2LABEL[predicted_idx],
                confidence=float(probs[i][predicted_idx]),
                all_scores=scores
            ))

        return results