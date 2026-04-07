from sqlalchemy.orm import Session

from resume_ai_api.db.models import Job


class JobRepository:
    def __init__(self, db_session: Session) -> None:
        self._db_session = db_session

    def create_job(
        self,
        job_id: str,
        job_title: str,
        resume_text: str,
        job_description_text: str,
        status: str = "pending",
    ) -> Job:
        job = Job(
            job_id=job_id,
            job_title=job_title,
            status=status,
            resume_text=resume_text,
            job_description_text=job_description_text,
        )

        self._db_session.add(job)
        self._db_session.commit()
        self._db_session.refresh(job)

        return job

    def get_job_by_id(self, job_id: str) -> Job | None:
        return (
            self._db_session.query(Job)
            .filter(Job.job_id == job_id)
            .first()
        )