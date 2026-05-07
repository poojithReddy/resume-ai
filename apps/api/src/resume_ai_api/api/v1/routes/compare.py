from fastapi import APIRouter, Depends

from resume_ai_api.dependencies.auth import require_admin
from resume_ai_api.dependencies.services import ( get_admin_service, get_job_service, )
from resume_ai_api.schemas.common import SuccessResponse


router = APIRouter(
    prefix="/admin/compare",
    tags=["Admin Compare"],
)


@router.get("/roles", response_model=SuccessResponse)
def get_compare_roles(
    service=Depends(get_admin_service),
    _=Depends(require_admin),
):
    result = service.get_compare_roles()

    return {
        "success": True,
        "message": result["message"],
        "data": result["data"],
    }


@router.get("/candidates", response_model=SuccessResponse)
def get_compare_candidates(
    role: str,
    service=Depends(get_admin_service),
    _=Depends(require_admin),
):
    result = service.get_compare_candidates(role)

    return {
        "success": True,
        "message": result["message"],
        "data": result["data"],
    }


@router.get("", response_model=SuccessResponse)
def compare_jobs(
    job_id_1: str,
    job_id_2: str,
    service=Depends(get_job_service),
    _=Depends(require_admin),
):
    result = service.compare_jobs(job_id_1, job_id_2)

    return {
        "success": True,
        "message": "Comparison fetched successfully",
        "data": result,
    }