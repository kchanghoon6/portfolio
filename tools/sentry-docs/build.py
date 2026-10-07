"""Rebuild everything the SENTRY page serves from the KCF submissions.

    python3 extract.py .          # text units from the Korean PDFs -> units.json
    python3 tmbuild.py            # tm_ids/*.json -> tm/all.json
    python3 build.py              # this file

Steps: translate the reports/summaries in place (render.py), translate the poster
from its .pptx and export it with PowerPoint, stamp a translation notice on every
English page, mask third-party names in the Korean forms, compress for the web,
then render the reader's page images and the poster panels into ../../docs/sentry.
"""
import os, shutil, subprocess, sys
from pathlib import Path

import fitz
from PIL import Image

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE)); sys.path.insert(0, str(HERE / "poster"))
from render import translate_doc, mask_original, REDACT_NAMES
from pptx_apply import apply as apply_pptx
import json

SRC = Path("/Users/changhoon/Desktop/CSIA_2nd/KCF/최종제출자료")
POSTER_PPTX = Path("/Users/changhoon/Desktop/CSIA_2nd/KCF/최종제출자료/작품포스터_SENTRY.pptx")
OUT = HERE.parent.parent / "docs" / "sentry"
WORK = HERE / ".build"
FONT = "/Users/changhoon/Library/Fonts/NanumGothic-Regular.ttf"
ROUND = {"r1": "Round 1 (written review), June 2026", "r2": "Round 2 (preliminary), July 2026",
         "r3": "Round 3 (finals), September 2026", "s1": "Round 1, June 2026",
         "s2": "Round 2, July 2026", "s3": "Round 3, September 2026",
         "poster": "Round 3 (finals), September 2026"}
BODY = {"r1": 16, "r2": 16, "r3": 16, "s1": 1, "s2": 1, "s3": 1, "poster": 2}
VIEW = {"r1": 16, "r2": 16, "r3": 16, "s1": 1, "s2": 1, "s3": 1, "poster": 2, "slides": 12}
NOTICE = ("English translation of the original Korean submission to the Korea Code Fair 2026, {r}. "
          "Layout, figures and tables are reproduced from the original; only the text is translated.")


def stamp(path, key):
    d = fitz.open(path)
    for i in range(min(BODY[key], len(d))):
        pg, r = d[i], d[i].rect
        if key == "poster":
            box, fs = fitz.Rect(r.x0 + 60, r.y1 - 34, r.x1 - 60, r.y1 - 8), 15
        else:
            box, fs = fitz.Rect(48, r.y1 - 26, r.x1 - 48, r.y1 - 6), 6.2
        rc = pg.insert_textbox(box, NOTICE.format(r=ROUND[key]), fontsize=fs, fontname="ng",
                               fontfile=FONT, color=(0.45, 0.45, 0.48), align=fitz.TEXT_ALIGN_CENTER)
        assert rc >= 0, (key, i)
    d.save(str(path) + ".s", garbage=4, deflate=True)
    os.replace(str(path) + ".s", path)


def compress(src, dst, poster=False):
    d = fitz.open(src); d.subset_fonts(); tmp = str(dst) + ".tmp.pdf"; d.save(tmp, garbage=4, deflate=True)
    res = "200" if poster else "150"
    subprocess.run(["gs", "-q", "-dNOPAUSE", "-dBATCH", "-dSAFER", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.6",
                    "-dPDFSETTINGS=/ebook", f"-dColorImageResolution={res}", f"-dGrayImageResolution={res}",
                    "-dDetectDuplicateImages=true", f"-sOutputFile={dst}", tmp], check=True)
    os.remove(tmp)


def pages(pdf, key, lang):
    d = fitz.open(pdf); out = OUT / "pages" / f"{key}-{lang}"; out.mkdir(parents=True, exist_ok=True)
    width = 1500 if key == "poster" else (1280 if key == "slides" else 1000)
    for i in range(min(VIEW[key], len(d))):
        pg = d[i]; z = width / pg.rect.width
        pix = pg.get_pixmap(matrix=fitz.Matrix(z, z), alpha=False)
        im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        im.save(out / f"{i + 1}.webp", "WEBP", quality=78, method=5)
        im.resize((150, round(150 * im.height / im.width)), Image.LANCZOS).save(out / f"t{i + 1}.webp", "WEBP", quality=60)


def panels(pdf, lang):
    # boxes measured on the poster rendered at 0.45x
    p1 = {"problem": (36, 236, 1036, 512), "method": (36, 520, 527, 1497), "flow": (551, 520, 1042, 952), "diff": (551, 960, 1042, 1497)}
    p2 = {"v1": (36, 13, 607, 428), "openlab": (608, 13, 1044, 428), "v2": (36, 433, 1044, 823), "v3": (36, 826, 682, 1499), "conclusion": (686, 830, 1044, 1499)}
    d = fitz.open(pdf); (OUT / "panels").mkdir(parents=True, exist_ok=True)
    for page, boxes in ((0, p1), (1, p2)):
        for name, b in boxes.items():
            r = fitz.Rect(*[v / 0.45 for v in b]); z = min(1400 / r.width, 1.2)
            pix = d[page].get_pixmap(matrix=fitz.Matrix(z, z), clip=r, alpha=False)
            Image.frombytes("RGB", (pix.width, pix.height), pix.samples).save(OUT / "panels" / f"{name}-{lang}.webp", "WEBP", quality=80, method=5)


def main():
    WORK.mkdir(exist_ok=True); OUT.mkdir(parents=True, exist_ok=True)
    tm = {}
    for f in ("tm/all.json", "tm/id_overrides.json"):
        tm.update(json.load(open(HERE / f)))
    for key in ("r1", "r2", "r3", "s1", "s2", "s3"):
        en = WORK / f"{key}-en.pdf"
        miss = translate_doc(key, tm, str(en))
        assert not miss, (key, miss)
        stamp(en, key)
    for key in ("s1", "s2", "s3", "slides"):
        mask_original(key, str(WORK / f"{key}-ko.pdf"))
    for key, rel in (("r1", "1차 서면심사"), ("r2", "2차 예선심사"), ("r3", "3차 본선심사")):
        shutil.copy(SRC / rel / "[서식2] 작품설명서_SENTRY.pdf", WORK / f"{key}-ko.pdf")
    shutil.copy(SRC / "3차 본선심사" / "작품포스터_SENTRY.pdf", WORK / "poster-ko.pdf")
    # poster: translate the .pptx, export with PowerPoint (layout identical to the submission)
    shutil.copy(POSTER_PPTX, WORK / "poster-ko.pptx")
    apply_pptx(str(WORK / "poster-ko.pptx"), json.load(open(HERE / "poster" / "poster_tm.json")), str(WORK / "poster-en.pptx"),
               json.load(open(HERE / "poster" / "chart_tm.json")))
    subprocess.run(["osascript", str(HERE / "poster" / "export.applescript"), str(WORK / "poster-en.pptx"), str(WORK / "poster-en.pdf")], check=True)
    stamp(WORK / "poster-en.pdf", "poster")

    for f in sorted(WORK.glob("*.pdf")):
        text = "".join(p.get_text() for p in fitz.open(f))
        assert not any(n in text for n in REDACT_NAMES), f"third-party name left in {f.name}"
        compress(f, OUT / f.name, poster=f.name.startswith("poster"))
        key, lang = f.stem.split("-")
        pages(f, key, lang)
        if key == "poster":
            panels(f, lang)
        print("built", f.name)


if __name__ == "__main__":
    main()
