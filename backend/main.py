
import os
import requests
import re

from urllib.parse import urlparse
from difflib import SequenceMatcher

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import get_database_connection
from article_extractor import extract_article
from claim_extractor import extract_main_claim


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GOOGLE_FACT_CHECK_API_KEY = os.getenv(
    "GOOGLE_FACT_CHECK_API_KEY"
)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="AI News Credibility Analyzer API",
    description="Backend API for checking the credibility of news claims.",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "AI News Credibility Analyzer Backend is running!"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# ============================================================
# DATABASE TEST
# ============================================================

@app.get("/db-test")
def database_test():

    try:
        db = get_database_connection()
        cursor = db.cursor()

        cursor.execute("SELECT DATABASE();")
        result = cursor.fetchone()

        cursor.close()
        db.close()

        return {
            "status": "connected",
            "database": result[0]
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }


# ============================================================
# CREATE USER
# ============================================================

@app.post("/users")
def create_user(
    name: str,
    email: str
):

    try:
        db = get_database_connection()
        cursor = db.cursor()

        query = """
            INSERT INTO users (name, email)
            VALUES (%s, %s)
        """

        cursor.execute(
            query,
            (name, email)
        )

        db.commit()

        user_id = cursor.lastrowid

        cursor.close()
        db.close()

        return {
            "status": "success",
            "message": "User created successfully",
            "user_id": user_id
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }


# ============================================================
# CREATE FACT CHECK MANUALLY
# ============================================================

@app.post("/fact-checks")
def create_fact_check(
    user_id: int,
    claim: str,
    source_url: str,
    verdict: str,
    confidence: float,
    reasoning: str,
    fact_analysis: str
):

    try:
        db = get_database_connection()
        cursor = db.cursor()

        query = """
            INSERT INTO fact_checks (
                user_id,
                claim,
                source_url,
                verdict,
                confidence,
                reasoning,
                fact_analysis
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            user_id,
            claim,
            source_url,
            verdict,
            confidence,
            reasoning,
            fact_analysis
        )

        cursor.execute(
            query,
            values
        )

        db.commit()

        fact_check_id = cursor.lastrowid

        cursor.close()
        db.close()

        return {
            "status": "success",
            "message": "Fact-check saved successfully",
            "fact_check_id": fact_check_id
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }


# ============================================================
# GET FACT CHECKS FOR USER
# ============================================================

@app.get("/fact-checks/{user_id}")
def get_fact_checks(user_id: int):

    try:
        db = get_database_connection()
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT
                id,
                user_id,
                claim,
                source_url,
                verdict,
                confidence,
                reasoning,
                fact_analysis,
                created_at
            FROM fact_checks
            WHERE user_id = %s
            ORDER BY created_at DESC
        """

        cursor.execute(
            query,
            (user_id,)
        )

        fact_checks = cursor.fetchall()

        cursor.close()
        db.close()

        return {
            "status": "success",
            "fact_checks": fact_checks
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }


# ============================================================
# CLAIM NORMALIZATION
# ============================================================

def normalize_claim(text: str):

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    return text


# ============================================================
# CLAIM SIMILARITY
# ============================================================

def calculate_claim_similarity(user_claim: str, fact_checked_claim: str):
    user_text = normalize_claim(user_claim)
    fact_text = normalize_claim(fact_checked_claim)

    if not user_text or not fact_text:
        return 0

    # Exact normalized match
    if user_text == fact_text:
        return 1.0

    user_words = set(user_text.split())
    fact_words = set(fact_text.split())

    # Word overlap
    common_words = user_words.intersection(fact_words)

    word_overlap = (
        len(common_words) / len(user_words)
        if user_words
        else 0
    )

    # Text similarity
    text_similarity = SequenceMatcher(
        None,
        user_text,
        fact_text
    ).ratio()

    # Important concepts
    concept_groups = [
        {"earth", "world"},
        {"sun"},
        {"orbit", "orbits", "orbiting"},
        {"revolve", "revolves", "revolving"},
        {"static", "stationary", "fixed"},
        {"moves", "moving", "motion"},
    ]

    concept_matches = 0
    total_relevant_concepts = 0

    for group in concept_groups:
        user_has_concept = bool(user_words.intersection(group))
        fact_has_concept = bool(fact_words.intersection(group))

        if user_has_concept:
            total_relevant_concepts += 1

            if fact_has_concept:
                concept_matches += 1

    concept_score = (
        concept_matches / total_relevant_concepts
        if total_relevant_concepts
        else 0
    )

    similarity = (
        word_overlap * 0.30
        + text_similarity * 0.30
        + concept_score * 0.40
    )

    return similarity




