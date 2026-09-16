from fastapi import FastAPI, APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import json
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import resend
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("gfa")

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
LEAD_NOTIFY_EMAIL = os.environ.get('LEAD_NOTIFY_EMAIL')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

app = FastAPI(title="GFA Việt Nam API")
api_router = APIRouter(prefix="/api")

GFA_KNOWLEDGE = """
Bạn là "Trợ lý tư vấn GFA" – trợ lý ảo của GFA Việt Nam, công ty cho thuê xe có 20 năm kinh nghiệm tại Hà Nội.
Thông tin công ty:
- Công ty TNHH GFA Việt Nam, trụ sở: Ô số E20 Khu E, khu đất 3ha, P. Phú Diễn, Hà Nội (chi nhánh Khu B38). Vận hành thêm GFA Auto và GFA Tour.
- Đội xe từ 4 đến 45 chỗ, gồm Toyota (Camry, Fortuner, Innova), Honda, Ford, Hyundai, Mercedes, BMW, Lexus, Nissan, Mitsubishi, Porsche, Jaguar.
- Dịch vụ: Thuê xe dài hạn (theo tháng/năm cho doanh nghiệp, cá nhân), Ngoại tỉnh & xe công vụ (đưa đón cán bộ, chuyên gia), Xe sân bay Nội Bài, Xe cưới hỏi, Du lịch & lễ hội, Xe tự lái & thuê kèm tài xế.
- Tài xế kinh nghiệm, lịch sự. Đánh giá 4.7 sao trên Google Maps. Giờ văn phòng: Thứ 2 – Chủ nhật, 8:00 – 17:00; xe phục vụ theo lịch đặt kể cả sớm/tối.
- Hotline: 0916 269 919 (gọi/Zalo), 0919 191 996; điện thoại bàn 024 3755 6677. Email: info.gfavietnam@gmail.com, datxe.gfavietnam@gmail.com. Zalo: https://zalo.me/0916919919.
Quy tắc trả lời:
- Luôn trả lời bằng tiếng Việt, ngắn gọn (tối đa 4-5 câu), thân thiện, chuyên nghiệp.
- KHÔNG bịa ra giá cụ thể. Nếu khách hỏi giá, giải thích giá phụ thuộc loại xe, lộ trình, thời gian và mời khách nhắn Zalo hoặc gọi hotline để nhận báo giá trong 15 phút, hoặc điền form "Yêu cầu báo giá" trên trang.
- Luôn kết thúc bằng một lời mời hành động: nhắn Zalo / gọi hotline 0916 269 919 / gửi yêu cầu báo giá.
- Không trả lời các chủ đề không liên quan đến thuê xe; lịch sự hướng khách về dịch vụ của GFA.
"""


class QuoteCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=8, max_length=20)
    service: str = Field(min_length=2, max_length=100)
    date: Optional[str] = None
    note: Optional[str] = Field(default=None, max_length=1500)
    source: Optional[str] = "website"


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    service: str
    date: Optional[str] = None
    note: Optional[str] = None
    source: Optional[str] = "website"
    ai_summary: Optional[str] = None
    ai_category: Optional[str] = None
    ai_priority: Optional[str] = None
    email_status: str = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=6, max_length=80)
    message: str = Field(min_length=1, max_length=1500)


def _claude(session_id: str, system_message: str) -> LlmChat:
    return LlmChat(api_key=EMERGENT_LLM_KEY, session_id=session_id, system_message=system_message).with_model(
        "anthropic", "claude-sonnet-4-6"
    )


async def analyze_lead(lead: Lead) -> dict:
    prompt = (
        "Phân tích yêu cầu báo giá thuê xe sau và trả về DUY NHẤT một JSON hợp lệ với các khóa: "
        '"category" (một trong: "Doanh nghiệp dài hạn", "Xe công vụ", "Sân bay", "Cưới hỏi", "Du lịch", "Đưa đón nhân viên", "Khác"), '
        '"priority" (một trong: "Cao", "Trung bình", "Thấp" – Cao nếu là doanh nghiệp/hợp đồng dài hạn hoặc cần xe gấp), '
        '"summary" (1-2 câu tiếng Việt tóm tắt nhu cầu cho nhân viên sales).\n\n'
        f"Họ tên: {lead.name}\nSĐT: {lead.phone}\nLoại dịch vụ: {lead.service}\nNgày cần xe: {lead.date or 'chưa rõ'}\nGhi chú: {lead.note or 'không có'}"
    )
    chat = _claude(f"lead-{lead.id}", "Bạn là trợ lý phân loại lead cho công ty cho thuê xe. Chỉ trả về JSON.")
    text = await chat.send_message(UserMessage(text=prompt))
    match = re.search(r"\{.*\}", text, re.S)
    return json.loads(match.group(0)) if match else {}


