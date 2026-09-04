from __future__ import annotations

import ipaddress
import socket
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup


MAX_RESPONSE_SIZE = 5 * 1024 * 1024  # 5 MB
REQUEST_TIMEOUT = 15.0

MIN_ARTICLE_WORDS = 20


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

    # Prevent requests to localhost/private network addresses.
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


def _extract_from_html(html: str) -> str:
    """Extract the main article text from an HTML document."""

    soup = BeautifulSoup(html, "html.parser")

    # Remove elements that commonly contain navigation,
    # advertisements, scripts, styling, comments, etc.
    for element in soup([
        "script",
        "style",
        "noscript",
        "svg",
        "nav",
        "footer",
        "header",
        "aside",
        "form"
    ]):
        element.decompose()

    # First preference: semantic <article> element.
    article = soup.find("article")

    if article:
        paragraphs = article.find_all("p")
    else:
        paragraphs = soup.find_all("p")

    extracted_paragraphs = []

    for paragraph in paragraphs:
        text = paragraph.get_text(" ", strip=True)

        if len(text.split()) >= 5:
            extracted_paragraphs.append(text)

    text = _clean_text("\n".join(extracted_paragraphs))

    return text


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
        raise ArticleExtractionError("URL cannot be empty.")

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

    # Decode using the server's declared encoding when possible.
    encoding = response.encoding or "utf-8"

    try:
        html_text = html.decode(encoding, errors="replace")
    except LookupError:
        html_text = html.decode("utf-8", errors="replace")

    article_text = _extract_from_html(html_text)

    word_count = len(article_text.split())

    if word_count < MIN_ARTICLE_WORDS:
        raise ArticleExtractionError(
            "Could not extract enough article text from this URL."
        )

    return article_text