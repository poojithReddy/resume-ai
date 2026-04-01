from fastapi import FastAPI

from resume_ai_api.api.v1.router import router as v1_router
from resume_ai_api.core.errors import AppError
from resume_ai_api.core.error_handlers import app_error_handler
from resume_ai_api.db.init_db import init_db
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Resume AI API")

# Register custom error handler
app.add_exception_handler(AppError, app_error_handler)

# Mount API v1
app.include_router(v1_router, prefix="/api/v1")

@app.on_event("startup")
def on_startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)