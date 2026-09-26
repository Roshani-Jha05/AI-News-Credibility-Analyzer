# ============================================================
# FACT CHECKING
# ============================================================

import os
import re
from pathlib import Path
from difflib import SequenceMatcher

import requests
from dotenv import load_dotenv


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv(
    Path(__file__).resolve().parents[2] / ".env"
)

GOOGLE_FACT_CHECK_API_KEY = os.getenv(
    "GOOGLE_FACT_CHECK_API_KEY"
)

GOOGLE_FACT_CHECK_URL = (
    "https://factchecktools.googleapis.com/v1alpha1/claims:search"
)


# ============================================================
# EXCEPTIONS
# ============================================================

class FactCheckError(Exception):
    """Raised when the fact-checking process fails."""
    pass


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_claim(text: str) -> str:
    """
    Normalize text before comparing claims.
    """

    text = text.lower()

    # Replace punctuation with spaces.
    text = re.sub(r"[^\w\s]", " ", text)

    # Remove extra whitespace.
    text = re.sub(r"\s+", " ", text)

    return text.strip()


# ============================================================
# NEGATION
# ============================================================

NEGATION_WORDS = {
    "not",
    "no",
    "never",
    "none",
    "neither",
    "nobody",
    "nothing",
    "without",
    "isnt",
    "isn't",
    "wasnt",
    "wasn't",
    "dont",
    "don't",
    "doesnt",
    "doesn't",
    "didnt",
    "didn't",
    "cannot",
    "can't",
    "cant",
}


def extract_negation_words(text: str) -> set:
    """
    Extract negation words from text.
    """

    normalized = normalize_claim(text)

    words = set(normalized.split())

    return words.intersection(NEGATION_WORDS)


def has_negation(text: str) -> bool:
    """
    Return True if the text contains a negation.
    """

    return bool(extract_negation_words(text))


# ============================================================
# CLAIM SIMILARITY
# ============================================================

def calculate_claim_similarity(
    submitted_claim: str,
    fact_checked_claim: str,
) -> float:
    """
    Calculate similarity between the submitted claim
    and a claim returned by Google Fact Check.

    Similarity uses:
    - exact normalized match
    - word overlap
    - SequenceMatcher similarity
    - basic concept matching
    """

    claim_a = normalize_claim(submitted_claim)
    claim_b = normalize_claim(fact_checked_claim)

    if not claim_a or not claim_b:
        return 0.0

    # --------------------------------------------------------
    # EXACT MATCH
    # --------------------------------------------------------

    if claim_a == claim_b:
        return 1.0

    # --------------------------------------------------------
    # WORD OVERLAP
    # --------------------------------------------------------

    words_a = set(claim_a.split())
    words_b = set(claim_b.split())

    if words_a and words_b:
        intersection = words_a.intersection(words_b)

        union = words_a.union(words_b)

        word_overlap = (
            len(intersection) / len(union)
            if union
            else 0.0
        )
    else:
        word_overlap = 0.0

    # --------------------------------------------------------
    # SEQUENCE SIMILARITY
    # --------------------------------------------------------

    sequence_similarity = SequenceMatcher(
        None,
        claim_a,
        claim_b,
    ).ratio()

    # --------------------------------------------------------
    # CONCEPT MATCHING
    # --------------------------------------------------------

    concept_groups = [
        {"earth", "world"},
        {"sun"},
        {"orbit", "orbital"},
        {"revolve", "revolves", "revolving"},
        {"static", "stationary", "fixed"},
        {"move", "moves", "moving", "motion"},
    ]

    concept_score = 0.0
    matched_groups = 0

    for group in concept_groups:

        has_a = bool(words_a.intersection(group))
        has_b = bool(words_b.intersection(group))

        if has_a and has_b:
            matched_groups += 1

    if concept_groups:
        concept_score = (
            matched_groups / len(concept_groups)
        )

    # --------------------------------------------------------
    # COMBINED SCORE
    # --------------------------------------------------------

    similarity = (
        (word_overlap * 0.30)
        + (sequence_similarity * 0.30)
        + (concept_score * 0.40)
    )

    return min(similarity, 1.0)


# ============================================================
# VERDICT FROM EXPLICIT RATING
# ============================================================

