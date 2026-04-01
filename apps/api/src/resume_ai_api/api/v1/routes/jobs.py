from fastapi import APIRouter, Depends

from resume_ai_api.dependencies.services import get_job_service
from resume_ai_api.schemas.jobs import (
    CreateJobRequest,
    CreateJobResponse,
    JobDetailResponse,
)
from resume_ai_api.services.job_service import JobService

router = APIRouter(tags=["Jobs"])


@router.post("/jobs", response_model=CreateJobResponse, status_code=201)
def create_job(
    payload: CreateJobRequest,
    job_service: JobService = Depends(get_job_service),
) -> CreateJobResponse:
    job_id = job_service.create_job(
        resume_text=payload.resume_text,
        job_description_text=payload.job_description_text,
    )
    return CreateJobResponse(job_id=job_id)


@router.get("/jobs/{job_id}", response_model=JobDetailResponse)
def get_job(
    job_id: str,
    job_service: JobService = Depends(get_job_service),
) -> JobDetailResponse:
    job = job_service.get_job(job_id)

    return JobDetailResponse(
        job_id=job.job_id,
        resume_text=job.resume_text,
        job_description_text=job.job_description_text,
    )