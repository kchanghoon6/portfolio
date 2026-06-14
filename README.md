# Kim Changhoon — Portfolio (static site)

A fast, dependency-free **static** portfolio (plain HTML / CSS / JS), rebuilt from the
original Next.js project for hosting on **GitHub Pages**. White theme by default, with an
opt-in dark mode.

## Structure

```
index.html              # the whole page
css/styles.css          # built stylesheet (foundation + all sections)
js/main.js              # theme toggle, nav, scroll-spy, reveal, project filter
src/img/profile.jpg     # profile photo
src/img/covers/*.svg    # project cover art
assets/                 # favicons / icons
.nojekyll               # tell GitHub Pages to serve files as-is

# build sources (not required at runtime)
index.template.html     # page template with <!-- @@SECTION@@ --> markers
css/foundation.css      # design tokens + shared component primitives
partials/<SECTION>.html # per-section markup
partials/<SECTION>.css  # per-section styles
assemble.py             # stitches partials -> index.html + css/styles.css
_src_nextjs/            # the original Next.js source (kept for reference)
```

## Editing content

Edit the section markup in `partials/*.html` (and styling in `partials/*.css` or
`css/foundation.css`), then rebuild:

```bash
python3 assemble.py
```

This regenerates `index.html` and `css/styles.css`. To change cover art, replace the
SVGs in `src/img/covers/` (or drop in an image/`<video>` — each card's `.cover` slot
accepts `<img>` or `<video>`).

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repo and push these files to it.
   - For a user/organization site, name the repo `<username>.github.io`.
   - For a project site, any repo name works (the site will live at
     `https://<username>.github.io/<repo>/`). All asset paths here are **relative**, so
     project-site hosting works without changes.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`.
3. GitHub serves `index.html`. The `.nojekyll` file ensures everything (including the
   `_*` folder) is served verbatim.

> Tip: you can exclude `_src_nextjs/`, `partials/`, `assemble.py`, and the `*.template.*`
> / `foundation.css` build sources from the deployed branch if you prefer a lean Pages
> branch — they are only needed to rebuild the site.
