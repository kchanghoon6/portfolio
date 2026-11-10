# Portfolio — context & handoff

Single source of truth for anyone (human or AI) picking up work on this site: what it is, how
it is built and deployed, what the design rules are and why, what every page contains, the
owner's decisions so far, and what is still open. Read §0 first; the rest is reference.

> **This file is public.** It is committed to a public repo and served by GitHub Pages
> (`/context.md`). Never write private information here — no third-party names (see §13),
> no personal emails other than the public contact address, no account details.

Last full update: 2026-11-10. Includes the PEBBLE-first revision after baseline commit
`3187718`.

---

## 0. Quick start

| | |
| --- | --- |
| Owner | **Kim Changhoon** — high-school student at CheongShim International Academy (CSIA), Korea. Applied ML, statistics / causal inference, full-stack web, robotics. |
| Live site | https://kchanghoon6.github.io/portfolio/ |
| Repo | https://github.com/kchanghoon6/portfolio (public), branch `main`, Pages serves `/` root |
| Local path | `~/Desktop/CSIA_2nd/Projects/Portfolio` |
| Stack | Plain HTML / CSS / JS. **No framework, no npm, no runtime dependencies.** Python 3 only for the build script and tooling. |

**Build** (home page only): edit `partials/*` or `css/foundation.css`, then

```bash
python3 assemble.py        # → index.html + css/styles.css (never hand-edit those two)
```

**Preview**: `python3 -m http.server 8766 --bind 127.0.0.1` from the repo root, open
http://localhost:8766/ (a `.claude/launch.json` entry named `portfolio` does the same).

**Deploy**: commit sources **and** regenerated outputs together, `git push origin main`.
GitHub Pages rebuilds in ~1 minute (`gh run list --repo kchanghoon6/portfolio --limit 1`).
Push must authenticate as the repo owner `kchanghoon6`. If this machine's `gh` CLI has a
different account active and the push gets a 403, switch temporarily, push, and switch back
to whichever account was active before:

```bash
gh auth switch --hostname github.com --user kchanghoon6
git push origin main
gh auth switch --hostname github.com --user <previously-active-account>
```

**Golden rules** (details in §9 and §13):

1. Content must be **true and verifiable** — never invent awards, numbers, roles or status.
2. **No hover lift / scale / zoom**, no ambient background effects. Hover changes colour only.
3. Light theme is the default; always check **light, dark and ~375px mobile**.
4. **Commit / push only when the owner asks.** The owner writes in Korean; reply in Korean.
5. SENTRY teammate and advisor names are **never** published (§11, §13).

---

## 1. Intent

Personal portfolio for **Kim Changhoon** — a high-school student at CheongShim International
Academy working across applied ML, statistics / causal inference, full-stack web and robotics.

The site has to read as **a builder's site, not a résumé template**. Two audiences:
admissions/competition reviewers skimming for credibility (largely US admissions — they can't
read Korean), and engineers who will judge the craft of the site itself. So the bar is:
*specific, real, and quietly technical* — never inflated, never decorative-for-its-own-sake.

**Voice:** plain and concrete, first person on detail pages. Real project names and outcomes
over adjectives. No "passionate about leveraging cutting-edge…" filler. Only genuine
credentials appear (placeholder awards/projects from the original template were deleted).
Unfinished work is labelled as such ("In progress", "planned").

---

## 2. Aesthetic direction

**"Bento, but un-AI."** The home page is a grey canvas (`--page`) holding white, softly
rounded tiles — an intro tile, a tall portrait tile, and a few fact tiles — with one dark tile
for emphasis. Indigo stays the accent but is used sparingly (small badges, the brand dot).
*Chosen 2026-10 from three drafts (Mono / Bento / Editorial). Two "less AI-looking" bento
variants (datasheet, colour-block) were also tried and rejected — the owner preferred plain
Bento. The earlier "live signal panel" hero — grid, aurora, waveform, ring, typewriter — was
retired as too busy.*

Committed choices:

- **Light is the default.** Dark is opt-in via the toggle and stored in `localStorage`
  (`theme`); the system colour scheme is intentionally **ignored** for the initial theme.
- **The grid is the visual idea.** No ambient background effects; structure, whitespace, and
  type carry the page.
- **No hover theatrics.** Hover never lifts, scales, zooms, or nudges anything — it only changes
  colour, border, or background. This was an explicit request: lift-on-hover reads as
  generic AI-built UI.
- **Exactly one dark tile per view** (`--invert-bg`): on home, the hero "Now building" tile and
  the closing Contact tile; on project pages, the hero intro tile (plus at most one dark card
  further down). Don't add more — it stops being emphasis.
- **Real content only.** Fact tiles show verifiable things (PEBBLE / USACO Gold / ywc.kr).

---

## 3. Tokens

All tokens live in `css/foundation.css` under `:root` (light) and `html[data-theme='dark']`.
**Never hard-code a colour in a section partial** — add or reuse a token.

### Colour

