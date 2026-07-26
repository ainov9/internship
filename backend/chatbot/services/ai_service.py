import logging
from core.openai_client import get_openai_client
from chatbot.services.data_loader import load_data
from chatbot.services.context import get_context

logger = logging.getLogger(__name__)


def build_system_prompt(data):
    return f"""
             Tu es un assistant IA utile et amical.
                Réponds toujours en français ou en anglais.
                    Réponse courte (max 3 lignes).

                          Base-toi uniquement sur ces données :
                                               {data}
    """

data = load_data()
SYSTEM_PROMPT = build_system_prompt(data)


def get_ai_reply(messages, model="gpt-3.5-turbo", max_tokens=100, temperature=0.0001):
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


def handle_user_message(user_message):
    context = get_context(user_message)
    if context:
        return context
    ai_response = get_ai_reply(user_message)
    return ai_response
