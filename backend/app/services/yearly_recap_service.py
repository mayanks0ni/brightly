from app.ai.model import run_llm
from app.schemas.recap import YearlyRecap
from app.services.recap_parser import parse_recap

def generate_yearly_recap(user_id: str, year: int, memories: list[dict]) -> YearlyRecap:
    joined = "\n".join(f"- {m['text']}" for m in memories[:30])

    prompt = f"""
You are creating a personal yearly recap.

Write the response in the following EXACT format
(use these headers literally):

THEMES:
- item
- item

PEAK MOMENTS:
- item
- item
- item

NARRATIVE:
A short paragraph (3–4 sentences).

PERSONALITY:
2–4 word label.

CLOSING NOTE:
One gentle sentence.

Memories:
{joined}
"""

    raw = run_llm(prompt)

    return parse_recap(raw, year, memories)
