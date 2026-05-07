from fastapi import Depends
from sqlalchemy.orm import Session

from resume_ai_api.dependencies.db import get_db_session
from resume_ai_api.repositories.job_repository import JobRepository
from resume_ai_api.repositories.user_repository import UserRepository
from resume_ai_api.services.admin_service import AdminService
from resume_ai_api.services.auth_service import AuthService
from resume_ai_api.services.job_service import JobService
from resume_ai_api.services.admin_job_service import AdminJobService


def get_job_repository(
    db_session: Session = Depends(get_db_session),
) -> JobRepository:
    return JobRepository(db_session)


def get_user_repository(
    db_session: Session = Depends(get_db_session),
) -> UserRepository:
    return UserRepository(db_session)


def get_job_service(
    job_repository: JobRepository = Depends(get_job_repository),
) -> JobService:
    return JobService(job_repository)


def get_auth_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> AuthService:
    return AuthService(user_repository)


def get_admin_service(
    user_repository: UserRepository = Depends(get_user_repository),
    job_repository: JobRepository = Depends(get_job_repository),
) -> AdminService:
    return AdminService(
        user_repository=user_repository,
        job_repository=job_repository,
    )


def get_admin_job_service(
    db: Session = Depends(get_db_session),
) -> AdminJobService:
    return AdminJobService(
        job_repository=JobRepository(db),
        user_repository=UserRepository(db),
    )