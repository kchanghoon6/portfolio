"""Write English text back into the original KCF PDFs, in place.

Only text is replaced. Images and vector art (tables, charts, flowcharts,
section bars) stay exactly as submitted. Pages outside the translated range
(e.g. the source-code appendix) are copied unchanged.
"""
import fitz, json, re, html, sys
from pathlib import Path

from extract import DOCS, SRC, HANGUL

FONT_DIR = "/Users/changhoon/Library/Fonts"
ARCH = fitz.Archive(FONT_DIR)
BASE_CSS = """
@font-face { font-family: ng; src: url(NanumGothic-Regular.ttf); }
@font-face { font-family: ng; font-weight: bold; src: url(NanumGothic-Bold.ttf); }
body, p { font-family: ng; margin: 0; padding: 0; }
"""
REDACT_NAMES = {"최승": "[name withheld]", "윤재성": "[name withheld]"}
EN_SCALE = 0.95
SHRUNK, BODY = [], []
CUTS = json.load(open(Path(__file__).with_name("cuts.json"))) if Path(__file__).with_name("cuts.json").exists() else {}          # NanumGothic Latin reads larger than its Hangul at equal pt


def hexcol(c):
    return "#%06x" % c


def obstacles(page, units_here, me):
    """Rects the English text must not run into (other text, images, rules)."""
    obs = []
    for u in units_here:
        if u is not me:
            obs.append(fitz.Rect(u["bbox"]))
    for b in page.get_text("dict")["blocks"]:
        if b["type"] == 0:
            for l in b["lines"]:
                t = "".join(s["text"] for s in l["spans"]).strip()
                if t and not HANGUL.search(t):
                    obs.append(fitz.Rect(l["bbox"]))
        else:
            obs.append(fitz.Rect(b["bbox"]))
    for d in page.get_drawings():
        r = d["rect"]
        if (r.height < 2.2 and r.width > 6) or (r.width < 2.2 and r.height > 6):   # rules / borders
            obs.append(r)
    return obs


def rules_of(page):
    return [d["rect"] for d in page.get_drawings()
            if d["rect"].height < 2.2 and d["rect"].width > 6]


def vrules_of(page):
    out = []
    for d in page.get_drawings():
        q = d["rect"]
        if q.width < 2.2 and q.height > 6:
            out.append(q)
        elif d.get("type") in ("s", "fs") and q.width > 6 and q.height > 6 and d.get("items") and len(d["items"]) == 1 and d["items"][0][0] == "re":
            out += [fitz.Rect(q.x0, q.y0, q.x0, q.y1), fitz.Rect(q.x1, q.y0, q.x1, q.y1)]   # stroked cell rect
    return out


def non_hangul_lines(page):
    out = []
    for b in page.get_text("dict")["blocks"]:
        if b["type"] != 0:
            continue
        for l in b["lines"]:
            t = "".join(s["text"] for s in l["spans"]).strip()
            if t and not HANGUL.search(t):
                out.append(dict(text=t, bbox=list(fitz.Rect(l["bbox"]))))
    return out


def table_cell(r, hrules, vrules):
    """The (x0, y0, x1, y1) of the table cell containing rect r, or None."""
    vov = lambda q: min(q.y1, r.y1) - max(q.y0, r.y0) > 0.5 * r.height
    left = [q.x1 for q in vrules if q.x1 <= r.x0 + 4 and vov(q)]
    right = [q.x0 for q in vrules if q.x0 >= r.x1 - 4 and vov(q)]
    if not left or not right:
        return None
    x0, x1 = max(left), min(right)
    hov = lambda q: q.x0 <= x0 + 3 and q.x1 >= x1 - 3
    top = [q.y1 for q in hrules if q.y1 <= r.y0 + 1 and hov(q)]
    bot = [q.y0 for q in hrules if q.y0 >= r.y1 - 1 and hov(q)]
    if not top or not bot:
        return None
    return (round(x0, 1), round(max(top), 1), round(x1, 1), round(min(bot), 1))


