import pytest
from chatbot.services import context as context_module


@pytest.fixture
#test the load function 
def sample_data():
    return {
        "catalogue": [
            {
                "id": "X1",
                "nom": "Produit A",
                "categorie": "Test",
                "prix": 10,
                "stock": "disponible",
            },
        ],
        "faq": {
            "livraison": "La livraison est effectuée sous 3 à 5 jours ouvrés.",
        },
    }


@pytest.fixture(autouse=True)
#test the load_data function
def patch_load_data(monkeypatch, sample_data):
    monkeypatch.setattr(context_module, "load_data", lambda: sample_data)


def test_empty_input():
    assert context_module.get_context("") == "Aucune information trouvée"


def test_existing_product():
    result = context_module.get_context("prix produit A")
    assert "Produit A" in result


def test_unknown_product():
    result = context_module.get_context("prix produit Z")
    assert result == "Aucune information trouvée"


def test_faq():
    result = context_module.get_context("livraison")
    assert "livraison" in result.lower()