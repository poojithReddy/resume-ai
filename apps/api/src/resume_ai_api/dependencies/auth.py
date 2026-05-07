from fastapi import Depends

from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from sqlalchemy.orm import Session

from resume_ai_api.core.constants import (
    ADMIN_ROLE,
    SUPER_ADMIN_ROLE,
)
from resume_ai_api.core.errors import AppError
from resume_ai_api.core.security import verify_token
from resume_ai_api.dependencies.db import (
    get_db_session,
)
from resume_ai_api.repositories.user_repository import (
    UserRepository,
)


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
):
    token = credentials.credentials

    try:
        payload = verify_token(token)

        user_id = payload.get("sub")
        role = payload.get("role")

        if not user_id or not role:
            raise AppError(
                "Invalid token payload",
                code="INVALID_TOKEN",
                status_code=401,
            )

        return payload

    except Exception:
        raise AppError(
            "Invalid or expired token",
            code="INVALID_TOKEN",
            status_code=401,
        )


def get_current_user_id(
    user=Depends(get_current_user),
) -> str:
    return user["sub"]


def get_current_user_with_db(
    user=Depends(get_current_user),
    db: Session = Depends(get_db_session),
):
    repo = UserRepository(db)

    db_user = repo.get_by_id(
        user["sub"]
    )

    if not db_user:
        raise AppError(
            "User not found",
            code="USER_NOT_FOUND",
            status_code=404,
        )

    if not db_user.is_active:
        raise AppError(
            "User account is deactivated",
            code="ACCOUNT_DEACTIVATED",
            status_code=403,
        )

    return db_user


def require_admin(
    user=Depends(get_current_user_with_db),
):
    if user.role not in [
        ADMIN_ROLE,
        SUPER_ADMIN_ROLE,
    ]:
        raise AppError(
            "Admin access required",
            code="ADMIN_ACCESS_REQUIRED",
            status_code=403,
        )

    return user