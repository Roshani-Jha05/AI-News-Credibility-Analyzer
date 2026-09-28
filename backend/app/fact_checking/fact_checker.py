import os
import re
from pathlib import Path
from difflib import SequenceMatcher

import requests
from dotenv import load_dotenv

from .claim_extractor import extract_claims


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

GOOGLE_FACT_CHECK_API_KEY = os.getenv("GOOGLE_FACT_CHECK_API_KEY")

GOOGLE_FACT_CHECK_URL = (
    "https://factchecktools.googleapis.com/v1alpha1/claims:search"
)


# ============================================================
# CONSTANTS
# ============================================================

MATCH_THRESHOLD = 0.45

SEARCH_STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "been",
    "being",
    "by",
    "for",
    "from",
    "had",
    "has",
    "have",
    "he",
    "her",
    "his",
    "in",
    "into",
    "is",
    "it",
    "its",
    "of",
    "on",
    "or",
    "that",
    "the",
    "their",
    "there",
    "they",
    "this",
    "to",
    "was",
    "were",
    "which",
    "who",
    "with",
    "would",
    "you",
    "your",
    "according",
    "reported",
    "reports",
    "report",
    "claim",
    "claims",
    "claimed",
    "saying",
    "says",
    "said",
    "found",
    "find",
    "finding",
    "shows",
    "show",
    "shown",
    "believed",
    "believes",
    "believe",
    "think",
    "thinks",
    "thought",
    "known",
    "know",
    "people",
    "person",
    "things",
    "thing",
    "year",
    "years",
    "day",
    "days",
    "time",
    "times",
}


# ============================================================
# EXCEPTIONS
# ============================================================

class FactCheckError(Exception):
    """Raised when fact-checking fails."""


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_claim(text: str) -> str:
    """
    Normalize a claim for comparison.
    """

    if not text:
        return ""

    text = text.lower()

    # Remove punctuation while keeping letters/numbers.
    text = re.sub(r"[^\w\s]", " ", text)

    # Collapse whitespace.
    text = re.sub(r"\s+", " ", text).strip()

    return text


def _meaningful_words(text: str) -> list[str]:
    """
    Return meaningful words from normalized text.
    """

    words = normalize_claim(text).split()

    return [
        word
        for word in words
        if word not in SEARCH_STOPWORDS
        and len(word) > 1
    ]


def _search_words(text: str) -> list[str]:
    """
    Prepare words for Google Fact Check API search queries.
    """

    words = normalize_claim(text).split()

    return [
        word
        for word in words
        if word not in SEARCH_STOPWORDS
        and len(word) > 1
    ]


# ============================================================
# NEGATION DETECTION
# ============================================================

NEGATION_WORDS = {
    "not",
    "no",
    "never",
    "neither",
    "nor",
    "false",
    "fake",
    "didnt",
    "didn't",
    "wasnt",
    "wasn't",
    "werent",
    "weren't",
    "isnt",
    "isn't",
    "arent",
    "aren't",
    "cannot",
    "can't",
    "couldnt",
    "couldn't",
    "wouldnt",
    "wouldn't",
    "shouldnt",
    "shouldn't",
}


def extract_negation_words(text: str) -> set[str]:
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
# WORD RELATIONSHIP
# ============================================================

def _word_variants(word: str) -> set[str]:
    """
    Generate simple morphological variants of a word.

    This helps match things such as:
        astronaut / astronauts
        describe / describes
        landing / landed
    """

    variants = {word}

    if len(word) <= 3:
        return variants

    if word.endswith("ies"):
        variants.add(word[:-3] + "y")

    if word.endswith("ing"):
        variants.add(word[:-3])

        if len(word) > 5:
            variants.add(word[:-3] + "e")

    if word.endswith("ed"):
        variants.add(word[:-2])

    if word.endswith("es"):
        variants.add(word[:-2])

    if word.endswith("s"):
        variants.add(word[:-1])

    return variants


def _words_are_related(word_a: str, word_b: str) -> bool:
    """
    Determine whether two words are identical or simple
    morphological variants of one another.
    """

    if word_a == word_b:
        return True

    variants_a = _word_variants(word_a)
    variants_b = _word_variants(word_b)

    if variants_a.intersection(variants_b):
        return True

    # Short fuzzy comparison for longer words.
    if len(word_a) >= 6 and len(word_b) >= 6:
        similarity = SequenceMatcher(
            None,
            word_a,
            word_b,
        ).ratio()

        if similarity >= 0.85:
            return True

    return False


