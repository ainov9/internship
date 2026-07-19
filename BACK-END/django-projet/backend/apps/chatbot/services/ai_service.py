# chatbot/services/ai_service.py

from openai import OpenAI
# Load environment variables from .env file  (for the securtity of  our key )
from dotenv import load_dotenv
load_dotenv()


client = OpenAI(api_key="OPENAI_API_KEY")

def generate_ai_response(messages):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )
    return response.choices[0].message.content