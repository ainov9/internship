import json
import os
from pathlib import Path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / '.env')

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


@csrf_exempt
def chat_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    message = body.get('message', '').strip()
    user_id = body.get('user_id', 1)

    if not message:
        return JsonResponse({'error': 'Message is required'}, status=400)

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Tu es un assistant IA utile et amical. Réponds toujours en français de manière claire et concise."},
                {"role": "user", "content": message}
            ],
            max_tokens=500,
            temperature=0.7,
        )
        reply = response.choices[0].message.content
    except Exception as e:
        return JsonResponse({
            'error': f'OpenAI API error: {str(e)}',
            'status': 'error',
        }, status=500)

    return JsonResponse({
        'message': reply,
        'user_id': user_id,
        'status': 'success',
    })


@csrf_exempt
def tts_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    text = body.get('text', '').strip()
    if not text:
        return JsonResponse({'error': 'Text is required'}, status=400)

    return JsonResponse({
        'message': 'TTS not yet implemented in backend. Use browser TTS fallback.',
        'status': 'not_implemented',
    }, status=501)
