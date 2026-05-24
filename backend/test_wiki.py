import httpx
import asyncio

async def test_search():
    query = "Albert Einstein"
    lang = "en-US"
    wiki_lang = "en" if lang == "en-US" else "kn"
    headers = {"User-Agent": "NeuroPathAI/1.0 (support@neuropath.edu)"}
    
    print(f"Testing Wikipedia search for: {query} in {wiki_lang}")
    
    async with httpx.AsyncClient(headers=headers) as client:
        try:
            # Step 1: Search
            search_url = f"https://{wiki_lang}.wikipedia.org/w/api.php"
            search_params = {
                "action": "query",
                "list": "search",
                "srsearch": query,
                "format": "json",
                "origin": "*"
            }
            print(f"Calling: {search_url}")
            search_resp = await client.get(search_url, params=search_params, timeout=10.0)
            print(f"Search Status: {search_resp.status_code}")
            
            if search_resp.status_code == 200:
                data = search_resp.json()
                results = data.get("query", {}).get("search", [])
                print(f"Results found: {len(results)}")
                if results:
                    title = results[0]["title"]
                    print(f"Best title: {title}")
                    
                    # Step 2: Summary
                    summary_url = f"https://{wiki_lang}.wikipedia.org/api/rest_v1/page/summary/{title.replace(' ', '_')}"
                    print(f"Calling: {summary_url}")
                    summary_resp = await client.get(summary_url, timeout=10.0)
                    print(f"Summary Status: {summary_resp.status_code}")
                    if summary_resp.status_code == 200:
                        print("Success! Summary received.")
                        print(summary_resp.json().get("extract")[:100] + "...")
                    else:
                        print(f"Summary failed: {summary_resp.text}")
            else:
                print(f"Search failed: {search_resp.text}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_search())
