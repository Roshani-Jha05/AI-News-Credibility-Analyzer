import re


def extract_main_claim(article_text: str) -> str:
    """
    Extract the main factual claim from article text.
    """

    if not article_text or not article_text.strip():
        raise ValueError("Article text is empty.")

    # ---------------------------------------------------------
    # First: look for an explicitly labelled "Claim:" section
    # ---------------------------------------------------------

    claim_match = re.search(
        r"claim:\s*(.*?)(?=\s*fact:|$)",
        article_text,
        flags=re.IGNORECASE | re.DOTALL
    )

    if claim_match:
        claim = claim_match.group(1).strip()

        # Clean unnecessary whitespace
        claim = re.sub(r"\s+", " ", claim).strip()

        # Remove surrounding quotation marks if present
        claim = claim.strip('"“”')

        if len(claim) >= 20:
            return claim

    # ---------------------------------------------------------
    # Fallback: sentence-based extraction
    # ---------------------------------------------------------

    sentences = re.split(
        r'(?<=[.!?])\s+',
        article_text.strip()
    )

    sentences = [
        sentence.strip()
        for sentence in sentences
        if len(sentence.strip()) >= 40
    ]

    if not sentences:
        raise ValueError(
            "Could not find suitable sentences in the article."
        )

    claim_keywords = [
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
        "nasa",
        "earth",
        "sun",
    ]

    scored_sentences = []

    for sentence in sentences:
        lower_sentence = sentence.lower()

        score = 0

        for keyword in claim_keywords:
            if keyword in lower_sentence:
                score += 1

        if len(sentence) >= 80:
            score += 1

        scored_sentences.append((score, sentence))

    scored_sentences.sort(
        reverse=True,
        key=lambda item: item[0]
    )

    return scored_sentences[0][1]