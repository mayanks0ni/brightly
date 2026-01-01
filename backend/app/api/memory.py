from fastapi import APIRouter, Depends
from app.schemas.memory import MemoryCreate
from app.services.memory_indexer import store_memory
from app.utils.auth import get_current_user

router = APIRouter()

@router.post("/memory")
async def add_memory(
    payload: MemoryCreate,
    user=Depends(get_current_user),
):
    await store_memory(
        user_id=user["uid"],
        text=payload.text,
    )
    return {"status": "ok"}
