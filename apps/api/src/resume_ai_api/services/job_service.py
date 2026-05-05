import uuid

from resume_ai_api.core.errors import AppError
from resume_ai_api.repositories.job_repository import JobRepository
from resume_ai_api.schemas.jobs import (
    JobCreateRequest,
    JobDetailResponse,
    Scorecard,
)
from resume_ai_api.services.ai_service import AIService


MAX_FREE_JOBS = 3

class JobService:
    def __init__(self, job_repository: JobRepository):
        self._job_repository = job_repository
        self._ai_service = AIService()

    def create_job(
        self, payload: JobCreateRequest, user_id: str | None = None
    ) -> str:
        if user_id is not None:
            existing_jobs = self._job_repository.list_jobs(user_id=user_id)

            if len(existing_jobs) >= MAX_FREE_JOBS:
                raise AppError(
                    "You have reached the maximum number of free analyses.",
                    code="LIMIT_EXCEEDED",
                    status_code=403,
                )

        job_id = f"job-{uuid.uuid4()}"

        job = self._job_repository.create_job(
            job_id=job_id,
            job_title=payload.job_title,
            job_role_category=payload.job_role_category,
            job_role_custom=payload.job_role_custom,
            status="pending",
            resume_text=payload.resume_text,
            job_description_text=payload.job_description_text,
            user_id=user_id,
        )

        self._generate_and_store_scorecard(job)

        return job_id

    def get_job(
        self, job_id: str, user_id: str, role: str
    ) -> JobDetailResponse:
        job = self._job_repository.get_job(job_id)

        if not job:
            raise AppError(
                "Job not found",
                code="JOB_NOT_FOUND",
                status_code=404,
            )

        # RBAC check
        if role not in ["ADMIN", "SUPER_ADMIN"] and job.user_id != user_id:
            raise AppError(
                "You are not allowed to access this job.",
                code="FORBIDDEN",
                status_code=403,
            )

        if job.score is None:
            raise AppError(
                "Scorecard not ready",
                code="SCORE_NOT_READY",
                status_code=500,
            )

        scorecard = Scorecard(
            score=job.score,
            match_band=job.match_band or "Unknown",
            summary=job.summary or "",
            matched_points=job.matched_points.split(",")
            if job.matched_points
            else [],
            missing_points=job.missing_points.split(",")
            if job.missing_points
            else [],
        )

        return JobDetailResponse(
            job_id=job.job_id,
            job_title=job.job_title,
            job_role_category=job.job_role_category,
            job_role_custom=job.job_role_custom,
            status="completed",
            resume_text=job.resume_text,
            job_description_text=job.job_description_text,
            created_at=job.created_at,
            scorecard=scorecard,
        )

    def list_jobs(self, user_id: str, role: str):
        if role in ["ADMIN", "SUPER_ADMIN"]:
            jobs = self._job_repository.list_jobs(user_id=None)
        else:
            jobs = self._job_repository.list_jobs(user_id=user_id)

        jobs = sorted(jobs, key=lambda j: j.created_at, reverse=True)

        return [
            {
                "job_id": job.job_id,
                "job_title": job.job_title,
                "job_role_category": job.job_role_category,
                "job_role_custom": job.job_role_custom,
                "created_at": job.created_at,
                "status": "completed"
                if job.score is not None
                else "pending",
                "score": job.score,
                "match_band": job.match_band,
                "user_name": job.user.name if job.user else None,
            }
            for job in jobs
        ]

    def compare_jobs(self, job_id_1: str, job_id_2: str):
        if job_id_1 == job_id_2:
            raise AppError(
                "Cannot compare the same job",
                code="SAME_JOB_COMPARISON",
                status_code=400,
            )

        job1 = self._job_repository.get_job(job_id_1)
        job2 = self._job_repository.get_job(job_id_2)

        if not job1 or not job2:
            raise AppError(
                "One or both jobs not found",
                code="JOB_NOT_FOUND",
                status_code=404,
            )

        if job1.user_id == job2.user_id:
            raise AppError(
                "Cannot compare jobs from the same user",
                code="SAME_USER_COMPARISON",
                status_code=400,
            )

        if job1.job_role_category != job2.job_role_category:
            raise AppError(
                "Jobs belong to different categories",
                code="ROLE_MISMATCH",
                status_code=400,
            )

        if job1.score is None or job2.score is None:
            raise AppError(
                "Scorecard not ready",
                code="SCORE_NOT_READY",
                status_code=400,
            )

        def build_scorecard(job):
            return {
                "job_id": job.job_id,
                "score": job.score,
                "match_band": job.match_band or "Unknown",
                "summary": job.summary,
                "matched_points": job.matched_points.split(",")
                if job.matched_points
                else [],
                "missing_points": job.missing_points.split(",")
                if job.missing_points
                else [],
            }

        user_a = build_scorecard(job1)
        user_b = build_scorecard(job2)

        if job1.score > job2.score:
            winner = "user_a"
        elif job2.score > job1.score:
            winner = "user_b"
        else:
            winner = "tie"

        return {
            "job_role_category": job1.job_role_category,
            "user_a": user_a,
            "user_b": user_b,
            "winner": winner,
        }

    def _generate_and_store_scorecard(self, job) -> None:
        scorecard = self._ai_service.generate_scorecard(
            job_title=job.job_title,
            resume_text=job.resume_text,
            job_description_text=job.job_description_text,
        )

        job.score = scorecard.score
        job.match_band = self._get_match_band(scorecard.score)
        job.summary = scorecard.summary
        job.matched_points = ",".join(scorecard.matched_points)
        job.missing_points = ",".join(scorecard.missing_points)
        job.status = "completed"

        self._job_repository.save(job)

    def _get_match_band(self, score: int) -> str:
        if score >= 80:
            return "Excellent"
        elif score >= 50:
            return "Good"
        else:
            return "Poor"