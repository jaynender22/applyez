from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ApplyEZ API")

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
    return {"ok": True, "message": "match endpoint wired"}

@app.post("/cover-story")
def cover_story(payload: dict):
    return {"ok": True, "message": "cover-story endpoint wired"}


