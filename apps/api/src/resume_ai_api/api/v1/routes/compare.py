from fastapi import APIRouter, Depends

from resume_ai_api.dependencies.auth import require_admin
from resume_ai_api.dependencies.services import get_job_service


router = APIRouter(prefix="/admin", tags=["Admin Compare"])


@router.get("/compare")
def compare_jobs(
    job_id_1: str,
    job_id_2: str,
    service=Depends(get_job_service),
    admin=Depends(require_admin),
):
    return service.compare_jobs(job_id_1, job_id_2)