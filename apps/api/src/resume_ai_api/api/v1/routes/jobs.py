from uuid import uuid4

from fastapi import APIRouter

from resume_ai_api.schemas.jobs import CreateJobRequest, CreateJobResponse
from resume_ai_api.core.errors import JobNotFound
from fastapi import Depends
from resume_ai_api.dependencies.services import get_job_service
from resume_ai_api.services.job_service import JobService

router = APIRouter(tags=["Jobs"])


@router.post("/jobs", response_model=CreateJobResponse, status_code=201)
def create_job(payload: CreateJobRequest) -> CreateJobResponse:
    job_id = f"job-{uuid4()}"
    return CreateJobResponse(job_id=job_id)

@router.get("/jobs/{job_id}")
def get_job(job_id: str, job_service: JobService = Depends(get_job_service)):
    return job_service.get_job(job_id)
