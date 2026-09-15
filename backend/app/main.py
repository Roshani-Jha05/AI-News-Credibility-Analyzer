# ============================================================
# AI NEWS CREDIBILITY ANALYZER - FASTAPI
# ============================================================

from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, model_validator

from .ai_detection.analyzer import analyze_article
from .ai_detection.article_extractor import (
    ArticleExtractionError,
    extract_article_from_url,
)


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="AI News Credibility Analyzer API",
    description=(
        "Backend API for AI-generated content detection "
        "and news credibility analysis."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# REQUEST MODEL
# ============================================================

class AnalyzeRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None

    @model_validator(mode="after")
    def validate_input(self):
        has_text = bool(self.text and self.text.strip())
        has_url = bool(self.url and self.url.strip())

        if not has_text and not has_url:
            raise ValueError(
                "Provide either article text or a URL."
            )

        if has_text and has_url:
            raise ValueError(
                "Provide either article text or a URL, not both."
            )

        return self


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "AI News Credibility Analyzer API",
        "status": "running",
    }


# ============================================================
# AI ANALYSIS
# ============================================================

@app.post("/api/analyze")
def analyze(request: AnalyzeRequest):

    source_type = None
    source_url = None
    article_text = None

    # --------------------------------------------------------
    # TEXT INPUT
    # --------------------------------------------------------

    if request.text and request.text.strip():
        source_type = "text"
        article_text = request.text.strip()

    # --------------------------------------------------------
    # URL INPUT
    # --------------------------------------------------------

    elif request.url and request.url.strip():
        source_type = "url"
        source_url = request.url.strip()

        try:
            article_text = extract_article_from_url(
                source_url
            )

        except ArticleExtractionError as error:
            raise HTTPException(
                status_code=400,
                detail=str(error),
            )

    # --------------------------------------------------------
    # ANALYZE ARTICLE
    # --------------------------------------------------------

    try:
        result = analyze_article(article_text)

        # Add information about where the article came from.
        result["source"] = {
            "type": source_type,
            "url": source_url,
        }

        # For URL requests, return the extracted word count.
        if source_type == "url":
            result["source"]["extracted_word_count"] = (
                len(article_text.split())
            )

        return result

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(error)}",
        )