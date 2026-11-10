# Kim Changhoon · Portfolio

Static HTML/CSS/JavaScript portfolio. No npm, framework or runtime dependencies.

- Live: https://kchanghoon6.github.io/portfolio/
- Design rules, content sources and handoff: [context.md](context.md)
- Current focus: **PEBBLE**, an in-progress variable-width search-robot research project.
- **SENTRY** is completed; its original KCF submissions and English editions remain available.

## Edit and preview

Edit home sections in `partials/`, shared primitives in `css/foundation.css` and metadata
in `index.template.html`. Do not edit the generated `index.html` or `css/styles.css` directly.

```sh
python3 assemble.py
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766/. Detail pages in `pages/` are standalone HTML.

## Structure

- `pages/pebble.html`, `css/pebble.css`, `js/pebble.js`: current research case study and CAD-still comparison.
- `pages/sentry.html`, `js/sentry.js`: completed-project page and bilingual document reader.
- `pages/delivery-robot.html`, `models/delivery-robot/`: in-progress delivery robot and public 3D layout.
- `css/project.css`: shared bento project-page primitives.
- `docs/sentry/`: active translated/original PDFs, page images and panels.
- `tools/sentry-docs/`: document translation/render pipeline; see its README.
- `src/img/`, `src/video/`, `assets/`: images, credited footage and icons.
- `_src_nextjs/`: historical reference only, not the deployed application.

Check light/dark themes, 375 px layouts, links and keyboard controls before shipping.
Label CAD, software checks, plans and physical results separately. Never publish order data
or other people's names. The delivery model is a transaction-redacted October layout,
not the November fabrication model.

## Deploy

GitHub Pages serves the repository root from `main`. Commit source changes together with
regenerated outputs. **Commit and push only when the owner explicitly requests it.**
The November 10 PEBBLE-first update follows this same build and deployment workflow.