def cell_box(me, rules, size):
    """If the unit sits between two horizontal table rules, return that cell's vertical span."""
    r = fitz.Rect(me["bbox"])
    ov = lambda q: min(q.x1, r.x1) - max(q.x0, r.x0) > 0.5 * min(r.width, q.width)
    above = [q.y1 for q in rules if q.y1 <= r.y0 + 1 and r.y0 - q.y1 < 2.2 * size and ov(q)]
    below = [q.y0 for q in rules if q.y0 >= r.y1 - 1 and q.y0 - r.y1 < 2.2 * size and ov(q)]
    if above and below:
        return max(above) + 0.8, min(below) - 0.8
    return None


def free_box(page, me, obs, align, grow_x):
    r = fitz.Rect(me["bbox"])
    pr = page.rect
    # how far down can we grow?
    below = [o.y0 for o in obs if o.y0 >= r.y1 - 1 and min(o.x1, r.x1) - max(o.x0, r.x0) > 1]
    y1 = min(below + [pr.y1 - 20]) - 0.8
    y1 = max(y1, r.y1 + 0.5)
    x0, x1 = r.x0, r.x1
    if grow_x:
        band = [o for o in obs if min(o.y1, r.y1) - max(o.y0, r.y0) > 0.5]
        right = [o.x0 for o in band if o.x0 >= r.x1 - 0.5] + [pr.x1 - 18]
        left = [o.x1 for o in band if o.x1 <= r.x0 + 0.5] + [pr.x0 + 18]
        if align == "left":
            x1 = max(x1, min(right) - 2)
        else:
            room = min(min(right) - r.x1, r.x0 - max(left)) - 2
            room = max(room, 0)
            x0, x1 = r.x0 - room, r.x1 + room
    return fitz.Rect(x0, r.y0 - 0.8, x1, y1)


def style_for(u, size_en, align, lh, underline=False):
    weight = "bold" if u["bold"] else "normal"
    deco = "text-decoration: underline;" if underline else ""
    return (f'font-size:{size_en:.2f}px; line-height:{lh:.2f}; font-weight:{weight}; '
            f'color:{hexcol(u["color"])}; text-align:{align}; {deco}')


def html_for(u, en, size_en, align, lh, underline=False):
    body = en[5:] if en.startswith("html:") else html.escape(en)
    return f'<p style="{style_for(u, size_en, align, lh, underline)}">{body}</p>'


def measure(rect, h):
    tmp = fitz.open()
    pg = tmp.new_page(width=rect.x1 + 50, height=rect.y1 + 50)
    spare, scale = pg.insert_htmlbox(rect, h, css=BASE_CSS, archive=ARCH, scale_low=0.3)
    return scale


def underline_rects(page, u):
    if u["n_lines"] != 1:
        return []
    r = fitz.Rect(u["bbox"])
    hits = []
    for d in page.get_drawings():
        q = d["rect"]
        if (q.height < 2.2 and r.y1 - 2 <= q.y0 <= r.y1 + 4 and abs(q.x0 - r.x0) < 3
                and 0.5 * r.width < q.width < 1.15 * r.width + 2):
            hits.append(q)
    return hits


def partial_spans(u):
    """Section bars like '1  주제': a white number box + a Hangul label. Replace the label only."""
    spans = [s for l in u["lines"] for s in l["spans"]]
    if len(spans) > 1 and any(s["color"] == 0xFFFFFF for s in spans) and any(s["color"] != 0xFFFFFF for s in spans):
        return [s for s in spans if s["color"] != 0xFFFFFF and s["t"].strip()]
    return None