| Role | Light | Dark |
| --- | --- | --- |
| `--bg` / `--bg-alt` | `#ffffff` / `#f6f7f9` | `#0d0e12` / `#121319` |
| `--surface` / `--surface-2` | `#ffffff` / `#f4f5f7` | `#16171d` / `#1d1f27` |
| `--fg` / `--fg-soft` | `#15171c` / `#2c3036` | `#f5f6f8` / `#e3e5ea` |
| `--muted` / `--muted-2` | `#5b616e` / `#868d9a` | `#a2a9b6` / `#79808d` |
| `--border` / `--border-strong` | `#e6e8ec` / `#d6d9df` | `rgba(255,255,255,.10)` / `.16` |
| `--brand` / `--brand-strong` | `#4f46e5` / `#4338ca` | `#818cf8` / `#a5b4fc` |
| `--violet` | `#7c3aed` | `#a78bfa` |
| `--brand-soft` | `#eef0ff` | `rgba(129,140,248,.14)` |

Indigo `--brand` is the primary accent; `--violet` is the secondary, used almost exclusively
in **gradients paired with brand** (buttons stay solid brand).

Deliberate exceptions to the token set — don't add more:

- **Green** (`#22c55e` / `#15803d`) as a *liveness* signal only: the hero status dot and the
  `.detail__status--live` pill on project pages.
- **Amber** (`#f59e0b`) only as the pulsing "in progress" dot on the robot page (`.rb-pulse`).
- **Fixed white/black overlays** in `.cover__tag`, and on dark media tiles (video/3D render
  heroes, the model stage) whose background is an image and therefore can't follow the theme.
- The 3D-model stage uses the model's own viewport grey (`#616364`) and page colour
  (`#eff4f6`) so the poster image and the live iframe blend in.

### Type

- `--font-sans`: **Geist** (Google Fonts) → system fallback. Headings `font-weight: 650`,
  tight tracking (`-0.02em`; hero name `-0.038em`).
- `--font-mono`: **Geist Mono**. Mono is a *semantic* signal, not decoration — it marks
  metadata and machine-ish text: eyebrows, tags, filter pills, venues, years, the nav brand,
  the hero status chip, fact-tile keys and roadmap dates.
- Body copy sits at `--muted` with `line-height: 1.6–1.7` and a `max-width` (~34–68ch).

### Geometry & effects

`--radius` `.85rem` · `--radius-sm` `.55rem` · `--radius-lg` `1.15rem` · `--radius-pill` ·
`--maxw` `72rem`. Bento: `--radius-tile` `1.75rem` (28px tiles) and `--radius-inner`
`1.25rem` (media inset inside a tile). Three shadow tiers (`--shadow-sm/md/lg`); tiles use
**no shadow**, only `--tile-border`. Focus is always `2px solid var(--brand)` with offset.

### Bento tokens (home + project pages)

| Role | Light | Dark |
| --- | --- | --- |
| `--page` (canvas behind tiles) | `#f3f3f5` | `#0b0c0f` |
| `--tile-border` | `rgba(17,18,20,.07)` | `rgba(255,255,255,.07)` |
| `--invert-bg` / `--invert-fg` | `#111214` / `#fff` | `#232637` / `#fff` |
| `--invert-muted` | `rgba(255,255,255,.6)` | `rgba(255,255,255,.62)` |
| `--invert-accent` (dot on the dark tile) | `#a5b4fc` | `#a5b4fc` |

Tiles themselves use `--surface`. These tokens were **added**, not substituted: older token
values are unchanged so the older detail pages (§10.3) render exactly as before.

---

## 4. Layout & rhythm

- `.container` — `max-width: var(--maxw)`, responsive inline padding.
- `.section` — `padding-block: clamp(3.5rem, 7vw, 6.5rem)`; tightened on home to
  `clamp(3rem, 6vw, 5rem)` and on project pages to `clamp(2.5rem, 5vw, 4rem)`.
- **Home has no `.section--alt` banding** — every section sits on `--page` and its content
  lives in tiles. `.section--alt` still exists for the older detail pages.
- `.section__head` — `.eyebrow` (mono, uppercase, brand) + `.section-title` + optional
  `.section-desc`. Every home section uses this; project pages use `.sx-head` (same parts
  plus a right-hand slot for a link or switch). Don't invent a third heading pattern.
- Grids: `.grid-2` / `.grid-3` (1 col → 2 at 640px → 3 at 1024px). Breakpoints in use are
  **640 / 760 / 768 / 820 / 900 / 1024** — reuse these rather than adding new ones.

**Home section order:** Hero → Projects ("Work" in the nav) → About → Activity → Skills →
Writing → Awards → Contact → Footer.

> **Naming gotcha:** two partials don't match their section names —
> `partials/RESEARCH.*` renders the **Activity** section (`#activity`), and
> `partials/PUBLICATIONS.*` renders the **Writing** section (`#writing`). The `KEYS` list in
> `assemble.py` is the source of truth for build order.

> **Scoping:** home styles hang off `<body class="home">` (set in `index.template.html`).
> Anything bento-specific belongs under `.home …` or a bento-only class (`.tile`, `.hero__*`,
> `.nav__pill`, `.contact__tile`). The new project pages also use `<body class="home
> project-page">` so they inherit the bento look; the older detail pages use a bare `<body>`.

---

## 5. Component primitives

Defined once in `foundation.css`; section partials should compose these, not re-style them.

- `.btn` + `--primary` / `--soft` / `--outline` / `--ghost`. On bento pages buttons are
  **pills**: `--primary` is ink (`--fg` on `--bg`, so it inverts in dark mode) and `--soft` is
  a `--page`-filled secondary. Hover changes background only.
