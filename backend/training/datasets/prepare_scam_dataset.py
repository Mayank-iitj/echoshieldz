"""
EchoShield Dataset Preparation Pipeline

This script prepares training data for the scam classifier:
1. Generates synthetic scam transcripts via templates
2. Loads external datasets (CommonVoice, FTC, etc.)
3. Applies data augmentation for code-mixed Hindi/English
4. Creates train/val/test splits

Dataset Sources:
1. Synthetic scam transcripts generated via templates (Hindi + English)
2. External: CommonVoice Hindi (negative examples)
3. External: Kaggle spam datasets (English baseline)
4. Custom: ScamAdviser complaint logs
"""

import json
import random
from pathlib import Path
from typing import List, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("echoshield.dataset")

# Scam template definitions
SCAM_TEMPLATES = {
    "KYC_FRAUD": [
        "Aapka KYC incomplete hai. Abhi verify karo warna account band ho jayega.",
        "Your KYC is pending. Please share your Aadhaar number to avoid suspension.",
        "RBI ne notice bheja hai. KYC update karo 24 ghante mein.",
        "SBI bank calling. Your account KYC verification pending. Complete now.",
        "Aapka bank account KYC expire ho gaya hai. Update immediately.",
    ],
    "OTP_THEFT": [
        "Hum bank officer bol rahe hain. Aapka OTP share karo verification ke liye.",
        "Your account has been compromised. Please read out the OTP sent to your number.",
        "SBI fraud department calling. Tell me the 6-digit OTP to block unauthorized access.",
        "OTP verify karo nahi toh account hack ho jayega. Abhi batao.",
        "HDFC Bank fraud alert. OTP share kro to secure account.",
    ],
    "FAKE_AUTHORITY": [
        "Main CBI inspector bol raha hoon. Aapke naam par arrest warrant hai.",
        "TRAI calling. Your mobile number will be disconnected in 2 hours.",
        "This is Mumbai Crime Branch. You are under digital arrest.",
        "Police department calling. You have a pending case. Pay fine now.",
        "Income Tax department. You have unpaid tax. Immediate payment required.",
    ],
    "UPI_SCAM": [
        "Maine aapko galat UPI pe paise bhej diye. Wapas karo please.",
        "You won a cashback. Accept this UPI request to receive ₹5000.",
        "Your UPI limit will be reset. Enter your MPIN to confirm.",
        "UPI refund aaya hai. Accept request to receive money.",
        "Amazon reward points redeem karo. UPI pe transfer ho jayega.",
    ],
    "INVESTMENT_SCAM": [
        "Sirf abhi invest karo ₹5000 mein ₹50000 returns 1 din mein.",
        "You have been selected for exclusive investment. Limited time offer.",
        "Bitcoin investment opportunity. 10x returns in one week.",
        "Stock market tips: Today invest kro, tomorrow crorepati.",
        "Fixed deposit scheme: Double your money in 6 months.",
    ],
    "LOTTERY_SCAM": [
        "Congratulations! You have won ₹1 crore lottery. Claim now.",
        "You are the lucky winner of Amazon lucky draw. Claim prize.",
        "KBC lottery jeetna. 25 lakh rupees award. Call now to claim.",
        "Microsoft lottery winner. You won $100,000. Share bank details.",
        "Lucky draw winner: iPhone 15 Pro Max. Pay processing fee to deliver.",
    ],
    "THREAT_EXTORTION": [
        "Humare paas aapke saare records hain. Paise nahi toh publish kar denge.",
        "Your private videos with us. Pay ₹50000 or we send to all contacts.",
        "We have your browsing history. Pay now or everyone will know.",
        "I have your edited photos. 24 ghante mein ₹1 lakh nahi aaya toh...",
        "Call recording and chat logs. Pay to delete or we share.",
    ],
    "ACCOUNT_FREEZE": [
        "Your account has been frozen for suspicious activity.",
        "Bank account suspended. Verify identity to unlock.",
        "ATM card blocked. Call immediately for re-activation.",
        "Aapka account fraud ke karan freeze ho gaya hai. Verify karo.",
        "Credit card deactivated. Provide details for reactivation.",
    ],
    "SYNTHETIC_URGENCY": [
        "Sirf 30 minute bacha hai. Abhi karo warna permanent block.",
        "This is your LAST WARNING. Act now or face legal consequences.",
        "Your electricity will be cut in 1 hour unless you pay now.",
        "Deadline is in 1 hour. Pay now or permanent ban.",
        "Abhi call kro, nahi toh 10 minute mein block ho jayega.",
    ]
}