# ============================================================
# CLAIM SIMILARITY
# ============================================================

def calculate_claim_similarity(
    claim_a: str,
    claim_b: str,
) -> float:
    """
    Compare two claims using several signals:

    1. Submitted-claim coverage
    2. Published fact-check coverage
    3. Jaccard similarity
    4. Sequence similarity
    5. Containment
    6. Core/distinctive-term overlap

    The important difference from the old matcher is that a
    published fact-check is often much shorter than the user's
    claim.

    Example:

        User:
        "On July 20, 1969, Buzz Aldrin took Holy Communion
        on the Moon during Apollo 11..."

        Fact-check:
        "Account by Apollo 11 astronaut Buzz Aldrin describes
        his taking Communion on the moon."

    These are clearly about the same event even though the
    wording and length differ.
    """

    if not claim_a or not claim_b:
        return 0.0

    normalized_a = normalize_claim(claim_a)
    normalized_b = normalize_claim(claim_b)

    if not normalized_a or not normalized_b:
        return 0.0

    # Exact match.
    if normalized_a == normalized_b:
        return 1.0

    words_a = _meaningful_words(normalized_a)
    words_b = _meaningful_words(normalized_b)

    if not words_a or not words_b:
        return 0.0

    # --------------------------------------------------------
    # 1. Submitted claim coverage
    # --------------------------------------------------------

    matched_a = set()

    for word_a in words_a:
        for word_b in words_b:
            if _words_are_related(word_a, word_b):
                matched_a.add(word_a)
                break

    submitted_coverage = len(matched_a) / len(words_a)

    # --------------------------------------------------------
    # 2. Published claim coverage
    # --------------------------------------------------------

    matched_b = set()

    for word_b in words_b:
        for word_a in words_a:
            if _words_are_related(word_a, word_b):
                matched_b.add(word_b)
                break

    published_coverage = len(matched_b) / len(words_b)

    # --------------------------------------------------------
    # 3. Jaccard similarity
    # --------------------------------------------------------

    set_a = set(words_a)
    set_b = set(words_b)

    intersection = set_a.intersection(set_b)
    union = set_a.union(set_b)

    jaccard_overlap = (
        len(intersection) / len(union)
        if union
        else 0.0
    )

    # --------------------------------------------------------
    # 4. Sequence similarity
    # --------------------------------------------------------

    sequence_similarity = SequenceMatcher(
        None,
        normalized_a,
        normalized_b,
    ).ratio()

    # --------------------------------------------------------
    # 5. Containment
    # --------------------------------------------------------

    containment_score = 0.0

    if normalized_a in normalized_b:
        containment_score = 1.0

    elif normalized_b in normalized_a:
        containment_score = 1.0

    # --------------------------------------------------------
    # 6. Distinctive/core term overlap
    # --------------------------------------------------------
    #
    # Instead of hard-coding specific claims such as Apollo,
    # Buzz Aldrin, etc., identify distinctive words that occur
    # in both claims.
    #
    # Proper nouns, numbers, and longer words are especially
    # useful because they carry more identifying information.
    # --------------------------------------------------------

    core_a = set()
    core_b = set()

    for word in words_a:
        if (
            len(word) >= 5
            or any(char.isdigit() for char in word)
        ):
            core_a.add(word)

    for word in words_b:
        if (
            len(word) >= 5
            or any(char.isdigit() for char in word)
        ):
            core_b.add(word)

    shared_core_terms = set()

    for word_a in core_a:
        for word_b in core_b:
            if _words_are_related(word_a, word_b):
                shared_core_terms.add(word_a)
                break

    if core_a:
        core_coverage = (
            len(shared_core_terms) / len(core_a)
        )
    else:
        core_coverage = 0.0

    # --------------------------------------------------------
    # 7. Negation consistency
    # --------------------------------------------------------

    negation_a = has_negation(claim_a)
    negation_b = has_negation(claim_b)

    if negation_a != negation_b:
        negation_penalty = 0.15
    else:
        negation_penalty = 0.0

    # --------------------------------------------------------
    # 8. Weighted final score
    # --------------------------------------------------------

    similarity = (
        (submitted_coverage * 0.20)
        + (published_coverage * 0.20)
        + (jaccard_overlap * 0.10)
        + (sequence_similarity * 0.10)
        + (containment_score * 0.05)
        + (core_coverage * 0.35)
    )

    similarity -= negation_penalty

    # --------------------------------------------------------
    # Strong published-claim coverage
    # --------------------------------------------------------

    if published_coverage >= 0.60:
        similarity = max(
            similarity,
            published_coverage * 0.75,
        )

    # --------------------------------------------------------
    # Strong core-term overlap
    # --------------------------------------------------------

    if (
        core_coverage >= 0.75
        and len(shared_core_terms) >= 3
    ):
        similarity = max(
            similarity,
            0.60,
        )

    if (
        core_coverage >= 0.90
        and len(shared_core_terms) >= 4
    ):
        similarity = max(
            similarity,
            0.70,
        )

    return min(
        max(similarity, 0.0),
        1.0,
    )


