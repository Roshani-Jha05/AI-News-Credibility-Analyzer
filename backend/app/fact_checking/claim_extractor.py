import re


CLAIM_KEYWORDS = [
    "claimed",
    "claims",
    "according",
    "confirmed",
    "revealed",
    "found",
    "shows",
    "stated",
    "alleged",
    "evidence",
    "scientists",
    "study",
    "research",
    "report",
    "reports",
    "data",
    "announced",
    "officials",
    "experts",
    "government",
    "nasa",
    "earth",
    "sun",
]


def _clean_sentence(sentence: str) -> str:
    """Clean whitespace and surrounding quotation marks."""
    sentence = re.sub(r"\s+", " ", sentence).strip()
    sentence = sentence.strip('"“”')
    return sentence


def _sentence_score(sentence: str) -> int:
    """Score a sentence based on how likely it is to contain a factual claim."""

    lower_sentence = sentence.lower()
    score = 0

    for keyword in CLAIM_KEYWORDS:
        if keyword in lower_sentence:
            score += 1

    # Longer sentences are more likely to contain a complete claim.
    if len(sentence) >= 80:
        score += 1

    # Sentences containing numbers often contain factual claims.
    if re.search(r"\d", sentence):
        score += 1

    return score


def extract_claims(
    article_text: str,
    max_claims: int = 3
) -> list[str]:
    """
    Extract multiple likely factual claims from article text.

    Returns up to max_claims candidate claims, ordered from
    strongest to weakest.
    """

    if not article_text or not article_text.strip():
        raise ValueError("Article text is empty.")

    # ------------------------------------------------------------
    # 1. Check for an explicitly labelled "Claim:" section
    # ------------------------------------------------------------

    claim_match = re.search(
        r"claim:\s*(.*?)(?=\s*fact:|$)",
        article_text,
        flags=re.IGNORECASE | re.DOTALL
    )

    if claim_match:
        claim = _clean_sentence(claim_match.group(1))

        if len(claim) >= 20:
            return [claim]

    # ------------------------------------------------------------
    # 2. Split article into sentences
    # ------------------------------------------------------------

    sentences = re.split(
        r"(?<=[.!?])\s+",
        article_text.strip()
    )

    cleaned_sentences = []

    for sentence in sentences:
        sentence = _clean_sentence(sentence)

        if len(sentence) >= 40:
            cleaned_sentences.append(sentence)

    if not cleaned_sentences:
        raise ValueError(
            "Could not find suitable sentences in the article."
        )

    # ------------------------------------------------------------
    # 3. Score candidate sentences
    # ------------------------------------------------------------

    scored_sentences = []

    for index, sentence in enumerate(cleaned_sentences):

        score = _sentence_score(sentence)

        scored_sentences.append(
            (score, index, sentence)
        )

    # Highest score first.
    scored_sentences.sort(
        key=lambda item: (-item[0], item[1])
    )

    # ------------------------------------------------------------
    # 4. Select diverse claims
    # ------------------------------------------------------------

    selected_claims = []

    for score, _, sentence in scored_sentences:

        # Ignore extremely weak candidates.
        if score == 0 and selected_claims:
            continue

        normalized_sentence = re.sub(
            r"\W+",
            " ",
            sentence.lower()
        ).strip()

        # Avoid selecting nearly identical sentences.
        is_duplicate = False

        for existing in selected_claims:

            normalized_existing = re.sub(
                r"\W+",
                " ",
                existing.lower()
            ).strip()

            existing_words = set(
                normalized_existing.split()
            )

            current_words = set(
                normalized_sentence.split()
            )

            if not existing_words or not current_words:
                continue

            overlap = len(
                existing_words.intersection(current_words)
            ) / len(
                existing_words.union(current_words)
            )

            if overlap >= 0.70:
                is_duplicate = True
                break

        if is_duplicate:
            continue

        selected_claims.append(sentence)

        if len(selected_claims) >= max_claims:
            break

    if not selected_claims:
        raise ValueError(
            "Could not extract any suitable factual claims."
        )

    return selected_claims


def extract_main_claim(article_text: str) -> str:
    """
    Backwards-compatible function.

    Returns the strongest single claim.
    """

    claims = extract_claims(
        article_text,
        max_claims=1
    )

    return claims[0]