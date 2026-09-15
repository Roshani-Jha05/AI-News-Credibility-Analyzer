from __future__ import annotations

import ipaddress
import json
import socket
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup


MAX_RESPONSE_SIZE = 5 * 1024 * 1024  # 5 MB
REQUEST_TIMEOUT = 15.0
MIN_ARTICLE_WORDS = 50


class ArticleExtractionError(Exception):
    """Raised when article text cannot be extracted from a URL."""


def _validate_url(url: str) -> None:
    """Validate the URL before making an external request."""

    parsed = urlparse(url)

    if parsed.scheme not in {"http", "https"}:
        raise ArticleExtractionError(
            "URL must use http:// or https://."
        )

    if not parsed.netloc:
        raise ArticleExtractionError(
            "Invalid URL."
        )

    hostname = parsed.hostname

    if not hostname:
        raise ArticleExtractionError(
            "Invalid URL hostname."
        )

    try:
        addresses = socket.getaddrinfo(
            hostname,
            None,
            type=socket.SOCK_STREAM
        )
    except socket.gaierror:
        raise ArticleExtractionError(
            "The URL hostname could not be resolved."
        )

    for address in addresses:
        ip = ipaddress.ip_address(address[4][0])

        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_reserved
            or ip.is_multicast
        ):
            raise ArticleExtractionError(
                "URLs pointing to private or local network addresses are not allowed."
            )


def _clean_text(text: str) -> str:
    """Normalize extracted article text."""

    lines = []

    for line in text.splitlines():
        line = " ".join(line.split())

        if line:
            lines.append(line)

    return "\n".join(lines).strip()


def _is_long_enough(text: str) -> bool:
    """Check whether extracted text meets the minimum word requirement."""

    return len(text.split()) >= MIN_ARTICLE_WORDS


def _extract_from_json_ld(soup: BeautifulSoup) -> str:
    """
    Try extracting article text from JSON-LD structured data.

    Many news websites expose article content through a
    NewsArticle / Article JSON-LD object.
    """

    candidates = []

    scripts = soup.find_all(
        "script",
        type="application/ld+json"
    )

    for script in scripts:
        raw = script.string

        if not raw:
            continue

        try:
            data = json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            continue

        objects = []

        if isinstance(data, dict):
            if "@graph" in data and isinstance(data["@graph"], list):
                objects.extend(data["@graph"])
            else:
                objects.append(data)

        elif isinstance(data, list):
            objects.extend(data)

        for obj in objects:
            if not isinstance(obj, dict):
                continue

            article_type = obj.get("@type")

            if isinstance(article_type, list):
                article_types = article_type
            else:
                article_types = [article_type]

            is_article = any(
                article_type_name in {
                    "Article",
                    "NewsArticle",
                    "ReportageNewsArticle",
                    "BlogPosting",
                }
                for article_type_name in article_types
            )

            if not is_article:
                continue

            article_body = obj.get("articleBody")

            if isinstance(article_body, str):
                cleaned = _clean_text(article_body)

                if cleaned:
                    candidates.append(cleaned)

    if not candidates:
        return ""

    candidates.sort(
        key=lambda text: len(text.split()),
        reverse=True
    )

    return candidates[0]