- `.card` — surface + border; hover tints the border. On home a card *is* a tile:
  `--radius-tile`, `--tile-border`, no shadow, and its `.cover` is inset by `.75rem` with
  `--radius-inner`.
- `.tile` — the bare bento surface (white, hairline, 28px radius) for non-card blocks.
- `.cover` — 16:9 media slot accepting `<img>` **or** `<video>` (an `<a class="cover">` when
  the card has a detail page), brand→violet gradient as the empty state, optional
  `.cover__tag` pill. **No zoom on hover.**
- `.tag` (chips) · `.filter` (pressable pills, `aria-pressed`; active = ink) · `.icon-well` ·
  `.icon-link` (icon + label links under a card, inside `.proj-card__links`) · `.detail-*` /
  `.detail__*` / `.doc*` primitives for the older detail pages.
- `.reveal` — fade + 14px rise on scroll via `IntersectionObserver`; stagger with
  `data-reveal-delay="<ms>"`. This is the only scroll movement.
- `[data-card-link="<url>"]` + `role="link" tabindex="0"` — makes a whole card clickable
  (Enter works too) without nesting anchors; inner links/buttons still win.

**Per-section class naming** is BEM-ish with a section prefix: `.hero__`, `.proj-card__`,
`.proj-hero__`, `.about__`, `.activity-card__`, `.skills__`, `.pub__`, `.award__`,
`.contact__`, `.footer__`, `.nav__`; project pages use `.sx-` (shared) and `.rb-` (robot only).
Keep new classes inside their prefix.

---

## 6. The hero — bento

`.hero__bento` is a grid of tiles:

| Breakpoint | Layout |
| --- | --- |
| < 640px | single column: intro → portrait (4:5) → three facts stacked |
| 640–899px | intro full width; portrait left, facts stacked right |
| ≥ 900px | `2fr / 1fr`: intro top-left, facts row (`1.25fr 1fr 1fr`) bottom-left, portrait spanning both rows on the right |

- **Intro tile** — status chip ("Open to research & collaboration", static green dot) →
  `Kim Changhoon` → one-line lead with the key phrase in `<strong>` → pill actions
  (View work / GitHub). The empty Résumé button was removed until a real public résumé is supplied.
- **Portrait tile** — `src/img/profile.jpg` cropped `object-position: 50% 28%`, with a frosted
  caption bar ("CheongShim Int'l Academy · Student").
- **Fact tiles** — mono uppercase key, large value, muted sub-line. `--now` is the dark tile
  ("Now building · PEBBLE") and links to `pages/pebble.html`; "Award · USACO Gold"; "Live ·
  ywc.kr" links out. Keep exactly three.

---

## 7. Navbar

A single **floating pill**, centred `0.9rem` from the top (`.nav__pill`); the fixed header is
`pointer-events: none` so only the pill catches clicks. Inside on home: `CK.` brand, links
(Work / About / Activity / Skills / Writing / Awards), a round theme toggle, and an ink
**Contact** pill. Project pages reuse the same pill with their own section links and an ink
**← Portfolio** pill instead of Contact. The scroll-spy marks the active link with a `--page`
background — no sliding indicator. Past 24px of scroll the nav gains `.is-scrolled` (more
opaque, `--shadow-md`).

Below 768px the links collapse: the pill keeps brand + toggle + CTA + menu button, and the
menu drops a rounded tile panel (`.nav__mobile`) underneath.

---

## 8. Motion contract

The home page has **no ambient animation**. The only motion is the scroll `.reveal` (fade +
14px rise, staggered in the hero) and short colour/background/border transitions
(**0.2–0.25s**, `ease`). Hover may never use `transform` — the build was checked to contain
zero `:hover` rules that set a transform.

Allowed exceptions, all on project pages and all reduced-motion-guarded: the SENTRY hero video,
the roadmap rail fill (`width` transition, 0.45s), and the robot page's amber "in progress"
pulse.

**`prefers-reduced-motion: reduce` is a hard requirement.** `foundation.css` clamps all
animation/transition durations and neutralises `.reveal`; `main.js` pauses any
`video[data-motion-video]`; `.rb-pulse` has its own guard. **Any new animation must be added
to a reduced-motion guard.**

No animation libraries and no runtime dependencies.

---

## 9. Guardrails

- Edit `partials/*` or `css/foundation.css`, then run `python3 assemble.py`. **Never hand-edit
  `index.html` or `css/styles.css`** — they are build outputs and will be overwritten.
- Pages in `pages/` are hand-written and are **not** touched by `assemble.py`. They load the
  built `../css/styles.css`, so rebuild after changing shared primitives and check them too.
