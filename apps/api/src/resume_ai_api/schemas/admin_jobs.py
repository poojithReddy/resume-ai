from pydantic import BaseModel, field_validator

from resume_ai_api.core.constants import ALLOWED_JOB_ROLE_CATEGORIES


class AdminJobCreateRequest(BaseModel):
    target_user_id: str
    job_title: str
    job_role_category: str
    job_role_custom: str | None = None
    resume_text: str
    job_description_text: str

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