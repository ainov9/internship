from chatbot.models import Conversation, Message
from chatbot.services.ai_service import get_ai_reply


def get_or_create_conversation(conversation_id=None, user_id=1):
    if conversation_id:
        try:
            return Conversation.objects.get(id=conversation_id, user_id=user_id), False
        except Conversation.DoesNotExist:
            pass
    conversation = Conversation.objects.create(user_id=user_id)
    return conversation, True


def send_message(message_text, user_id=1, conversation_id=None):
    conversation, _ = get_or_create_conversation(conversation_id, user_id)

    Message.objects.create(
        conversation=conversation,
        role='user',
        content=message_text,
    )

    history = list(
        conversation.messages
        .order_by('created_at')
        .values('role', 'content')
    )

    ai_result = get_ai_reply(history)

    Message.objects.create(
        conversation=conversation,
        role='assistant',
        content=ai_result["content"],
        tokens_used=ai_result["tokens_used"],
    )

    conversation.save()

    return {
        "conversation_id": str(conversation.id),
        "message": ai_result["content"],
        "tokens_used": ai_result["tokens_used"],
        "model": ai_result["model"],
    }


def get_conversation_history(conversation_id, user_id=1):
    try:
        conversation = Conversation.objects.get(id=conversation_id, user_id=user_id)
    except Conversation.DoesNotExist:
        return None

    messages = conversation.messages.order_by('created_at').values(
        'id', 'role', 'content', 'tokens_used', 'created_at'
    )

    return {
        "conversation_id": str(conversation.id),
        "title": conversation.title,
        "created_at": conversation.created_at,
        "messages": list(messages),
    }


def list_conversations(user_id=1):
    conversations = Conversation.objects.filter(user_id=user_id).order_by('-updated_at')
    return [
        {
            "id": str(c.id),
            "title": c.title,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "message_count": c.messages.count(),
        }
        for c in conversations
    ]
