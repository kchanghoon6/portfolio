import json, glob, os
from pathlib import Path
os.chdir(Path(__file__).parent)
units = {u["id"]: u for v in json.load(open(Path(__file__).with_name("units.json"))).values() for u in v}
tm = {}
for f in sorted(glob.glob("tm_ids/*.json")):
    for k, v in json.load(open(f)).items():
        if k not in units: raise SystemExit(f"unknown id {k} in {f}")
        tm[units[k]["ko"]] = v
json.dump(tm, open("tm/all.json", "w"), ensure_ascii=False, indent=0)
print("TM entries:", len(tm))
