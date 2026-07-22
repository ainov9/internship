import os
from functools import lru_cache
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent.parent / '.env')


@lru_cache(maxsize=1)
def get_openai_client():
    return OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
