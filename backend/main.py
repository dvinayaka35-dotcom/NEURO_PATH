from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db

from routers import quiz
from routers import progress
from routers import hints
from routers import auth
from routers import user
from routers import ai
from routers import quiz_engine

app = FastAPI(
    title="EduAI Backend",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_db()

app.include_router(quiz.router)
app.include_router(progress.router)
app.include_router(hints.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(ai.router)
app.include_router(quiz_engine.router)

# Force-verify all existing users for development
from sqlalchemy import text
with Session(engine) as session:
    session.execute(text("UPDATE user SET is_verified = 1"))
    session.commit()

@app.get("/")
def home():
    return {
        "message": "EduAI Backend Running - v1.0.1"
    }