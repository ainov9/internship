import json
import logging
import os

from core.openai_client import get_openai_client
from chatbot.services.data_loader import load_data

logger = logging.getLogger(__name__)
data = load_data()


def build_system_prompt(data):
    return f"""
Tu es un assistant IA utile et amical.
Base-toi uniquement sur ces données.
Retourne toujours uniquement un objet JSON valide, sans markdown ni explication.
Sans produit avec une image dans le contexte : {{"text": "..."}}.
Avec un produit avec une image : {{"text": "...", "product": {{"name": "...", "image": "..."}}}}.
Avec plusieurs produits avec une image : {{"text": "...", "products": [{{"name": "...", "image": "..."}}]}}.
Le texte doit être concis et contenir au maximum deux lignes.

Données : {data}
"""


SYSTEM_PROMPT = build_system_prompt(data)


def _products_for_message(message):
    question = (message or "").casefold()
    catalogue = data.get("catalogue", [])
    exact_products = [
        product for product in catalogue
        if str(product.get("nom", "")).casefold() in question and "image" in product
    ]
    if exact_products:
        return exact_products

    products = []
    for product in catalogue:
        name = str(product.get("nom", ""))
        category = str(product.get("categorie", ""))
        # Keep useful short product tokens such as "PC", while ignoring
        # one-letter words that would create false matches.
        name_words = [word for word in name.casefold().split() if len(word) >= 2]
        if (
            name.casefold() in question
            or category.casefold() in question
            or any(word in question for word in name_words)
        ):
            if "image" in product:
                products.append(product)
    return products


def _short_text(value):
    lines = [line.strip() for line in str(value or "").splitlines() if line.strip()]
    return "\n".join(lines[:2])


def format_response(content, user_message):
    """Normalize model output to the exact JSON contract used by the frontend."""
    parsed = {}
    try:
        candidate = json.loads(content or "")
        if isinstance(candidate, dict):
            parsed = candidate
    except (TypeError, json.JSONDecodeError):
        pass

    response = {"text": _short_text(parsed.get("text", content))}
    products = _products_for_message(user_message)
    formatted_products = [
        {"name": product.get("nom", ""), "image": product["image"]}
        for product in products
    ]
    if len(formatted_products) == 1:
        response["product"] = formatted_products[0]
    elif formatted_products:
        response["products"] = formatted_products
    return json.dumps(response, ensure_ascii=False)


def get_ai_reply(messages, model="gpt-3.5-turbo", max_tokens=100, temperature=0.6):
    last_user_msg = ""
    for msg in reversed(messages):
        if msg["role"] == "user":
            last_user_msg = msg["content"]
            break

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {
            "content": format_response("Je suis un assistant de démonstration.", last_user_msg),
            "tokens_used": 0,
            "model": "fallback",
        }

    client = get_openai_client()
    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    api_messages.extend({"role": msg["role"], "content": msg["content"]} for msg in messages)

    try:
        response = client.chat.completions.create(
            model=model,
            messages=api_messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        choice = response.choices[0]
        return {
            "content": format_response(choice.message.content, last_user_msg),
            "tokens_used": response.usage.total_tokens if response.usage else 0,
            "model": response.model,
        }
    except Exception as e:
        logger.error("OpenAI API error: %s", e)
        return {
            "content": format_response("Désolé, une erreur est survenue lors de la communication avec l'IA.", last_user_msg),
            "tokens_used": 0,
            "model": "error",
        }
