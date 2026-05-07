from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.security import HTTPBearer

from resume_ai_api.api.v1.router import router as api_router
from resume_ai_api.core.errors import AppError
from resume_ai_api.core.error_handlers import (
    app_error_handler,
    validation_error_handler,
)

app = FastAPI(title="Hire Lens AI API")

security = HTTPBearer()

# Exception handlers
app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(
    RequestValidationError,
    validation_error_handler,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(api_router, prefix="/api/v1")