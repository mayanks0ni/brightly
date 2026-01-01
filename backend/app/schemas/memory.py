from pydantic import BaseModel

class MemoryCreate(BaseModel):
    text: str
