def enrich_with_context(user_message):
    system_context = (
        "You are a helpful AI assistant from dataset. "
        "Answer clearly and concisely from dataset ."
    )

    return f"{system_context}\n\nUser: {user_message}"