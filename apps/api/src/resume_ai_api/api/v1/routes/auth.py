from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from resume_ai_api.db.session import get_db
from resume_ai_api.schemas.auth import (
    SignupRequest,
    LoginRequest,
    AuthResponse,
    UpdateProfileRequest,
)
from resume_ai_api.services.auth_service import AuthService
from resume_ai_api.repositories.user_repository import UserRepository
from resume_ai_api.dependencies.auth import get_current_user_id


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=AuthResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    user_repository = UserRepository(db)
    service = AuthService(user_repository)
    return service.signup(payload)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user_repository = UserRepository(db)
    service = AuthService(user_repository)
    return service.login(payload)


@router.post("/update-profile")
def update_profile(
    payload: UpdateProfileRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    user_repository = UserRepository(db)
    service = AuthService(user_repository)

    return service.update_profile(user_id, payload)