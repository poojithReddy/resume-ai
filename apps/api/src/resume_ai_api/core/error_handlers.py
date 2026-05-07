from fastapi import Request
from fastapi.responses import JSONResponse

from resume_ai_api.core.errors import AppError


def app_error_handler(
    _: Request,
    exc: Exception,
) -> JSONResponse:
    if isinstance(exc, AppError):
        app_error = exc
    else:
        app_error = AppError(
            message="Something went wrong",
            code="INTERNAL_SERVER_ERROR",
            status_code=500,
        )

    return JSONResponse(
        status_code=app_error.status_code,
        content={
            "success": False,
            "error": {
                "code": app_error.code,
                "message": app_error.message,
            },
        },
    )


def validation_error_handler(
    _: Request,
    exc: Exception,
) -> JSONResponse:
    errors = getattr(exc, "errors", lambda: [])()
    first_error = errors[0] if errors else {}

    message = first_error.get("msg", "Validation error")

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": message,
            },
        },
    )