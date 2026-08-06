import json
import re
import unicodedata
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path


SERVICES_DIR = Path(__file__).parent
TRACKING_PATH = SERVICES_DIR / "question_tracking.json"
FAQ_PATH = SERVICES_DIR / "faq.json"
SIMILARITY_THRESHOLD = 0.82


def normalize_question(question):
    value = unicodedata.normalize("NFKD", str(question or ""))
    value = "".join(char for char in value if not unicodedata.combining(char))
    value = value.casefold()
    value = re.sub(r"[^\w\s]", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def _load(path):
    if not path.exists():
        return []
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        return value if isinstance(value, list) else []
    except (OSError, json.JSONDecodeError):
        return []


def _save(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _similar(left, right):
    if left == right or left in right or right in left:
        return True
    return SequenceMatcher(None, left, right).ratio() >= SIMILARITY_THRESHOLD


def track_question(question):
    normalized = normalize_question(question)
    if not normalized:
        return {"status": "tracked", "count": 0}

    tracking = _load(TRACKING_PATH)
    entry = next(
        (item for item in tracking if _similar(normalized, item.get("question", ""))),
        None,
    )
    if entry is None:
        entry = {"question": normalized, "count": 0}
        tracking.append(entry)

    entry["count"] = int(entry.get("count", 0)) + 1
    _save(TRACKING_PATH, tracking)

    if entry["count"] > 2:
        faq = _load(FAQ_PATH)
        faq_entry = next(
            (item for item in faq if _similar(entry["question"], item.get("question", ""))),
            None,
        )
        if faq_entry is None:
            faq.append({
                "question": entry["question"],
                "count": entry["count"],
                "status": "faq",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        else:
            faq_entry["count"] = entry["count"]
        _save(FAQ_PATH, faq)
        return {"status": "faq", "count": entry["count"]}

    return {"status": "tracked", "count": entry["count"]}
