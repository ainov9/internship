import logging
from core.openai_client import get_openai_client

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "Tu es un assistant IA utile et amical. "
    "Réponds toujours en français de manière claire et concise."
)


def get_ai_reply(messages, model="gpt-3.5-turbo", max_tokens=500, temperature=0.7):
    client = get_openai_client()

    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in messages:
        api_messages.append({"role": msg["role"], "content": msg["content"]})

    try:
        response = client.chat.completions.create(
            model=model,
            messages=api_messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        choice = response.choices[0]
        return {
            "content": choice.message.content,
            "tokens_used": response.usage.total_tokens if response.usage else 0,
            "model": response.model,
        }
    except Exception as e:
        logger.error("OpenAI API error: %s", e)
        raise
