# apps/datasets/services/validation.py

import os

# ✅ Allowed extensions
ALLOWED_EXTENSIONS = [".txt", ".pdf", ".json", ".csv"]

# ✅ Max file size (5 MB)
MAX_FILE_SIZE = 5 * 1024 * 1024


class FileValidationError(Exception):
    pass


def validate_file(file):
    """
    Main validation function
    """

    validate_extension(file)
    validate_size(file)


def validate_extension(file):
    ext = os.path.splitext(file.name)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise FileValidationError(
            f"File type '{ext}' not allowed. Allowed: {ALLOWED_EXTENSIONS}"
        )


def validate_size(file):
    if file.size > MAX_FILE_SIZE:
        raise FileValidationError(
            f"File too large. Max size is {MAX_FILE_SIZE / (1024 * 1024)} MB"
        )