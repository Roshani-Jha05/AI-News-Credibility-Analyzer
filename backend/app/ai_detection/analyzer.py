# ============================================================
# AI NEWS CREDIBILITY ANALYZER - AI DETECTION
# ============================================================

from .detector import AIDetector
from .features import extract_features


class AIAnalyzer:
    """
    Main AI detection analyzer.

    RoBERTa is the primary AI/human classifier.
    Linguistic features provide supporting evidence.

    The linguistic features do NOT replace the RoBERTa
    prediction. They only make a small adjustment to the
    final AI probability.
    """

    def __init__(self):
        """
        Initialize the AI detection model.
        """

        self.detector = AIDetector()

    # ========================================================
    # MAIN ANALYSIS
    # ========================================================

    def analyze(self, text):
        """
        Analyze a piece of text for AI-generation likelihood.

        Parameters
        ----------
        text : str
            Article or text to analyze.

        Returns
        -------
        dict
            Complete AI detection result.
        """

        if not text or not text.strip():
            raise ValueError("Text cannot be empty.")

        # ----------------------------------------------------
        # 1. RoBERTa model prediction
        # ----------------------------------------------------

        model_result = self.detector.analyze(text)

        # ----------------------------------------------------
        # 2. Extract linguistic features
        # ----------------------------------------------------

        features = extract_features(text)

        # ----------------------------------------------------
        # 3. Interpret linguistic evidence
        # ----------------------------------------------------

        linguistic_evidence = self._calculate_linguistic_evidence(
            features
        )

        # ----------------------------------------------------
        # 4. Combine RoBERTa + linguistic evidence
        # ----------------------------------------------------

        final_result = self._combine_results(
            model_result,
            linguistic_evidence
        )

        # ----------------------------------------------------
        # 5. Return complete result
        # ----------------------------------------------------

        return {
            "prediction": final_result["prediction"],
            "confidence": final_result["confidence"],
            "ai_probability": final_result["ai_probability"],
            "human_probability": final_result["human_probability"],

            # Primary model result
            "model": {
                "prediction": model_result["prediction"],
                "ai_probability": model_result["ai_probability"],
                "human_probability": model_result["human_probability"],
                "confidence": model_result["confidence"]
            },

            # Linguistic information
            "linguistic_features": features,

            # Interpreted linguistic evidence
            "linguistic_evidence": linguistic_evidence
        }

    # ========================================================
    # LINGUISTIC EVIDENCE
    # ========================================================

    def _calculate_linguistic_evidence(self, features):
        """
        Interpret linguistic features as AI-like,
        Human-like, or Neutral signals.

        Currently:
            - Perplexity
            - Burstiness

        Vocabulary diversity and other statistics are
        returned as features but are not currently used
        as direct classification signals because they do
        not reliably separate AI and human text in the
        current evaluation dataset.
        """

        perplexity = features["perplexity"]
        burstiness = features["burstiness"]

        signals = []

        # ----------------------------------------------------
        # Perplexity
        # ----------------------------------------------------

        if perplexity < 25:

            signals.append({
                "feature": "perplexity",
                "signal": "AI-like",
                "value": perplexity
            })

        elif perplexity > 40:

            signals.append({
                "feature": "perplexity",
                "signal": "Human-like",
                "value": perplexity
            })

        else:

            signals.append({
                "feature": "perplexity",
                "signal": "Neutral",
                "value": perplexity
            })

        # ----------------------------------------------------
        # Burstiness
        # ----------------------------------------------------

        if burstiness < 0.25:

            signals.append({
                "feature": "burstiness",
                "signal": "AI-like",
                "value": burstiness
            })

        elif burstiness > 0.40:

            signals.append({
                "feature": "burstiness",
                "signal": "Human-like",
                "value": burstiness
            })

        else:

            signals.append({
                "feature": "burstiness",
                "signal": "Neutral",
                "value": burstiness
            })

        # ----------------------------------------------------
        # Count supporting signals
        # ----------------------------------------------------

        ai_signals = sum(
            1
            for signal in signals
            if signal["signal"] == "AI-like"
        )

        human_signals = sum(
            1
            for signal in signals
            if signal["signal"] == "Human-like"
        )

        # ----------------------------------------------------
        # Determine overall linguistic evidence
        # ----------------------------------------------------

        if ai_signals > human_signals:

            overall = "AI-like"

        elif human_signals > ai_signals:

            overall = "Human-like"

        else:

            overall = "Neutral"

        return {
            "overall": overall,
            "signals": signals
        }

    # ========================================================
    # RESULT FUSION
    # ========================================================

    def _combine_results(
        self,
        model_result,
        linguistic_evidence
    ):
        """
        Combine RoBERTa prediction with linguistic evidence.

        RoBERTa remains the primary signal.

        Linguistic evidence can make only a small adjustment:
            AI-like     -> +0.05
            Human-like  -> -0.05
            Neutral     ->  0.00

        The probability is always constrained to [0, 1].
        """

        # ----------------------------------------------------
        # Start with RoBERTa probability
        # ----------------------------------------------------

        model_ai_probability = model_result["ai_probability"]

        adjustment = 0.0

        # ----------------------------------------------------
        # Apply linguistic evidence
        # ----------------------------------------------------

        if linguistic_evidence["overall"] == "AI-like":

            adjustment = 0.05

        elif linguistic_evidence["overall"] == "Human-like":

            adjustment = -0.05

        # Neutral = no adjustment

        # ----------------------------------------------------
        # Calculate final AI probability
        # ----------------------------------------------------

        final_ai_probability = (
            model_ai_probability + adjustment
        )

        # ----------------------------------------------------
        # Keep probability within valid range
        # ----------------------------------------------------

        final_ai_probability = max(
            0.0,
            min(1.0, final_ai_probability)
        )

        # ----------------------------------------------------
        # Human probability
        # ----------------------------------------------------

        final_human_probability = (
            1.0 - final_ai_probability
        )

        # ----------------------------------------------------
        # Final prediction
        # ----------------------------------------------------

        if final_ai_probability >= 0.50:

            prediction = "AI-generated"

        else:

            prediction = "Human-written"

        # ----------------------------------------------------
        # Final confidence
        # ----------------------------------------------------

        confidence_value = max(
            final_ai_probability,
            final_human_probability
        )

        if confidence_value >= 0.90:

            confidence = "High"

        elif confidence_value >= 0.70:

            confidence = "Medium"

        else:

            confidence = "Low"

        return {
            "prediction": prediction,
            "ai_probability": round(
                final_ai_probability,
                4
            ),
            "human_probability": round(
                final_human_probability,
                4
            ),
            "confidence": confidence
        }


# ============================================================
# SINGLETON ANALYZER
# ============================================================

_analyzer = None


def get_analyzer():
    """
    Return a single shared AIAnalyzer instance.

    This prevents the RoBERTa model from being loaded
    again for every API request.
    """

    global _analyzer

    if _analyzer is None:

        _analyzer = AIAnalyzer()

    return _analyzer


# ============================================================
# PUBLIC ANALYSIS FUNCTION
# ============================================================

def analyze_article(text):
    """
    Public helper used by the FastAPI backend.

    Parameters
    ----------
    text : str
        Article text.

    Returns
    -------
    dict
        Complete AI detection result.
    """

    analyzer = get_analyzer()

    return analyzer.analyze(text)