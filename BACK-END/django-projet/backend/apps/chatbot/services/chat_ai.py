# apps/chatbot/services/chat_service.py

import time
from django.shortcuts import get_object_or_404

from apps.chatbot.models import Conversation, Message
from apps.chatbot.services.ai_service import generate_ai_response
from apps.analytics.services.analytics_service import log_query


def store_human_response(conversation_id, content, agent=None):
    conversation = get_object_or_404(Conversation, id=conversation_id)

    return Message.objects.create(
        conversation=conversation,
        sender="human_agent",
        content=content,
        is_human_reviewed=True,
        reviewed_by=agent if agent else None,
    )


def handle_user_message(user, content, conversation_id=None):
    start_time = time.time()

    #  Conversation
    if conversation_id:
        conversation = get_object_or_404(
            Conversation, id=conversation_id, user=user
        )
    else:
        conversation = Conversation.objects.create(user=user)

    # Save user message
    Message.objects.create(
        conversation=conversation,
        sender="user",
        content=content
    )

    #  History
    messages = Message.objects.filter(
        conversation=conversation
    ).order_by("created_at")

    history = [
        {"role": msg.sender, "content": msg.content}
        for msg in messages
    ]

    #  AI response (simple)
    ai_response = generate_ai_response(history)

    #  Timing
    response_time = time.time() - start_time

    # Save assistant message
    Message.objects.create(
        conversation=conversation,
        sender="assistant",
        content=ai_response,
        response_time=response_time
    )

    #  Analytics
    log_query(user=user, response_time=response_time)

    return {
        "conversation_id": conversation.id,
        "message": ai_response,
        "response_time": round(response_time, 2)
    }