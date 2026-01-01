# from app.services.rag import retrieve_relevant_memories
# from app.ai.model import run_llm

# def generate_daily_motivation(user_id: str) -> str:
#     # 1️⃣ Always retrieve multiple candidates
#     results = retrieve_relevant_memories(
#         user_id=user_id,
#         query="a personal moment from my life",
#         top_k=5,
#     )

#     # 2️⃣ Absolute fallback if vector DB is empty
#     if not results:
#         return (
#             "You’ve been taking time to notice your experiences. "
#             "That awareness itself is something worth continuing."
#         )

#     # 3️⃣ Deterministically select the top memory
#     memory = results[0]

#     # 4️⃣ Give the LLM a job it CANNOT fail at
#     prompt = f"""
# You are a calm, grounding voice.

# The following is a personal memory written by the user.
# Your task is NOT to exaggerate or hype.
# Simply reflect it back in a gentle, encouraging way.

# Write 2–3 sentences that help the user
# remember why this moment mattered to them.

# Memory:
# "{memory}"

# Reflection:
# """

#     output = run_llm(prompt).strip()

#     # 5️⃣ Safety fallback (LLMs can be weird sometimes)
#     if not output:
#         return (
#             "You’ve lived moments that mattered to you. "
#             "Taking a second to remember them can quietly strengthen you."
#         )

#     return output

from app.services.rag import retrieve_relevant_memories
from app.ai.model import run_llm

def generate_daily_motivation(user_id: str) -> str:
    # 1️⃣ Always retrieve multiple candidates
    results = retrieve_relevant_memories(
        user_id=user_id,
        query="a personal moment from my life",
        top_k=5,
    )

    # 2️⃣ Absolute fallback if vector DB is empty
    if not results:
        return (
            "You’ve been taking time to notice your experiences. "
            "That awareness itself is something worth continuing."
        )

    # 3️⃣ Deterministically select the top memory
    memory = results[0]

    # 4️⃣ Give the LLM a job it CANNOT fail at
    prompt = f"""
You are a calm, grounding voice.

The following is a personal memory written by the user.
Your task is NOT to exaggerate or hype.
Simply reflect it back in a gentle, encouraging way.

Write 2–3 sentences that help the user
remember why this moment mattered to them.

Memory:
"{memory}"

Reflection:
"""

    output = run_llm(prompt).strip()

    # 5️⃣ Safety fallback
    if not output:
        return (
            "You’ve lived moments that mattered to you. "
            "Taking a second to remember them can quietly strengthen you."
        )

    return output

