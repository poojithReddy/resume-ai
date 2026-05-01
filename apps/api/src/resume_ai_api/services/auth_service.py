from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

from resume_ai_api.core.errors import AppError
from resume_ai_api.core.security import create_access_token
from resume_ai_api.repositories.user_repository import UserRepository
from resume_ai_api.schemas.auth import (
    LoginRequest,
    SignupRequest,
    UpdateProfileRequest,
)


pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


class AuthService:
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository

    def signup(self, payload: SignupRequest):
        email = payload.email.lower()
        existing_user = self._user_repository.get_by_email(email)

        if existing_user:
            raise AppError(
                "An account with this email already exists.",
                code="USER_EXISTS",
                status_code=409,
            )

        try:
            password_hash = pwd_context.hash(payload.password)

            user = self._user_repository.create_user(
                name=payload.name,
                email=email,
                password_hash=password_hash,
            )

            token = create_access_token(user.id)

            return {
                "user_id": user.id,
                "email": user.email,
                "token": token,
            }

        except IntegrityError:
            raise AppError(
                "An account with this email already exists.",
                code="USER_EXISTS",
                status_code=409,
            )

    def login(self, payload: LoginRequest):
        email = payload.email.lower()
        user = self._user_repository.get_by_email(email)

        if not user:
            raise AppError(
                "Email or password is incorrect.",
                code="INVALID_CREDENTIALS",
                status_code=401,
            )

        if not pwd_context.verify(payload.password, str(user.password_hash)):
            raise AppError(
                "Email or password is incorrect.",
                code="INVALID_CREDENTIALS",
                status_code=401,
            )

        token = create_access_token(user.id)

        return {
            "user_id": user.id,
            "email": user.email,
            "token": token,
        }

    def update_profile(self, user_id: str, payload: UpdateProfileRequest):
        user = self._user_repository.get_by_id(user_id)

        if not user:
            raise AppError(
                "User not found",
                code="USER_NOT_FOUND",
                status_code=404,
            )

        # Update name
        if payload.name:
            user.name = payload.name

        # Update password
        if payload.password:
            if not payload.confirm_password:
                raise AppError(
                    "Confirm password is required",
                    code="CONFIRM_PASSWORD_REQUIRED",
                    status_code=400,
                )

            if payload.password != payload.confirm_password:
                raise AppError(
                    "Passwords do not match",
                    code="PASSWORD_MISMATCH",
                    status_code=400,
                )

            user.password_hash = pwd_context.hash(payload.password)

        self._user_repository.save(user)

        return {
            "message": "Profile updated successfully"
        }