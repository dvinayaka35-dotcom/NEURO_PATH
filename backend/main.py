from fastapi import FastAPI
from database import create_db

from routers import quiz
from routers import progress
from routers import hints

app = FastAPI(
    title="EduAI Backend",
    version="1.0.0"
)

create_db()

app.include_router(quiz.router)
app.include_router(progress.router)
app.include_router(hints.router)

@app.get("/")
def home():
    return {
        "message": "EduAI Backend Running"
    }