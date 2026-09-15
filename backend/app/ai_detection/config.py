# ============================================================
# AI DETECTION - CONFIGURATION
# ============================================================

# ------------------------------------------------------------
# RoBERTa model
# ------------------------------------------------------------

MODEL_ID = "frankhanhj/roberta-base-all-sources-ai-identifier"

MAX_LENGTH = 512


# ------------------------------------------------------------
# Classification
# ------------------------------------------------------------

AI_THRESHOLD = 0.50


# ------------------------------------------------------------
# Confidence
# ------------------------------------------------------------

CONFIDENCE_HIGH = 0.90
CONFIDENCE_MEDIUM = 0.70


# ------------------------------------------------------------
# Linguistic evidence
# ------------------------------------------------------------

PERPLEXITY_AI_THRESHOLD = 25.0
PERPLEXITY_HUMAN_THRESHOLD = 40.0

BURSTINESS_AI_THRESHOLD = 0.25
BURSTINESS_HUMAN_THRESHOLD = 0.40


# ------------------------------------------------------------
# Linguistic influence
#
# RoBERTa remains the primary signal.
# Linguistic evidence can only make a small adjustment.
# ------------------------------------------------------------

LINGUISTIC_ADJUSTMENT = 0.05

MIN_WORD_COUNT = 20