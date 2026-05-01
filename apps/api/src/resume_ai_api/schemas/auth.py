import re

from pydantic import BaseModel, EmailStr, Field, field_validator


PASSWORD_PATTERN = re.compile(r"^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$")


class SignupRequest(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not PASSWORD_PATTERN.match(value):
            raise ValueError(
                "Password must be at least 8 characters and include 1 uppercase letter and 1 symbol."
            )
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    user_id: str
    email: EmailStr
    token: str

class UpdateProfileRequest(BaseModel):
    name: str | None = None
    password: str | None = None
    confirm_password: str | None = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str | None):
        if value and not PASSWORD_PATTERN.match(value):
            raise ValueError(
                "Password must be at least 8 characters and include 1 uppercase letter and 1 symbol."
            )
        return value