- Commit the regenerated outputs together with the sources (GitHub Pages serves them directly).
- **Cache-busting:** project pages load `../css/project.css?v=…`, `../js/main.js?v=…` and
  `../js/sentry.js?v=…` with a date+letter version (e.g. `20261008e`). Bump the version in
  every page that loads a file whenever you change that file, or returning visitors (and
  GitHub Pages' ~10-minute cache) will mix old and new.
- Check **both themes and mobile (375px)** for any visual change; dark is not an afterthought.
  No page may scroll horizontally at 375px (the roadmap scrolls inside its own box — fine).
- Changing a shared token value affects every page — prefer adding a scoped token.
- Content must stay truthful — no invented awards, metrics, roles, affiliations or progress.
- No hover lift / scale / zoom, no background effects behind copy, one dark tile per view.
- Relative URLs everywhere (the site lives under `/portfolio/`); no leading `/`.

---

## 10. Repository map

```
index.html, css/styles.css   BUILD OUTPUTS of assemble.py (home page) — never hand-edit
index.template.html          home <head>, no-flash theme script, <!-- @@KEY@@ --> markers
assemble.py                  stitches partials into the two outputs (KEYS = build order)
css/foundation.css           tokens + shared primitives (first part of styles.css)
partials/<KEY>.html|.css     home sections: NAV HERO PROJECTS ABOUT RESEARCH(=Activity)
                             SKILLS PUBLICATIONS(=Writing) AWARDS CONTACT FOOTER
css/project.css              bento project pages; .sx- shared, .rb- delivery robot
css/pebble.css, js/pebble.js   PEBBLE page styles + accessible CAD-still comparison
js/main.js                   every page: theme toggle, mobile menu, scroll-spy, reveal,
                             project filter, data-card-link, nav .is-scrolled, motion-aware
                             videos, footer year
js/sentry.js                 SENTRY page only: figure language switch + document reader
pages/*.html                 detail pages (two templates — §10.3)
models/delivery-robot/       copy of the owner's interactive 3D robot model (§12)
docs/sentry/                 GENERATED by tools/sentry-docs (PDFs, page images, panels)
docs/whsdsc-*.pdf            WHSDSC certificate + redacted Phase-1 submission (keep redacted)
docs/schoolhouse-portfolio.pdf  Schoolhouse.world tutoring certificate
src/img/covers/              card cover art (SVG, hand-built/vectorised; cssc.png)
src/img/sentry/hero-poster.jpg  poster frame for the SENTRY hero video
src/img/robot/               current cargo/chassis CAD and historical October layout renders
src/img/pebble/              current prototype, wide configuration and floor-funnel CAD renders
src/img/webdev/cssc/         csiasc.com screenshots for pages/csiasc.html
src/video/sentry-bridge-hero.mp4  stock footage (Mixkit), must stay credited
assets/                      favicons ("CK" mark)
tools/sentry-docs/           translation/render pipeline for SENTRY docs (own README)
_src_nextjs/                 the original Next.js source, reference only — not deployed logic
.nojekyll                    serve files verbatim (incl. _-prefixed folders)
```

### 10.1 `js/main.js` hooks

| Hook | Behaviour |
| --- | --- |
| `#theme-toggle` | toggles `html[data-theme=dark]`, stores `localStorage.theme` |
| `#nav-toggle` / `#nav-mobile` | mobile menu (Esc and link click close it) |
| `.nav__link[href^="#"]` + sections with ids | scroll-spy (`aria-current`) |
| `.reveal`, `data-reveal-delay` | reveal on scroll |
| `.filter[data-filter]`, `#proj-archive-grid .proj-card[data-category]`, `#proj-empty` | archive filter (All / statistics / ML / robotics / webdev) |
| `[data-card-link]` | whole-card navigation |
| `video[data-motion-video]` | paused under reduced motion; retried when a hidden tab becomes visible |
| `#footer-year` | current year |

### 10.2 Home content (what's actually on the page)

- **Hero** — §6.
- **Projects** (`partials/PROJECTS.html`):
  - *Flagship* `.proj-hero` card: **PEBBLE** (robotics, in progress, labeled CAD render),
    whole card links to `pages/pebble.html`.
  - *Featured* (2): **SENTRY** (ML, Completed, original reports retained) and
    **ywc.kr — Youth Web Coalition** (webdev, Live). WHSDSC remains in the archive.
  - *Archive* "All projects" with the filter: PEBBLE (robotics, in progress), SENTRY (ML, Completed), WHSDSC (ML), A/B Deep #1 HTE /
    #2 Hierarchical-Bayes / #4 Network interference / #5 Switchback & HAC (statistics, GitHub
    links into `kchanghoon6/ab_test_practice`, no detail pages), **Campus Delivery Robot**
    (robotics, "In progress", Details + 3D model), **csiasc.com** (webdev, Live, Visit site +
    Details), ywc.kr (webdev, Live).
  - Categories the owner fixed: SENTRY and WHSDSC are **ML only**; the filter set is exactly
    All / statistics / ML / robotics / webdev.
- **About** — three paragraphs (CSIA; PEBBLE current focus; completed SENTRY "with one teammate, doing most of the work
  myself"; WHSDSC team lead; A/B work; ywc.kr founder; csiasc.com; Schoolhouse tutoring;
  USACO Gold).
- **Activity** — one card: Schoolhouse.world peer tutoring (19 sessions, 12 hours, 23
  learners, 12 countries, 46 positive ratings) → `pages/schoolhouse.html`.
- **Skills** — five groups: Languages, ML & modeling, Statistics & causal inference, Web &
  data, Tools & hardware.
- **Writing** — SENTRY methodology (→ page + `docs/sentry/r3-en.pdf`); Advanced A/B testing
  notes (→ GitHub).
- **Awards** — **USA Computing Olympiad — Gold Division (2026)**; **RoboRAVE World
  Championship — Finalist** ("International robotics competition · Osaka, Japan", 2026).
  Nothing else: template placeholder awards were removed on purpose.
