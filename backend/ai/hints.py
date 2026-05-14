import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def generate_hint(question):

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an AI tutor."
            },
            {
                "role": "user",
                "content": f"Give a short hint for this question: {question}"
            }
        ]
    )

    return response.choices[0].message.content