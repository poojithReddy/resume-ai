from datetime import datetime
from pydantic import BaseModel


class JobCreateRequest(BaseModel):
    job_title: str
    job_description_text: str
    resume_text: str


class JobCreateResponse(BaseModel):
    job_id: str


class Scorecard(BaseModel):
    score: int
    match_band: str
    summary: str
    matched_points: list[str]
    missing_points: list[str]


class JobDetailResponse(BaseModel):
    job_id: str
    job_title: str
    status: str
    resume_text: str
    job_description_text: str
    created_at: datetime
    scorecard: Scorecard