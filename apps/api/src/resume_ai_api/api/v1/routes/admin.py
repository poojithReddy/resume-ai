from fastapi import APIRouter, Depends, Query
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from resume_ai_api.core.constants import (
    ADMIN_ROLE,
    SUPER_ADMIN_ROLE,
    USER_ROLE,
)
from resume_ai_api.dependencies.auth import require_admin
from resume_ai_api.dependencies.db import get_db_session
from resume_ai_api.dependencies.services import get_admin_service
from resume_ai_api.repositories.user_repository import UserRepository
from resume_ai_api.schemas.admin import CreateUserRequest
from resume_ai_api.schemas.common import SuccessResponse
from resume_ai_api.core.errors import AppError


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
)


@router.get(
    "/dashboard-summary",
    response_model=SuccessResponse,
)
def get_dashboard_summary(
    service=Depends(get_admin_service),
    _=Depends(require_admin),
):
    result = service.get_dashboard_summary()

    return {
        "success": True,
        "message": result["message"],
        "data": result["data"],
    }


@router.get(
    "/users",
    response_model=SuccessResponse,
)
def list_users(
    db: Session = Depends(get_db_session),
    _=Depends(require_admin),
):
    repo = UserRepository(db)
    users = repo.list_users()

    return {
        "success": True,
        "message": "Users fetched successfully",
        "data": [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active,
                "created_at": user.created_at,
                "updated_at": user.updated_at,
                "last_login_at": user.last_login_at,
            }
            for user in users
        ],
    }


@router.get(
    "/users/active-users",
    response_model=SuccessResponse,
)
def get_active_users(
    role: str | None = Query(default=USER_ROLE),
    status: str | None = Query(default="active"),
    db: Session = Depends(get_db_session),
    _=Depends(require_admin),
):
    repo = UserRepository(db)
    users = repo.list_users()

    if role:
        users = [u for u in users if u.role == role]

    if status == "active":
        users = [u for u in users if u.is_active]
    elif status == "inactive":
        users = [u for u in users if not u.is_active]

    users = [u for u in users if u.role == USER_ROLE]

    return {
        "success": True,
        "message": "Active users fetched successfully",
        "data": [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
            }
            for user in users
        ],
    }


@router.post(
    "/users",
    response_model=SuccessResponse,
)
def create_user(
    payload: CreateUserRequest,
    db: Session = Depends(get_db_session),
    admin=Depends(require_admin),
):
    repo = UserRepository(db)

    if payload.role not in [
        USER_ROLE,
        ADMIN_ROLE,
        SUPER_ADMIN_ROLE,
    ]:
        raise AppError(
            "Invalid role",
            code="INVALID_ROLE",
            status_code=400,
        )

    if (
        admin.role == ADMIN_ROLE
        and payload.role == SUPER_ADMIN_ROLE
    ):
        raise AppError(
            "Only super admin can assign SUPER_ADMIN role",
            code="FORBIDDEN_ROLE_ASSIGNMENT",
            status_code=403,
        )

    existing_user = repo.get_by_email(payload.email.lower())

    if existing_user:
        raise AppError(
            "User already exists",
            code="USER_ALREADY_EXISTS",
            status_code=409,
        )

    password_hash = pwd_context.hash(payload.password)

    user = repo.create_user(
        name=payload.name.strip(),
        email=payload.email.lower(),
        password_hash=password_hash,
        role=payload.role,
    )

    return {
        "success": True,
        "message": "User created successfully",
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "last_login_at": user.last_login_at,
        },
    }


@router.post(
    "/users/{user_id}/deactivate",
    response_model=SuccessResponse,
)
def deactivate_user(
    user_id: str,
    db: Session = Depends(get_db_session),
    admin=Depends(require_admin),
):
    repo = UserRepository(db)

    user = repo.get_by_id(user_id)

    if not user:
        raise AppError(
            "User not found",
            code="USER_NOT_FOUND",
            status_code=404,
        )

    if user.id == admin.id:
        raise AppError(
            "You cannot deactivate yourself",
            code="SELF_DEACTIVATION_NOT_ALLOWED",
            status_code=400,
        )

    if (
        user.role == SUPER_ADMIN_ROLE
        and admin.role != SUPER_ADMIN_ROLE
    ):
        raise AppError(
            "Only super admin can deactivate another super admin",
            code="FORBIDDEN",
            status_code=403,
        )

    user.is_active = False
    repo.save(user)

    return {
        "success": True,
        "message": "User deactivated successfully",
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
        },
    }


@router.post(
    "/users/{user_id}/reactivate",
    response_model=SuccessResponse,
)
def reactivate_user(
    user_id: str,
    db: Session = Depends(get_db_session),
    admin=Depends(require_admin),
):
    repo = UserRepository(db)

    user = repo.get_by_id(user_id)

    if not user:
        raise AppError(
            "User not found",
            code="USER_NOT_FOUND",
            status_code=404,
        )

    if (
        user.role == SUPER_ADMIN_ROLE
        and admin.role != SUPER_ADMIN_ROLE
    ):
        raise AppError(
            "Only super admin can reactivate another super admin",
            code="FORBIDDEN",
            status_code=403,
        )

    user.is_active = True
    repo.save(user)

    return {
        "success": True,
        "message": "User reactivated successfully",
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
        },
    }