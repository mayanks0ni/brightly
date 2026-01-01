import uuid
from datetime import datetime

from app.ai.embeddings import embed_text
from app.db.pinecone import index
from app.services.firebase import save_memory


async def store_memory(user_id: str, text: str):
    memory_id = str(uuid.uuid4())

    # UTC timestamp
    created_at = datetime.utcnow()

    # Derived date fields
    date_str = created_at.strftime("%Y-%m-%d")
    year = created_at.year
    month = created_at.month
    timestamp = int(created_at.timestamp())

    # 1️⃣ Save raw memory to Firestore (source of truth)
    await save_memory(
        memory_id=memory_id,
        user_id=user_id,
        text=text,
        created_at=created_at,
    )

    # 2️⃣ Generate embedding (blocking, intentional)
    vector = embed_text(text)

    # 3️⃣ Index in Pinecone (RAG layer)
    index.upsert(
        [
            {
                "id": memory_id,
                "values": vector,
                "metadata": {
                    "userId": user_id,        # ✅ consistent key
                    "text": text,
                    "date": date_str,         # UI display
                    "year": year,             # yearly filter
                    "month": month,           # future use
                    "timestamp": timestamp,   # numeric ranges
                },
            }
        ]
    )

    return memory_id
