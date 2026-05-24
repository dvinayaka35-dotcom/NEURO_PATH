from fastapi import APIRouter
from pydantic import BaseModel
import httpx
import random

router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)

class QuestionRequest(BaseModel):
    question: str
    lang: str

async def search_wikipedia(query: str, lang: str):
    """Real-time search using Wikipedia API with two-step title discovery"""
    wiki_lang = "en" if lang == "en-US" else "kn"
    headers = {"User-Agent": "NeuroPathAI/1.0 (https://neuropath.edu; support@neuropath.edu) httpx/0.24"}
    
    async with httpx.AsyncClient(headers=headers) as client:
        try:
            # Step 1: Search for the most relevant page title
            search_url = f"https://{wiki_lang}.wikipedia.org/w/api.php"
            search_params = {
                "action": "query",
                "list": "search",
                "srsearch": query,
                "format": "json",
                "origin": "*"
            }
            search_resp = await client.get(search_url, params=search_params, timeout=5.0)
            
            if search_resp.status_code == 200:
                search_data = search_resp.json()
                results = search_data.get("query", {}).get("search", [])
                
                if results:
                    best_title = results[0]["title"]
                    # Step 2: Get the summary for this specific title
                    summary_url = f"https://{wiki_lang}.wikipedia.org/api/rest_v1/page/summary/{best_title.replace(' ', '_')}"
                    summary_resp = await client.get(summary_url, timeout=5.0)
                    
                    if summary_resp.status_code == 200:
                        data = summary_resp.json()
                        return data.get("extract", "I found a match but couldn't get the summary.")
                    
                    # Fallback to snippet if summary fails
                    snippet = results[0].get("snippet", "").replace('<span class="searchmatch">', '').replace('</span>', '')
                    return f"According to Wikipedia: {snippet}..."
        except Exception as e:
            print(f"Deep Search error: {e}")
    return None

@router.post("/ask")
async def ask_ai(req: QuestionRequest):
    q = req.question.strip().lower()
    
    # Regional Knowledge overrides for high accuracy
    regional_facts = {
        "cm of tamil nadu": "The Chief Minister of Tamil Nadu is C. Joseph Vijay.",
        "cm of tn": "The Chief Minister of Tamil Nadu is C. Joseph Vijay.",
        "cm of karnataka": "The Chief Minister of Karnataka is Siddaramaiah.",
        "prime minister": "The Prime Minister of India is Narendra Modi.",
        "president of india": "The President of India is Droupadi Murmu.",
    }
    
    for key, val in regional_facts.items():
        if key in q:
            return {"answer": val}

    # Perform REAL-TIME WEB SEARCH
    search_result = await search_wikipedia(q, req.lang)
    
    if search_result:
        # Clean up Wikipedia citations like [1], [2]
        import re
        clean_result = re.sub(r'\[\d+\]', '', search_result)
        return {"answer": clean_result}

    # Fallback if search fails
    if req.lang == "kn-IN":
        return {"answer": "ಕ್ಷಮಿಸಿ, ಈ ವಿಷಯದ ಬಗ್ಗೆ ನನಗೆ ಮಾಹಿತಿ ಸಿಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಇನ್ನೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ."}
    return {"answer": f"I analyzed your question about {q}. It seems to be a complex topic. Let me look into it more deeply!"}
