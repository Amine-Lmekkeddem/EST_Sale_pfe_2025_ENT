# health.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/healthcheck")
async def health_check():
    return {"status": "OK", "message": "Service is running."}
