"""
Export ScamBERT model to ONNX format for on-device inference.
"""

import torch
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("echoshield.export")


def export_scambert_to_onnx(
    model_path: str = "./models/scambert_final",
    output_path: str = "../android/models/scambert_lite.onnx"
):
    """Export ScamBERT to ONNX format."""
    logger.info(f"Loading model from {model_path}")

    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    model.eval()

    # Dummy input
    dummy_input = tokenizer(
        "Aapka KYC incomplete hai verify karo",
        return_tensors="pt",
        padding="max_length",
        max_length=256
    )

    input_ids = dummy_input["input_ids"]
    attention_mask = dummy_input["attention_mask"]

    logger.info("Exporting to ONNX...")
    torch.onnx.export(
        model,
        (input_ids, attention_mask),
        output_path,
        opset_version=14,
        input_names=["input_ids", "attention_mask"],
        output_names=["logits"],
        dynamic_axes={
            "input_ids": {0: "batch_size", 1: "seq_length"},
            "attention_mask": {0: "batch_size", 1: "seq_length"},
        },
        do_constant_folding=True
    )

    logger.info(f"ONNX model exported to {output_path}")


def export_whisper_tiny():
    """Export Whisper-tiny to TFLite."""
    # Note: Whisper requires special handling for TFLite
    # Use whisper-tiny model from HuggingFace and convert
    # This is a placeholder - actual conversion requires
    # using the conversion scripts from TensorFlow Lite
    logger.info("Whisper-tiny export not implemented yet")
    pass


if __name__ == "__main__":
    import sys
    model_path = sys.argv[1] if len(sys.argv) > 1 else "./models/scambert_final"
    output_path = sys.argv[2] if len(sys.argv) > 2 else "../android/models/scambert_lite.onnx"
    export_scambert_to_onnx(model_path, output_path)