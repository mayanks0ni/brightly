from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user
from app.services.motivation_service import generate_daily_motivation

router = APIRouter()

@router.post("/daily")
def daily_motivation(user=Depends(get_current_user)):
    motivation = generate_daily_motivation(user["uid"])
    return {"text": motivation}

