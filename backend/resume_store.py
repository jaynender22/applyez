import json
from pathlib import Path
from collections import defaultdict

DATA_DIR = Path(__file__).parent / "data"

def load_json(name: str):
    return json.loads((DATA_DIR / name).read_text(encoding="utf-8"))

def build_grouped_resume(profile: str):
    rows = load_json("resume_content.json")
    dates = load_json("section_dates.json")

    rows = [r for r in rows if r["profile"] == profile]

    grouped = {"work": [], "project": []}
    buckets = {
        "work": defaultdict(lambda: {"job_title": "", "company": "", "location": "", "bullets": [], "dates": None}),
        "project": defaultdict(lambda: {"job_title": "", "company": "", "location": "", "bullets": [], "dates": None}),
    }

    for r in rows:
        exp_type = r["exp_type"]
        key = r["job_title"]
        g = buckets[exp_type][key]
        g["job_title"] = r["job_title"]
        g["company"] = r["company"]
        g["location"] = r["location"]
        g["bullets"].append({"point_num": r["point_num"], "text": r["point_content"]})
        g["dates"] = dates.get(exp_type, {}).get(key)

    for exp_type in ["work", "project"]:
        items = list(buckets[exp_type].values())
        for g in items:
            g["bullets"] = sorted(g["bullets"], key=lambda x: x["point_num"])
        grouped[exp_type] = items

    return grouped
