from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ApplyEZ Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/match")
def match(payload: dict):
    jd = payload.get("job_description", "")
    # dummy response for wiring
    return {
        "job_description_chars": len(jd),
        "selected_experiences": [],
        "selected_projects": [],
        "why_these": "Dummy response (Gemini comes next)",
        "keywords_used": []
    }

@app.post("/cover-story")
def cover_story(payload: dict):
    jd = payload.get("job_description", "")
    story = payload.get("my_story", "")
    return {
        "rewritten_story": f"Dummy rewrite. JD chars={len(jd)}, story chars={len(story)}"
    }