def translate_doc(key, tm, out_path, mask_names=True):
    rel, pages = DOCS[key]
    doc = fitz.open(SRC / rel)
    units = json.load(open(Path(__file__).with_name("units.json")))[key]
    # merge groups: fragments split by inline math are re-set as one paragraph
    groups = json.load(open(Path(__file__).with_name("groups.json"))).get(key, [])
    byid = {u["id"]: u for u in units}
    merged = []
    for g in groups:
        us = [byid[i] for i in g]
        r = fitz.Rect()
        for u in us:
            r |= fitz.Rect(u["bbox"])
        head = dict(us[0], bbox=list(r), n_lines=max(2, sum(u["n_lines"] for u in us)),
                    lines=[l for u in us for l in u["lines"]], merged_rect=list(r))
        first = tm.get(us[0]["id"]) or tm.get(us[0]["ko"]) or ""
        if not first.startswith("html:"):          # plain fragments: join their translations
            parts = [tm.get(u["id"]) or tm.get(u["ko"]) for u in us]
            if all(parts):
                head["joined_en"] = " ".join(x.strip() for x in parts)
        merged.append((set(g), head))
    drop = set().union(*[m[0] for m in merged]) if merged else set()
    units = [u for u in units if u["id"] not in drop] + [m[1] for m in merged]
    missing = []
    for p in pages:
        page = doc[p]
        here = [u for u in units if u["page"] == p]
        if not here:
            continue
        vr = vrules_of(page)
        split_here = []
        for u in here:
            if (u["id"] + "#1") in tm and u["n_lines"] == 1:
                lr = fitz.Rect(u["bbox"])
                cut = CUTS.get(u["id"]) or sorted({q.x0 for q in vr if lr.x0 + 5 < q.x0 < lr.x1 - 5
                                                   and min(q.y1, lr.y1) - max(q.y0, lr.y0) > 0.5 * lr.height})
                if cut:
                    edges = [lr.x0] + list(cut) + [lr.x1]
                    for k in range(len(edges) - 1):
                        r2 = fitz.Rect(edges[k] + (1 if k else 0), lr.y0, edges[k + 1] - (1 if k < len(edges) - 2 else 0), lr.y1)
                        line = dict(u["lines"][0], bbox=list(r2))
                        split_here.append(dict(u, id=f'{u["id"]}#{k + 1}', bbox=list(r2), lines=[line]))
                    continue
            split_here.append(u)
        here = split_here
        lm = min(fitz.Rect(u["bbox"]).x0 for u in here)
        sizes = {}
        for u in here:
            sizes[u["size"]] = sizes.get(u["size"], 0) + len(u["ko"])
        body_size = max(sizes, key=sizes.get)
        plans, ul_rects = [], []
        for u in here:
            en = u.get("joined_en") or (tm.get(u["id"]) if "#" in u["id"] else (tm.get(u["id"]) or tm.get(u["ko"])))
            if en is None:
                missing.append(u["id"])
                continue
            for k, v in REDACT_NAMES.items():
                en = en.replace(k, v)
            r = fitz.Rect(u["bbox"])
            part = partial_spans(u)
            align = "left" if (u["n_lines"] > 1 or abs(r.x0 - lm) < 4 or part) else "center"
            uls = underline_rects(page, u)
            ul_rects += uls
            plans.append(dict(u=u, en=en, align=align, part=part, underline=bool(uls)))
        hrules, vrules = rules_of(page), vrules_of(page)
        img_rects = [fitz.Rect(b["bbox"]) for b in page.get_text("dict")["blocks"] if b["type"] == 1]
        cells = {}
        for pl in plans:
            if pl["part"] or pl["u"].get("merged_rect"):
                continue
            c = table_cell(fitz.Rect(pl["u"]["bbox"]), hrules, vrules)
            if c and any(fitz.Rect(c).intersects(im) for im in img_rects):
                c = None                      # a figure inside a layout table: keep caption where it was
            if c and (c[3] - c[1]) < 260:
                pl["tcell"] = c
                cells.setdefault(c, []).append(pl)
        drop_ids = set()
        for c, group in cells.items():
            head = group[0]
            lines = [l for g in group for l in g["u"]["lines"]]
            xs0 = [l["bbox"][0] for l in lines]
            cx = [(l["bbox"][0] + l["bbox"][2]) / 2 for l in lines]
            centred = len(lines) == 1 and head["align"] == "center" or (max(xs0) - min(xs0) > 3 and max(cx) - min(cx) < 4)
            parts = [g["en"][5:] if g["en"].startswith("html:") else html.escape(g["en"]) for g in group]
            # symbol-only lines in the same cell, e.g. "(T·H)", move with the text
            cr = fitz.Rect(c)
            extra = []
            for ln in non_hangul_lines(page):
                lr = fitz.Rect(ln["bbox"])
                if cr.contains(lr) and not any(lr.intersects(fitz.Rect(l["bbox"])) for g in group for l in g["u"]["lines"]):
                    extra.append((lr.y0, html.escape(ln["text"]), ln))
            joined = parts[0]
            for prev_part, part in zip(parts, parts[1:]):
                sep = "<br/>" if re.search(r"[.!?:;]\s*$", prev_part) else ("" if prev_part.rstrip().endswith("-") else " ")
                joined = joined.rstrip() + sep + part if sep != " " else joined + sep + part
            for _, t, _ in sorted(extra, key=lambda e: e[0]):
                joined += "<br/>" + t
            head["en"] = "html:" + joined
            head["extra_redact"] = [fitz.Rect(e[2]["bbox"]) for e in extra]
            r = fitz.Rect()
            for g in group:
                r |= fitz.Rect(g["u"]["bbox"])
            head["u"] = dict(head["u"], bbox=list(r), lines=lines, n_lines=max(2, len(lines)))
            head["align"] = "center" if centred else "left"
            head["underline"] = any(g["underline"] for g in group)
            for g in group[1:]:
                drop_ids.add(id(g))
        plans = [pl for pl in plans if id(pl) not in drop_ids]
        merged_plans = []
        for pl in plans:
            prev = merged_plans[-1] if merged_plans else None
            u = pl["u"]
            if prev and not prev.get("tcell") and not pl.get("tcell") and not prev["part"] and not pl["part"] and prev["align"] == "center" and pl["align"] == "center":
                a, b = fitz.Rect(prev["u"]["bbox"]), fitz.Rect(u["bbox"])
                pu = prev["u"]
                if (abs((a.x0 + a.x1) / 2 - (b.x0 + b.x1) / 2) < 4 and abs(pu["size"] - u["size"]) < 0.6
                        and pu["bold"] == u["bold"] and 0 < b.y0 - fitz.Rect(pu["lines"][-1]["bbox"]).y0 < 2.25 * u["size"]):
                    prev["u"] = dict(pu, bbox=list(a | b), lines=pu["lines"] + u["lines"],
                                     n_lines=pu["n_lines"] + u["n_lines"], id=pu["id"])
                    prev["en"] = prev["en"].rstrip() + ("" if prev["en"].rstrip().endswith("-") else " ") + pl["en"].lstrip()
                    prev["underline"] = prev["underline"] or pl["underline"]
                    continue
            merged_plans.append(pl)
        plans = merged_plans
        rules = rules_of(page)
        # phase 1: remove underlines that will be redrawn at the new text length
        for q in ul_rects:
            page.add_redact_annot(q + (-0.5, -0.5, 0.5, 0.5), fill=False)
        if ul_rects:
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE,
                                  graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_TOUCHED,
                                  text=fitz.PDF_REDACT_TEXT_NONE)
        # merged math paragraphs: radical bars / fraction rules inside them go too
        mr = [fitz.Rect(pl["u"]["merged_rect"]) for pl in plans if pl["u"].get("merged_rect")]
        for q in mr:
            page.add_redact_annot(q + (-1, -2, 1, 2), fill=False)
        if mr:
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE,
                                  graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED,
                                  text=fitz.PDF_REDACT_TEXT_NONE)
        # geometry before the text is removed
        for pl in plans:
            u = pl["u"]
            obs = obstacles(page, here, u)
            if pl["part"]:
                s0 = fitz.Rect(pl["part"][0]["bbox"])
                pl["box"] = fitz.Rect(s0.x0, s0.y0 - 0.8, s0.x0 + 220, s0.y1 + 3)
                pl["redact"] = [fitz.Rect(s["bbox"]) for s in pl["part"]]
            else:
                pl["box"] = free_box(page, u, obs, pl["align"], grow_x=(u["n_lines"] == 1 or pl["align"] == "center"))
                pl["cell"] = None
                if pl.get("tcell"):
                    x0, y0, x1, y1 = pl["tcell"]
                    pl["cell"] = (y0 + 1, y1 - 1)
                    pl["box"] = fitz.Rect(x0 + 2.5, y0 + 1, x1 - 2.5, y1 - 1)
                    pl["lh"] = 1.18
                elif pl["align"] == "center":
                    cb = cell_box(u, rules, u["size"])
                    if cb:
                        pl["cell"] = cb
                        pl["box"] = fitz.Rect(pl["box"].x0, cb[0], pl["box"].x1, cb[1])
                pl["redact"] = [fitz.Rect(l["bbox"]) for l in u["lines"]]
                if u.get("merged_rect"):            # also clears the inline math between fragments
                    pl["redact"] = [fitz.Rect(u["merged_rect"])]
            n = u["n_lines"]
            if n > 1:
                ys = [l["bbox"][1] for l in u["lines"]]
                pitch = (ys[-1] - ys[0]) / (n - 1)
                pl["lh"] = min(max(pitch / (u["size"] * EN_SCALE) * 0.72, 1.25), 1.42)
            else:
                pl["lh"] = 1.18
            if pl["align"] == "center" and not pl.get("tcell"):
                pl["lh"] = 1.15
            pl["is_body"] = n > 1 and abs(u["size"] - body_size) < 0.6 and not u["bold"] and not pl.get("tcell")
        # page-uniform scale for body paragraphs
        body_scales = [measure(pl["box"], html_for(pl["u"], pl["en"], pl["u"]["size"] * EN_SCALE, pl["align"], pl["lh"]))
                       for pl in plans if pl["is_body"]]
        page_scale = max(min(body_scales + [1.0]), 0.7)
        # phase 2: remove the Korean text (images + vector art kept)
        for pl in plans:
            for q in pl["redact"] + pl.get("extra_redact", []):
                page.add_redact_annot(q + (0, 0.6, 0, -0.6), fill=False)
        for name in (REDACT_NAMES if mask_names else {}):
            for q in page.search_for(name):
                page.add_redact_annot(q, fill=False)
        page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_NONE)
        for pl in plans:
            u = pl["u"]
            size = u["size"] * EN_SCALE * (page_scale if pl["is_body"] else 1.0)
            h = html_for(u, pl["en"], size, pl["align"], pl["lh"], pl["underline"])
            box = pl["box"]
            if pl.get("cell"):                      # centre vertically inside the table cell
                tmp = fitz.open(); tp = tmp.new_page(width=page.rect.width, height=page.rect.height)
                sp, _ = tp.insert_htmlbox(box, h, css=BASE_CSS, archive=ARCH, scale_low=0.45)
                if sp > 0:
                    box = fitz.Rect(box.x0, box.y0 + sp / 2, box.x1, box.y1)
            spare, sc = page.insert_htmlbox(box, h, css=BASE_CSS, archive=ARCH,
                                            scale_low=0.85 if pl["is_body"] else 0.45)
            if spare < 0:
                missing.append(u["id"] + " (overflow)")
            elif sc < 0.8 and not pl["is_body"]:
                SHRUNK.append((u["id"], round(sc, 2), pl["en"][:70]))
            if pl["is_body"]:
                BODY.append((p + 1, round(page_scale, 3)))
    doc.save(out_path, garbage=4, deflate=True)
    return missing


def mask_original(key, out_path):
    """The Korean original with only third-party names covered."""
    rel, pages = DOCS[key]
    doc = fitz.open(SRC / rel)
    for page in doc:
        hits = [q for n in REDACT_NAMES for q in page.search_for(n)]
        for q in hits:
            page.add_redact_annot(q + (-1, -1, 1, 1), fill=(0.86, 0.86, 0.88))
        if hits:
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_NONE)
    doc.save(out_path, garbage=4, deflate=True)
    return sum(len(page.search_for(n)) for page in doc for n in REDACT_NAMES)


if __name__ == "__main__":
    key, tm_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
    tm = {}
    for f in tm_path.split(","):
        tm.update(json.load(open(f)))
    miss = translate_doc(key, tm, out)
    print("missing/overflow:", len(miss), miss[:20])
    print("body scale by page:", sorted(set(BODY)))
    print("shrunk < 0.8:"); [print("  ", x) for x in SHRUNK]
