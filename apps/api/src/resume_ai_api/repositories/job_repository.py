from sqlalchemy import or_
from sqlalchemy.orm import Session

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
        target_user_id: str | None = None,
        actor_id: str | None = None,
    ) -> Job:
        job = Job(
            job_id=job_id,
            job_title=job_title,
            job_role_category=job_role_category,
            job_role_custom=job_role_custom,
            status=status,
            resume_text=resume_text,
            job_description_text=job_description_text,
            target_user_id=target_user_id,
            actor_id=actor_id,
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

    def list_jobs(self, target_user_id: str | None = None):
        query = self._db.query(Job)

        if target_user_id is not None:
            query = query.filter(Job.target_user_id == target_user_id)

        return query.order_by(Job.created_at.desc()).all()

    def list_by_role(self, role: str):
        return (
            self._db.query(Job)
            .filter(
                or_(
                    Job.job_role_category == role,
                    Job.job_role_custom == role,
                )
            )
            .order_by(Job.created_at.desc())
            .all()
        )

    def get_available_roles(self):
        jobs = self._db.query(Job).all()

        roles = set()

        for job in jobs:
            if job.job_role_category == "other" and job.job_role_custom:
                roles.add(job.job_role_custom)
            else:
                roles.add(job.job_role_category)

        return sorted(list(roles))

    def get_total_jobs_count(self) -> int:
        return self._db.query(Job).count()

    def get_completed_jobs_count(self) -> int:
        return self._db.query(Job).filter(Job.score.isnot(None)).count()

    def get_pending_jobs_count(self) -> int:
        return self._db.query(Job).filter(Job.score.is_(None)).count()

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