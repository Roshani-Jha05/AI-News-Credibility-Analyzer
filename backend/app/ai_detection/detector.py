# ============================================================
# AI DETECTION ENGINE - RoBERTa
# ============================================================

import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification
)

from .config import (
    MODEL_ID,
    MAX_LENGTH,
    AI_THRESHOLD,
    CONFIDENCE_HIGH,
    CONFIDENCE_MEDIUM
)


# Number of tokens shared between consecutive chunks.
# This helps preserve context around chunk boundaries.
CHUNK_STRIDE = 64


class AIDetector:

    def __init__(self):

        print("Loading RoBERTa AI detection model...")

        # CPU-only configuration for the current system.
        self.device = torch.device("cpu")

        self.tokenizer = AutoTokenizer.from_pretrained(
            MODEL_ID
        )

        self.model = AutoModelForSequenceClassification.from_pretrained(
            MODEL_ID
        )

        self.model.to(self.device)
        self.model.eval()

        print("RoBERTa AI detection model loaded.")
        print(f"Model: {MODEL_ID}")
        print(f"Labels: {self.model.config.id2label}")
        print(f"Maximum tokens per chunk: {MAX_LENGTH}")
        print(f"Chunk stride: {CHUNK_STRIDE}")

    # ========================================================
    # PUBLIC ANALYSIS
    # ========================================================

    def analyze(self, text):
        """
        Analyze text and return AI/human prediction.

        Short text:
            One RoBERTa prediction is performed.

        Long text:
            The text is divided into overlapping chunks.
            RoBERTa analyzes every chunk and the AI probabilities
            are aggregated into one document-level result.
        """

        if not text or not text.strip():
            raise ValueError("Text cannot be empty.")

        # ----------------------------------------------------
        # Tokenize into overlapping chunks
        # ----------------------------------------------------

        encoded = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=MAX_LENGTH,
            stride=CHUNK_STRIDE,
            return_overflowing_tokens=True,
            padding=True
        )

        # ----------------------------------------------------
        # Number of chunks
        # ----------------------------------------------------

        input_ids = encoded["input_ids"]

        chunk_count = input_ids.shape[0]

        ai_probabilities = []
        human_probabilities = []
        chunk_lengths = []

        # ----------------------------------------------------
        # Analyze each chunk
        # ----------------------------------------------------

        for chunk_index in range(chunk_count):

            chunk_inputs = {}

            for key in ["input_ids", "attention_mask"]:

                if key in encoded:

                    chunk_inputs[key] = (
                        encoded[key][chunk_index]
                        .unsqueeze(0)
                        .to(self.device)
                    )

            with torch.no_grad():

                outputs = self.model(
                    **chunk_inputs
                )

            probabilities = torch.softmax(
                outputs.logits,
                dim=-1
            )[0]

            human_probability = probabilities[0].item()
            ai_probability = probabilities[1].item()

            ai_probabilities.append(
                ai_probability
            )

            human_probabilities.append(
                human_probability
            )

            chunk_lengths.append(
                int(
                    encoded["attention_mask"][chunk_index]
                    .sum()
                    .item()
                )
            )

        # ----------------------------------------------------
        # Aggregate chunk probabilities
        # ----------------------------------------------------

        ai_probability = self._weighted_average(
            ai_probabilities,
            chunk_lengths
        )

        human_probability = self._weighted_average(
            human_probabilities,
            chunk_lengths
        )

        # ----------------------------------------------------
        # Normalize probabilities
        # ----------------------------------------------------

        probability_total = (
            ai_probability + human_probability
        )

        if probability_total > 0:

            ai_probability = (
                ai_probability / probability_total
            )

            human_probability = (
                human_probability / probability_total
            )

        # ----------------------------------------------------
        # Final prediction
        # ----------------------------------------------------

        if ai_probability >= AI_THRESHOLD:

            prediction = "AI-generated"

        else:

            prediction = "Human-written"

        # ----------------------------------------------------
        # Confidence
        # ----------------------------------------------------

        confidence_value = max(
            ai_probability,
            human_probability
        )

        if confidence_value >= CONFIDENCE_HIGH:

            confidence_level = "High"

        elif confidence_value >= CONFIDENCE_MEDIUM:

            confidence_level = "Medium"

        else:

            confidence_level = "Low"

        return {
            "prediction": prediction,
            "ai_probability": round(
                ai_probability,
                4
            ),
            "human_probability": round(
                human_probability,
                4
            ),
            "confidence": confidence_level,
            "chunk_count": chunk_count
        }

    # ========================================================
    # WEIGHTED AVERAGE
    # ========================================================

    @staticmethod
    def _weighted_average(values, weights):
        """
        Calculate a weighted average.

        Longer chunks receive slightly more influence than
        shorter chunks.
        """

        if not values:
            return 0.0

        if not weights:
            return sum(values) / len(values)

        total_weight = sum(weights)

        if total_weight == 0:
            return sum(values) / len(values)

        weighted_sum = sum(
            value * weight
            for value, weight in zip(
                values,
                weights
            )
        )

        return weighted_sum / total_weight