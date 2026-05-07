from typing import Any

from pydantic import BaseModel


class SuccessResponse(BaseModel):
    success: bool = True

    message: str

    data: Any | None = None


class ErrorDetail(BaseModel):
    code: str

    message: str


class ErrorResponse(BaseModel):
    success: bool = False

    error: ErrorDetail