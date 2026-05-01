from fastapi import APIRouter, Depends

from resume_ai_api.dependencies.services import get_job_service
from resume_ai_api.dependencies.auth import get_current_user_id
from resume_ai_api.schemas.jobs import JobCreateRequest, JobCreateResponse, JobDetailResponse

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("", response_model=JobCreateResponse)
def create_job(
    payload: JobCreateRequest,
    user_id: str = Depends(get_current_user_id),
    service=Depends(get_job_service),
):
    job_id = service.create_job(payload, user_id=user_id)
    return JobCreateResponse(job_id=job_id)


@router.get("/{job_id}", response_model=JobDetailResponse)
def get_job(
    job_id: str,
    user_id: str = Depends(get_current_user_id),
    service=Depends(get_job_service),
):
    return service.get_job(job_id, user_id=user_id)


@router.get("")
def list_jobs(
    user_id: str = Depends(get_current_user_id),
    service=Depends(get_job_service),
):
    return service.list_jobs(user_id=user_id)