- **Contact** — dark tile: `kchanghoon6@gmail.com` (public contact address), GitHub, ywc.kr.

### 10.3 Detail pages — two templates

| Template | Pages | Look |
| --- | --- | --- |
| **Bento project page** (new) | `pebble.html`, `sentry.html`, `delivery-robot.html` | `<body class="home project-page">`, floating nav pill with section links, dark hero tile + fact tiles, `css/project.css` |
| **Classic detail page** (older) | `whsdsc.html`, `ywc.html`, `csiasc.html`, `schoolhouse.html` | bare `<body>`, `.detail-nav` bar (← Back to portfolio, CK., theme toggle), `main.detail` with `.detail__title/meta/lead/body`, `.detail__status` pill, `.doc` blocks embedding PDFs in iframes |

New project pages should use the bento template. Migrating the four classic pages is an open
option, not a request (§15).

Facts on the classic pages: WHSDSC — Student Team Leader, team of 3, Feb–Mar 2026, did not
advance past Phase 1 (say so honestly). ywc.kr — founder/developer, Flask, 594 competitions
and 868 pre-college programs catalogued, live. csiasc.com — CSIA student self-governance court
+ petition system (Flask/SQLite), **live again since 2026-10-08** with a "Visit csiasc.com"
button. Schoolhouse — certified tutor, certificate embedded.

---

## 11. SENTRY project page (`pages/sentry.html`)

**Status: Completed**, at the owner's request on November 10. Reports, poster and reader remain intact.
Bento project template. Styles in `css/project.css` (`.sx-`), behaviour in `js/sentry.js`.

**Order:** overview (full-width **video banner** intro tile · three fact tiles · small poster
tile) → **Experiments** (v1 foam-board model, openLAB 45 m research-bridge public data, v2
aluminum model with 27 conditions, v3 two real footbridges) → **Poster** (finals poster, 2
pages) → **Documents** reader.

