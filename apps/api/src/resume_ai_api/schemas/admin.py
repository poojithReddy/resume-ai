import re

from pydantic import BaseModel, EmailStr, Field, field_validator

from resume_ai_api.core.constants import USER_ROLE, ADMIN_ROLE, SUPER_ADMIN_ROLE


PASSWORD_PATTERN = re.compile(r"^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$")


class CreateUserRequest(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str
    role: str = USER_ROLE

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not PASSWORD_PATTERN.match(value):
            raise ValueError(
                "Password must be at least 8 characters and include 1 uppercase letter and 1 symbol."
            )
        return value

    @field_validator("role")
    @classmethod
    def validate_role(cls, value: str) -> str:
        if value not in [USER_ROLE, ADMIN_ROLE, SUPER_ADMIN_ROLE]:
            raise ValueError("Invalid role")
        return value


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    is_active: bool