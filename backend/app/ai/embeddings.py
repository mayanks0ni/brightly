import os
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()

if(LLM_PROVIDER == "gemini"):
    from google import genai
    from typing import List

    client = genai.Client()

    def embed_text(text: str) -> List[float]:
        if not text.strip():
            raise ValueError("Text is empty")

        result = client.models.embed_content(
            model="text-embedding-004",
            contents=text,
        )

        # Google returns a structured response
        embedding = result.embeddings[0].values

        if not isinstance(embedding, list):
            raise RuntimeError("Unexpected embedding format from Google GenAI")

        return embedding

else:
    import subprocess
    import json

    def embed_text(text: str) -> list[float]:
        result = subprocess.run(
            ["ollama", "run", "nomic-embed-text", text],
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            raise RuntimeError(f"Ollama error: {result.stderr}")

        output = result.stdout.strip()

        if not output:
            raise RuntimeError("Empty embedding output from Ollama")

        embedding = json.loads(output)

        if not isinstance(embedding, list):
            raise RuntimeError(f"Unexpected embedding format: {embedding}")

        return embedding

