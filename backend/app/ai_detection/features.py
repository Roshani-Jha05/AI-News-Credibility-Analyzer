# ============================================================
# AI DETECTION - LINGUISTIC FEATURES
# ============================================================

import math
import re
from collections import Counter
from .perplexity import PerplexityCalculator

# ============================================================
# TEXT HELPERS
# ============================================================

def split_sentences(text):
    """
    Split text into sentences using basic punctuation.
    """

    sentences = re.split(r"(?<=[.!?])\s+", text.strip())

    return [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]


def tokenize_words(text):
    """
    Extract words from text.
    """

    return re.findall(r"\b[\w'-]+\b", text.lower())


# ============================================================
# PERPLEXITY
# ============================================================

_perplexity_calculator = None


def calculate_perplexity(text):
    """
    Calculate perplexity using the language model.
    """

    global _perplexity_calculator

    if _perplexity_calculator is None:
        _perplexity_calculator = PerplexityCalculator()

    return _perplexity_calculator.calculate(text)


# ============================================================
# BURSTINESS
# ============================================================

def calculate_burstiness(text):
    """
    Measure variation in sentence lengths.

    Higher values indicate greater variation between
    sentence lengths.
    """

    sentences = split_sentences(text)

    if len(sentences) < 2:
        return 0.0

    lengths = [
        len(tokenize_words(sentence))
        for sentence in sentences
    ]

    mean = sum(lengths) / len(lengths)

    if mean == 0:
        return 0.0

    variance = sum(
        (length - mean) ** 2
        for length in lengths
    ) / len(lengths)

    standard_deviation = math.sqrt(variance)

    return standard_deviation / mean


# ============================================================
# SENTENCE STATISTICS
# ============================================================

def calculate_sentence_statistics(text):
    """
    Calculate basic sentence-length statistics.
    """

    sentences = split_sentences(text)

    if not sentences:
        return {
            "sentence_count": 0,
            "average_sentence_length": 0.0,
            "min_sentence_length": 0,
            "max_sentence_length": 0
        }

    lengths = [
        len(tokenize_words(sentence))
        for sentence in sentences
    ]

    return {
        "sentence_count": len(sentences),
        "average_sentence_length": round(
            sum(lengths) / len(lengths),
            2
        ),
        "min_sentence_length": min(lengths),
        "max_sentence_length": max(lengths)
    }


# ============================================================
# VOCABULARY DIVERSITY
# ============================================================

def calculate_vocabulary_diversity(text):
    """
    Calculate the ratio of unique words to total words.

    This is a simple type-token ratio (TTR).
    """

    words = tokenize_words(text)

    if not words:
        return 0.0

    unique_words = set(words)

    return round(
        len(unique_words) / len(words),
        4
    )


# ============================================================
# WORD STATISTICS
# ============================================================

def calculate_word_statistics(text):
    """
    Calculate basic word-level statistics.
    """

    words = tokenize_words(text)

    if not words:
        return {
            "word_count": 0,
            "average_word_length": 0.0
        }

    average_length = sum(
        len(word)
        for word in words
    ) / len(words)

    return {
        "word_count": len(words),
        "average_word_length": round(
            average_length,
            2
        )
    }


# ============================================================
# COMPLETE FEATURE EXTRACTION
# ============================================================

def extract_features(text):
    """
    Extract all currently implemented linguistic features.
    """

    if not text or not text.strip():
        raise ValueError("Text cannot be empty.")

    sentence_stats = calculate_sentence_statistics(text)
    word_stats = calculate_word_statistics(text)

    return {
        "perplexity": calculate_perplexity(text),

        "burstiness": round(
            calculate_burstiness(text),
            4
        ),

        "vocabulary_diversity": calculate_vocabulary_diversity(
            text
        ),

        **sentence_stats,
        **word_stats
    }