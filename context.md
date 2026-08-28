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

**"Light, precise, instrument-like."** A calm white editorial base with an indigo/violet
accent, plus a thin layer of *live measurement* signals that hint at the anomaly-detection
and experimentation work without ever shouting.

Committed choices:

- **Light is the default.** Dark is opt-in via the toggle and stored in `localStorage`; the
  system colour scheme is intentionally **ignored** for the initial theme.
- **Restraint over density.** Generous whitespace, one accent hue family, sharp hierarchy.
- **Motion is ambient, not attention-seeking** — slow drifts and one-time draws, never bounce
  or spin-for-fun.
- **Avoid the AI-slop look:** no purple-gradient-on-white hero blobs as the whole idea, no
  glassmorphism everywhere, no stock iconography. Decoration must *mean* something (the hero
  waveform is a signal trace because he builds signal models).

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

Only three deliberate exceptions to the token set exist — don't add a fourth:

- **Green** (`#22c55e` / `#15803d`) as a *liveness* signal only: the hero status dot and the
  `.detail__status--live` pill on project pages.
- **Fixed white/black overlays** in `.cover__tag`, which sits on top of arbitrary cover art
  and therefore can't follow the theme.
- **`#000` inside `mask-image` gradients**, where the colour is a mask stencil, not a paint.

### Type

- `--font-sans`: **Geist** (Google Fonts) → system fallback. Headings `font-weight: 650`,
  tight tracking (`-0.02em`; hero name `-0.038em`).
- `--font-mono`: **Geist Mono**. Mono is a *semantic* signal, not decoration — it marks
  metadata and machine-ish text: eyebrows, tags, filter pills, venues, years, the nav brand,
  the hero status pill / `build:` readout / stat values.
- Body copy sits at `--muted` with `line-height: 1.6–1.7` and a `max-width` (~34–68ch).

### Geometry & effects

`--radius` `.85rem` · `--radius-sm` `.55rem` · `--radius-lg` `1.15rem` · `--radius-pill` ·
`--maxw` `72rem`. Three shadow tiers (`--shadow-sm/md/lg`) — cards rest at `sm` and lift to
`lg` on hover. Focus is always `2px solid var(--brand)` with offset.

---

## 4. Layout & rhythm

- `.container` — `max-width: var(--maxw)`, responsive inline padding.
- `.section` — `padding-block: clamp(3.5rem, 7vw, 6.5rem)`.
- `.section--alt` — tinted `--bg-alt` band with top/bottom borders. **Alternates** down the
  page for rhythm: About, Skills, and Awards are banded; Projects, Activity, Writing, and
  Contact are not. Preserve the alternation when adding a section.
- `.section__head` — `.eyebrow` (mono, uppercase, brand) + `.section-title` + optional
  `.section-desc`. Every section uses this; don't invent a new heading pattern.
- Grids: `.grid-2` / `.grid-3` (1 col → 2 at 640px → 3 at 1024px). Breakpoints in use are
  **640 / 768 / 900 / 1024** — reuse these rather than adding new ones.

**Section order:** Hero → Projects → About → Activity → Skills → Writing → Awards → Contact →
Footer.

> **Naming gotcha:** two partials don't match their section names —
> `partials/RESEARCH.*` renders the **Activity** section (`#activity`), and
> `partials/PUBLICATIONS.*` renders the **Writing** section (`#writing`). The `KEYS` list in
> `assemble.py` is the source of truth for build order.

---

## 5. Component primitives

Defined once in `foundation.css`; section partials should compose these, not re-style them.

- `.btn` + `--primary` (solid brand, lifts on hover) / `--outline` / `--ghost`.
- `.card` — surface + border + `shadow-sm`; hover lifts `-4px`, borders brand-tinted, shadow
  to `lg`. Used by projects, skills, awards, contact, activity.
- `.cover` — 16:9 media slot at the top of a card, accepting `<img>` **or** `<video>`, with a
  brand→violet gradient as the empty state and a `1.045` scale on card hover. Optional
  `.cover__tag` pill.
- `.tag` (mono chips) · `.filter` (pressable pills, `aria-pressed`) · `.icon-well` ·
  `.icon-link` · `.detail-*` primitives for the standalone pages in `pages/`.
- `.reveal` — fade + 14px rise, triggered by `IntersectionObserver`; stagger via
  `data-reveal-delay="<ms>"`.

