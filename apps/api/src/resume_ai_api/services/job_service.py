import uuid
import json

from resume_ai_api.core.errors import AppError
from resume_ai_api.repositories.job_repository import JobRepository
from resume_ai_api.schemas.jobs import JobCreateRequest, JobDetailResponse, Scorecard
from resume_ai_api.services.ai_service import AIService


MAX_FREE_JOBS = 3


class JobService:
    def __init__(self, job_repository: JobRepository):
        self._job_repository = job_repository
        self._ai_service = AIService()

    def create_job(self, payload: JobCreateRequest, user_id: str | None = None) -> str:
        if user_id:
            existing_jobs = self._job_repository.list_jobs(user_id=user_id)

            if len(existing_jobs) >= MAX_FREE_JOBS:
                raise AppError(
                    "You have reached the maximum number of free analyses.",
                    code="LIMIT_EXCEEDED",
                    status_code=403,
                )

        job_id = f"job-{uuid.uuid4()}"

        scorecard = self._generate_scorecard(
            payload.job_title,
            payload.resume_text,
            payload.job_description_text,
        )

        self._job_repository.create_job(
            job_id=job_id,
            job_title=payload.job_title,
            status="completed",
            resume_text=payload.resume_text,
            job_description_text=payload.job_description_text,
            user_id=user_id,
            score=scorecard.score,
            match_band=scorecard.match_band,
            summary=scorecard.summary,
            matched_points=json.dumps(scorecard.matched_points),
            missing_points=json.dumps(scorecard.missing_points),
        )

        return job_id

    def get_job(self, job_id: str, user_id: str | None = None) -> JobDetailResponse:
        job = self._job_repository.get_job(job_id)

        if not job:
            raise AppError("Job not found", code="JOB_NOT_FOUND", status_code=404)

        if user_id and job.user_id != user_id:
            raise AppError(
                "You are not allowed to access this job.",
                code="FORBIDDEN",
                status_code=403,
            )

        return JobDetailResponse(
            job_id=job.job_id,
            job_title=job.job_title,
            status=job.status,
            resume_text=job.resume_text,
            job_description_text=job.job_description_text,
            created_at=job.created_at,
            scorecard=Scorecard(
                score=job.score or 0,
                match_band=job.match_band or "",
                summary=job.summary or "",
                matched_points=json.loads(job.matched_points or "[]"),
                missing_points=json.loads(job.missing_points or "[]"),
            ),
        )

    def list_jobs(self, user_id: str | None = None):
        jobs = self._job_repository.list_jobs(user_id=user_id)

        return [
            {
                "job_id": job.job_id,
                "job_title": job.job_title,
                "created_at": job.created_at,
                "status": job.status,
                "score": job.score,
            }
            for job in jobs
        ]

    def _generate_scorecard(
        self,
        job_title: str,
        resume_text: str,
        job_description: str,
    ) -> Scorecard:
        return self._ai_service.generate_scorecard(
            job_title=job_title,
            resume_text=resume_text,
            job_description_text=job_description,
        )

    def _fallback_scorecard(self, resume_text: str, job_description: str) -> Scorecard:
        resume_words = set(resume_text.lower().split())
        jd_words = set(job_description.lower().split())

        matched = list(resume_words & jd_words)
        missing = list(jd_words - resume_words)

        score = int((len(matched) / max(len(jd_words), 1)) * 100)

        if score >= 85:
            band = "Excellent"
        elif score >= 75:
            band = "Good"
        elif score >= 60:
            band = "Average"
        else:
            band = "Poor"

        return Scorecard(
            score=score,
            match_band=band,
            summary=f"{len(matched)} matched keywords, {len(missing)} missing.",
            matched_points=matched[:5],
            missing_points=missing[:5],
        )