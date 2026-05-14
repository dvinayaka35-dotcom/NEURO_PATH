from fastapi import APIRouter
from ai.hints import generate_hint

router = APIRouter(prefix="/hints", tags=["Hints"])

@router.get("/")
def get_hint(question: str):
    hint = generate_hint(question)
    return {"hint": hint}