"""
EchoShield ScamBERT Fine-tuning Pipeline

Fine-tunes DistilBERT-multilingual on scam classification task.
Supports Hindi/English code-mixed text.
"""

import os
import json
import torch
import numpy as np
from pathlib import Path
from typing import Dict, List
from dataclasses import dataclass

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    DataCollatorWithPadding,
    EarlyStoppingCallback
)
from datasets import Dataset, DatasetDict
from sklearn.metrics import classification_report, f1_score, accuracy_score
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("echoshield.finetune")

LABEL2ID = {
    "SAFE": 0, "KYC_FRAUD": 1, "OTP_THEFT": 2, "FAKE_AUTHORITY": 3,
    "UPI_SCAM": 4, "INVESTMENT_SCAM": 5, "LOTTERY_SCAM": 6,
    "THREAT_EXTORTION": 7, "ACCOUNT_FREEZE": 8, "SYNTHETIC_URGENCY": 9
}
ID2LABEL = {v: k for k, v in LABEL2ID.items()}


@dataclass
class TrainingConfig:
    model_name: str = "distilbert-base-multilingual-cased"
    # Alternative: "ai4bharat/indic-bert" for primarily Hindi

    output_dir: str = "./models/scambert"
    num_train_epochs: int = 8
    per_device_train_batch_size: int = 32
    per_device_eval_batch_size: int = 64
    learning_rate: float = 2e-5
    weight_decay: float = 0.01
    warmup_ratio: float = 0.1

    max_length: int = 256
    fp16: bool = True
    logging_steps: int = 50
    save_total_limit: int = 3


def load_dataset(data_dir: str = "../../data/processed") -> DatasetDict:
    """Load dataset from JSON files."""
    data_dir = Path(data_dir)

    splits = {}
    for split in ["train", "val", "test"]:
        with open(data_dir / f"{split}.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            # Convert to Dataset format
            splits[split] = Dataset.from_list(data)

    return DatasetDict(splits)


def tokenize_function(examples, tokenizer, max_length: int):
    """Tokenize text data."""
    return tokenizer(
        examples["text"],
        truncation=True,
        max_length=max_length,
        padding=False
    )


def compute_metrics(eval_pred):
    """Compute classification metrics."""
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)

    acc = accuracy_score(labels, predictions)
    f1_macro = f1_score(labels, predictions, average="macro")
    f1_weighted = f1_score(labels, predictions, average="weighted")

    return {
        "accuracy": acc,
        "macro_f1": f1_macro,
        "weighted_f1": f1_weighted
    }


def main():
    """Main training function."""
    config = TrainingConfig()

    logger.info("Loading tokenizer and model...")
    tokenizer = AutoTokenizer.from_pretrained(config.model_name)
    model = AutoModelForSequenceClassification.from_pretrained(
        config.model_name,
        num_labels=len(LABEL2ID),
        id2label=ID2LABEL,
        label2id=LABEL2ID
    )

    # Use GPU if available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info(f"Using device: {device}")
    model = model.to(device)

    # Load dataset
    logger.info("Loading dataset...")
    raw_dataset = load_dataset()

    # Tokenize
    logger.info("Tokenizing dataset...")
    tokenized_dataset = raw_dataset.map(
        lambda x: tokenize_function(x, tokenizer, config.max_length),
        batched=True,
        remove_columns=["text", "label", "source"]
    )

    # Data collator
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    # Training arguments
    training_args = TrainingArguments(
        output_dir=config.output_dir,
        num_train_epochs=config.num_train_epochs,
        per_device_train_batch_size=config.per_device_train_batch_size,
        per_device_eval_batch_size=config.per_device_eval_batch_size,
        learning_rate=config.learning_rate,
        weight_decay=config.weight_decay,
        warmup_ratio=config.warmup_ratio,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="macro_f1",
        greater_is_better=True,
        fp16=config.fp16 and device == "cuda",
        logging_steps=config.logging_steps,
        save_total_limit=config.save_total_limit,
        report_to="none",
        logging_first_step=True,
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        eval_dataset=tokenized_dataset["val"],
        tokenizer=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=3)]
    )

    # Train
    logger.info("Starting training...")
    trainer.train()

    # Evaluate on test set
    logger.info("Evaluating on test set...")
    predictions = trainer.predict(tokenized_dataset["test"])
    preds = np.argmax(predictions.predictions, axis=-1)

    # Classification report
    report = classification_report(
        predictions.label_ids,
        preds,
        target_names=list(LABEL2ID.keys()),
        zero_division=0
    )
    print("\nClassification Report:")
    print(report)

    # Save model
    output_path = Path(config.output_dir) / "final"
    trainer.save_model(output_path)
    tokenizer.save_pretrained(output_path)
    logger.info(f"Model saved to {output_path}")


if __name__ == "__main__":
    main()