# ============================================================
# GOOGLE SEARCH QUERY GENERATION
# ============================================================

def _build_search_queries(claim: str) -> list[str]:
    """
    Generate multiple search queries from a claim.

    Google Fact Check Tools sometimes returns different
    results depending on how the query is phrased.
    """

    queries = []

    # --------------------------------------------------------
    # Original claim
    # --------------------------------------------------------

    original = claim.strip()

    if original:
        queries.append(original)

    # --------------------------------------------------------
    # Compact keyword query
    # --------------------------------------------------------

    words = _search_words(claim)

    if words:
        compact_query = " ".join(words[:12])

        if compact_query not in queries:
            queries.append(compact_query)

    # --------------------------------------------------------
    # Short keyword windows
    # --------------------------------------------------------

    window_size = 5
    step = 4

    for start in range(
        0,
        len(words),
        step,
    ):
        window = words[start:start + window_size]

        if len(window) < 3:
            continue

        query = " ".join(window)

        if query not in queries:
            queries.append(query)

        if len(queries) >= 5:
            break

    return queries[:5]


# ============================================================
# GOOGLE FACT CHECK API SEARCH
# ============================================================

def _search_google_fact_checks(
    query: str,
) -> list[dict]:
    """
    Search Google Fact Check Tools API.
    """

    if not GOOGLE_FACT_CHECK_API_KEY:
        raise FactCheckError(
            "GOOGLE_FACT_CHECK_API_KEY is missing."
        )

    params = {
        "query": query,
        "languageCode": "en",
        "pageSize": 20,
    }

    headers = {
        "X-Goog-Api-Key": GOOGLE_FACT_CHECK_API_KEY,
    }

    print()
    print("Searching Google Fact Check API:")
    print(query)

    try:
        response = requests.get(
            GOOGLE_FACT_CHECK_URL,
            params=params,
            headers=headers,
            timeout=15,
        )

    except requests.RequestException as error:
        raise FactCheckError(
            f"Google Fact Check API request failed: {error}"
        ) from error

    if response.status_code != 200:
        try:
            error_data = response.json()
        except ValueError:
            error_data = response.text

        raise FactCheckError(
            "Google Fact Check API returned "
            f"HTTP {response.status_code}: {error_data}"
        )

    try:
        data = response.json()
    except ValueError as error:
        raise FactCheckError(
            "Google Fact Check API returned invalid JSON."
        ) from error

    claims = data.get("claims", [])

    print(
        f"Results returned: {len(claims)}"
    )

    return claims


# ============================================================
# VERDICT EXTRACTION
# ============================================================

def get_verdict_from_rating(
    rating: str,
) -> str:
    """
    Convert a publisher's textual rating into one of the
    application's standard verdicts.
    """

    if not rating:
        return "Unverifiable"

    rating_lower = rating.lower().strip()

    # False
    false_terms = [
        "false",
        "mostly false",
        "pants on fire",
        "incorrect",
        "wrong",
        "fake",
        "not true",
        "untrue",
    ]

    for term in false_terms:
        if term in rating_lower:
            return "False"

    # True
    true_terms = [
        "true",
        "mostly true",
        "correct",
        "accurate",
        "yes",
    ]

    for term in true_terms:
        if term in rating_lower:
            return "True"

    # Misleading
    misleading_terms = [
        "misleading",
        "half true",
        "half-true",
        "partly true",
        "partially true",
        "mixture",
        "mixed",
        "missing context",
        "out of context",
    ]

    for term in misleading_terms:
        if term in rating_lower:
            return "Misleading"

    return "Unverifiable"


