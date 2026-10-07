"""Replace Korean text in a pptx with English (text frames, table cells, chart labels),
shrinking type so each line still fits the box it had in the original."""
import json, math, re, sys, zipfile, shutil, os
from pptx import Presentation
from pptx.util import Pt, Emu
from pptx.enum.dml import MSO_FILL
from pptx.enum.text import PP_ALIGN
from pptx_walk import paragraphs, HANGUL

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
_HERE = os.path.dirname(os.path.abspath(__file__))
SCALE_OVERRIDES = json.load(open(os.path.join(_HERE, "scale_overrides.json")))

def width_units(s):
    w = 0.0
    for ch in s:
        if HANGUL.match(ch): w += 0.92
        elif ch in "il.,:;|!'·()[]": w += 0.3
        elif ch.isupper() or ch in "mwMW%": w += 0.7
        elif ch == " ": w += 0.28
        else: w += 0.55
    return w

def eff_size(para):
    for r in para.runs:
        if r.font.size: return r.font.size.pt
    el = para._p.find(A + "endParaRPr")
    if el is not None and el.get("sz"): return int(el.get("sz")) / 100
    ppr = para._p.find(A + "pPr")
    if ppr is not None:
        d = ppr.find(A + "defRPr")
        if d is not None and d.get("sz"): return int(d.get("sz")) / 100
    return 18.0

def box_width(shape, cell):
    if cell is not None:
        table, r, c, cl = cell
        w = Emu(table.columns[c].width).pt
        return w - Emu(cl.margin_left or 91440).pt - Emu(cl.margin_right or 91440).pt
    tf = shape.text_frame
    ins = Emu(tf.margin_left or 91440).pt + Emu(tf.margin_right or 91440).pt
    return Emu(shape.width).pt - ins

