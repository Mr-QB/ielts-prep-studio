"""Extract usable PDF text layers or render scanned pages for private review."""
import argparse
import json
import re
from pathlib import Path

import fitz


def parse_ranges(spec, page_count):
    selected = set()
    for chunk in spec.split(","):
        bounds = [part.strip() for part in chunk.split("-", 1)]
        start = int(bounds[0])
        end = int(bounds[1]) if len(bounds) == 2 else start
        if start < 1 or end < start or end > page_count:
            raise ValueError(f"Invalid page range {chunk!r} for {page_count}-page PDF")
        selected.update(range(start, end + 1))
    return sorted(selected)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", nargs="?", type=Path, default=Path("private_sources/cambridge12_gt/book.pdf"))
    parser.add_argument("--pages", default="11-139", help="PDF pages, e.g. 17-20,124-131")
    parser.add_argument("--output", type=Path, default=Path(".tmp/cambridge12"))
    parser.add_argument("--scale", type=float, default=1.7)
    args = parser.parse_args()
    if not args.pdf.is_file():
        print("CAMBRIDGE_SOURCE_MISSING")
        raise SystemExit(2)

    with fitz.open(args.pdf) as document:
        pages = parse_ranges(args.pages, document.page_count)
        image_dir = args.output / "pages"
        text_dir = args.output / "text_layer"
        image_dir.mkdir(parents=True, exist_ok=True)
        text_dir.mkdir(parents=True, exist_ok=True)
        page_info = []
        for number in pages:
            page = document[number - 1]
            text = page.get_text("text").strip()
            entry = {"sourcePdfPage": number, "textLayerCharacters": len(text), "status": "embedded_text" if len(text) > 80 else "scan_rendered"}
            if len(text) > 80:
                (text_dir / f"page-{number:04}.txt").write_text(text + "\n", encoding="utf-8")
            else:
                page.get_pixmap(matrix=fitz.Matrix(args.scale, args.scale), alpha=False).save(image_dir / f"page-{number:04}.png")
                entry["image"] = str(image_dir / f"page-{number:04}.png")
                entry["needsManualReview"] = True
            page_info.append(entry)
        (args.output / "page_inventory.json").write_text(json.dumps(page_info, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        scan_count = sum(page["status"] == "scan_rendered" for page in page_info)
        print(f"Pages selected: {len(pages)}; rendered scans: {scan_count}; output: {args.output}")


if __name__ == "__main__":
    main()
