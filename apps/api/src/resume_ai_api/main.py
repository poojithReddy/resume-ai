from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from resume_ai_api.api.v1.router import router as api_router
from resume_ai_api.core.errors import AppError, app_error_handler


app = FastAPI(title="Resume AI API")

app.add_exception_handler(AppError, app_error_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")