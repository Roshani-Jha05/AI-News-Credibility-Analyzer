# ============================================================
# PERPLEXITY CALCULATOR
# ============================================================

import math

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM


MODEL_ID = "gpt2"
MAX_LENGTH = 512


class PerplexityCalculator:

    def __init__(self):

        print("Loading perplexity language model...")

        self.device = torch.device("cpu")

        self.tokenizer = AutoTokenizer.from_pretrained(
            MODEL_ID
        )

        self.model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID
        )

        self.model.to(self.device)
        self.model.eval()

        print("Perplexity language model loaded.")

    def calculate(self, text):
        """
        Calculate language-model perplexity for the supplied text.
        """

        if not text or not text.strip():
            raise ValueError("Text cannot be empty.")

        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=MAX_LENGTH
        )

        inputs = {
            key: value.to(self.device)
            for key, value in inputs.items()
        }

        with torch.no_grad():

            outputs = self.model(
                **inputs,
                labels=inputs["input_ids"]
            )

        loss = outputs.loss.item()

        perplexity = math.exp(loss)

        return round(perplexity, 4)