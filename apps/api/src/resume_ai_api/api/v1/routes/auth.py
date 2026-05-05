from fastapi import APIRouter, Depends

from resume_ai_api.schemas.auth import (
    SignupRequest,
    LoginRequest,
    AuthResponse,
    UpdateProfileRequest,
)
from resume_ai_api.dependencies.services import get_auth_service
from resume_ai_api.dependencies.auth import get_current_user_id


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=AuthResponse)
def signup(
    payload: SignupRequest,
    service=Depends(get_auth_service),
):
    return service.signup(payload)


@router.post("/login", response_model=AuthResponse)
def login(
    payload: LoginRequest,
    service=Depends(get_auth_service),
):
    return service.login(payload)


@router.post("/update-profile")
def update_profile(
    payload: UpdateProfileRequest,
    user_id: str = Depends(get_current_user_id),
    service=Depends(get_auth_service),
):
    return service.update_profile(user_id, payload)