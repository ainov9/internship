from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from services.chat_ai import process_message
from dataset.services.upload_service import handle_uploaded_file
from analytics import generate_analytics


@api_view(['POST'])
def chat_view(request):
    """
    View pour traiter les messages du chatbot
    """

    # 1. récupérer le message
    message = request.data.get("message")
    user_id = request.data.get("user_id")

    # 2. validation simple
    if not message:
        return Response(
            {"error": "Message is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # 3. logique (appel service)
        reply = process_message(message, user_id)

        # 4. réponse
        return Response({
            "reply": reply
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )