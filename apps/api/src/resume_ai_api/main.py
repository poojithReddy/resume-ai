from fastapi import FastAPI

from resume_ai_api.api.v1.router import router as v1_router
from resume_ai_api.core.errors import AppError
from resume_ai_api.core.error_handlers import app_error_handler

app = FastAPI(title="Resume AI API")

# Register custom error handler
app.add_exception_handler(AppError, app_error_handler)

# Mount API v1
app.include_router(v1_router, prefix="/api/v1")
