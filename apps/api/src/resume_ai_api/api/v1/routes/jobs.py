from fastapi import APIRouter, Depends

from resume_ai_api.dependencies.auth import get_current_user
from resume_ai_api.dependencies.services import get_job_service
from resume_ai_api.schemas.common import SuccessResponse
from resume_ai_api.schemas.jobs import JobCreateRequest
from resume_ai_api.core.constants import USER_ROLE
from resume_ai_api.core.errors import AppError


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.post(
    "",
    response_model=SuccessResponse,
)
def create_job(
    payload: JobCreateRequest,
    current_user=Depends(get_current_user),
    service=Depends(get_job_service),
):
    if current_user["role"] != USER_ROLE:
        raise AppError(
            "Only users can create jobs",
            code="FORBIDDEN",
            status_code=403,
        )

    job_id = service.create_job(
        payload,
        user_id=current_user["sub"],
        role=current_user["role"],
    )

    return {
        "success": True,
        "message": "Job analysis created successfully",
        "data": {
            "job_id": job_id,
        },
    }


@router.get(
    "/{job_id}",
    response_model=SuccessResponse,
)
def get_job(
    job_id: str,
    current_user=Depends(get_current_user),
    service=Depends(get_job_service),
):
    job = service.get_job(
        job_id,
        user_id=current_user["sub"],
        role=current_user["role"],
    )

    return {
        "success": True,
        "message": "Job fetched successfully",
        "data": job,
    }


@router.get(
    "",
    response_model=SuccessResponse,
)
def list_jobs(
    current_user=Depends(get_current_user),
    service=Depends(get_job_service),
):
    jobs = service.list_jobs(
        user_id=current_user["sub"],
        role=current_user["role"],
    )

    return {
        "success": True,
        "message": "Jobs fetched successfully",
        "data": jobs,
    }