def apply(src, tm, out, chart_tm, overrides=None):
    overrides = overrides or {}
    prs = Presentation(src)
    report = []
    # first pass: decide per frame whether every Korean paragraph was a single line
    plans = []
    for pid, para, text, shape, tf, cell in list(paragraphs(prs)):
        en = overrides.get(pid) or tm.get(text)
        if en is None:
            report.append(("MISSING", pid, text)); continue
        size = eff_size(para)
        bw = box_width(shape, cell)
        ko_w, en_w = width_units(text) * size, width_units(en) * size
        single = "\n" not in text and (ko_w <= bw * 1.35 or len(text) <= 14)
        plans.append(dict(pid=pid, para=para, text=text, en=en, size=size, bw=bw, ko_w=ko_w, en_w=en_w,
                          single=single, tf=tf, cell=cell, shape=shape))
    for pl in plans:
        scale = 1.0
        sh = pl["shape"]
        filled = False
        try:
            filled = sh.fill.type == MSO_FILL.SOLID
        except Exception:
            pass
        nparas = len(pl["tf"].paragraphs)
        ko_lines = max(1, math.ceil(pl["ko_w"] / max(pl["bw"], 1) - 0.08))
        wraps = pl["tf"].word_wrap is not False
        if pl["tf"].word_wrap is None and pl["cell"] is None and ko_lines > 1:
            pl["tf"].word_wrap = True          # inherited "none" would push long text off the poster
            pl["fix_lines"] = ko_lines
        if pl["cell"] is not None or filled:
            # must stay inside its cell / coloured label: same number of lines as the original
            target = 0.92 * pl["bw"] * ko_lines
            if pl["en_w"] > target:
                scale = max(target / pl["en_w"], 0.4)
            if filled and ko_lines == 1:
                pl["tf"].word_wrap = False
        elif not wraps:
            # the original box does not wrap: keep it on one line, shrinking to the room it had
            allow = pl["bw"] * 1.1
            if pl["en_w"] > allow:
                scale = max(allow / pl["en_w"], 0.4)
        elif nparas == 1 and ko_lines == 1 and len(pl["text"].strip()) <= 16:
            # a free-standing label or heading: keep it on one line, let it use spare room
            allow = pl["bw"] * (1.75 if pl["size"] >= 50 else 1.2)
            if pl["en_w"] > allow:
                scale = max(allow / pl["en_w"], 0.45)
            pl["tf"].word_wrap = False
        elif nparas <= 2 and pl["shape"].has_text_frame and pl["cell"] is None and (
                pl["shape"].text_frame._txBody.find(A + "bodyPr").find(A + "spAutoFit") is not None):
            # box grows with its text in PowerPoint but our layout around it does not:
            # keep the original number of lines
            pl["pin_bottom"] = True
            target = 0.86 * pl["bw"] * ko_lines
            if pl["en_w"] > target:
                scale = max(target / pl["en_w"], 0.6)
        elif pl.get("fix_lines"):
            # was laid out by PowerPoint with hard wraps: keep that many lines exactly
            target = 0.93 * pl["bw"] * pl["fix_lines"]
            if pl["en_w"] > target:
                scale = max(target / pl["en_w"], 0.55)
        else:
            # wrapped text: keep the original line count when possible, never below 75%
            target = 0.93 * pl["bw"] * ko_lines
            if pl["en_w"] > target:
                scale = max(target / pl["en_w"], 0.72)
        pl["scale"] = scale
    groups = {}
    for pl in plans:
        if pl["cell"] is None and len(pl["tf"].paragraphs) > 1 and pl["tf"].word_wrap is not False:
            groups.setdefault(id(pl["tf"]), []).append(pl)
    for g in groups.values():
        # equalize body lines only (same original size); headings keep their own scale
        by_size = {}
        for x in g:
            by_size.setdefault(round(x["size"]), []).append(x)
        for xs in by_size.values():
            m = min(x["scale"] for x in xs)
            for x in xs:
                x["scale"] = m
    for pl in plans:
        scale = pl["scale"]
        if pl["text"] in SCALE_OVERRIDES:
            scale = SCALE_OVERRIDES[pl["text"]]
            if len(pl["text"]) <= 20:
                pl["tf"].word_wrap = False
        runs = pl["para"].runs
        runs[0].text = pl["en"]
        for r in runs[1:]:
            r._r.getparent().remove(r._r)
        if scale < 0.999:
            runs[0].font.size = Pt(round(pl["size"] * scale, 1))
        report.append(("ok", pl["pid"], round(scale, 2)))
    # an empty leading paragraph keeps its original (large) line height; shrink it with the text
    for pl in plans:
        tf = pl["tf"]
        paras = tf.paragraphs
        if len(paras) > 1 and not "".join(r.text for r in paras[0].runs).strip():
            sz = pl["para"].runs[0].font.size if pl["para"].runs else None
            if sz is not None:
                end = paras[0]._p.find(A + "endParaRPr")
                if end is None:
                    end = paras[0]._p.makeelement(A + "endParaRPr", {})
                    paras[0]._p.append(end)
                end.set("sz", str(int(sz.pt * 100)))
    # auto-grow text boxes whose text got shorter must keep their original *bottom* edge:
    # PowerPoint recomputes spAutoFit height from the top, which moves short text up into the
    # element above it. Pin the box so its last line sits where the original last line did.
    for pl in plans:
        bp = pl["tf"]._txBody.find(A + "bodyPr")
        sh = pl["shape"]
        if pl["cell"] is None and bp is not None and bp.find(A + "spAutoFit") is not None and pl.get("pin_bottom"):
            bp.remove(bp.find(A + "spAutoFit"))
            bp.set("anchor", "b")
    prs.save(out)
    # chart labels live in the chart parts' string caches
    tmp = out + ".tmp"
    with zipfile.ZipFile(out) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.startswith("ppt/charts/chart") and item.filename.endswith(".xml"):
                s = data.decode("utf-8")
                base = item.filename.rsplit("/", 1)[-1]
                def sub(m):
                    t = m.group(2)
                    return f"<{m.group(1)}>{chart_tm.get(base + '|' + t, chart_tm.get(t, t))}</{m.group(1)}>"
                s = re.sub(r"<(c:v|a:t)>([^<]*)</\1>", sub, s)
                data = s.encode("utf-8")
            zout.writestr(item, data)
    os.replace(tmp, out)
    return report

if __name__ == "__main__":
    src, tm_path, out = sys.argv[1:4]
    tm = json.load(open(tm_path)); ctm = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "chart_tm.json")))
    ov = json.load(open(sys.argv[4])) if len(sys.argv) > 4 else {}
    rep = apply(src, tm, out, ctm, ov)
    miss = [r for r in rep if r[0] == "MISSING"]
    shrunk = sorted([r for r in rep if r[0] == "ok" and r[2] < 0.6], key=lambda r: r[2])
    print("paragraphs:", len(rep), "missing:", len(miss), "shrunk<0.6:", len(shrunk))
    for r in shrunk[:12]: print("  ", r)
