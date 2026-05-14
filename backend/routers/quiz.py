from fastapi import APIRouter
import json

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)

@router.get("/questions")
def get_questions():

    with open("questions.jason", "r") as file:
        questions = json.load(file)

    return questions