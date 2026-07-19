# apps/datasets/services/upload_service.py

from apps.dataset.models import Document
from .parsing_service import parse_text_file


def handle_file_upload(file, title):
    content = parse_text_file(file)

    document = Document.objects.create(
        title=title,
        content=content
    )

    return document