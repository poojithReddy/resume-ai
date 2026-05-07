from fastapi import APIRouter

from resume_ai_api.api.v1.routes import jobs, health, auth, admin
from resume_ai_api.api.v1.routes.compare import router as compare_router
from resume_ai_api.api.v1.routes.admin_jobs import router as admin_jobs_router

router = APIRouter()

router.include_router(health.router)
router.include_router(auth.router)
router.include_router(jobs.router)
router.include_router(admin.router)
router.include_router(admin_jobs_router)
router.include_router(compare_router)