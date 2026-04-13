from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from resume_ai_api.db.session import get_db
from resume_ai_api.repositories.job_repository import JobRepository
from resume_ai_api.schemas.jobs import JobCreateRequest, JobCreateResponse, JobDetailResponse
from resume_ai_api.services.job_service import JobService

router = APIRouter(prefix="/jobs", tags=["jobs"])


def get_job_service(db: Session = Depends(get_db)) -> JobService:
    repo = JobRepository(db)
    return JobService(repo)


@router.post("", response_model=JobCreateResponse)
def create_job(
    payload: JobCreateRequest,
    x_user_id: str | None = Header(default=None),
    service: JobService = Depends(get_job_service),
):
    job_id = service.create_job(payload, user_id=x_user_id)
    return JobCreateResponse(job_id=job_id)


@router.get("", response_model=list[JobDetailResponse])
def list_jobs(
    x_user_id: str | None = Header(default=None),
    service: JobService = Depends(get_job_service),
):
    jobs = service.list_jobs(user_id=x_user_id)
    return [service.get_job(job.job_id) for job in jobs]


@router.get("/{job_id}", response_model=JobDetailResponse)
def get_job(
    job_id: str,
    service: JobService = Depends(get_job_service),
):
    return service.get_job(job_id)