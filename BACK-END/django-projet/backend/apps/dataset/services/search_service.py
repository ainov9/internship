# apps/datasets/services/search_service.py

from apps.dataset.models import FAQ, Document


def search_dataset(query):
    """
    Search in FAQ + Documents
    Returns list of relevant text chunks
    """

    results = []

    # 🔹 1. Search FAQ
    faqs = FAQ.objects.filter(question__icontains=query)[:5]

    for faq in faqs:
        results.append(f"Q: {faq.question}\nA: {faq.answer}")

    # 🔹 2. Search Documents
    docs = Document.objects.filter(content__icontains=query)[:3]

    for doc in docs:
        results.append(doc.content[:500])  # limit size

    return results