from resume_ai_api.services.job_service import JobService


def get_job_service() -> JobService:
    return JobService()