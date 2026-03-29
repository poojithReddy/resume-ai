from fastapi import APIRouter

from resume_ai_api.api.v1.routes.health import router as health_router
from resume_ai_api.api.v1.routes.jobs import router as jobs_router

router = APIRouter()

# Add all v1 routes here
router.include_router(health_router)
router.include_router(jobs_router)