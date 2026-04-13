from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

from resume_ai_api.core.errors import AppError
from resume_ai_api.repositories.user_repository import UserRepository
from resume_ai_api.schemas.auth import LoginRequest, SignupRequest


pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


class AuthService:
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository

    def signup(self, payload: SignupRequest):
        existing_user = self._user_repository.get_by_email(payload.email)

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
                email=payload.email,
                password_hash=password_hash,
            )

            return {
                "user_id": user.id,
                "email": user.email,
            }

        except IntegrityError:
            raise AppError(
                "An account with this email already exists.",
                code="USER_EXISTS",
                status_code=409,
            )

    def login(self, payload: LoginRequest):
        user = self._user_repository.get_by_email(payload.email)

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

        return {
            "user_id": user.id,
            "email": user.email,
        }