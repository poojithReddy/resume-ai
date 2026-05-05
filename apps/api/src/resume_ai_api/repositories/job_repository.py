from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from resume_ai_api.db.models import Job


class JobRepository:
    def __init__(self, db: Session):
        self._db = db

    def create_job(
        self,
        job_id: str,
        job_title: str,
        job_role_category: str,
        job_role_custom: str | None,
        status: str,
        resume_text: str,
        job_description_text: str,
        user_id: str | None = None,
    ) -> Job:
        job = Job(
            job_id=job_id,
            job_title=job_title,
            job_role_category=job_role_category,
            job_role_custom=job_role_custom,
            status=status,
            resume_text=resume_text,
            job_description_text=job_description_text,
            user_id=user_id,
        )

        self._db.add(job)
        self._db.commit()
        self._db.refresh(job)

        return job

    def get_job(self, job_id: str) -> Job | None:
        return (
            self._db.query(Job)
            .filter(Job.job_id == job_id)
            .first()
        )

    def list_jobs(self, user_id: str | None = None):
        query = self._db.query(Job).options(joinedload(Job.user))

        if user_id is not None:
            query = query.filter(Job.user_id == user_id)

        return query.order_by(Job.created_at.desc()).all()

    def list_by_role(self, job_role_category: str):
        return (
            self._db.query(Job)
            .filter(Job.job_role_category == job_role_category)
            .order_by(Job.created_at.desc())
            .all()
        )

    def get_jobs_by_ids(self, job_ids: list[str]):
        return (
            self._db.query(Job)
            .filter(Job.job_id.in_(job_ids))
            .all()
        )

    def save(self, job: Job) -> None:
        try:
            self._db.add(job)
            self._db.commit()
            self._db.refresh(job)
        except Exception:
            self._db.rollback()
            raise