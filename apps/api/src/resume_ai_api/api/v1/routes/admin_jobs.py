from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from resume_ai_api.dependencies.auth import require_admin
from resume_ai_api.dependencies.db import get_db_session
from resume_ai_api.repositories.job_repository import JobRepository
from resume_ai_api.repositories.user_repository import UserRepository
from resume_ai_api.schemas.common import SuccessResponse
from resume_ai_api.schemas.admin_jobs import AdminJobCreateRequest
from resume_ai_api.services.admin_job_service import AdminJobService


router = APIRouter(
    prefix="/admin/jobs",
    tags=["Admin Jobs"],
)


def get_admin_job_service(
    db: Session = Depends(get_db_session),
):
    return AdminJobService(
        job_repository=JobRepository(db),
        user_repository=UserRepository(db),
    )


@router.post(
    "/create-analysis",
    response_model=SuccessResponse,
)
def create_admin_job_analysis(
    payload: AdminJobCreateRequest,
    admin=Depends(require_admin),
    service: AdminJobService = Depends(get_admin_job_service),
):
    job_id = service.create_admin_job_analysis(
        actor_id=admin.id,
        target_user_id=payload.target_user_id,
        job_title=payload.job_title,
        job_role_category=payload.job_role_category,
        job_role_custom=payload.job_role_custom,
        resume_text=payload.resume_text,
        job_description_text=payload.job_description_text,
    )

    return {
        "success": True,
        "message": "Job analysis created successfully",
        "data": {
            "job_id": job_id,
        },
    }