**Per-section class naming** is BEM-ish with a section prefix: `.hero__`, `.proj-card__`,
`.about__`, `.activity-card__`, `.skills__`, `.pub__`, `.award__`, `.contact__`, `.footer__`,
`.nav__`. Keep new classes inside their section's prefix.

---

## 6. The hero — "live signal panel"

The hero is the site's signature and the one place with real visual investment. It layers a
static editorial column against a slow, living backdrop.

**Backdrop (`.hero__bg`, three layers, all `pointer-events: none`):**

1. `.hero__grid` — faint engineering graph paper, radially masked so it's strongest at the
   top-right and gone behind the copy.
2. `.hero__aurora` — two heavily blurred brand/violet blobs drifting on 19s / 24s alternating
   loops. This is the atmosphere; it should never be crisp enough to notice as a shape.
3. `.hero__signal` — a calm anomaly-trace line that self-draws once on load, with two pulsing
   data points. It is **deliberately low-amplitude and diagonally masked**
   (`linear-gradient(to top left, …)`) so it fades to nothing under the left text column and
   only reads along the bottom-right. *An earlier version had a tall spike that collided with
   the stat strip — do not reintroduce vertical spikes here.*

**Foreground:**

- `.hero__status` — mono pill with a pulsing green dot ("Open to research & collaboration").
- `.hero__name` — the largest type on the site.
- `.hero__rotator` — a mono `build:` readout that types/deletes through real project domains
  with a blinking caret. Content lives in the `data-rotate` JSON attribute in the markup;
  the driver is in `js/main.js`. Keep the entries **true to actual projects**.
- `.hero__headline` with `.hero__mark` — a hand-drawn violet marker underline that draws
  itself under "real users" (SVG path with `pathLength="1"`).
- `.hero__stats` — a three-item credential strip (USACO / SENTRY / ywc.kr) with gradient
  ticks. Facts only.
- Photo: `.hero__photo-ring` is a conic gradient animated via an `@property --ring-angle`
  registered custom property; `.hero__photo-chip` is a floating "Now building …" chip.

Entrance is a **staggered reveal** (`data-reveal-delay` 0 → 420ms) so the hero assembles
top-down on load.

---

## 7. Navbar

Fixed, blurred, and translucent over `--bg`. Three behaviours, all in `js/main.js`:

- **Condense on scroll** — past 24px it gains `.is-scrolled`: more opaque, border swapped for
  `--shadow-md`, height `3.75rem → 3.35rem`.
- **`.nav__progress`** — a brand→violet scroll-progress meter on the bottom edge, driven by
  the `--nav-progress` custom property and revealed only once scrolled.
- **`.nav__indicator`** — a sliding "magic line" that follows the scroll-spy's active link and
  retargets to whichever link is hovered, snapping back on mouse-leave. Positioned by
  `--ind-x` / `--ind-w`, measured from `getBoundingClientRect()`.

Mobile (<768px) swaps the link row for a toggle + stacked panel; the indicator is desktop-only.

---

## 8. Motion contract

Ambient loops (aurora, status/chip pulses, ring spin, caret) run indefinitely but slowly.
One-shot draws (signal trace, marker underline) fire once on load. Transitions sit at
**0.16–0.32s** with `ease` or `cubic-bezier(0.5, 0, 0.1, 1)`.

**`prefers-reduced-motion: reduce` is a hard requirement.** `foundation.css` clamps all
animation/transition durations and neutralises `.reveal`; `HERO.css` additionally disables
every hero loop and forces the self-drawing paths to their finished state
(`stroke-dashoffset: 0`), and the nav indicator drops its slide transition. **Any new
animation must be added to a reduced-motion guard.**

Everything is also driven by CSS custom properties + `IntersectionObserver` only — no
animation libraries, and no runtime dependencies at all.

---

## 9. Guardrails

- Edit `partials/*` or `css/foundation.css`, then run `python3 assemble.py`. **Never hand-edit
  `index.html` or `css/styles.css`** — they are build outputs and will be overwritten.
- Commit the regenerated outputs together with the sources (GitHub Pages serves them directly).
- Check **both themes and mobile** for any visual change; dark is not an afterthought here.
- Content must stay truthful — no invented awards, metrics, or affiliations.
- Keep decoration behind the copy legible: background layers must never reduce text contrast
  or collide with UI (see the hero signal note in §6).
