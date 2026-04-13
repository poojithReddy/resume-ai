from passlib.context import CryptContext

from resume_ai_api.repositories.user_repository import UserRepository
from resume_ai_api.schemas.auth import SignupRequest, LoginRequest


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, user_repository: UserRepository):
        self._user_repository = user_repository

    def signup(self, payload: SignupRequest):
        existing_user = self._user_repository.get_by_email(payload.email)
        if existing_user:
            raise ValueError("User already exists")

        password_hash = pwd_context.hash(payload.password)

        user = self._user_repository.create_user(
            name=payload.name,
            email=payload.email,
            password_hash=password_hash,
        )

        return {
            "user_id": user.id,
            "token": f"token-{user.id}",
        }

    def login(self, payload: LoginRequest):
        user = self._user_repository.get_by_email(payload.email)
        if not user:
            raise ValueError("Invalid credentials")

        if not pwd_context.verify(payload.password, str(user.password_hash)):
            raise ValueError("Invalid credentials")

        return {
            "user_id": user.id,
            "token": f"token-{user.id}",
        }