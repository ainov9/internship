from chatbot.services.data_loader import load_data


def get_context(user_message):
    data = load_data()
    question = user_message.lower()

    results = []

    for produit in data["catalogue"]:
        if (
            produit["nom"].lower() in question
            or produit["categorie"].lower() in question
            or str(produit["prix"]) in question
            or str(produit["stock"]) in question
        ):
            results.append(
                f"{produit['nom']} ({produit['prix']}€, stock: {produit['stock']})"
            )

    if results:
        return "\n".join(results)
    return ""
