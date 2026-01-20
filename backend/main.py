from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/match")
def match(payload: dict):
    return {
        "selected_experiences": [],
        "selected_projects": [],
        "why_these": "Dummy response (wire-up step)",
        "keywords_used": []
    }

@app.post("/cover-story")
def cover_story(payload: dict):
    return {"rewritten_story": "Dummy rewritten story (wire-up step)"}

