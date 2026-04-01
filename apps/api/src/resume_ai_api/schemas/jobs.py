from pydantic import BaseModel, Field


class CreateJobRequest(BaseModel):
    resume_text: str = Field(min_length=1, description="Plain text resume content")
    job_description_text: str = Field(min_length=1, description="Plain text job description")


class CreateJobResponse(BaseModel):
    job_id: str

class JobDetailResponse(BaseModel):
    job_id: str
    resume_text: str
    job_description_text: str