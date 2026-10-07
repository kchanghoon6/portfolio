# SENTRY documents pipeline

Builds the English editions of the Korea Code Fair 2026 submissions and every asset the
SENTRY page (`pages/sentry.html`) serves from `docs/sentry/`.

The English editions are made **in place**: text in the original PDFs is replaced by its
translation, while images, charts, tables and page layout are left exactly as submitted.
The poster is translated from its `.pptx` and exported with PowerPoint, so its layout is
identical to the printed one.

## Run

```bash
cd tools/sentry-docs
python3 extract.py .    # Korean PDFs -> units.json (text units with position and style)
python3 tmbuild.py      # tm_ids/*.json -> tm/all.json (translation memory)
python3 build.py        # translate, stamp, mask names, compress, render pages/panels
```

Needs PyMuPDF, Pillow, python-pptx, Ghostscript (`gs`), NanumGothic in `~/Library/Fonts`,
Microsoft PowerPoint (poster export), and the submissions in
`~/Desktop/CSIA_2nd/KCF/최종제출자료`.

## Editing a translation

- Reports and summaries: change the sentence in `tm_ids/<doc>_*.json` (keyed by unit id,
  e.g. `r3-p05-003`), then rerun `tmbuild.py` and `build.py`.
  `tm/id_overrides.json` holds HTML overrides (sub/superscripts, forced line breaks) and
  `#1`/`#2` parts of lines that cross a table rule.
- Poster: `poster/poster_tm.json` (Korean paragraph → English),
  `poster/chart_tm.json` (chart labels), `poster/scale_overrides.json` (font scale for
  boxes that need a fixed size).

## Rules

- Third-party names (teammate, advisor) never appear: `render.REDACT_NAMES` masks them in
  the Korean forms and replaces them with "[name withheld]" in English; `build.py` refuses
  to publish a file that still contains one.
- Every English page carries a one-line notice that it is a translation of the original.
- The source-code appendix of the reports is left untranslated; the reader shows the
  16-page body and the PDFs contain everything.
- The round-2 slides are Korean only — their headings are part of the artwork.
