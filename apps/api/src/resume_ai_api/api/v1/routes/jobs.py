from fastapi import APIRouter, Depends

from resume_ai_api.dependencies.auth import get_current_user
from resume_ai_api.dependencies.services import get_job_service
from resume_ai_api.schemas.jobs import (
    JobCreateRequest,
    JobCreateResponse,
    JobDetailResponse,
)

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("", response_model=JobCreateResponse)
def create_job(
    payload: JobCreateRequest,
    current_user = Depends(get_current_user),
    service=Depends(get_job_service),
):
    job_id = service.create_job(
        payload,
        user_id=current_user["sub"],
    )
    return JobCreateResponse(job_id=job_id)


@router.get("/{job_id}", response_model=JobDetailResponse)
def get_job(
    job_id: str,
    current_user = Depends(get_current_user),
    service=Depends(get_job_service),
):
    return service.get_job(
        job_id,
        user_id=current_user["sub"],
        role=current_user["role"],
    )


@router.get("")
def list_jobs(
    current_user = Depends(get_current_user),
    service=Depends(get_job_service),
):
    return service.list_jobs(
        user_id=current_user["sub"],
        role=current_user["role"],
    )