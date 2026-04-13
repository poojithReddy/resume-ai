from fastapi import Request
from fastapi.responses import JSONResponse

from resume_ai_api.core.errors import AppError


def app_error_handler(request: Request, exc: Exception) -> JSONResponse:
    app_error = exc if isinstance(exc, AppError) else AppError("Something went wrong")

    return JSONResponse(
        status_code=app_error.status_code,
        content={
            "error": {
                "code": app_error.code,
                "message": app_error.message,
            }
        },
    )