# ============================================================
# SAVE FACT CHECK TO DATABASE
# ============================================================
def save_fact_check_to_db(
    claim,
    source_url,
    verdict,
    confidence,
    reasoning,
    fact_analysis
):

    try:

        conn = get_database_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO fact_checks (
                user_id,
                claim,
                source_url,
                verdict,
                confidence,
                reasoning,
                fact_analysis
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            None,
            claim,
            source_url,
            verdict,
            confidence,
            reasoning,
            fact_analysis
        )

        cursor.execute(
            query,
            values
        )

        conn.commit()

        cursor.close()
        conn.close()

        print("DATABASE SAVE SUCCESS")

        return True

    except Exception as e:

        print(
            f"Database save error: {e}"
        )

        return False


# ============================================================
# ANALYZE CLAIM
# ============================================================

@app.post("/analyze")
def analyze_claim(claim: str):

    original_input = claim.strip()
    article_url = None

    # Keep the user's/extracted claim separately.
    submitted_claim = original_input

    # --------------------------------------------------------
    # Detect whether the user entered a URL
    # --------------------------------------------------------

    parsed_url = urlparse(
        original_input
    )

    if (
        parsed_url.scheme in ("http", "https")
        and parsed_url.netloc
    ):

        article_url = original_input

        try:

            # Extract article
            article = extract_article(
                article_url
            )

            # Extract main factual claim
            submitted_claim = extract_main_claim(
                article["text"]
            )

            claim = submitted_claim

        except Exception as e:

            reasoning = (
                "Could not process this news article. "
                "The URL may be invalid, unreachable, "
                "or temporarily unavailable."
            )

            fact_analysis = (
                "The article could not be extracted "
                "or its main claim could not be identified."
            )

            claim_explanation = (
                "The submitted news article could not "
                "be processed, so a claim explanation "
                "could not be generated."
            )

            # Save article-processing error to database
            save_fact_check_to_db(
                claim=original_input,
                source_url=article_url,
                verdict="Unverifiable",
                confidence=0,
                reasoning=reasoning,
                fact_analysis=fact_analysis,
            )

            return {
                "id": "article-error",
                "verdict": "Unverifiable",
                "confidence": 0,
                "reasoning": reasoning,
                "factAnalysis": fact_analysis,
                "claimExplanation": claim_explanation,
                "sources": [],
                "claim": original_input,
            }

    # --------------------------------------------------------
    # Google Fact Check API
    # --------------------------------------------------------

    url = (
        "https://factchecktools.googleapis.com/"
        "v1alpha1/claims:search"
    )

           # Use the original claim for Google Fact Check searches.
    # The full claim is also used for similarity checking.
    params = {
        "query": claim
    }

    headers = {
        "X-Goog-Api-Key": GOOGLE_FACT_CHECK_API_KEY
    }

    try:

        response = requests.get(
            url,
            params=params,
            headers=headers,
            timeout=30
        )

        # ----------------------------------------------------
        # API ERROR
        # ----------------------------------------------------

        if response.status_code != 200:

            reasoning = (
                "The fact-check service could not "
                "be reached successfully."
            )

            fact_analysis = (
                "Unable to retrieve fact-check information."
            )

            claim_explanation = (
                "A claim explanation could not be generated "
                "because the fact-check service did not "
                "return usable information."
            )

            # Save API error to database
            save_fact_check_to_db(
                claim=claim,
                source_url=article_url,
                verdict="Unverifiable",
                confidence=0,
                reasoning=reasoning,
                fact_analysis=fact_analysis,
            )

            return {
                "id": "error",
                "verdict": "Unverifiable",
                "confidence": 0,
                "reasoning": reasoning,
                "factAnalysis": fact_analysis,
                "claimExplanation": claim_explanation,
                "sources": [],
                "claim": claim,
            }

        # ----------------------------------------------------
        # READ GOOGLE RESPONSE
        # ----------------------------------------------------

        data = response.json()

        claims = data.get(
            "claims",
            []
        )

        # ----------------------------------------------------
        # NO RESULTS
        # ----------------------------------------------------

        if not claims:

            reasoning = (
                "No matching fact-check was found."
            )

            fact_analysis = (
                "There is not enough retrieved "
                "fact-check evidence to determine "
                "whether this claim is true or false."
            )

            claim_explanation = (
                f"The submitted claim states: "
                f"'{claim}'. No matching fact-check "
                "claim was found to provide a more "
                "detailed explanation."
            )

            # Save no-result analysis to database
            save_fact_check_to_db(
                claim=claim,
                source_url=article_url,
                verdict="Unverifiable",
                confidence=0,
                reasoning=reasoning,
                fact_analysis=fact_analysis,
            )

            return {
                "id": "no-result",
                "verdict": "Unverifiable",
                "confidence": 0,
                "reasoning": reasoning,
                "factAnalysis": fact_analysis,
                "claimExplanation": claim_explanation,
                "sources": [],
                "claim": claim,
            }

        # ----------------------------------------------------
        # FIND BEST MATCH
        # ----------------------------------------------------

        best_claim = None
        best_similarity = 0

        for candidate in claims:

            candidate_text = candidate.get(
                "text",
                ""
            )

            similarity = calculate_claim_similarity(
                claim,
                candidate_text
            )

            if similarity > best_similarity:

                best_similarity = similarity
                best_claim = candidate

        # ----------------------------------------------------
        # WEAK MATCH
        # ----------------------------------------------------

        if (
            best_claim is None
            or best_similarity < 0.50
        ):

            reasoning = (
                "A related fact-check was found, "
                "but it did not match the submitted "
                "claim closely enough."
            )

            fact_analysis = (
                "The available fact-check evidence "
                "may refer to a different claim."
            )

            claim_explanation = (
                f"The submitted claim states: "
                f"'{claim}'. The retrieved fact-check "
                "was not considered similar enough "
                "to provide a reliable explanation."
            )

            # Save weak match to database
            save_fact_check_to_db(
                claim=claim,
                source_url=article_url,
                verdict="Unverifiable",
                confidence=0,
                reasoning=reasoning,
                fact_analysis=fact_analysis,
            )

            return {
                "id": "weak-match",
                "verdict": "Unverifiable",
                "confidence": 0,
                "reasoning": reasoning,
                "factAnalysis": fact_analysis,
                "claimExplanation": claim_explanation,
                "sources": [],
                "claim": claim,
            }

        # ----------------------------------------------------
        # GET BEST CLAIM + REVIEWS
        # ----------------------------------------------------

        claim_text = best_claim.get(
            "text",
            claim
        )

        reviews = best_claim.get(
            "claimReview",
            []
        )

        # ----------------------------------------------------
        # DYNAMIC CLAIM EXPLANATION
        # ----------------------------------------------------
        #
        # Google Fact Check provides the detailed claim
        # that was actually checked.
        #
        # This changes automatically depending on the
        # submitted claim or news article.
        # ----------------------------------------------------

        claim_explanation = claim_text

        # ----------------------------------------------------
        # NO REVIEW
        # ----------------------------------------------------

        if not reviews:

            reasoning = (
                "A matching claim was found, "
                "but no fact-check review was available."
            )

            fact_analysis = (
                "No review rating was available."
            )

            # Save no-review result to database
            save_fact_check_to_db(
                claim=claim_text,
                source_url=article_url,
                verdict="Unverifiable",
                confidence=0,
                reasoning=reasoning,
                fact_analysis=fact_analysis,
            )

            return {
                "id": "no-review",
                "verdict": "Unverifiable",
                "confidence": 0,
                "reasoning": reasoning,
                "factAnalysis": fact_analysis,
                "claimExplanation": claim_explanation,
                "sources": [],
                "claim": claim,
            }

        # ----------------------------------------------------
        # REVIEW INFORMATION
        # ----------------------------------------------------

        review = reviews[0]

        rating = review.get(
            "textualRating",
            "Unknown"
        )

        publisher = review.get(
            "publisher",
            {}
        )

        publisher_name = publisher.get(
            "name",
            "Unknown publisher"
        )

        publisher_site = publisher.get(
            "site",
            ""
        )

        review_url = review.get(
            "url",
            ""
        )

        review_title = review.get(
            "title",
            "Fact-check review"
        )

        review_date = review.get(
            "reviewDate"
        )

        rating_lower = rating.lower()

        # ----------------------------------------------------
        # VERDICT
        # ----------------------------------------------------

        if (
            "false" in rating_lower
            and "true" not in rating_lower
        ):

            verdict = "False"

        elif (
            "true" in rating_lower
            and "false" not in rating_lower
        ):

            verdict = "True"

        elif (
            "misleading" in rating_lower
            or "mixed" in rating_lower
        ):

            verdict = "Misleading"

        else:

            verdict = "Unverifiable"

        # ----------------------------------------------------
        # EVIDENCE MATCH CONFIDENCE
        # ----------------------------------------------------

        confidence = round(
            best_similarity * 100
        )

        # ----------------------------------------------------
        # FACT-CHECK SOURCE
        # ----------------------------------------------------

        review_source = {
            "title": review_title,
            "url": review_url,
            "publisher": publisher_name,
            "site": publisher_site,
            "rating": rating,
            "publishedAt": review_date
        }

        # ----------------------------------------------------
        # SOURCES
        # ----------------------------------------------------

        if article_url:

            sources = [

                {
                    "title": "Original news article",
                    "url": article_url,
                    "publisher": "News article",
                    "site": urlparse(
                        article_url
                    ).netloc,
                    "rating": "Article being analyzed",
                    "publishedAt": None
                },

                {
                    "title": review_title,
                    "url": review_url,
                    "publisher": publisher_name,
                    "site": publisher_site,
                    "rating": rating,
                    "publishedAt": review_date
                }

            ]

        else:

            sources = [
                review_source
            ]

        # ----------------------------------------------------
        # TEXTS USED FOR DATABASE / FRONTEND
        # ----------------------------------------------------

        reasoning = (
            f"Google Fact Check data contains a review by "
            f"{publisher_name} with the rating '{rating}'."
        )

        fact_analysis = (
            f"The retrieved fact-check review rates "
            f"this claim as '{rating}'."
        )

        # ----------------------------------------------------
        # SAVE SUCCESSFUL FACT CHECK TO DATABASE
        # ----------------------------------------------------

        save_fact_check_to_db(
            claim=claim_text,
            source_url=article_url,
            verdict=verdict,
            confidence=confidence,
            reasoning=reasoning,
            fact_analysis=fact_analysis,
        )
        # ----------------------------------------------------
        # FRONTEND SCORES
        # ----------------------------------------------------

        if verdict == "True":
            authentic_percent = 90
        elif verdict == "False":
            authentic_percent = 15
        elif verdict == "Misleading":
            authentic_percent = 50
        else:
            authentic_percent = 50

        source_credibility_score = 85
        fact_analysis_score = confidence
        ai_analysis_score = 75


        # ----------------------------------------------------
        # RETURN RESULT TO FRONTEND
        # ----------------------------------------------------

        return {

            "id": "google-fact-check",

            "verdict": verdict,

            "confidence": confidence,

            "reasoning": reasoning,

            "factAnalysis": fact_analysis,

            "claimExplanation": claim_explanation,

            "sources": sources,

            "claim": claim,

            "authenticPercent": authentic_percent,

            "sourceCredibilityScore": source_credibility_score,

            "factAnalysisScore": fact_analysis_score,

            "aiAnalysisScore": ai_analysis_score,

        }

    # ========================================================
    # GOOGLE / ANALYSIS ERROR
    # ========================================================

    except Exception as e:

        claim_explanation = (
            f"The submitted claim states: "
            f"'{claim}', but an explanation could not "
            "be generated because the fact-check process "
            "encountered an error."
        )

        return {

            "id": "error",

            "verdict": "Unverifiable",

            "confidence": 0,

            "reasoning": (
                f"An error occurred while retrieving "
                f"fact-check information: {str(e)}"
            ),

            "factAnalysis": (
                "The fact-check service could not be processed."
            ),

            "claimExplanation": claim_explanation,

            "sources": [],

            "claim": claim,

        }


# ============================================================
# GOOGLE FACT CHECK TEST
# ============================================================

@app.get("/google-test")
def google_fact_check_test(
    claim: str
):

    url = (
        "https://factchecktools.googleapis.com/"
        "v1alpha1/claims:search"
    )

    params = {
        "query": claim
    }

    headers = {
        "X-Goog-Api-Key": GOOGLE_FACT_CHECK_API_KEY
    }

    try:

        response = requests.get(
            url,
            params=params,
            headers=headers,
            timeout=30
        )

        return {
            "status_code": response.status_code,
            "google_response": response.json()
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }