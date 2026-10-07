# Design context

Reference for anyone (human or AI) making visual changes to this site. `README.md` covers
**how to build and deploy**; this file covers **what the design is and why**, so future edits
stay coherent instead of drifting into generic template territory.

---

## 1. Intent

Personal portfolio for **Kim Changhoon** — a high-school student at CheongShim International
Academy working across applied ML, statistics / causal inference, and full-stack web.

The site has to read as **a builder's site, not a résumé template**. Two audiences:
admissions/competition reviewers skimming for credibility, and engineers who will judge the
craft of the site itself. So the bar is: *specific, real, and quietly technical* — never
inflated, never decorative-for-its-own-sake.

**Voice:** plain and concrete. Real project names and outcomes over adjectives. No
"passionate about leveraging cutting-edge…" filler. Only genuine credentials appear
(placeholder awards/projects from the original template were deliberately deleted).

---

## 2. Aesthetic direction

**"Bento, but un-AI."** The home page is a grey canvas (`--page`) holding white, softly
rounded tiles — an intro tile, a tall portrait tile, and a few fact tiles — with one dark tile
for emphasis. Indigo stays the accent but is used sparingly (small badges, the brand dot).
*Chosen 2026-10 from three drafts (Mono / Bento / Editorial); the earlier "live signal panel"
hero — grid, aurora, waveform, ring, typewriter — was retired as too busy.*

Committed choices:

- **Light is the default.** Dark is opt-in via the toggle and stored in `localStorage`; the
  system colour scheme is intentionally **ignored** for the initial theme.
- **The grid is the visual idea.** No ambient background effects; structure, whitespace, and
  type carry the page.
- **No hover theatrics.** Hover never lifts, scales, zooms, or nudges anything — it only changes
  colour, border, or background. This was an explicit request: lift-on-hover reads as
  generic AI-built UI.
- **Exactly one dark tile per view** (`--invert-bg`): the hero "Now building" tile and the
  closing Contact tile. Don't add more — it stops being emphasis.
- **Real content only.** Fact tiles show verifiable things (SENTRY / USACO Gold / ywc.kr).

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

Only two deliberate exceptions to the token set exist — don't add a third:

- **Green** (`#22c55e` / `#15803d`) as a *liveness* signal only: the hero status dot and the
  `.detail__status--live` pill on project pages.
- **Fixed white/black overlays** in `.cover__tag`, which sits on top of arbitrary cover art
  and therefore can't follow the theme.

### Type

- `--font-sans`: **Geist** (Google Fonts) → system fallback. Headings `font-weight: 650`,
  tight tracking (`-0.02em`; hero name `-0.038em`).
- `--font-mono`: **Geist Mono**. Mono is a *semantic* signal, not decoration — it marks
  metadata and machine-ish text: eyebrows, tags, filter pills, venues, years, the nav brand,
  the hero status chip and the fact-tile keys.
- Body copy sits at `--muted` with `line-height: 1.6–1.7` and a `max-width` (~34–68ch).

### Geometry & effects

`--radius` `.85rem` · `--radius-sm` `.55rem` · `--radius-lg` `1.15rem` · `--radius-pill` ·
`--maxw` `72rem`. Home-only: `--radius-tile` `1.75rem` (28px tiles) and `--radius-inner`
`1.25rem` (media inset inside a tile). Three shadow tiers (`--shadow-sm/md/lg`); home tiles
use **no shadow**, only `--tile-border`. Focus is always `2px solid var(--brand)` with offset.

### Home (bento) tokens

| Role | Light | Dark |
| --- | --- | --- |
| `--page` (canvas behind tiles) | `#f3f3f5` | `#0b0c0f` |
| `--tile-border` | `rgba(17,18,20,.07)` | `rgba(255,255,255,.07)` |
| `--invert-bg` / `--invert-fg` | `#111214` / `#fff` | `#232637` / `#fff` |
| `--invert-muted` | `rgba(255,255,255,.6)` | `rgba(255,255,255,.62)` |
| `--invert-accent` (dot on the dark tile) | `#a5b4fc` | `#a5b4fc` |

Tiles themselves use `--surface`. These tokens were **added**, not substituted: existing token
values are unchanged so the detail pages (notably `pages/sentry.html` + `css/sentry.css`,
which lean heavily on `--bg`, `--surface`, `--radius*`) render exactly as before.

---

## 4. Layout & rhythm

- `.container` — `max-width: var(--maxw)`, responsive inline padding.
- `.section` — `padding-block: clamp(3.5rem, 7vw, 6.5rem)`; tightened on home to
  `clamp(3rem, 6vw, 5rem)`.
- **Home has no `.section--alt` banding** — every section sits on `--page` and its content
  lives in tiles. `.section--alt` still exists and is still used by the detail pages.
- `.section__head` — `.eyebrow` (mono, uppercase, brand) + `.section-title` + optional
  `.section-desc`. Every section uses this; don't invent a new heading pattern.
- Grids: `.grid-2` / `.grid-3` (1 col → 2 at 640px → 3 at 1024px). Breakpoints in use are
  **640 / 768 / 820 / 900 / 1024** — reuse these rather than adding new ones.

**Section order:** Hero → Projects ("Work" in the nav) → About → Activity → Skills → Writing →
Awards → Contact → Footer.

> **Naming gotcha:** two partials don't match their section names —
> `partials/RESEARCH.*` renders the **Activity** section (`#activity`), and
> `partials/PUBLICATIONS.*` renders the **Writing** section (`#writing`). The `KEYS` list in
> `assemble.py` is the source of truth for build order.

> **Scoping:** home styles hang off `<body class="home">` (set in `index.template.html`).
> Anything bento-specific belongs under `.home …` or a home-only class (`.tile`, `.hero__*`,
> `.nav__pill`, `.contact__tile`) so it can't leak into `pages/`.

---

## 5. Component primitives

Defined once in `foundation.css`; section partials should compose these, not re-style them.

- `.btn` + `--primary` / `--outline` / `--ghost`. On home, buttons are **pills**:
  `--primary` is ink (`--fg` on `--bg`, so it inverts in dark mode) and `--soft` is a
  `--page`-filled secondary. Hover changes background only.
- `.card` — surface + border; hover tints the border. On home a card *is* a tile:
  `--radius-tile`, `--tile-border`, no shadow, and its `.cover` is inset by `.75rem` with
  `--radius-inner`.
- `.tile` — the bare bento surface (white, hairline, 28px radius) for non-card blocks.
- `.cover` — 16:9 media slot accepting `<img>` **or** `<video>`, brand→violet gradient as the
  empty state, optional `.cover__tag` pill (a light chip on home). **No zoom on hover.**
- `.tag` (chips — `--page`-filled on home) · `.filter` (pressable pills, `aria-pressed`;
  active = ink) · `.icon-well` · `.icon-link` · `.detail-*` primitives for `pages/`.
- `.reveal` — fade + 14px rise on scroll via `IntersectionObserver`; stagger with
  `data-reveal-delay="<ms>"`. This is the only movement on the page.

**Per-section class naming** is BEM-ish with a section prefix: `.hero__`, `.proj-card__`,
`.about__`, `.activity-card__`, `.skills__`, `.pub__`, `.award__`, `.contact__`, `.footer__`,
`.nav__`. Keep new classes inside their section's prefix.

---

## 6. The hero — bento

`.hero__bento` is a grid of tiles:

| Breakpoint | Layout |
| --- | --- |
| < 640px | single column: intro → portrait (4:5) → three facts stacked |
| 640–899px | intro full width; portrait left, facts stacked right |
| ≥ 900px | `2fr / 1fr`: intro top-left, facts row (`1.25fr 1fr 1fr`) bottom-left, portrait spanning both rows on the right |

- **Intro tile** — status chip (static green dot, `--page` fill) → `Kim Changhoon` → one-line
  lead with the key phrase in `<strong>` → pill actions (View work / Résumé / GitHub).
- **Portrait tile** — `profile.jpg` cropped `object-position: 50% 28%`, with a frosted caption
  bar ("CheongShim Int'l Academy · Student").
- **Fact tiles** — mono uppercase key, large value, muted sub-line. `--now` is the dark tile and
  links to `pages/sentry.html`; the ywc.kr tile links out. Keep exactly three.

---

## 7. Navbar

A single **floating pill**, centred `0.9rem` from the top (`.nav__pill`); the fixed header is
`pointer-events: none` so only the pill catches clicks. Inside: `CK.` brand, links (Work /
About / Activity / Skills / Writing / Awards), a round theme toggle, and an ink **Contact**
pill. The scroll-spy marks the active link with a `--page` background — no sliding indicator.
Past 24px of scroll the nav gains `.is-scrolled` (more opaque, `--shadow-md`).

Below 768px the links collapse: the pill keeps brand + toggle + Contact + menu button, and the
menu drops a rounded tile panel (`.nav__mobile`) underneath.

---

## 8. Motion contract

The home page has **no ambient animation**. The only motion is the scroll `.reveal` (fade +
14px rise, staggered in the hero) and short colour/background/border transitions
(**0.2–0.25s**, `ease`). Hover may never use `transform` — the build was checked to contain
zero `:hover` rules that set a transform.

**`prefers-reduced-motion: reduce` is a hard requirement.** `foundation.css` clamps all
animation/transition durations and neutralises `.reveal`; `main.js` pauses any
`video[data-motion-video]` (used on the SENTRY page). **Any new animation must be added to a
reduced-motion guard.**

No animation libraries and no runtime dependencies.

---

## 9. Guardrails

- Edit `partials/*` or `css/foundation.css`, then run `python3 assemble.py`. **Never hand-edit
  `index.html` or `css/styles.css`** — they are build outputs and will be overwritten.
- Commit the regenerated outputs together with the sources (GitHub Pages serves them directly).
- Check **both themes and mobile** for any visual change; dark is not an afterthought here.
- Changing a shared token value affects `pages/` too — prefer adding a home-scoped token.
- Content must stay truthful — no invented awards, metrics, or affiliations.
- No hover lift / scale / zoom, no background effects behind copy, one dark tile per view.

---

## 10. SENTRY project page (`pages/sentry.html`)

Same bento language as home (`<body class="home sentry-page">`, floating nav pill, tiles);
page-only styles live in `css/sentry.css` (prefix `.sx-`) and behaviour in `js/sentry.js`.
Order: overview bento (full-width **video banner** intro · three fact tiles + a small poster
tile) → **Experiments** (v1 foam
board, openLAB data, v2 aluminum model, v3 two real footbridges) → **Poster** → **Documents**
reader (English / 한국어 / side by side).

- **Hero video.** `src/video/sentry-bridge-hero.mp4` is stock footage (Mixkit, "Aerial View of
  a Highway Bridge") and must stay credited on the tile. It is the page's one dark tile, so the
  fact tiles stay light. `main.js` pauses it under reduced motion and retries playback when a
  background tab becomes visible.
- **Figures are the originals.** Experiment tiles show crops of the submitted poster, the
  reader shows pages rendered from the submitted PDFs. Do not redraw diagrams for the site —
  the owner explicitly rejected that.
- **English + Korean, page for page.** English editions translate the text in place and keep
  layout, figures and page numbers, so every page can be checked against the Korean original.
  Each English page carries a translation notice.
- **Team project.** SENTRY is a two-student team with a faculty advisor, and Kim Changhoon did
  most of the work; say so wherever it is described (don't list specific roles he hasn't confirmed). The teammate's and advisor's names are withheld everywhere (masked in the
  Korean forms, "[name withheld]" in English).
- Assets in `docs/sentry/` are generated by `tools/sentry-docs/` (see its README) — edit the
  translation memory there and rebuild instead of editing PDFs or images by hand.