def get_verdict_from_rating(
    rating: str,
) -> str | None:
    """
    Try to determine a categorical verdict from Google's
    textual rating.

    Returns:
        True
        False
        Misleading
        None
    """

    if not rating:
        return None

    rating_lower = rating.lower().strip()

    # --------------------------------------------------------
    # MISLEADING / MIXED
    # --------------------------------------------------------

    misleading_indicators = [
        "misleading",
        "mostly misleading",
        "partly true",
        "partially true",
        "mixed",
    ]

    for indicator in misleading_indicators:
        if indicator in rating_lower:
            return "Misleading"

    # --------------------------------------------------------
    # FALSE
    # --------------------------------------------------------

    false_indicators = [
        "false",
        "not true",
        "not correct",
        "incorrect",
        "debunked",
        "no evidence",
        "does not support",
        "not accurate",
        "not the case",
        "isn't true",
        "is not true",
    ]

    for indicator in false_indicators:
        if indicator in rating_lower:
            return "False"

    # --------------------------------------------------------
    # TRUE
    # --------------------------------------------------------

    true_indicators = [
        "true",
        "correct",
        "accurate",
        "verified",
        "supported",
    ]

    for indicator in true_indicators:
        if indicator in rating_lower:
            return "True"

    return None


# ============================================================
# VERDICT FROM REVIEW CONTEXT
# ============================================================

def get_verdict_from_review_context(
    fact_checked_claim: str,
    rating: str,
    title: str,
) -> str:
    """
    Determine the verdict from Google's fact-check review.

    Uses:
    1. Explicit rating information.
    2. Conservative analysis of the review title.
    3. Wording in the rating/title.

    Does NOT automatically invert a verdict based only
    on claim negation.
    """

    # --------------------------------------------------------
    # 1. EXPLICIT RATING
    # --------------------------------------------------------

    explicit_verdict = get_verdict_from_rating(
        rating
    )

    if explicit_verdict:
        return explicit_verdict

    # --------------------------------------------------------
    # NORMALIZE TEXT
    # --------------------------------------------------------

    claim_normalized = normalize_claim(
        fact_checked_claim
    )

    title_normalized = normalize_claim(
        title
    )

    # --------------------------------------------------------
    # 2. CHECK NEGATED TITLE
    #
    # Example:
    #
    # Claim:
    #   The Earth is flat
    #
    # Title:
    #   The Earth is not flat - Full Fact
    #
    # The title explicitly rejects the claim.
    # --------------------------------------------------------

    claim_words = set(
        claim_normalized.split()
    )

    title_words = set(
        title_normalized.split()
    )

    if claim_words and title_words:

        common_words = (
            claim_words.intersection(title_words)
        )

        # Generic fact-check words should not
        # contribute to the meaningful match.
        generic_words = {
            "fact",
            "check",
            "factcheck",
            "review",
            "full",
        }

        meaningful_common_words = (
            common_words - generic_words
        )

        if len(meaningful_common_words) >= 2:

            claim_negated = has_negation(
                claim_normalized
            )

            title_negated = has_negation(
                title_normalized
            )

            if title_negated and not claim_negated:
                return "False"

    # --------------------------------------------------------
    # 3. CHECK REVIEW TITLE + RATING WORDING
    # --------------------------------------------------------

    combined_text = (
        f"{rating} {title}"
    ).lower()

    misleading_indicators = [
        "misleading",
        "mostly misleading",
        "partly true",
        "partially true",
        "mixed",
    ]

    for indicator in misleading_indicators:

        if indicator in combined_text:
            return "Misleading"

    false_indicators = [
        "not true",
        "not correct",
        "incorrect",
        "false",
        "debunked",
        "no evidence",
        "does not support",
        "not accurate",
        "not the case",
        "isn't true",
        "is not true",
    ]

    for indicator in false_indicators:

        if indicator in combined_text:
            return "False"

    return "Unverifiable"


# ============================================================
# FACT CHECK CLAIM
# ============================================================

