"""Backend tests for GFA Vietnam API — quote, leads, chat SSE."""
import os
import json
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Load from frontend .env directly if not in environ
    envp = "/app/frontend/.env"
    with open(envp) as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"


# --------- Health ---------
def test_root():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    assert "GFA" in r.json().get("message", "")


# --------- Quote validation ---------
def test_quote_validation_short_name():
    r = requests.post(f"{API}/quote", json={
        "name": "A", "phone": "0912345678", "service": "Thuê xe dài hạn"
    }, timeout=15)
    assert r.status_code == 422


def test_quote_validation_short_phone():
    r = requests.post(f"{API}/quote", json={
        "name": "Test User", "phone": "123", "service": "Thuê xe dài hạn"
    }, timeout=15)
    assert r.status_code == 422


# --------- Quote create + AI classification + leads list ---------
@pytest.fixture(scope="module")
def created_lead():
    payload = {
        "name": "TEST_Nguyen Van A",
        "phone": "0912345678",
        "service": "Thuê xe dài hạn",
        "date": "2026-02-01",
        "note": "Cần 2 xe 16 chỗ đưa đón nhân viên hàng ngày",
        "source": "pytest",
    }
    r = requests.post(f"{API}/quote", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "id" in data and data["name"] == payload["name"]
    assert data["email_status"] == "pending"
    return data


def test_quote_creates_lead(created_lead):
    assert created_lead["phone"] == "0912345678"
    assert created_lead["service"] == "Thuê xe dài hạn"


def test_lead_ai_and_email_status(created_lead):
    """After ~20s the background task should populate AI fields + skip email."""
    lead_id = created_lead["id"]
    found = None
    for _ in range(12):  # up to ~60s
        time.sleep(5)
        r = requests.get(f"{API}/leads", timeout=15)
        assert r.status_code == 200
        for lead in r.json():
            if lead["id"] == lead_id:
                if lead.get("email_status") != "pending":
                    found = lead
                    break
        if found:
            break
    assert found is not None, "Lead never updated by background task"
    assert "skipped" in found["email_status"].lower(), f"Unexpected email_status: {found['email_status']}"
    assert found.get("ai_category"), "ai_category missing"
    assert found.get("ai_priority"), "ai_priority missing"
    assert found.get("ai_summary"), "ai_summary missing"


# --------- Chat SSE ---------
def test_chat_sse_stream_and_history():
    session_id = f"pytest-{int(time.time())}"
    payload = {"session_id": session_id, "message": "Xin chào, tôi muốn thuê xe 16 chỗ đưa đón nhân viên."}
    got_delta = False
    got_done = False
    reply_text_parts = []
    with requests.post(f"{API}/chat", json=payload, stream=True, timeout=60) as r:
        assert r.status_code == 200
        assert "text/event-stream" in r.headers.get("content-type", "")
        for raw in r.iter_lines(decode_unicode=True):
            if not raw:
                continue
            assert raw.startswith("data:"), raw
            data = json.loads(raw[5:].strip())
            if "delta" in data:
                got_delta = True
                reply_text_parts.append(data["delta"])
            if data.get("done"):
                got_done = True
                break
    assert got_delta, "No delta received"
    assert got_done, "No done marker received"
    full = "".join(reply_text_parts)
    assert len(full) > 5
    # Basic Vietnamese sanity — should contain Vietnamese characters or common words
    vn_markers = ["à", "á", "ạ", "ả", "ấ", "ầ", "ậ", "ẩ", "ẫ", "ắ", "ằ", "ặ", "ẳ", "ẵ",
                  "è", "é", "ê", "ế", "ề", "ệ", "ể", "ễ", "ì", "í", "ị", "ỉ", "ĩ",
                  "ò", "ó", "ọ", "ỏ", "õ", "ô", "ố", "ồ", "ộ", "ổ", "ỗ", "ơ", "ớ", "ờ", "ợ", "ở", "ỡ",
                  "ù", "ú", "ụ", "ủ", "ũ", "ư", "ứ", "ừ", "ự", "ử", "ữ", "ý", "ỳ", "ỵ", "ỷ", "ỹ", "đ"]
    assert any(m in full.lower() for m in vn_markers) or "chào" in full.lower() or "GFA" in full or "Zalo" in full or "xe" in full.lower()

    # History endpoint
    time.sleep(1)
    r = requests.get(f"{API}/chat/{session_id}", timeout=15)
    assert r.status_code == 200
    msgs = r.json()
    assert len(msgs) >= 2
    roles = [m["role"] for m in msgs]
    assert "user" in roles and "assistant" in roles


def test_chat_validation_short_session():
    r = requests.post(f"{API}/chat", json={"session_id": "abc", "message": "hi"}, timeout=15)
    assert r.status_code == 422