- **Hero.** Chip "Completed · Korea Code Fair 2026 · Finals". Team line "Completed project ·
  Team of two students with a faculty advisor. I did most of the work." Fact tiles:
  v2 aluminum model 840 / 840, v3 real bridge E ≤ 1 %, v3 real bridge C 200 kg.
  `src/video/sentry-bridge-hero.mp4` is stock footage (Mixkit, "Aerial View of a Highway
  Bridge") and **must stay credited** ("Footage: Mixkit" link on the tile).
- **Figures are the originals.** Experiment tiles show crops of the submitted poster
  (`docs/sentry/panels/<name>-<en|ko>.webp`; `problem/flow/method/diff/conclusion` panels also
  exist but are unused). Do **not** redraw diagrams for the site — the owner explicitly
  rejected that.
- **English + Korean, page for page.** English editions translate the text in place and keep
  layout, figures and page numbers, so every page can be checked against the Korean original.
  Each English page carries a translation notice. A language switch (`[data-lang-switch]`,
  stored as `localStorage['sentry-lang']`) swaps `img[data-src-en|ko]` / `a[data-href-en|ko]`.
- **Reader** (`#sx-reader`). Documents are defined in `DOCS` in `js/sentry.js`:

  | id | Document | Round | Pages shown / in PDF | Langs |
  | --- | --- | --- | --- | --- |
  | `r1` / `s1` | Project report / summary | 1 · Written review (Jun 2026) | 16/16, 1 | en, ko |
  | `r2` / `s2` / `slides` | Report / summary / presentation slides | 2 · Preliminary (Jul 2026) | 16/38, 1, 12 | en, ko (slides ko only) |
  | `r3` / `poster` / `s3` | Report / poster / summary | 3 · Finals (Sep 2026) | 16/40, 2, 1 | en, ko |

  Page images: `docs/sentry/pages/<id>-<lang>/<n>.webp`, thumbs `t<n>.webp`; PDFs
  `docs/sentry/<id>-<lang>.pdf`. Modes: English / 한국어 / side by side. Reports show the
  16-page body; the source-code appendix stays in the PDF, untranslated. `[data-open-doc]`
  (+ `data-page`) anywhere on the page opens a document in the reader. ←/→ keys page.
- **Roadmap picker.** The reader's document list is a horizontal roadmap
  (`nav.sx-road > ol.sx-road__stops > li.sx-stop[data-round]`): a dot per round on a rail,
  date + round name under it, the round's documents as `.sx-item` buttons below. Selecting a
  document sets `data-active-round` (rail fills to that dot via `--progress`), marks earlier
  rounds `.is-done` and the current one `.is-active`, and the selected `.sx-item` gets
  `aria-current="true"` (ink pill). On narrow screens the rail scrolls inside `.sx-road` and the
  active stop is centred (instantly on load, smoothly on clicks, with a fallback for browsers
  that skip smooth scrolling). The roadmap is generic: `--n` = number of stops
  (`.sx-road__stops--4` sets 4), `--progress` = 0…1.
- **Team project.** Two students + faculty advisor; Kim Changhoon did most of the work. Say so
  wherever SENTRY is described; don't list specific sub-roles (not confirmed). Teammate and
  advisor names are withheld everywhere (masked in the Korean forms, "[name withheld]" in
  English). `tools/sentry-docs/build.py` refuses to publish a file that still contains a name.
- **Regenerating documents:** everything in `docs/sentry/` comes from `tools/sentry-docs/`
  (see its README: `extract.py` → `tmbuild.py` → `build.py`; needs PyMuPDF, Pillow,
  python-pptx, Ghostscript, NanumGothic, Microsoft PowerPoint for the poster, and the original
  submissions in `~/Desktop/CSIA_2nd/KCF/최종제출자료/{1차 서면심사,2차 예선심사,3차 본선심사}`).
  Fix a translation in `tools/sentry-docs/tm_ids/*.json` and rebuild — never edit PDFs or
  images by hand.

---

## 12. Campus Delivery Robot page (pages/delivery-robot.html)

Bento template with css/project.css and scoped css/delivery-robot.css. **In progress**:
CAD/fabrication preparation, no physical assembly, payload, autonomy or success-rate result.

**Current-first order:** overview and current cargo CAD → chassis/cargo component evidence →
three-layer system explanation → power/control/sensing/elevator design → safety and validation
→ collapsed historical October whole-system model. No current integrated whole-robot CAD has
been established. Never label the October model as the November fabrication baseline.

**Authoritative current mechanical sources:** sibling Robotics/섀시_가공_v4.5 (SCAD + drawing),
물품함_v1.1 (SCAD + drawing + HTML), 업체전달_2026-11-04_정리본. The revised CarryOn mentor
PDF provides mission/wiring intent; November drawings override older mechanical dimensions.
- Chassis: 264 × 520 and 264 × 462 mm, 1.5 mm SPCC; six 85 mm deck spacers; upper plate
  offset 53 mm. Supplied L-brackets, not a newly invented motor-mount design.
- Cargo: seven 1.5 mm AL5052-H32 panels, removable on four 45 mm spacers. Belt top Z208 mm,
  250 mm width / 900 mm loop; two 250 mm ramp leaves, nominal 22.7°; tension travel −10/+7.
- Drawing target 140 × 200 × 100 mm and ≤2 kg is **not a tested payload rating**. Do not mix
  the historical model's 0.5 kg test target with this current drawing target.
- Plan includes Pi 5 + ESP32-S3, four traction motors / MDD10A, two MDD3A drop-off drivers,
  12.8 V 9.9 Ah LiFePO4, seven VL53L1X sensors, current sensing, latches and an elevator mast.
- Electrical open gates remain: ESP32 supply overlap; incompatible PWM needs; I/O beyond
  one 16-pin expander; latch-feedback/current-margin verification; deliberate E-stop rearm.
  Mission/navigation/order software and boarding validation are plans, not operational claims.

**Current visual assets:** src/img/robot/cargo-v1-1.png and cargo-deployed-v1-1.png are direct
renders from the authentic current cargo viewer. chassis-v4-5.svg is an exact SCAD flat
projection, not a redrawn hole pattern. The system stack is explicitly a simplified explanation.
models/delivery-robot/cargo-v1-1.html preserves original embedded geometry with public English
controls. Purchased hardware, mast/deck/ramp envelopes are simplified; the mast is shortened
for visibility. The homepage's cargo-CAD link points here, not to the historical model.

**Historical model:** models/delivery-robot/dropoff-3d.html is the transaction-redacted
October 18 layout. It is behind a disclosure on the detail page. Old model-render.webp and
model-thumb.webp remain historical renders. Never copy the private original blindly: it
contains transaction metadata that must not be published. No private source PDFs are uploaded.

Not confirmed: whether this is solo or team; RoboRAVE exact event/category wording. Do not
infer either from local files or planned submissions.

---

## 13. Owner decisions & preferences (chronological, keep honouring them)

- **2026-06** Migrated from Next.js to a static site; white/light default, dark opt-in,
  system scheme ignored. All template placeholder projects/awards deleted. "Research" section
  became **Activity** (extracurriculars); there is no Experience section (high-school student).
- **2026-10** Bento redesign chosen (B over Mono/Editorial; plain B over the B1/B2 variants).
  **No hover lift/zoom animations** — they look AI-made.
- **2026-10** SENTRY page: show the **original KCF submissions** (no redrawn diagrams);
  English editions made in place + Korean originals side by side; hybrid layout (story tiles +
  document reader). Team of two + advisor stated; **teammate/advisor names withheld**; owner
  "did most of the work" (no finer roles). Hero video banner (variant A, full-width).
- **2026-10-08** USACO is **Gold** (an earlier "Silver" was the owner's mistake).
  csiasc.com is live again → linked. RoboRAVE World Championship Finalist added.
  Delivery robot gets a detail page linked to the 3D model, marked "in progress". SENTRY
  reader sidebar became a **horizontal roadmap** with selectable items under each dot.
- Working style: the owner writes in **Korean** and expects Korean replies; prefers seeing a
  rendered result (screenshots) before/after visual changes, and drafts first for big
  redesigns; **commit + push only on request** (usually the literal message "commit + push").
- Privacy: no third-party names (SENTRY teammate/advisor, WHSDSC teammates); the WHSDSC
  submission PDF stays redacted; don't add personal data beyond the public contact address.

---

## 14. Recipes

### 14.1 Add or change a home project card
Edit `partials/PROJECTS.html` (copy an existing `<article class="card proj-card reveal"
data-category="…">`), use an `<a class="cover" href="…">` when there is a detail page, set
`.cover__tag` ("Category · Status"), add links in `.proj-card__links`, then
`python3 assemble.py`. Covers go in `src/img/covers/` (SVG preferred, 16:9).

### 14.2 Add a bento project page
Copy `pages/delivery-robot.html` (simplest bento page): keep the `<head>` (fonts, no-flash
theme script, `../css/styles.css` + `../css/project.css?v=…`), the nav pill (update section
links), `.sx-hero.sx-hero--banner` → `.sx-head` sections → footer, and `../js/main.js?v=…`.
Use `.sx-road` for any timeline. Link it from the home card.

### 14.3 Add an award
Add an `<li class="reveal">` to `partials/AWARDS.html` (icon in `.icon-well`, title, issuer,
year), rebuild. Only real, confirmed awards.

### 14.4 Refresh the robot model and its renders
1. `cp ~/Desktop/CSIA_2nd/Projects/Robotics/dropoff_3d_real_parts.html models/delivery-robot/dropoff-3d.html`
   **Never publish this copy blind.** The October 18 source contained transaction metadata.
   Remove transaction identifiers, per-order dates/status/totals and hidden purchase prices;
   retain geometry and public product references. Verify embedded JS after redaction.
2. Re-check the facts in §12 against the model's notes and update the page if they changed.
3. Renders: copy the model to a temp file, inject CSS that hides `header, aside, .viewtitle,
   .viewtools, .viewstatus, footer` and makes `.shell` one full-height column, plus a script
   that unchecks `#dims` (dimension labels) after load; screenshot it with headless Chrome
   (`--headless=new --use-angle=swiftshader --enable-unsafe-swiftshader
   --force-device-scale-factor=2 --virtual-time-budget=15000 --window-size=1400,900`), then
   crop/resize with Pillow to WebP (`model-render` ~1800 px wide, `model-thumb` ~900 px).

### 14.5 Verify before reporting
- Local links: for each of `index.html` and `pages/*.html`, every relative `href`/`src` (and
  `data-src-*`, `data-href-*`, `data-embed-load`) must exist on disk.
- Screenshots: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new
  --hide-scrollbars --window-size=1440,4000 --virtual-time-budget=8000
  --screenshot=out.png "http://localhost:8766/<page>?v=<timestamp>"` (add the swiftshader
  flags for WebGL). Check light, dark (`html[data-theme=dark]`) and 375px width; confirm
  `document.documentElement.scrollWidth === 375` on mobile.
- After pushing: wait for the Pages run, then `curl` the live URLs (with a `?v=` query) to
  confirm the new content is served.

### 14.6 Commit style
Imperative sentence-case summary, a short body listing what changed and why, ending with the
co-author trailer the tooling asks for. Commit sources and build outputs together.

---

## 15. Open items / known gaps (as of 2026-11-10)

Resolved in the November 10 PEBBLE-first revision:
- PEBBLE is the hero focus and flagship; SENTRY is Completed, with all active documentation retained.
- Delivery model refreshed from October 18, transaction data removed, renders regenerated;
  November fabrication preparation replaces the old October "now" status.
- Empty Résumé button removed. Add it only when a real public file exists.
- Removed 29 unreferenced old SENTRY images plus docs/sentry-report.pdf (7,978,825 bytes).
  Kept hero-poster.jpg and the active docs/sentry/ reader assets.
- README and source footer year updated.

Still unconfirmed / not changed:
- RoboRAVE exact event/category wording, and whether delivery robot is solo or team.
- Four classic detail pages remain on their existing template; migration is optional.
- PEBBLE physical performance, mass, durability and deployment are unverified. Do not infer
  measured results from firmware tests, CAD checks, simulations or planned trials.

## 16. PEBBLE flagship (November 10 revision)

Page: pages/pebble.html. Shared bento primitives plus css/pebble.css and js/pebble.js.
Homepage hero, flagship, archive and About identify it as current focus / In progress.
The page uses current CAD renders, never a generated concept illustration or physical photo.

**Research:** contact-responsive asymmetric narrowing versus symmetric narrowing at the same
stepwise total reduction, compared with fixed-wide NONE and initially-narrow MIN. Widths
136.5–161.5 mm are nominal commanded dimensions, not measured contact widths. Side selection
uses width-adjustment servo-current proxies; fixture load cells provide a force reference.

**Current scope:** first prototype uses a fixed, braced T3 tail. The spherical deployment/
throwable concept is not a physically demonstrated folding robot. No measured success rate,
rescue performance, mass or durability claims. Prior art exists for hemispherical wheels;
the experiment/escape strategy is the focus, not invention of the mechanism.

**Experiment:** November 9 adjustable floor-funnel v4, not old fixed-angle v3. Planned core
matrix: 2 total angles (20°/30°) × 2 entry conditions × 4 modes × 6 repeats = 96 trials.
Success: marked core center passes 100 mm beyond the actual exit within 60 s. Video is for
judging, not controller input. Preliminary work must lock the gap and entry offsets.

**Software:** FW10 / LOG_VER7 records 2,479 dynamic host tests, 10 static guards and five
compiled targets. All are software-side evidence; hardware bench testing remains ahead.

**Private working sources (not copied into the public site):** sibling KSEF project,
PEBBLE_v1_1호기/02_계획서_문서/PEBBLE_실행가이드_최신_20261110.md,
03_시험/PEBBLE_RQ2A_장치/깔때기안_20261109/RQ2A_깔때기_시험절차_정본.md,
07_펌웨어/STATUS_FW10.md. Robot renders are from 01_CAD_설계/PEBBLE_v3_3D보기.html,
SHA256 f42dca14d49b848045a6717bf1f02341bf5f66247a707428b94fe92d2ce9f4f9.
Includes November 8 tail brace and November 9 funnel. Do not publish the 17.5 MB internal
viewer blindly; only clean CAD stills are used here. The anatomy buttons switch stills, not simulated or physical outcomes. Regenerate from the newest source after verifying its
release and privacy; hide #ui and #tag, use the fixed-tail preset for the primary render.

### Detailed engineering walkthrough (November 10 continuation)

The owner asked for the detail depth of PEBBLE_필기노트_1108_v3_소재부품_실험진행.pdf (24 pages).
Use pages 2–8 for explanatory structure, but the November 8–9 correction page and November 10
execution guide override older parts/process/status descriptions. The original PDF includes
private transaction/vendor information and is **not published** wholesale.

Source-content baseline before the visual-first revision: Inside → width mechanism → Electronics → Materials → Tests → Progress. The
four-button CAD assembly explorer switches authentic stills (inside / right-wheel section /
width linkage / F5v12 sled); source geometry is unchanged. Assemblies are selectively hidden,
the wheel is sectioned, module envelopes may be simplified. Captions and English explanations
make these limitations explicit. No closed-ball first-prototype demonstration is shown.

Key content: shell-bearing-motor load paths; 24 cartridges × 3 hooks × 2 wheels (planned 144);
KST X08N V6 + 13 mm crank/slider/17-4PH rod/guide/gland; stationary PA12 core and service sled;
fixed T3 tail rather than fitted deployment lines/pulleys/spring. Pololu #4797 + #3081 are
planned part selections, not measured installed speed. Avoid older CAD metadata's gear-ratio
text; the notes are the component-selection reference.

Electronics explanation: XIAO upper-level commands via UART, RP2040 final interlock authority;
1S 902540 800 mAh battery, r1-lite six-layer 22.5 × 20 mm board, separate 6 V drive/servo and
3.3 V logic A/B paths. Current-path deviations and the harness bypass are disclosed, not
presented as full-current compliance. 2.7 A pre-validation / 3.0 A conditional battery cap;
stricter failure limits or installation hold remain possible. IMU temperature is a proxy,
not direct battery temperature. LoRa off for the core trial campaign; field validation separate.

Materials are explained by role, not generic strength numbers. The current F-plan separates
TPU bars and ring for flat printing; assembly/adhesive/coupon approval remains open. Brace-seat
geometry, retained spool scope and service/programming access are unresolved gates. The 128
planned funnel activities (16 preliminary + 96 core + 16 side-slope) are distinct from a mapped,
minimum-width maze demonstration and supporting material/thermal/radio checks.

**Verification of the detailed revision:** source/privacy reviewer passed; 8 HTML pages, 143
local references and 67 internal anchors checked with no missing targets. Four CAD explorer
buttons show exactly one explanatory panel and active state. Both robot pages fit 375 px
without horizontal overflow. Desktop/mobile light/dark and current cargo viewer inspected.

### Visual-first notebook revision (current presentation)

Owner feedback: the engineering expansion was too text-heavy. The default page now follows
the notebook's image + direct label structure, not paragraphs beside a small CAD render.
Keep this visual-first hierarchy for future revisions; don't add visible prose cards by default.

PEBBLE now has four compact chapters: Anatomy, Control/power, Experiment, Current state.
- Four notebook-*.webp stills use original geometry, tightly framed, with illustrative
  component colors. Colors distinguish parts/material roles, not actual paint or finishes.
- Direct leader labels use real projected geometry centers from the final camera. Wheel
  bearing/shell endpoints are raycast-confirmed visible mesh vertices. Normalized positions
  are embedded in js/pebble.js. If geometry, view, crop or image framing changes, recalculate
  them; never retain old anchors blindly. Mobile shows a large image plus readable label buttons.
- The command/power map, four width-policy glyphs and trial matrix are native diagrams.
  They explain the plan, not dimensional CAD, physics simulation or measured outcomes.
- All five technical-note groups were retained with exact normalized text, in closed native
  disclosures. Source-backed hardware/safety/fabrication facts were not discarded.
- Logical default text-node count fell from 2,121 to about 429 words (varies by selected view),
  roughly 80%. Not a full-document word reduction: complete notes remain expandable.

Delivery page uses large current cargo views and direct labels, an exact chassis projection,
a simplified native SVG three-deck map and four illustrated discharge stages. All 60 original
factual blocks remain in named disclosures. Default text falls roughly 60%. Current v4.5 /
v1.1 and historical October layout boundaries remain explicit.

QA: 8 HTML pages, 142 local refs and 68 internal anchors checked. Both themes and 375 px
checked; all five PEBBLE disclosures open still fit 375 px. Original full notes and all
60 delivery factual blocks independently compared, not accepted on self-report. No source
PDF or internal 17.5 MB viewer was published. Core factual caveats from the earlier revision
remain authoritative.
