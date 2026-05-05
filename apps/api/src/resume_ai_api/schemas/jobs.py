from datetime import datetime

from pydantic import BaseModel, field_validator


ALLOWED_JOB_ROLE_CATEGORIES = [
    "software",
    "data",
    "qa_testing",
    "devops_cloud",
    "product_design",
    "marketing_sales",
    "finance_operations",
    "other",
]


class JobCreateRequest(BaseModel):
    job_title: str
    job_role_category: str
    job_role_custom: str | None = None
    job_description_text: str
    resume_text: str

    @field_validator("job_role_category")
    @classmethod
    def validate_job_role_category(cls, value: str) -> str:
        normalized = value.lower().strip()

        if normalized not in ALLOWED_JOB_ROLE_CATEGORIES:
            raise ValueError("Invalid job role category")

        return normalized

    @field_validator("job_role_custom")
    @classmethod
    def validate_job_role_custom(cls, value: str | None) -> str | None:
        if value is None:
            return None

        cleaned = value.strip()

        if not cleaned:
            return None

        return cleaned


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
    job_role_category: str
    job_role_custom: str | None
    status: str
    resume_text: str
    job_description_text: str
    created_at: datetime
    scorecard: Scorecard