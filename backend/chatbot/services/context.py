from chatbot.services.data_loader import load_data


def get_context(user_message):
    data = load_data()
    question = (user_message or "").casefold()
    results = []

    for product in data.get("catalogue", []):
        if (
            str(product.get("nom", "")).casefold() in question
            or str(product.get("categorie", "")).casefold() in question
            or str(product.get("prix", "")) in question
            or str(product.get("stock", "")).casefold() in question
        ):
            result = f"{product.get('nom', '')} ({product.get('prix', '')}€, stock: {product.get('stock', '')})"
            if "image" in product:
                result += f" [image: {product['image']}]"
            results.append(result)

    for keyword, answer in data.get("faq", {}).items():
        if keyword.casefold() in question:
            results.append(answer)

    return "\n".join(results) if results else "Aucune information trouvée"
