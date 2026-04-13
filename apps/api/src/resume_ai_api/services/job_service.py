import uuid

from resume_ai_api.repositories.job_repository import JobRepository
from resume_ai_api.schemas.jobs import (
    JobCreateRequest,
    JobDetailResponse,
    Scorecard,
)
from resume_ai_api.core.errors import AppError


class JobService:
    def __init__(self, job_repository: JobRepository):
        self._job_repository = job_repository

    def create_job(self, payload: JobCreateRequest, user_id: str | None = None) -> str:
        job_id = f"job-{uuid.uuid4()}"

        self._job_repository.create_job(
            job_id=job_id,
            job_title=payload.job_title,
            status="pending",
            resume_text=payload.resume_text,
            job_description_text=payload.job_description_text,
            user_id=user_id,
        )

        return job_id

    def get_job(self, job_id: str) -> JobDetailResponse:
        job = self._job_repository.get_job(job_id)

        if not job:
            raise AppError("Job not found", code="JOB_NOT_FOUND", status_code=404)

        scorecard = self._generate_scorecard(
            job.resume_text,
            job.job_description_text,
        )

        return JobDetailResponse(
            job_id=job.job_id,
            job_title=job.job_title,
            status=job.status,
            resume_text=job.resume_text,
            job_description_text=job.job_description_text,
            created_at=job.created_at,
            scorecard=scorecard,
        )

    def list_jobs(self, user_id: str | None = None):
        return self._job_repository.list_jobs(user_id=user_id)

    def _generate_scorecard(self, resume_text: str, job_description: str) -> Scorecard:
        resume_words = set(resume_text.lower().split())
        jd_words = set(job_description.lower().split())

        matched = list(resume_words & jd_words)
        missing = list(jd_words - resume_words)

        score = int((len(matched) / max(len(jd_words), 1)) * 100)

        if score >= 85:
            band = "Excellent"
        elif score >= 60:
            band = "Good"
        else:
            band = "Poor"

        return Scorecard(
            score=score,
            match_band=band,
            summary=f"{len(matched)} matched keywords, {len(missing)} missing.",
            matched_points=matched[:5],
            missing_points=missing[:5],
        )