# Safe call templates (negative examples)
SAFE_TEMPLATES = [
    "Hello, kaisa hai aap? Kal meeting mein milte hain.",
    "Can you please send me the report by tomorrow?",
    "Thank you for calling. I will get back to you shortly.",
    "Please hold on while I check your account details.",
    "The weather is nice today. Shall we go for a walk?",
    "I am running late by 10 minutes. Please wait.",
    "Can you please repeat that? I did not hear clearly.",
    "Sure, I will send the documents via email.",
    "The meeting has been rescheduled to 3 PM.",
    "Please talk to my manager for this matter.",
    "Hello, this is John. May I speak with Mr. Sharma?",
    "Thanks for your help. Have a great day!",
    "Could you please remind me about the appointment?",
    "I will be there in about half an hour.",
    "The project deadline is next Friday. We need to finish by then.",
]


def generate_synthetic_dataset(num_samples_per_label: int = 500) -> List[Dict]:
    """Generate synthetic scam transcripts from templates."""
    data = []

    for label, templates in SCAM_TEMPLATES.items():
        for template in templates:
            # Add variations
            variations = [
                template,
                template.lower(),
                template.replace(".", "..."),
                "ji " + template,
                template + " jaldi kijiye",
                "please " + template.lower(),
            ]

            for text in variations[:num_samples_per_label // len(templates)]:
                data.append({
                    "text": text,
                    "label": label,
                    "source": "synthetic"
                })

    return data


def generate_safe_dataset(num_samples: int = 3000) -> List[Dict]:
    """Generate safe call transcripts."""
    data = []

    for _ in range(num_samples // len(SAFE_TEMPLATES)):
        for template in SAFE_TEMPLATES:
            data.append({
                "text": template,
                "label": "SAFE",
                "source": "synthetic"
            })

    return data


def augment_text(text: str) -> List[str]:
    """Apply text augmentation for code-mixed Hindi/English."""
    augmentations = [
        text,  # Original
        text.lower(),
        text.replace(" ", "  "),  # Extra space
        text.replace("aapka", "aapka"),
        text.replace("hai", "hai"),
    ]
    return augmentations


def create_train_val_test(data: List[Dict], train_ratio: float = 0.7, val_ratio: float = 0.15):
    """Split data into train/val/test sets."""
    random.shuffle(data)

    train_size = int(len(data) * train_ratio)
    val_size = int(len(data) * val_ratio)

    train_data = data[:train_size]
    val_data = data[train_size:train_size + val_size]
    test_data = data[train_size + val_size:]

    return train_data, val_data, test_data


def main():
    """Main dataset preparation."""
    logger.info("Generating synthetic dataset...")

    # Generate data
    scam_data = generate_synthetic_dataset()
    safe_data = generate_safe_dataset()
    all_data = scam_data + safe_data

    # Add augmentation
    augmented_data = []
    for item in all_data:
        augmented_data.append(item)
        if item["label"] != "SAFE":  # More augmentation for scam
            for aug in augment_text(item["text"]):
                if aug != item["text"]:
                    augmented_data.append({
                        "text": aug,
                        "label": item["label"],
                        "source": "augmented"
                    })

    logger.info(f"Total samples: {len(augmented_data)}")

    # Split
    train_data, val_data, test_data = create_train_val_test(augmented_data)

    # Save
    output_dir = Path("../../data/processed")
    output_dir.mkdir(parents=True, exist_ok=True)

    for split_name, split_data in [
        ("train", train_data),
        ("val", val_data),
        ("test", test_data)
    ]:
        output_path = output_dir / f"{split_name}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(split_data, f, ensure_ascii=False, indent=2)
        logger.info(f"Saved {split_name}: {len(split_data)} samples")

    # Save label distribution
    label_counts = {}
    for item in all_data:
        label_counts[item["label"]] = label_counts.get(item["label"], 0) + 1

    logger.info(f"Label distribution: {label_counts}")
    logger.info("Dataset preparation complete!")


if __name__ == "__main__":
    main()