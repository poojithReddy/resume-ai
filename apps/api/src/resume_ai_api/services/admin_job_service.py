import uuid
from datetime import datetime

from resume_ai_api.core.constants import USER_ROLE
from resume_ai_api.core.errors import AppError
from resume_ai_api.repositories.job_repository import JobRepository
from resume_ai_api.repositories.user_repository import UserRepository
from resume_ai_api.services.ai_service import AIService


class AdminJobService:
    def __init__(
        self,
        job_repository: JobRepository,
        user_repository: UserRepository,
    ):
        self._job_repository = job_repository
        self._user_repository = user_repository
        self._ai_service = AIService()

    def create_admin_job_analysis(
        self,
        *,
        actor_id: str,
        target_user_id: str,
        job_title: str,
        job_role_category: str,
        job_role_custom: str | None,
        resume_text: str,
        job_description_text: str,
    ) -> str:

        user = self._user_repository.get_by_id(target_user_id)

        if not user:
            raise AppError(
                "User not found",
                code="USER_NOT_FOUND",
                status_code=404,
            )

        if user.role != USER_ROLE:
            raise AppError(
                "Only USER role can be analyzed",
                code="INVALID_TARGET_USER",
                status_code=400,
            )

        if not user.is_active:
            raise AppError(
                "User is not active",
                code="USER_INACTIVE",
                status_code=400,
            )

        job_id = f"job-{uuid.uuid4()}"

        job = self._job_repository.create_job(
            job_id=job_id,
            job_title=job_title,
            job_role_category=job_role_category,
            job_role_custom=job_role_custom,
            status="pending",
            resume_text=resume_text,
            job_description_text=job_description_text,
            target_user_id=target_user_id,
            actor_id=actor_id,
        )

        self._generate_and_store_scorecard(job)

        return job_id

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
        job.ai_feedback = getattr(scorecard, "ai_feedback", None)
        job.status = "completed"
        job.analysis_completed_at = datetime.utcnow()

        self._job_repository.save(job)

    def _get_match_band(self, score: int) -> str:
        if score >= 85:
            return "Excellent"
        elif score >= 75:
            return "Very Good"
        elif score >= 65:
            return "Good"
        elif score >= 50:
            return "Average"
        else:
            return "Poor"