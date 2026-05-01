from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from resume_ai_api.core.security import verify_token


security = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    token = credentials.credentials

    try:
        user_id = verify_token(token)
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")