def lead_email_html(lead: Lead) -> str:
    rows = [
        ("Họ tên", lead.name), ("Số điện thoại", lead.phone), ("Loại dịch vụ", lead.service),
        ("Ngày cần xe", lead.date or "—"), ("Ghi chú", lead.note or "—"),
        ("Phân loại (AI)", lead.ai_category or "—"), ("Ưu tiên (AI)", lead.ai_priority or "—"),
        ("Tóm tắt (AI)", lead.ai_summary or "—"), ("Thời gian", lead.created_at),
    ]
    trs = "".join(
        f'<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;color:#0A1128;width:160px">{k}</td>'
        f'<td style="padding:8px 12px;border:1px solid #e5e7eb;color:#111">{v}</td></tr>' for k, v in rows
    )
    return (
        '<table style="font-family:Arial,sans-serif;border-collapse:collapse;width:100%;max-width:640px">'
        f'<tr><td colspan="2" style="padding:14px 12px;background:#0A1128;color:#D4AF37;font-size:18px;font-weight:700">Yêu cầu báo giá mới – GFA Việt Nam</td></tr>{trs}'
        f'<tr><td colspan="2" style="padding:10px 12px;color:#555;font-size:12px">Liên hệ lại khách qua Zalo/điện thoại: <a href="tel:{lead.phone}">{lead.phone}</a></td></tr></table>'
    )


async def process_lead(lead: Lead):
    try:
        ai = await asyncio.wait_for(analyze_lead(lead), timeout=40)
        lead.ai_category, lead.ai_priority, lead.ai_summary = ai.get("category"), ai.get("priority"), ai.get("summary")
    except Exception as e:
        logger.warning(f"Lead AI analysis failed: {e}")

    if RESEND_API_KEY and LEAD_NOTIFY_EMAIL:
        params = {
            "from": SENDER_EMAIL,
            "to": [LEAD_NOTIFY_EMAIL],
            "subject": f"[GFA] Báo giá mới: {lead.service} – {lead.name} ({lead.ai_priority or 'chưa phân loại'})",
            "html": lead_email_html(lead),
        }
        try:
            await asyncio.to_thread(resend.Emails.send, params)
            lead.email_status = "sent"
        except Exception as e:
            logger.error(f"Resend failed: {e}")
            lead.email_status = f"failed: {str(e)[:120]}"
    else:
        lead.email_status = "skipped: RESEND_API_KEY not configured"
        logger.warning("RESEND_API_KEY missing – lead stored in MongoDB only")

    await db.leads.update_one({"id": lead.id}, {"$set": lead.model_dump()})


@api_router.get("/")
async def root():
    return {"message": "GFA Việt Nam API"}


@api_router.post("/quote", response_model=Lead)
async def create_quote(payload: QuoteCreate, background: BackgroundTasks):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    background.add_task(process_lead, lead)
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(limit: int = 50):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(min(limit, 200))
    return docs


@api_router.get("/chat/{session_id}")
async def chat_history(session_id: str):
    docs = await db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("created_at", 1).to_list(100)
    return docs


@api_router.post("/chat")
async def chat(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    history = await db.chat_messages.find({"session_id": req.session_id}, {"_id": 0}).sort("created_at", -1).to_list(12)
    history.reverse()
    transcript = "\n".join(f"{'Khách' if m['role'] == 'user' else 'Trợ lý'}: {m['content']}" for m in history)
    system = GFA_KNOWLEDGE + (f"\nLịch sử hội thoại gần đây:\n{transcript}" if transcript else "")

    now = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_one(
        {"id": str(uuid.uuid4()), "session_id": req.session_id, "role": "user", "content": req.message, "created_at": now}
    )

    async def event_generator():
        chat_client = _claude(req.session_id, system)
        full = []
        try:
            async for ev in chat_client.stream_message(UserMessage(text=req.message)):
                if isinstance(ev, TextDelta):
                    full.append(ev.content)
                    yield f"data: {json.dumps({'delta': ev.content}, ensure_ascii=False)}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception as e:
            logger.error(f"Chat stream failed: {e}")
            fallback = "Xin lỗi, hệ thống đang bận. Anh/chị vui lòng nhắn Zalo hoặc gọi hotline 0916 269 919 để được hỗ trợ ngay."
            full.append(fallback)
            yield f"data: {json.dumps({'delta': fallback}, ensure_ascii=False)}\n\n"
        reply = "".join(full)
        await db.chat_messages.insert_one(
            {"id": str(uuid.uuid4()), "session_id": req.session_id, "role": "assistant", "content": reply,
             "created_at": datetime.now(timezone.utc).isoformat()}
        )
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(
        event_generator(), media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
