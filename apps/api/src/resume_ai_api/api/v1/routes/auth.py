from fastapi import APIRouter, Depends

from resume_ai_api.dependencies.auth import (
    get_current_user_id,
)
from resume_ai_api.dependencies.services import (
    get_auth_service,
)
from resume_ai_api.schemas.auth import (
    LoginRequest,
    SignupRequest,
    UpdateProfileRequest,
)
from resume_ai_api.schemas.common import (
    SuccessResponse,
)


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/signup",
    response_model=SuccessResponse,
)
def signup(
    payload: SignupRequest,
    service=Depends(get_auth_service),
):
    result = service.signup(payload)

    return {
        "success": True,
        "message": "Signup successful",
        "data": result.data,
    }


@router.post(
    "/login",
    response_model=SuccessResponse,
)
def login_user(
    payload: LoginRequest,
    service=Depends(get_auth_service),
):
    result = service.login_user(payload)

    return {
        "success": True,
        "message": result["message"],
        "data": result["data"],
    }


@router.post(
    "/admin/login",
    response_model=SuccessResponse,
)
def login_admin(
    payload: LoginRequest,
    service=Depends(get_auth_service),
):
    result = service.login_admin(payload)

    return {
        "success": True,
        "message": result["message"],
        "data": result["data"],
    }


@router.get(
    "/profile",
    response_model=SuccessResponse,
)
def get_profile(
    user_id: str = Depends(
        get_current_user_id
    ),
    service=Depends(get_auth_service),
):
    profile = service.get_profile(user_id)

    return {
        "success": True,
        "message": "Profile fetched successfully",
        "data": profile,
    }


@router.post(
    "/update-profile",
    response_model=SuccessResponse,
)
def update_profile(
    payload: UpdateProfileRequest,
    user_id: str = Depends(
        get_current_user_id
    ),
    service=Depends(get_auth_service),
):
    result = service.update_profile(
        user_id,
        payload,
    )

    return {
        "success": True,
        "message": result["message"],
        "data": result["data"],
    }