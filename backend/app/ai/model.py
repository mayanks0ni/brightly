import os
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini").lower()
if LLM_PROVIDER == "gemini":
    from google import genai
    from google.genai import types

    client = genai.Client()
    config = types.GenerateContentConfig(
        temperature=0.4,          # Lower temperature for grounded, consistent output
        top_p=0.9                # Nucleus sampling for a balance of variety and focus
    )

    def run_llm(prompt: str) -> str:
        try:
            response = client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt, config=config
            )

            if not response or not response.text:
                return ""

            return response.text.strip()

        except Exception as e:
            # Absolute safety: never crash motivation pipeline
            return ""
else:
    import subprocess
    import json

    def run_llm(prompt: str, json_output: bool = False):
        result = subprocess.run(
            ["ollama", "run", "llama3", prompt],
            capture_output=True,
            text=True
        )
        output = result.stdout.strip()

        if json_output:
            try:
                return json.loads(output)
            except json.JSONDecodeError:
                return {"error": "Invalid JSON from model", "raw": output}

        return output