def _extract_from_html(html: str) -> str:
    """Extract the main article text from an HTML document."""

    soup = BeautifulSoup(html, "html.parser")

    # --------------------------------------------------------
    # 1. Try JSON-LD BEFORE removing script elements.
    # --------------------------------------------------------

    json_ld_text = _extract_from_json_ld(soup)

    if _is_long_enough(json_ld_text):
        return json_ld_text

    # --------------------------------------------------------
    # 2. Remove elements that are not article content.
    # --------------------------------------------------------

    for element in soup([
        "script",
        "style",
        "noscript",
        "svg",
        "nav",
        "footer",
        "header",
        "aside",
        "form",
        "iframe",
    ]):
        element.decompose()

    # --------------------------------------------------------
    # 3. Try semantic <article>.
    # --------------------------------------------------------

    article = soup.find("article")

    if article:
        paragraphs = article.find_all("p")

        extracted_paragraphs = []

        for paragraph in paragraphs:
            text = paragraph.get_text(" ", strip=True)

            if len(text.split()) >= 5:
                extracted_paragraphs.append(text)

        text = _clean_text(
            "\n".join(extracted_paragraphs)
        )

        if _is_long_enough(text):
            return text

    # --------------------------------------------------------
    # 4. Try common article-content containers.
    # --------------------------------------------------------

    selectors = [
        "[class*='article-body']",
        "[class*='article_body']",
        "[class*='articleBody']",
        "[class*='article-content']",
        "[class*='article_content']",
        "[class*='articleContent']",
        "[class*='story-body']",
        "[class*='story_body']",
        "[class*='storyBody']",
        "[class*='story-content']",
        "[class*='story_content']",
        "[class*='storyContent']",
        "[id*='article-body']",
        "[id*='articleBody']",
        "[id*='story-body']",
        "[id*='storyBody']",
    ]

    for selector in selectors:

        container = soup.select_one(selector)

        if not container:
            continue

        paragraphs = container.find_all("p")

        extracted_paragraphs = []

        for paragraph in paragraphs:
            text = paragraph.get_text(" ", strip=True)

            if len(text.split()) >= 5:
                extracted_paragraphs.append(text)

        text = _clean_text(
            "\n".join(extracted_paragraphs)
        )

        if _is_long_enough(text):
            return text

    # --------------------------------------------------------
    # 5. Final fallback: all meaningful <p> elements.
    # --------------------------------------------------------

    paragraphs = soup.find_all("p")

    extracted_paragraphs = []

    for paragraph in paragraphs:
        text = paragraph.get_text(" ", strip=True)

        if len(text.split()) >= 5:
            extracted_paragraphs.append(text)

    return _clean_text(
        "\n".join(extracted_paragraphs)
    )


def extract_article_from_url(url: str) -> str:
    """
    Download a web page and extract its article text.

    Raises:
        ArticleExtractionError: if the URL is invalid,
        inaccessible, too large, or does not contain
        enough article text.
    """

    url = url.strip()

    if not url:
        raise ArticleExtractionError(
            "URL cannot be empty."
        )

    _validate_url(url)

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 "
            "(KHTML, like Gecko) "
            "Chrome/131.0 Safari/537.36"
        )
    }

    try:
        with httpx.Client(
            timeout=REQUEST_TIMEOUT,
            follow_redirects=True,
            headers=headers
        ) as client:

            with client.stream("GET", url) as response:

                response.raise_for_status()

                content_length = response.headers.get(
                    "content-length"
                )

                if content_length:
                    try:
                        if int(content_length) > MAX_RESPONSE_SIZE:
                            raise ArticleExtractionError(
                                "The webpage is too large to process."
                            )
                    except ValueError:
                        pass

                chunks = []
                total_size = 0

                for chunk in response.iter_bytes():

                    total_size += len(chunk)

                    if total_size > MAX_RESPONSE_SIZE:
                        raise ArticleExtractionError(
                            "The webpage is too large to process."
                        )

                    chunks.append(chunk)

                html = b"".join(chunks)

                encoding = response.encoding or "utf-8"

    except ArticleExtractionError:
        raise

    except httpx.TimeoutException:
        raise ArticleExtractionError(
            "The webpage took too long to respond."
        )

    except httpx.HTTPStatusError as error:
        raise ArticleExtractionError(
            f"The webpage could not be accessed "
            f"(HTTP {error.response.status_code})."
        )

    except httpx.RequestError:
        raise ArticleExtractionError(
            "Could not connect to the webpage."
        )

    except Exception:
        raise ArticleExtractionError(
            "An unexpected error occurred while fetching the webpage."
        )

    try:
        html_text = html.decode(
            encoding,
            errors="replace"
        )

    except LookupError:
        html_text = html.decode(
            "utf-8",
            errors="replace"
        )

    article_text = _extract_from_html(
        html_text
    )

    word_count = len(
        article_text.split()
    )

    if word_count < MIN_ARTICLE_WORDS:
        raise ArticleExtractionError(
            "Could not extract at least 50 words from this URL."
        )

    return article_text