from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from resume_store import build_grouped_resume
from match_logic import top_keywords, score

app = FastAPI(title="ApplyEZ Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/resume")
def get_resume(profile: str = "data_engineer"):
    return build_grouped_resume(profile)

@app.post("/match")
def match(payload: dict):
    profile = payload.get("profile", "data_engineer")
    jd = payload.get("job_description", "")
    keywords = top_keywords(jd)

    grouped = build_grouped_resume(profile)

    # reorder bullets inside each work job
    work_out = []
    for job in grouped["work"]:
        scored = sorted(job["bullets"], key=lambda b: score(b["text"], keywords), reverse=True)
        work_out.append({
            "job_title": job["job_title"],
            "bullet_order": [b["point_num"] for b in scored]
        })

    # pick top 2 projects by total score
    proj_scored = []
    for proj in grouped["project"]:
        total = sum(score(b["text"], keywords) for b in proj["bullets"])
        proj_scored.append((total, proj))

    proj_scored.sort(key=lambda x: x[0], reverse=True)
    top2 = [x[1] for x in proj_scored[:2]]

    # sort selected projects by end date desc (latest first)
    def end_date(item):
        d = item.get("dates")
        if not d:
            return datetime(1900, 1, 1)
        return datetime.fromisoformat(d["end"])

    top2.sort(key=end_date, reverse=True)

    projects_out = []
    for proj in top2:
        scored = sorted(proj["bullets"], key=lambda b: score(b["text"], keywords), reverse=True)
        projects_out.append({
            "job_title": proj["job_title"],
            "bullet_order": [b["point_num"] for b in scored]
        })

    return {
        "profile": profile,
        "keywords_used": keywords[:12],
        "work": work_out,
        "projects": projects_out
    }

