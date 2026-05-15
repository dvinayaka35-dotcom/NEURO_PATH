from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    is_verified: bool = True
    verification_code: Optional[str] = None
    parent_phone: Optional[str] = None
    theme: str = "dark"
    notif_quiz: bool = True
    notif_docs: bool = True
    profile_image: Optional[str] = None

class LoginHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None

class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    name: str
    email: str

    xp: int = 0
    streak: int = 0

    weak_subject: Optional[str] = None


class QuizResult(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    student_id: int

    topic: str
    score: int
    difficulty: str