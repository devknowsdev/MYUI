#!/usr/bin/env python3
import csv, json, sys, pathlib
from collections import OrderedDict, defaultdict

SECTION_ORDER = ["connect", "feel", "sound", "form", "instruments", "mix"]

def section_sort_key(value):
    try:
        return (SECTION_ORDER.index(value), value)
    except ValueError:
        return (999, value)

ROOT = pathlib.Path(__file__).resolve().parent.parent
csv_path = ROOT / "terms_master.csv"
out_path = ROOT / "terms_data.js"

rows = list(csv.DictReader(csv_path.open()))
required = [
    "code","category","section_key","section_label","flow_bucket","function_bucket",
    "palette_h","palette_s","shortcut","term"
]
for column in required:
    if column not in rows[0]:
        raise SystemExit(f"Missing required column: {column}")

rows = [{k: (v if v is not None else "") for k, v in row.items()} for row in rows]

master_rows = []
for idx, row in enumerate(rows):
    normalized = {
        "id": row.get("id") or f"{row.get('code','')}::{row.get('section_key','')}::{row.get('category','')}::{row.get('shortcut','')}::{row.get('term','').lower()}::{idx}",
        "code": row.get("code", ""),
        "category": row.get("category", ""),
        "section_key": row.get("section_key", ""),
        "section_label": row.get("section_label", ""),
        "flow_bucket": row.get("flow_bucket", ""),
        "function_bucket": row.get("function_bucket", ""),
        "palette_h": row.get("palette_h", "210"),
        "palette_s": row.get("palette_s", "18"),
        "shortcut": row.get("shortcut", ""),
        "term": row.get("term", ""),
        "base_shortcut": row.get("base_shortcut", ""),
        "suffix": row.get("suffix", ""),
        "notes": row.get("notes", ""),
        "order_code": row.get("order_code", "0"),
        "hidden": str(row.get("hidden", "")).strip().lower() in ("1", "true", "yes"),
        "deleted": str(row.get("deleted", "")).strip().lower() in ("1", "true", "yes")
    }
    master_rows.append(normalized)

seen_shortcuts = {}
for row in master_rows:
    if row["hidden"] or row["deleted"]:
        continue
    sc = row["shortcut"].strip()
    if not sc:
        continue
    if sc in seen_shortcuts:
        raise SystemExit(f"Duplicate active shortcut: {sc} ({seen_shortcuts[sc]} / {row['term']})")
    seen_shortcuts[sc] = row["term"]

cats = OrderedDict()
for row in master_rows:
    if row["hidden"] or row["deleted"]:
        continue
    code = row["code"] or f"{row['section_key']}::{row['category']}"
    cats.setdefault(code, {
        "code": row["code"],
        "label": row["category"],
        "display": row["category"],
        "sectionKey": row["section_key"],
        "sectionLabel": row["section_label"],
        "flowBucket": row["flow_bucket"],
        "functionBucket": row["function_bucket"],
        "palette": {
            "h": int(row["palette_h"] or 210),
            "s": int(row["palette_s"] or 18)
        },
        "terms": []
    })
    cats[code]["terms"].append({
        "s": row["shortcut"],
        "p": row["term"],
        "baseShortcut": row.get("base_shortcut", ""),
        "suffix": row.get("suffix", ""),
        "ord": len(cats[code]["terms"])
    })

payload = sorted(
    cats.values(),
    key=lambda cat: (
        section_sort_key(cat.get("sectionKey", "")),
        int(str(cat.get("code", "999"))[1:]) if len(str(cat.get("code", ""))) > 1 and str(cat.get("code", ""))[0].isalpha() and str(cat.get("code", ""))[1:].isdigit() else 999,
        str(cat.get("label", ""))
    )
)
js = "const MYUI_TERM_CATEGORIES = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n\n"
js += "const MYUI_TERM_MASTER = " + json.dumps(master_rows, ensure_ascii=False, indent=2) + ";\n\n"
js += "globalThis.MYUI_TERM_CATEGORIES = MYUI_TERM_CATEGORIES;\n"
js += "globalThis.MYUI_TERM_MASTER = MYUI_TERM_MASTER;\n"
js += "globalThis.MYUI_TERM_DATA = { version: \"2026-03-24\", categories: MYUI_TERM_CATEGORIES, master: MYUI_TERM_MASTER };\n\n"
js += "globalThis.TERMS = MYUI_TERM_CATEGORIES.flatMap((cat) => cat.terms.map((term) => ({ p: term.p, s: term.s, sec: cat.sectionKey, secLabel: cat.sectionLabel, cat: cat.display, catCode: cat.code, catLabel: cat.label, flowBucket: cat.flowBucket, functionBucket: cat.functionBucket, baseShortcut: term.baseShortcut || \"\", suffix: term.suffix || \"\", ord: term.ord })));\n\n"
js += "globalThis.CATS = MYUI_TERM_CATEGORIES.reduce((acc, cat) => { if (!acc[cat.sectionKey]) acc[cat.sectionKey] = []; acc[cat.sectionKey].push(cat.display); return acc; }, {});\n"
out_path.write_text(js)
print(f"Wrote {out_path}")
