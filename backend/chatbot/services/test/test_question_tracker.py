import json

from chatbot.services import question_tracker


def test_normalize_question():
    assert question_tracker.normalize_question("Quel est le prix ?!") == "quel est le prix"


def test_similar_questions_are_counted_and_promoted(monkeypatch, tmp_path):
    tracking_path = tmp_path / "question_tracking.json"
    faq_path = tmp_path / "faq.json"
    tracking_path.write_text("[]", encoding="utf-8")
    faq_path.write_text("[]", encoding="utf-8")
    monkeypatch.setattr(question_tracker, "TRACKING_PATH", tracking_path)
    monkeypatch.setattr(question_tracker, "FAQ_PATH", faq_path)

    assert question_tracker.track_question("Quel est le prix du clavier ?") == {"status": "tracked", "count": 1}
    assert question_tracker.track_question("quel est le prix du clavier") == {"status": "tracked", "count": 2}
    result = question_tracker.track_question("Quel est le prix du clavier!")

    assert result == {"status": "faq", "count": 3}
    faq = json.loads(faq_path.read_text(encoding="utf-8"))
    assert faq[0]["status"] == "faq"
    assert faq[0]["count"] == 3
    assert "created_at" in faq[0]
