import requests
import trafilatura
from urllib.parse import urlparse


def extract_article(url: str):
    """
    Fetch a webpage and extract its main article text.
    """

    # Basic URL validation
    parsed = urlparse(url)

    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError("Invalid URL")

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/154.0.0.0 Safari/537.36"
        ),
        "Accept": (
            "text/html,application/xhtml+xml,application/xml;"
            "q=0.9,image/avif,image/webp,*/*;q=0.8"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/",
    }

    response = requests.get(
        url,
        headers=headers,
        timeout=15
    )

    response.raise_for_status()

    # Extract the main article content
    article_text = trafilatura.extract(
        response.text,
        include_comments=False,
        include_tables=False
    )

    if not article_text:
        raise ValueError(
            "Could not extract readable article content from this URL."
        )

    return {
        "url": url,
        "title": "",
        "text": article_text
    }