from pydantic import BaseModel
from typing import List

class YearlyRecap(BaseModel):
    year: int
    total_memories: int
    themes: List[str]
    peak_moments: List[str]
    narrative: str
    personality: str
    closing_note: str
