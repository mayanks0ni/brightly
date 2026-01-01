from app.ai.embeddings import embed_text
from app.db.pinecone import index

def retrieve_yearly_memories(user_id: str, year: int, top_k: int = 40):
    # 1️⃣ Use a meaningful semantic query
    query_vector = embed_text(
        "important positive moments and meaningful experiences"
    )

    results = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True,
        filter={
            "userId": user_id,
            "year": year,
        },
    )

    return [
        {
            "text": m["metadata"]["text"],
            "date": m["metadata"]["date"],
        }
        for m in results["matches"]
    ]
