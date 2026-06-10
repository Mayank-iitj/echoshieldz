from fastapi import APIRouter

from app.api.v1 import call_analysis, websocket, caller_lookup, feedback

router = APIRouter()

router.include_router(call_analysis.router)
router.include_router(websocket.router)
router.include_router(caller_lookup.router)
router.include_router(feedback.router)