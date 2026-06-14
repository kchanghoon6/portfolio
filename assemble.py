# -*- coding: utf-8 -*-
"""Stitch section partials into the final index.html and css/styles.css.

Reads:
  index.template.html        (has <!-- @@KEY@@ --> markers)
  css/foundation.css         (design system; appended first)
  partials/<KEY>.html        (section markup; replaces its marker)
  partials/<KEY>.css         (section CSS; appended after foundation, in order)

Writes:
  index.html
  css/styles.css
"""
import os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
KEYS = ["NAV", "HERO", "PROJECTS", "ABOUT", "RESEARCH", "SKILLS",
        "PUBLICATIONS", "AWARDS", "CONTACT", "FOOTER"]

def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()

# --- HTML -----------------------------------------------------------------
html = read(os.path.join(ROOT, "index.template.html"))
missing = []
for key in KEYS:
    frag_path = os.path.join(ROOT, "partials", key + ".html")
    marker = "<!-- @@%s@@ -->" % key
    if os.path.exists(frag_path) and os.path.getsize(frag_path) > 0:
        frag = read(frag_path).strip()
    else:
        frag = "<!-- MISSING SECTION: %s -->" % key
        missing.append(key)
    if marker not in html:
        print("WARN: marker not found:", marker)
    html = html.replace(marker, frag)

with open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8") as f:
    f.write(html)

# --- CSS ------------------------------------------------------------------
css = [read(os.path.join(ROOT, "css", "foundation.css")).rstrip(), ""]
for key in KEYS:
    cpath = os.path.join(ROOT, "partials", key + ".css")
    if os.path.exists(cpath) and os.path.getsize(cpath) > 0:
        body = read(cpath).strip()
        if body:
            css.append("/* ---- %s ---- */" % key)
            css.append(body)
            css.append("")

with open(os.path.join(ROOT, "css", "styles.css"), "w", encoding="utf-8") as f:
    f.write("\n".join(css) + "\n")

print("Assembled index.html (%d bytes) and css/styles.css (%d bytes)." % (
    os.path.getsize(os.path.join(ROOT, "index.html")),
    os.path.getsize(os.path.join(ROOT, "css", "styles.css")),
))
if missing:
    print("MISSING partials:", ", ".join(missing))
    sys.exit(2)
print("OK")
