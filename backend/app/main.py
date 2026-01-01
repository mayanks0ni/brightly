from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import motivation, memory, recap

app = FastAPI(title="Brightly AI Backend")

# ✅ CORS CONFIG (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(
    motivation.router,
    prefix="/motivation",
    tags=["Motivation"],
)

app.include_router(
    memory.router,
    prefix="/api",
    tags=["Memory"],
)

app.include_router(
    recap.router,
    prefix="/recap",
    tags=["Recap"]
)


@app.get("/health")
def health():
    return {"status": "ok"}