def fact_check_claim(
    claim: str,
    article_url: str | None = None,
) -> dict:
    """
    Search Google Fact Check Tools for a submitted claim.

    Returns a structured fact-check result.
    """

    if not claim or not claim.strip():
        raise FactCheckError(
            "Claim cannot be empty."
        )

    if not GOOGLE_FACT_CHECK_API_KEY:
        raise FactCheckError(
            "GOOGLE_FACT_CHECK_API_KEY is not configured."
        )

    claim = claim.strip()

    # ========================================================
    # GOOGLE FACT CHECK API REQUEST
    # ========================================================

    params = {
        "query": claim,
    }

    headers = {
        "X-Goog-Api-Key": GOOGLE_FACT_CHECK_API_KEY,
    }

    try:

        response = requests.get(
            GOOGLE_FACT_CHECK_URL,
            params=params,
            headers=headers,
            timeout=30,
        )

    except requests.RequestException as error:

        raise FactCheckError(
            f"Google Fact Check API request failed: {error}"
        )

    # ========================================================
    # API ERROR
    # ========================================================

    if response.status_code != 200:

        raise FactCheckError(
            "Google Fact Check API returned "
            f"HTTP {response.status_code}."
        )

    try:

        data = response.json()

    except ValueError:

        raise FactCheckError(
            "Google Fact Check API returned invalid JSON."
        )

    # ========================================================
    # NO MATCHING FACT CHECK
    # ========================================================

    if not data.get("claims"):

        return {
            "verdict": "No fact-check found",
            "confidence": 0,
            "reasoning": (
                "No published fact-check matching "
                "the claim was found."
            ),
            "claim": claim,
            "factAnalysis": (
                "Google Fact Check Tools did not "
                "return a matching published fact-check."
            ),
            "claimExplanation": (
                "No existing fact-check was found "
                "for this claim."
            ),
            "sources": [],
        }

    # ========================================================
    # FIND BEST MATCH
    # ========================================================

    best_match = None
    best_similarity = 0.0

    for item in data.get("claims", []):

        fact_checked_claim = (
            item.get("text", "")
        )

        similarity = calculate_claim_similarity(
            claim,
            fact_checked_claim,
        )

        if similarity > best_similarity:

            best_similarity = similarity

            best_match = item

    # ========================================================
    # WEAK MATCH
    # ========================================================

    if (
        best_match is None
        or best_similarity < 0.50
    ):

        return {
            "verdict": "No fact-check found",
            "confidence": round(
                best_similarity * 100
            ),
            "reasoning": (
                "A sufficiently similar published "
                "fact-check was not found for this claim."
            ),
            "claim": claim,
            "factAnalysis": (
                "Google Fact Check Tools returned "
                "results, but none were sufficiently "
                "similar to the submitted claim."
            ),
            "claimExplanation": (
                "No sufficiently relevant existing "
                "fact-check was found for this claim."
            ),
            "sources": [],
        }

    # ========================================================
    # REVIEW INFORMATION
    # ========================================================

    review = {}

    if best_match.get("claimReview"):

        review = best_match[
            "claimReview"
        ][0]

    rating = review.get(
        "textualRating",
        "",
    )

    publisher = review.get(
        "publisher",
        {},
    )

    publisher_name = publisher.get(
        "name",
        "",
    )

    publisher_site = publisher.get(
        "site",
        "",
    )

    review_url = review.get(
        "url",
        "",
    )

    review_title = review.get(
        "title",
        "",
    )

    review_date = review.get(
        "reviewDate",
        "",
    )

    # ========================================================
    # DETERMINE VERDICT
    # ========================================================

    verdict = get_verdict_from_review_context(
        fact_checked_claim=best_match.get(
            "text",
            "",
        ),
        rating=rating,
        title=review_title,
    )

    # ========================================================
    # SOURCE INFORMATION
    # ========================================================

    sources = []

    if article_url:

        sources.append({
            "type": "article",
            "url": article_url,
        })

    if (
        publisher_name
        or publisher_site
        or review_url
    ):

        sources.append({
            "type": "fact_check",
            "publisher": publisher_name,
            "site": publisher_site,
            "url": review_url,
            "title": review_title,
            "reviewDate": review_date,
        })

    # ========================================================
    # ANALYSIS TEXT
    # ========================================================

    if verdict == "False":

        reasoning = (
            "A fact-checked claim matching the "
            "submitted claim was found with "
            f"{round(best_similarity * 100)}% similarity."
        )

    elif verdict == "True":

        reasoning = (
            "A fact-checked claim matching the "
            "submitted claim was found with "
            f"{round(best_similarity * 100)}% similarity."
        )

    elif verdict == "Misleading":

        reasoning = (
            "A related fact-check was found with "
            f"{round(best_similarity * 100)}% similarity "
            "and was rated as misleading."
        )

    else:

        reasoning = (
            "A related fact-check was found with "
            f"{round(best_similarity * 100)}% similarity, "
            "but the available review did not provide "
            "enough information to assign a reliable "
            "categorical verdict."
        )

    # ========================================================
    # FINAL RESULT
    # ========================================================

    return {
        "verdict": verdict,
        "confidence": round(
            best_similarity * 100
        ),
        "reasoning": reasoning,
        "factAnalysis": rating,
        "claimExplanation": best_match.get(
            "text",
            "",
        ),
        "sources": sources,
        "claim": claim,
    }