from datetime import datetime

from pydantic import BaseModel, Field


class CreateJobRequest(BaseModel):
    job_title: str = Field(min_length=1, description="Job title")
    resume_text: str = Field(min_length=1, description="Plain text resume content")
    job_description_text: str = Field(min_length=1, description="Plain text job description")


class CreateJobResponse(BaseModel):
    job_id: str


class JobDetailResponse(BaseModel):
    job_id: str
    job_title: str
    status: str
    resume_text: str
    job_description_text: str
    created_at: datetime