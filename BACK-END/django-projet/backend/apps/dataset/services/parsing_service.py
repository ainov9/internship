# apps/datasets/services/parsing_service.py

def parse_text_file(file):
    """
    Extract text from uploaded file
    (basic version)
    """
    content = file.read().decode("utf-8")
    return content