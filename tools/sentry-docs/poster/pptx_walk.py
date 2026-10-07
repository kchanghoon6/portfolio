import re
HANGUL = re.compile(r"[가-힣]")

def frames(shapes, path=""):
    for k, sh in enumerate(shapes):
        p = f"{path}/{k}"
        if sh.shape_type == 6:
            yield from frames(sh.shapes, p)
            continue
        if sh.has_text_frame:
            yield p, sh, sh.text_frame, None
        if getattr(sh, "has_table", False) and sh.has_table:
            for r, row in enumerate(sh.table.rows):
                for c, cell in enumerate(row.cells):
                    yield f"{p}/t{r}.{c}", sh, cell.text_frame, (sh.table, r, c, cell)

def paragraphs(prs):
    for s, slide in enumerate(prs.slides):
        for path, sh, tf, cell in frames(slide.shapes):
            for i, para in enumerate(tf.paragraphs):
                text = "".join(r.text for r in para.runs)
                if HANGUL.search(text):
                    yield f"s{s+1}{path}/p{i}", para, text, sh, tf, cell
