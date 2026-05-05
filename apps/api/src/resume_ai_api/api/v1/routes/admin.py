from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from resume_ai_api.core.constants import ADMIN_ROLE, SUPER_ADMIN_ROLE, USER_ROLE
from resume_ai_api.dependencies.auth import require_admin
from resume_ai_api.dependencies.db import get_db_session
from resume_ai_api.repositories.user_repository import UserRepository
from resume_ai_api.schemas.admin import CreateUserRequest


router = APIRouter(prefix="/admin", tags=["Admin"])

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


@router.get("/users")
def list_users(
    db: Session = Depends(get_db_session),
    admin=Depends(require_admin),
):
    repo = UserRepository(db)
    users = repo.list_users()

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
        }
        for user in users
    ]


@router.post("/users")
def create_user(
    payload: CreateUserRequest,
    db: Session = Depends(get_db_session),
    admin=Depends(require_admin),
):
    repo = UserRepository(db)

    if payload.role not in [USER_ROLE, ADMIN_ROLE, SUPER_ADMIN_ROLE]:
        raise HTTPException(status_code=400, detail="Invalid role")

    if admin.role == ADMIN_ROLE and payload.role == SUPER_ADMIN_ROLE:
        raise HTTPException(
            status_code=403,
            detail="Only super admin can assign SUPER_ADMIN role",
        )

    existing_user = repo.get_by_email(payload.email.lower())

    if existing_user:
        raise HTTPException(status_code=409, detail="User already exists")

    password_hash = pwd_context.hash(payload.password)

    user = repo.create_user(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=password_hash,
        role=payload.role,
    )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
    }


@router.post("/users/{user_id}/deactivate")
def deactivate_user(
    user_id: str,
    db: Session = Depends(get_db_session),
    admin=Depends(require_admin),
):
    repo = UserRepository(db)
    user = repo.get_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot deactivate yourself")

    if user.role == SUPER_ADMIN_ROLE and admin.role != SUPER_ADMIN_ROLE:
        raise HTTPException(
            status_code=403,
            detail="Only super admin can deactivate another super admin",
        )

    user.is_active = False
    repo.save(user)

    return {"message": "User deactivated"}