# ============================================================
# AI NEWS CREDIBILITY ANALYZER - FASTAPI
# ============================================================

from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from .source_credibility.credibility import analyze_url, analyze_text

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, model_validator

from .fact_checking.fact_checker import fact_check_article

from .ai_detection.analyzer import analyze_article
from .ai_detection.article_extractor import (
    ArticleExtractionError,
    extract_article_from_url,
)

from .chatbot import ask_gemini


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
# REQUEST MODELS
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


class SourceCredibilityRequest(BaseModel):
    url: Optional[str] = None
    text: Optional[str] = None

    @model_validator(mode="after")
    def validate_input(self):
        has_text = bool(self.text and self.text.strip())
        has_url = bool(self.url and self.url.strip())

        if not has_text and not has_url:
            raise ValueError("Provide either article text or a URL.")

        if has_text and has_url:
            raise ValueError("Provide either article text or a URL, not both.")

        return self


class FactCheckRequest(BaseModel):
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


class ChatRequest(BaseModel):
    question: str
    fact_check_context: str = ""


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

    if request.text and request.text.strip():
        source_type = "text"
        article_text = request.text.strip()

    elif request.url and request.url.strip():
        source_type = "url"
        source_url = request.url.strip()

        try:
            article_text = extract_article_from_url(source_url)

        except ArticleExtractionError as error:
            raise HTTPException(
                status_code=400,
                detail=str(error),
            )

    try:
        result = analyze_article(article_text)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(error)}"
        )

    result["source"] = {
        "type": source_type,
        "url": source_url,
        "extracted_word_count": len(article_text.split()),
    }

    return result


# ============================================================
# SOURCE CREDIBILITY
# ============================================================

@app.post("/api/source-credibility")
def source_credibility(req: SourceCredibilityRequest):

    if req.url:
        try:
            return analyze_url(req.url.strip())

        except Exception as error:
            raise HTTPException(
                status_code=500,
                detail=f"Source credibility analysis failed: {str(error)}"
            )

    if req.text:
        try:
            return analyze_text(req.text.strip())

        except Exception as error:
            raise HTTPException(
                status_code=500,
                detail=f"Source credibility analysis failed: {str(error)}"
            )

    raise HTTPException(
        status_code=400,
        detail="Provide either article text or a URL."
    )


# ============================================================
# FACT CHECKING
# ============================================================

@app.post("/api/fact-check")
def fact_check(request: FactCheckRequest):

    article_text = None
    source_url = None

    # --------------------------------------------------------
    # TEXT INPUT
    # --------------------------------------------------------

    if request.text and request.text.strip():
        article_text = request.text.strip()

    # --------------------------------------------------------
    # URL INPUT
    # --------------------------------------------------------

    elif request.url and request.url.strip():
        source_url = request.url.strip()

        try:
            article_text = extract_article_from_url(source_url)

        except ArticleExtractionError as error:
            raise HTTPException(
                status_code=400,
                detail=str(error),
            )

    # --------------------------------------------------------
    # MULTI-CLAIM FACT CHECKING
    # --------------------------------------------------------

    try:
        result = fact_check_article(
            article_text=article_text,
            article_url=source_url,
            max_claims=3,
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Fact checking failed: {str(error)}",
        )

    return result


# ============================================================
# CHATBOT
# ============================================================

@app.post("/api/chat")
def chat(request: ChatRequest):

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    try:
        result = ask_gemini(
            question=question,
            fact_check_context=request.fact_check_context,
        )

        if not result.get("success"):
            raise HTTPException(
                status_code=500,
                detail=result.get(
                    "answer",
                    "Gemini could not process the request."
                ),
            )

        return result

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Chatbot failed: {str(error)}"
        )