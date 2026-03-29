from resume_ai_api.core.errors import JobNotFound


class JobService:
    def get_job(self, job_id: str) -> dict:
        # No storage yet, so this always fails for now
        raise JobNotFound(job_id)