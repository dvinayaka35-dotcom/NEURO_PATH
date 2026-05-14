from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    is_verified: bool = False
    verification_code: Optional[str] = None

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