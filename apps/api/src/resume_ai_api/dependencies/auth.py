from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from resume_ai_api.core.constants import ADMIN_ROLE, SUPER_ADMIN_ROLE
from resume_ai_api.core.security import verify_token
from resume_ai_api.dependencies.db import get_db_session
from resume_ai_api.repositories.user_repository import UserRepository


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        return verify_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def get_current_user_id(user=Depends(get_current_user)) -> str:
    return user["sub"]


def get_current_user_with_db(
    user=Depends(get_current_user),
    db: Session = Depends(get_db_session),
):
    repo = UserRepository(db)
    db_user = repo.get_by_id(user["sub"])

    if not db_user or not db_user.is_active:
        raise HTTPException(status_code=403, detail="User inactive or not found")

    return db_user


def require_admin(user=Depends(get_current_user_with_db)):
    if user.role not in [ADMIN_ROLE, SUPER_ADMIN_ROLE]:
        raise HTTPException(status_code=403, detail="Admin access required")

    return user