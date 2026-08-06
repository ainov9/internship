import json
import logging
import os
import re
from datetime import datetime, timezone
from pathlib import Path

from core.openai_client import get_openai_client
from chatbot.services.data_loader import load_data

logger = logging.getLogger(__name__)
data = load_data()
UNANSWERED_QUESTIONS_PATH = Path(__file__).with_name("unanswered_questions.json")


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


UNCERTAINTY_PATTERNS = (
    "i don't know",
    "i do not know",
    "not sure",
    "no information",
    "je ne sais pas",
    "aucune information",
    "je ne suis pas sûr",
    "je ne suis pas certain",
)


def _classification_category(question):
    question = (question or "").casefold()
    if any(word in question for word in ("prix", "coût", "cout", "tarif", "price")):
        return "pricing"
    if any(word in question for word in ("erreur", "problème", "probleme", "installation", "bug")):
        return "technical"
    if _products_for_message(question):
        return "product"
    return "other"


def classify_response(question, response, context):
    """Classify whether a generated answer is supported by the supplied context."""
    timestamp = datetime.now(timezone.utc).isoformat()
    response_data = response
    if isinstance(response, str):
        try:
            response_data = json.loads(response)
        except json.JSONDecodeError:
            response_data = {"text": response}

    answer_text = str(response_data.get("text", "")) if isinstance(response_data, dict) else str(response_data or "")
    context_text = json.dumps(context, ensure_ascii=False) if isinstance(context, (dict, list)) else str(context or "")
    normalized_answer = answer_text.casefold().strip()
    context_is_empty = not context_text.strip() or context_text.casefold().strip() in {
        "aucune information trouvée",
        "no information",
    }
    uncertain = any(pattern in normalized_answer for pattern in UNCERTAINTY_PATTERNS)

    product_context = _products_for_message(question)
    product_addressed = not product_context or any(
        str(product.get("nom", "")).casefold() in normalized_answer
        for product in product_context
    )
    directly_answered = bool(answer_text) and product_addressed

    if context_is_empty or uncertain or not directly_answered:
        reason = "Aucune information pertinente dans le contexte."
        if uncertain:
            reason = "La réponse exprime une incertitude."
        elif not directly_answered:
            reason = "La réponse ne traite pas directement la question."
        return {
            "question": question,
            "status": "unanswered",
            "reason": reason,
            "timestamp": timestamp,
            "suggested_category": _classification_category(question),
        }

    return {"status": "answered"}


def save_unanswered_question(classification):
    """Append only responses that explicitly express uncertainty."""
    if (
        classification.get("status") != "unanswered"
        or classification.get("reason") != "La réponse exprime une incertitude."
    ):
        return

    records = []
    if UNANSWERED_QUESTIONS_PATH.exists():
        try:
            stored = json.loads(UNANSWERED_QUESTIONS_PATH.read_text(encoding="utf-8"))
            if isinstance(stored, list):
                records = stored
        except (OSError, json.JSONDecodeError):
            records = []

    records.append(classification)
    UNANSWERED_QUESTIONS_PATH.write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


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


def get_ai_reply(messages, model="gpt-3.5-turbo", max_tokens=100, temperature=0.8):
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
