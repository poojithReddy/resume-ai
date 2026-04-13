from fastapi import APIRouter

from resume_ai_api.api.v1.routes import jobs, health, auth

router = APIRouter()

router.include_router(health.router)
router.include_router(auth.router)
router.include_router(jobs.router)