"""Extract translatable text units from the KCF PDFs.

A unit is a paragraph, a table cell, a caption, or a diagram label: a run of
consecutive lines that share a left edge, a style, and a normal line pitch.
Each unit keeps its rectangle and style so render.py can put English text
back in exactly the same place.
"""
import fitz, json, re, sys
from pathlib import Path

HANGUL = re.compile(r"[가-힣]")
BULLET = re.compile(r"^\s*(\d+[\).]|[①-⑳]|[-•·▪■□○●※*]|\[|<|\(\d+\)|[가-하]\.)")
SRC = Path("/Users/changhoon/Desktop/CSIA_2nd/KCF/최종제출자료")
DOCS = {
    "r1": ("1차 서면심사/[서식2] 작품설명서_SENTRY.pdf", range(0, 16)),
    "r2": ("2차 예선심사/[서식2] 작품설명서_SENTRY.pdf", range(0, 16)),
    "r3": ("3차 본선심사/[서식2] 작품설명서_SENTRY.pdf", range(0, 16)),
    "s1": ("1차 서면심사/[서식1] 작품요약서_SENTRY.pdf", range(0, 1)),
    "s2": ("2차 예선심사/[서식1] 작품요약서_SENTRY.pdf", range(0, 1)),
    "s3": ("3차 본선심사/[서식1] 작품요약서_SENTRY.pdf", range(0, 1)),
    "poster": ("3차 본선심사/작품포스터_SENTRY.pdf", range(0, 2)),
    "slides": ("2차 예선심사/발표자료_SENTRY.pdf", range(0, 12)),
}


def is_bold(font):
    return bool(re.search(r"Bold|Black|Heavy|ExtraBold|SemiBold|-B$|B$", font))


def lines_of(page):
    out = []
    for b in page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)["blocks"]:
        if b["type"] != 0:
            continue
        for l in b["lines"]:
            spans = [s for s in l["spans"] if s["text"].strip()]
            if not spans:
                continue
            if abs(l["dir"][1]) > 0.1:          # rotated text (axis labels): leave as is
                continue
            text = "".join(s["text"] for s in l["spans"]).strip()
            main = max(spans, key=lambda s: len(s["text"].strip()))
            out.append(dict(
                text=text, bbox=list(fitz.Rect(l["bbox"])),
                size=round(main["size"], 2), font=main["font"].split("+")[-1],
                bold=is_bold(main["font"]), color=main["color"],
                spans=[dict(t=s["text"], bbox=list(fitz.Rect(s["bbox"])), color=s["color"],
                            size=round(s["size"], 2), font=s["font"].split("+")[-1]) for s in spans],
            ))
    return out


def group(lines):
    """Merge consecutive lines into units (paragraphs / cells)."""
    units = []
    for ln in lines:
        r = fitz.Rect(ln["bbox"])
        u = units[-1] if units else None
        if u:
            ur = fitz.Rect(u["bbox"])
            last = fitz.Rect(u["lines"][-1]["bbox"])
            same_style = abs(u["size"] - ln["size"]) < 0.6 and u["bold"] == ln["bold"]
            pitch = r.y0 - last.y0
            same_col = abs(r.x0 - fitz.Rect(u["lines"][0]["bbox"]).x0) < 4 or abs(r.x0 - last.x0) < 4
            overlap_x = min(r.x1, ur.x1) - max(r.x0, ur.x0) > 0.3 * min(r.width, ur.width)
            normal_gap = 0 < pitch < ln["size"] * 2.25
            prev_text = u["lines"][-1]["text"]
            col_w = max(ur.width, r.width)
            prev_short = last.width < 0.82 * col_w and re.search(r"[.다요음함됨임!?)\]]\s*$", prev_text)
            starts_new = bool(BULLET.match(ln["text"]))
            if same_style and same_col and overlap_x and normal_gap and not prev_short and not starts_new:
                u["lines"].append(ln)
                u["bbox"] = list(ur | r)
                continue
        units.append(dict(size=ln["size"], bold=ln["bold"], color=ln["color"], font=ln["font"],
                          bbox=ln["bbox"], lines=[ln]))
    for u in units:
        u["ko"] = " ".join(l["text"] for l in u["lines"]).strip()
        u["n_lines"] = len(u["lines"])
    return [u for u in units if HANGUL.search(u["ko"])]


def main(out_dir):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    allu = {}
    for key, (rel, pages) in DOCS.items():
        doc = fitz.open(SRC / rel)
        items = []
        for p in pages:
            for i, u in enumerate(group(lines_of(doc[p]))):
                u["id"] = f"{key}-p{p+1:02d}-{i:03d}"
                u["page"] = p
                items.append(u)
        allu[key] = items
        print(key, len(items), "units")
    json.dump(allu, open(out_dir / "units.json", "w"), ensure_ascii=False, indent=1)
    uniq = sorted({u["ko"] for v in allu.values() for u in v})
    print("unique strings:", len(uniq), " total chars:", sum(len(s) for s in uniq))


if __name__ == "__main__":
    main(sys.argv[1])
