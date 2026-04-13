from fastapi import Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    def __init__(self, message: str, code: str = "APP_ERROR", status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(message)


def app_error_handler(request: Request, exc: Exception) -> JSONResponse:
    app_error = exc if isinstance(exc, AppError) else AppError("Something went wrong", status_code=500)

    return JSONResponse(
        status_code=app_error.status_code,
        content={
            "error": {
                "code": app_error.code,
                "message": app_error.message,
            }
        },
    )