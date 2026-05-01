from sqlalchemy.orm import Session

from resume_ai_api.db.models import Job


class JobRepository:
    def __init__(self, db: Session):
        self._db = db

    def create_job(
        self,
        job_id: str,
        job_title: str,
        status: str,
        resume_text: str,
        job_description_text: str,
        user_id: str | None = None,
        score: int | None = None,
        match_band: str | None = None,
        summary: str | None = None,
        matched_points: str | None = None,
        missing_points: str | None = None,
    ) -> Job:
        job = Job(
            job_id=job_id,
            job_title=job_title,
            status=status,
            resume_text=resume_text,
            job_description_text=job_description_text,
            user_id=user_id,
            score=score,
            match_band=match_band,
            summary=summary,
            matched_points=matched_points,
            missing_points=missing_points,
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
        query = self._db.query(Job)

        if user_id:
            query = query.filter(Job.user_id == user_id)

        return query.order_by(Job.created_at.desc()).all()