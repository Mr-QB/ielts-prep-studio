# Cambridge IELTS 12 GT private content workflow

To add licensed original audio later, place the 16 part recordings under `data/private/cambridge12_gt/test_05/audio/` through `test_08/audio/`. Set each matching `parts[].audio` entry in that test's `listening.json` to `{"status":"available","fileName":"<file>.mp3"}`. Set `manifest.json` `audioStatus` to `available` only when every Test 5–8 part has a real recording. `npm run validate:cambridge12` checks that declared files exist; the authenticated app serves them through its private audio endpoint. Never use TTS or another book's recordings as a substitute.

The Cambridge IELTS 12 General Training pack is private, user-provided study material. Keep the source PDF, extracted text, answer keys, and scans out of public Git. `.gitignore` excludes `private_sources/` and `data/private/`; `.dockerignore` excludes them from the image. Docker Compose mounts `./data/private` read-only at runtime.

The verified source is `private_sources/cambridge12_gt/book.pdf` (ISBN 9781316637838). Its SHA-256 is recorded in the private manifest. Do not use the Internet Archive OCR derivative as source of truth or substitute another mirror.

The local pack contains all Reading and Listening questions and answer keys for Tests 5–8, all 16 Listening transcript parts, and all 8 Writing prompts with their scanned sample answers. The source audit covers the relevant printed pages, with no unresolved extraction issues or unsupported layouts. The authentic Listening audio files were not supplied; the app clearly marks audio as unavailable and does not claim playable listening audio.

For a new local import, install PyMuPDF (`pip install -r scripts/cambridge12/requirements.txt`), inspect and render the supplied PDF, then compare normalized content against the page images:

```sh
python scripts/cambridge12/inspect_pdf.py private_sources/cambridge12_gt/book.pdf
npm run cambridge:render -- private_sources/cambridge12_gt/book.pdf --pages 11-139
npm run cambridge:ocr -- .tmp/cambridge12/pages
npm run validate:cambridge12
```

Rendered pages and OCR drafts stay under ignored `.tmp/cambridge12/`. OCR output is never copied to the private content pack automatically. The validator checks the source PDF digest, manifest and page review, question/answer coverage, transcript mapping, Writing sample scans, and referenced private assets.
