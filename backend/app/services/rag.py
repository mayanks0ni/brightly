from app.ai.embeddings import embed_text
from app.db.pinecone import index

def retrieve_relevant_memories(
    user_id: str,
    query: str,
    top_k: int = 5,
) -> list[str]:

    query_vector = embed_text(query)

    results = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True,
        filter={
            "user_id": user_id  # ✅ FIXED KEY
        },
    )

    # Safety check
    if not results.matches:
        return []

    return [
        match.metadata["text"]  # ✅ FIXED ACCESS
        for match in results.matches
    ]