def get_verdict_from_review_context(
    rating: str,
    review_title: str = "",
    review_text: str = "",
) -> str:
    """
    Determine a verdict using the publisher's rating first,
    with title/text as supporting context.
    """

    verdict = get_verdict_from_rating(rating)

    if verdict != "Unverifiable":
        return verdict

    combined = " ".join(
        [
            rating or "",
            review_title or "",
            review_text or "",
        ]
    ).lower()

    if "pants on fire" in combined:
        return "False"

    if "false" in combined:
        return "False"

    if "misleading" in combined:
        return "Misleading"

    if "true" in combined:
        return "True"

    return "Unverifiable"


# ============================================================
# FACT-CHECK A SINGLE CLAIM
# ============================================================

def fact_check_claim(
    claim: str,
) -> dict:
    """
    Search Google Fact Check Tools for a claim and return
    the strongest matching published fact-check.
    """

    if not claim or not claim.strip():
        raise FactCheckError(
            "Claim cannot be empty."
        )

    if not GOOGLE_FACT_CHECK_API_KEY:
        raise FactCheckError(
            "GOOGLE_FACT_CHECK_API_KEY is missing."
        )

    claim = claim.strip()

    # --------------------------------------------------------
    # Build multiple queries
    # --------------------------------------------------------

    search_queries = _build_search_queries(claim)

    print()
    print("=" * 60)
    print("FACT CHECK SEARCH QUERIES")
    print("=" * 60)

    for index, query in enumerate(
        search_queries,
        start=1,
    ):
        print(f"{index}. {query}")

    # --------------------------------------------------------
    # Search Google using all queries
    # --------------------------------------------------------

    all_claims = []

    for query in search_queries:
        results = _search_google_fact_checks(query)

        all_claims.extend(results)

    # --------------------------------------------------------
    # Deduplicate Google results
    # --------------------------------------------------------

    unique_claims = []

    seen = set()

    for item in all_claims:
        google_claim_text = (
            item.get("text", "")
            .strip()
        )

        if not google_claim_text:
            continue

        key = normalize_claim(
            google_claim_text
        )

        if key in seen:
            continue

        seen.add(key)
        unique_claims.append(item)

    # --------------------------------------------------------
    # No Google results
    # --------------------------------------------------------

    if not unique_claims:
        return {
            "verdict": "No fact-check found",
            "confidence": 0,
            "reasoning": (
                "Google Fact Check Tools did not return "
                "a published fact-check for this claim."
            ),
            "factAnalysis": (
                "No published fact-check was found."
            ),
            "claimExplanation": (
                "No matching published fact-check "
                "was returned by Google Fact Check Tools."
            ),
            "sources": [],
            "claim": claim,
        }

    # --------------------------------------------------------
    # Calculate similarity for every result
    # --------------------------------------------------------

    scored_claims = []

    print()
    print("=" * 60)
    print("ALL GOOGLE FACT CHECK RESULTS")
    print("=" * 60)

    for index, item in enumerate(
        unique_claims,
        start=1,
    ):
        google_claim = (
            item.get("text", "")
            .strip()
        )

        similarity = calculate_claim_similarity(
            claim,
            google_claim,
        )

        print()
        print(f"Result #{index}")
        print(f"Google claim:")
        print(google_claim)
        print(
            f"Similarity: {similarity:.4f}"
        )

        scored_claims.append(
            (
                similarity,
                item,
            )
        )

    # --------------------------------------------------------
    # Select strongest match
    # --------------------------------------------------------

    scored_claims.sort(
        key=lambda item: item[0],
        reverse=True,
    )

    best_similarity, best_match = scored_claims[0]

    print()
    print("=" * 60)
    print("BEST FACT CHECK MATCH")
    print("=" * 60)
    print(
        f"Similarity: {best_similarity:.4f}"
    )
    print(
        f"Percentage: {round(best_similarity * 100)}"
    )
    print(
        "Google claim:"
    )
    print(
        best_match.get("text", "")
    )

    # --------------------------------------------------------
    # Reject weak matches
    # --------------------------------------------------------

    if best_similarity < MATCH_THRESHOLD:
        return {
            "verdict": "No fact-check found",
            "confidence": 0,
            "reasoning": (
                "Google Fact Check Tools returned "
                "results, but none were sufficiently "
                "similar to the submitted claim."
            ),
            "factAnalysis": (
                "Google Fact Check Tools returned results, "
                "but none were sufficiently similar to "
                "the submitted claim."
            ),
            "claimExplanation": (
                "A sufficiently similar published "
                "fact-check was not found for this claim."
            ),
            "sources": [],
            "claim": claim,
        }

    # --------------------------------------------------------
    # Extract claim reviews
    # --------------------------------------------------------

    claim_reviews = best_match.get(
        "claimReview",
        [],
    )

    if not claim_reviews:
        return {
            "verdict": "Unverifiable",
            "confidence": round(
                best_similarity * 100
            ),
            "reasoning": (
                "A matching Google Fact Check claim "
                "was found, but no publisher review "
                "was available."
            ),
            "factAnalysis": (
                "A matching fact-check claim was found, "
                "but its publisher review could not "
                "be retrieved."
            ),
            "claimExplanation": (
                "The published claim did not contain "
                "enough review information to determine "
                "a verdict."
            ),
            "sources": [],
            "claim": claim,
        }

    # --------------------------------------------------------
    # Use first available review
    # --------------------------------------------------------

    review = claim_reviews[0]

    publisher = review.get(
        "publisher",
        {},
    )

    publisher_name = publisher.get(
        "name",
        "Unknown publisher",
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

    textual_rating = review.get(
        "textualRating",
        "",
    )

    # --------------------------------------------------------
    # Print selected review
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("SELECTED FACT CHECK REVIEW")
    print("=" * 60)
    print(
        f"Publisher: {publisher_name}"
    )
    print(
        f"Title: {review_title}"
    )
    print(
        f"Rating: {textual_rating}"
    )
    print(
        f"Date: {review_date}"
    )
    print(
        f"URL: {review_url}"
    )

    # --------------------------------------------------------
    # Determine verdict
    # --------------------------------------------------------

    verdict = get_verdict_from_review_context(
        rating=textual_rating,
        review_title=review_title,
    )

    # --------------------------------------------------------
    # Sources
    # --------------------------------------------------------

    sources = []

    if review_url:
        sources.append(
            {
                "title": (
                    review_title
                    or "Published fact-check"
                ),
                "url": review_url,
                "publisher": publisher_name,
                "date": review_date,
            }
        )

    # --------------------------------------------------------
    # Reasoning
    # --------------------------------------------------------

    reasoning = (
        f"{publisher_name} published a fact-check "
        f"covering a substantially similar claim. "
        f"The publisher's rating was "
        f"\"{textual_rating or 'not provided'}\"."
    )

    fact_analysis = (
        f"A published fact-check from "
        f"{publisher_name} was matched to this claim "
        f"with approximately "
        f"{round(best_similarity * 100)}% textual similarity."
    )

    claim_explanation = (
        f"The matched fact-check states: "
        f"\"{best_match.get('text', '').strip()}\""
    )

    # --------------------------------------------------------
    # Final result
    # --------------------------------------------------------

    return {
        "verdict": verdict,
        "confidence": round(
            best_similarity * 100
        ),
        "reasoning": reasoning,
        "factAnalysis": fact_analysis,
        "claimExplanation": claim_explanation,
        "sources": sources,
        "claim": claim,
    }


# ============================================================
# FACT-CHECK ENTIRE ARTICLE
# ============================================================

def fact_check_article(
    article_text: str | None = None,
    article_url: str | None = None,
    max_claims: int = 3,
) -> dict:
    """
    Extract important claims from an article and fact-check
    up to max_claims of them.

    The strongest fact-check result is returned as the main
    verdict, while all checked claims are preserved in
    checkedClaims.
    """

    # --------------------------------------------------------
    # Validate input
    # --------------------------------------------------------

    if not article_text or not article_text.strip():
        return {
            "verdict": "No fact-check found",
            "confidence": 0,
            "reasoning": (
                "No article text was available for "
                "fact-checking."
            ),
            "factAnalysis": (
                "No article text was available."
            ),
            "claimExplanation": (
                "Unable to extract claims because "
                "the article text was empty."
            ),
            "sources": [],
            "factScore": 50,
            "checkedClaims": [],
        }

    article_text = article_text.strip()

    # --------------------------------------------------------
    # Extract claims
    # --------------------------------------------------------

    claims = extract_claims(
        article_text,
        max_claims=max_claims,
    )

    print()
    print("=" * 60)
    print("EXTRACTED FACT-CHECK CLAIMS")
    print("=" * 60)

    for index, claim in enumerate(
        claims,
        start=1,
    ):
        print(
            f"{index}. {claim}"
        )

    # --------------------------------------------------------
    # No claims
    # --------------------------------------------------------

    if not claims:
        return {
            "verdict": "No fact-check found",
            "confidence": 0,
            "reasoning": (
                "No suitable factual claims could "
                "be extracted from the article."
            ),
            "factAnalysis": (
                "No suitable claims were identified "
                "for fact-checking."
            ),
            "claimExplanation": (
                "The article did not contain enough "
                "clear factual statements to check."
            ),
            "sources": [],
            "factScore": 50,
            "checkedClaims": [],
        }

    # --------------------------------------------------------
    # Fact-check each claim
    # --------------------------------------------------------

    checked_claims = []

    for claim in claims:

        try:
            result = fact_check_claim(
                claim
            )

        except FactCheckError as error:
            result = {
                "verdict": "No fact-check found",
                "confidence": 0,
                "reasoning": str(error),
                "factAnalysis": str(error),
                "claimExplanation": str(error),
                "sources": [],
                "claim": claim,
            }

        except Exception as error:
            result = {
                "verdict": "No fact-check found",
                "confidence": 0,
                "reasoning": (
                    f"Fact-checking failed: {error}"
                ),
                "factAnalysis": (
                    f"Fact-checking failed: {error}"
                ),
                "claimExplanation": (
                    f"Fact-checking failed: {error}"
                ),
                "sources": [],
                "claim": claim,
            }

        if result is not None:

            result["_candidate_claim"] = claim

            checked_claims.append(
                result
            )

    # --------------------------------------------------------
    # No successful results
    # --------------------------------------------------------

    if not checked_claims:
        return {
            "verdict": "No fact-check found",
            "confidence": 0,
            "reasoning": (
                "No fact-check results were available "
                "for the extracted claims."
            ),
            "factAnalysis": (
                "No published fact-check was found "
                "for the extracted claims."
            ),
            "claimExplanation": (
                "The extracted claims could not be "
                "matched to published fact-checks."
            ),
            "sources": [],
            "factScore": 50,
            "checkedClaims": [],
        }

    # --------------------------------------------------------
    # Select strongest result
    # --------------------------------------------------------
    #
    # Priority:
    #
    # False        -> 4
    # Misleading   -> 3
    # True         -> 2
    # Unverifiable -> 1
    # No fact-check -> 0
    #
    # Confidence is used as the tie-breaker.
    # --------------------------------------------------------

    verdict_priority = {
        "False": 4,
        "Misleading": 3,
        "True": 2,
        "Unverifiable": 1,
        "No fact-check found": 0,
    }

    best_result = max(
        checked_claims,
        key=lambda result: (
            verdict_priority.get(
                result.get(
                    "verdict",
                    "No fact-check found",
                ),
                0,
            ),
            result.get(
                "confidence",
                0,
            ),
        ),
    )

    # --------------------------------------------------------
    # Fact accuracy score
    # --------------------------------------------------------

    best_verdict = best_result.get(
        "verdict",
        "No fact-check found",
    )

    if best_verdict == "True":
        fact_score = 100

    elif best_verdict == "False":
        fact_score = 0

    elif best_verdict in {
        "Misleading",
        "Unverifiable",
        "No fact-check found",
    }:
        fact_score = 50

    else:
        fact_score = 50

    # --------------------------------------------------------
    # Clean internal field before returning
    # --------------------------------------------------------

    clean_checked_claims = []

    for result in checked_claims:

        cleaned = {
            key: value
            for key, value in result.items()
            if key != "_candidate_claim"
        }

        clean_checked_claims.append(
            cleaned
        )

    # --------------------------------------------------------
    # Final article result
    # --------------------------------------------------------

    return {
        "verdict": best_result.get(
            "verdict",
            "No fact-check found",
        ),
        "confidence": best_result.get(
            "confidence",
            0,
        ),
        "reasoning": best_result.get(
            "reasoning",
            "",
        ),
        "factAnalysis": best_result.get(
            "factAnalysis",
            "",
        ),
        "claimExplanation": best_result.get(
            "claimExplanation",
            "",
        ),
        "sources": best_result.get(
            "sources",
            [],
        ),
        "claim": best_result.get(
            "claim",
            "",
        ),
        "factScore": fact_score,
        "checkedClaims": clean_checked_claims,
    }