from unittest.mock import MagicMock
import pytest
from chatbot.services import ai_service


def _make_fake_client(total_tokens, content="Réponse simulée"):
    """Construit un faux client OpenAI dont la réponse renvoie total_tokens."""
    fake_response = MagicMock()
    fake_response.choices = [MagicMock(message=MagicMock(content=content))]
    fake_response.usage = MagicMock(total_tokens=total_tokens)
    fake_response.model = "gpt-3.5-turbo"

    fake_client = MagicMock()
    fake_client.chat.completions.create.return_value = fake_response
    return fake_client


@pytest.fixture(autouse=True)
def fake_api_key(monkeypatch):
    # Simule la présence d'une clé API pour sortir du mode "fallback"
    monkeypatch.setenv("OPENAI_API_KEY", "fake-key-for-tests")


def test_default_max_tokens_is_100_not_200(monkeypatch):
    fake_client = _make_fake_client(total_tokens=80)
    monkeypatch.setattr(ai_service, "get_openai_client", lambda: fake_client)

    ai_service.get_ai_reply([{"role": "user", "content": "Bonjour"}])

    _, kwargs = fake_client.chat.completions.create.call_args
    assert kwargs["max_tokens"] == 100
    assert kwargs["max_tokens"] != 200


def test_explicit_max_tokens_is_forwarded_unchanged(monkeypatch):
    fake_client = _make_fake_client(total_tokens=50)
    monkeypatch.setattr(ai_service, "get_openai_client", lambda: fake_client)

    ai_service.get_ai_reply(
        [{"role": "user", "content": "Bonjour"}], max_tokens=100
    )

    _, kwargs = fake_client.chat.completions.create.call_args
    assert kwargs["max_tokens"] == 100


def test_default_temperature_is_valid(monkeypatch):
    fake_client = _make_fake_client(total_tokens=20)
    monkeypatch.setattr(ai_service, "get_openai_client", lambda: fake_client)

    ai_service.get_ai_reply([{"role": "user", "content": "Bonjour"}])

    _, kwargs = fake_client.chat.completions.create.call_args
    assert 0 <= kwargs["temperature"] <= 2


def test_tokens_used_does_not_exceed_the_100_cap(monkeypatch):
    # La réponse simulée respecte la limite fixée (100), pas 200
    fake_client = _make_fake_client(total_tokens=95)
    monkeypatch.setattr(ai_service, "get_openai_client", lambda: fake_client)

    result = ai_service.get_ai_reply([{"role": "user", "content": "Bonjour"}])

    assert result["tokens_used"] <= 100
    assert result["tokens_used"] != 200


def test_no_api_key_returns_zero_tokens(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    result = ai_service.get_ai_reply([{"role": "user", "content": "Bonjour"}])

    assert result["tokens_used"] == 0
    assert result["model"] == "fallback"
