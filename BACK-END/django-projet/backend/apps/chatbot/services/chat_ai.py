# apps/chatbot/services/chat_service.py

import time
from django.shortcuts import get_object_or_404

from apps.chatbot.models import Conversation, Message
from apps.chatbot.services.ai_service import generate_ai_response
from apps.chatbot.services.context_service import enrich_with_context
from apps.analytics.services.analytics_service import log_query


def handle_user_message(user, content, conversation_id=None):
    """
    Main entry point for chatbot logic
    """

    start_time = time.time()

    # 1️⃣ Get or create conversation
    if conversation_id:
        conversation = get_object_or_404(
            Conversation, id=conversation_id, user=user
        )
    else:
        conversation = Conversation.objects.create(user=user)

    # 2️⃣ Save user message
    user_message = Message.objects.create(
        conversation=conversation,
        sender="user",
        content=content
    )

    # 3️⃣ Get conversation history
    messages = Message.objects.filter(
        conversation=conversation
    ).order_by("created_at")

    history = [
        {"role": msg.sender, "content": msg.content}
        for msg in messages
    ]

    # 4️⃣ Add context (RAG ready)
    enriched_input = enrich_with_context(content)

    history.append({
        "role": "user",
        "content": enriched_input
    })

    # 5️⃣ Generate AI response
    ai_response = generate_ai_response(history)

    # 6️⃣ Calculate response time
    response_time = time.time() - start_time

    # 7️⃣ Save bot message
    bot_message = Message.objects.create(
        conversation=conversation,
        sender="assistant",
        content=ai_response,
        response_time=response_time
    )

    # 8️⃣ Log analytics
    log_query(
        user=user,
        response_time=response_time
    )

    # 9️⃣ Return response
    return {
        "conversation_id": conversation.id,
        "message": ai_response,
        "response_time": round(response_time, 2)
    
    }