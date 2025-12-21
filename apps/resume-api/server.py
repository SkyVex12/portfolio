from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

from main import PERSON_ORDER, generate_person_from_jd, render_resume_text

app = FastAPI(title="Resume Builder API", version="1.0.0")

class TrialRequest(BaseModel):
  job_description: str
  tone: Optional[str] = None
  person: Optional[str] = None

@app.get("/health")
def health():
  return {"ok": True}

@app.post("/trial")
def trial(req: TrialRequest):
  person = req.person or (PERSON_ORDER[0] if PERSON_ORDER else "Timothy")
  pdata = generate_person_from_jd(req.job_description, person=person)
  return {"ok": True, "resume_json": {person: pdata}, "resume_text": render_resume_text(person, pdata)}
