from uuid import uuid4

from resume_ai_api.core.errors import JobNotFound
from resume_ai_api.repositories.job_repository import JobRepository


class JobService:
    def __init__(self, job_repository: JobRepository) -> None:
        self._job_repository = job_repository

    def create_job(self, resume_text: str, job_description_text: str) -> str:
        job_id = f"job-{uuid4()}"

        self._job_repository.create_job(
            job_id=job_id,
            resume_text=resume_text,
            job_description_text=job_description_text,
        )

        return job_id

    def get_job(self, job_id: str):
        job = self._job_repository.get_job_by_id(job_id)

        if job is None:
            raise JobNotFound(job_id)

        return job