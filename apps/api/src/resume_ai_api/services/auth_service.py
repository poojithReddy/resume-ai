from datetime import datetime

from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

from resume_ai_api.core.constants import (
    ADMIN_ROLE,
    SUPER_ADMIN_ROLE,
    USER_ROLE,
)
from resume_ai_api.core.errors import AppError
from resume_ai_api.core.security import create_access_token
from resume_ai_api.repositories.user_repository import UserRepository
from resume_ai_api.schemas.auth import (
    AuthResponse,
    AuthUserData,
    LoginRequest,
    SignupRequest,
    UpdateProfileRequest,
)


pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
)


class AuthService:
    def __init__(
        self,
        user_repository: UserRepository,
    ):
        self._user_repository = user_repository

    def signup(
        self,
        payload: SignupRequest,
    ) -> AuthResponse:
        existing_user = self._user_repository.get_by_email(
            payload.email.lower()
        )

        if existing_user:
            raise AppError(
                "User already exists",
                code="USER_ALREADY_EXISTS",
                status_code=409,
            )

        password_hash = pwd_context.hash(
            payload.password
        )

        try:
            user = self._user_repository.create_user(
                name=payload.name.strip(),
                email=payload.email.lower(),
                password_hash=password_hash,
                role=USER_ROLE,
            )

        except IntegrityError:
            raise AppError(
                "User already exists",
                code="USER_ALREADY_EXISTS",
                status_code=409,
            )

        token = create_access_token(
            user_id=user.id,
            role=user.role,
        )

        return AuthResponse(
            message="Signup successful",
            data=AuthUserData(
                user_id=user.id,
                name=user.name,
                email=user.email,
                role=user.role,
                is_active=user.is_active,
                token=token,
            ),
        )

    def login_user(
        self,
        payload: LoginRequest,
    ) -> dict:
        user = self._validate_login_credentials(
            payload
        )

        if user.role != USER_ROLE:
            raise AppError(
                "Invalid user login",
                code="INVALID_USER_LOGIN",
                status_code=403,
            )

        self._update_last_login(user)

        token = create_access_token(
            user_id=user.id,
            role=user.role,
        )

        return {
            "message": "Login successful",
            "data": {
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active,
                "token": token,
            },
        }

    def login_admin(
        self,
        payload: LoginRequest,
    ) -> dict:
        user = self._validate_login_credentials(
            payload
        )

        if user.role not in [
            ADMIN_ROLE,
            SUPER_ADMIN_ROLE,
        ]:
            raise AppError(
                "Invalid admin login",
                code="INVALID_ADMIN_LOGIN",
                status_code=403,
            )

        self._update_last_login(user)

        token = create_access_token(
            user_id=user.id,
            role=user.role,
        )

        return {
            "message": "Admin login successful",
            "data": {
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active,
                "token": token,
            },
        }

    def get_profile(
        self,
        user_id: str,
    ) -> dict:
        user = self._user_repository.get_by_id(
            user_id
        )

        if not user:
            raise AppError(
                "User not found",
                code="USER_NOT_FOUND",
                status_code=404,
            )

        return {
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "last_login_at": user.last_login_at,
        }

    def update_profile(
        self,
        user_id: str,
        payload: UpdateProfileRequest,
    ):
        user = self._user_repository.get_by_id(
            user_id
        )

        if not user:
            raise AppError(
                "User not found",
                code="USER_NOT_FOUND",
                status_code=404,
            )

        if payload.name is not None:
            user.name = payload.name.strip()

        if payload.password:
            if payload.password != payload.confirm_password:
                raise AppError(
                    "Passwords do not match",
                    code="PASSWORD_MISMATCH",
                    status_code=400,
                )

            user.password_hash = pwd_context.hash(
                payload.password
            )

        self._user_repository.save(user)

        return {
            "message": "Profile updated successfully",
            "data": {
                "user_id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active,
            },
        }

    def _validate_login_credentials(
        self,
        payload: LoginRequest,
    ):
        user = self._user_repository.get_by_email(
            payload.email.lower()
        )

        if not user:
            raise AppError(
                "Invalid email or password",
                code="INVALID_CREDENTIALS",
                status_code=401,
            )

        if not user.is_active:
            raise AppError(
                "Your account has been deactivated. Please contact admin.",
                code="ACCOUNT_DEACTIVATED",
                status_code=403,
            )

        valid_password = pwd_context.verify(
            payload.password,
            user.password_hash,
        )

        if not valid_password:
            raise AppError(
                "Invalid email or password",
                code="INVALID_CREDENTIALS",
                status_code=401,
            )

        return user

    def _update_last_login(
        self,
        user,
    ) -> None:
        user.last_login_at = datetime.utcnow()

        self._user_repository.save(user)