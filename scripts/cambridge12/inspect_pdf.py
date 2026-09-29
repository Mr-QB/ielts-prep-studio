"""Inspect the user-supplied Cambridge PDF without using external OCR derivatives."""
import argparse
import hashlib
from pathlib import Path

import fitz


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", nargs="?", type=Path, default=Path("private_sources/cambridge12_gt/book.pdf"))
    args = parser.parse_args()
    if not args.pdf.is_file():
        print("CAMBRIDGE_SOURCE_MISSING")
        raise SystemExit(2)
    digest = hashlib.sha256(args.pdf.read_bytes()).hexdigest()
    with fitz.open(args.pdf) as document:
        text_pages = [i + 1 for i, page in enumerate(document) if len(page.get_text("text").strip()) > 80]
        print(f"Source: {args.pdf}")
        print(f"Pages: {document.page_count}")
        print(f"Pages with usable embedded text (>80 chars): {len(text_pages)}")
        print(f"SHA-256: {digest}")
        print(f"Metadata title: {(document.metadata or {}).get('title') or '(none)'}")
        print(f"Text-layer page indexes: {text_pages[:30]}{' …' if len(text_pages) > 30 else ''}")


if __name__ == "__main__":
    main()
