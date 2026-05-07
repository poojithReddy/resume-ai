from resume_ai_api.repositories.job_repository import JobRepository
from resume_ai_api.repositories.user_repository import UserRepository


class AdminService:
    def __init__(
        self,
        user_repository: UserRepository,
        job_repository: JobRepository,
    ):
        self._user_repository = user_repository
        self._job_repository = job_repository

    def get_dashboard_summary(self):
        return {
            "message": "Dashboard summary fetched successfully",
            "data": {
                "total_users": self._user_repository.get_total_users_count(),
                "active_users": self._user_repository.get_active_users_count(),
                "inactive_users": self._user_repository.get_inactive_users_count(),
                "total_analyses": self._job_repository.get_total_jobs_count(),
                "completed_analyses": self._job_repository.get_completed_jobs_count(),
                "pending_analyses": self._job_repository.get_pending_jobs_count(),
            },
        }

    def get_compare_roles(self):
        roles = self._job_repository.get_available_roles()

        return {
            "message": "Roles fetched successfully",
            "data": roles,
        }

    def get_compare_candidates(self, role: str):
        jobs = self._job_repository.list_by_role(role)

        return {
            "message": "Candidates fetched successfully",
            "data": [
                {
                    "job_id": job.job_id,
                    "job_title": job.job_title,
                    "job_role_category": job.job_role_category,
                    "job_role_custom": job.job_role_custom,
                    "score": job.score,
                    "match_band": job.match_band,
                    "created_at": job.created_at,
                    "updated_at": job.updated_at,
                    "user_name": getattr(job.target_user, "name", None),
                    "user_email": getattr(job.target_user, "email", None),
                    "user_status": getattr(job.target_user, "is_active", None),
                }
                for job in jobs
            ],
        }