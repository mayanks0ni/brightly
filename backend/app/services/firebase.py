from app.core.firebase import db

async def save_memory(memory_id, user_id, text, created_at):
    db.collection("memories").document(memory_id).set({
        "userId": user_id,
        "text": text,
        "createdAt": created_at,
    })

async def save_yearly_recap(user_id, recap_id, recap):
    db.collection("yearlyRecap").document(recap_id).set({
        "userId": user_id,
        "year": recap["year"],
        "total_memories": recap["total_memories"],
        "themes": recap["themes"],
        "peak_moments": recap["peak_moments"],
        "narrative": recap["narrative"],
        "personality": recap["personality"],
        "closing_note": recap["closing_note"]
    })
