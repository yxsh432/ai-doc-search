import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.environ.get("GOOGLE_API_KEY")
if not api_key:
    print("NO API KEY")
else:
    genai.configure(api_key=api_key)
    try:
        models = genai.list_models()
        for m in models:
            if "generateContent" in m.supported_generation_methods:
                print(f"Supported text model: {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")
