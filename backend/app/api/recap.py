from fastapi import APIRouter, Header
from datetime import datetime
from app.services.firebase import save_yearly_recap
from app.services.yearly_rag import retrieve_yearly_memories
from app.services.yearly_recap_service import generate_yearly_recap

router = APIRouter()

@router.post("/yearly")
async def yearly_recap(year: int, x_user_id: str = Header(...)):
    memories = retrieve_yearly_memories(x_user_id, year)

    if not memories:
        return {
            "year": year,
            "total_memories": 0,
            "themes": [],
            "peak_moments": [],
            "narrative": "You are just getting started.",
            "personality": "The Beginner",
            "closing_note": "Every journey starts with noticing."
        }

    recap = generate_yearly_recap(x_user_id, year, memories)
    recap_id = x_user_id+"_"+f"{datetime.now().year}"
    await save_yearly_recap(x_user_id, recap_id, recap)
    return recap
