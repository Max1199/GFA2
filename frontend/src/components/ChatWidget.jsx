import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT } from "@/data/site";
import { track, trackCta } from "@/lib/track";
import { ZaloIcon } from "./icons";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const getSession = () => {
  let s = localStorage.getItem("gfa_chat_session");
  if (!s) { s = `web-${crypto.randomUUID()}`; localStorage.setItem("gfa_chat_session", s); }
  return s;
};
const WELCOME = { role: "assistant", content: "Xin chào! Tôi là Trợ lý tư vấn GFA. Anh/chị cần thuê xe loại nào, đi đâu và bao lâu? Tôi sẽ tư vấn ngay." };
const QUICK = ["Thuê xe dài hạn cho công ty", "Đón sân bay Nội Bài", "Xe 45 chỗ đi Sapa", "Xe cưới 7 chỗ"];

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);
  const sessionRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    sessionRef.current = getSession();
    fetch(`${API}/chat/${sessionRef.current}`).then((r) => r.json()).then((h) => { if (h.length) setMsgs(h); }).catch(() => {});
  }, [open]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || busy) return;
    setInput("");
    setBusy(true);
    track("chat_message", { length: message.length });
    setMsgs((m) => [...m, { role: "user", content: message }, { role: "assistant", content: "" }]);
    try {
      const res = await fetch(`${API}/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sessionRef.current, message }) });
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop();
        for (const p of parts) {
          if (!p.startsWith("data: ")) continue;
          const ev = JSON.parse(p.slice(6));
          if (ev.delta) setMsgs((m) => { const c = [...m]; c[c.length - 1] = { ...c[c.length - 1], content: c[c.length - 1].content + ev.delta }; return c; });
        }
      }
    } catch {
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: `Kết nối gián đoạn. Anh/chị vui lòng nhắn Zalo hoặc gọi ${CONTACT.hotline}.` }; return c; });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button onClick={() => { setOpen(!open); track("chat_toggle", { open: !open }); }} data-testid="chat-toggle" aria-label="Trợ lý tư vấn GFA"
        className="fixed z-50 right-4 bottom-24 md:right-6 md:bottom-6 w-14 h-14 rounded-full bg-gold text-ink grid place-items-center shadow-[0_10px_40px_rgba(212,175,55,0.35)] hover:scale-105 transition-transform">
        {open ? <X /> : <MessageSquare />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={{ duration: 0.25 }}
            data-testid="chat-panel" className="fixed z-50 right-4 left-4 md:left-auto md:right-6 bottom-[calc(6rem+4rem)] md:bottom-24 md:w-[380px] h-[min(70vh,560px)] bg-charcoal/95 backdrop-blur-xl border border-gold/20 flex flex-col shadow-2xl">
            <div className="px-4 py-3 border-b border-gold/20 flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-gold text-ink grid place-items-center"><Sparkles className="w-4 h-4" /></span>
              <div>
                <div className="text-sm font-bold text-cream">Trợ lý tư vấn GFA</div>
                <div className="text-[11px] text-mist">Trả lời tức thì · Claude AI</div>
              </div>
              <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("zalo", "chat")} data-testid="chat-zalo" className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-cream bg-[#0068FF] px-3 h-8 rounded-full hover:bg-[#1a78ff] transition-colors"><ZaloIcon className="w-4 h-4" /> Zalo</a>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" data-testid="chat-messages">
              {msgs.map((m, i) => (
                <div key={i} className={`max-w-[85%] text-sm leading-relaxed px-3.5 py-2.5 whitespace-pre-wrap ${m.role === "user" ? "ml-auto bg-gold text-ink" : "bg-ink/60 text-cream border border-gold/20"}`} data-testid={`chat-msg-${m.role}`}>
                  {m.content || <span className="inline-flex gap-1"><i className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /><i className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse [animation-delay:150ms]" /><i className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse [animation-delay:300ms]" /></span>}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            {msgs.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {QUICK.map((q) => <button key={q} onClick={() => send(q)} data-testid="chat-quick" className="text-xs border border-gold/40 text-gold px-3 py-1.5 rounded-full hover:bg-gold hover:text-ink transition-colors">{q}</button>)}
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-gold/20 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nhập câu hỏi..." data-testid="chat-input"
                className="flex-1 h-11 bg-ink/60 border border-gold/25 px-3 text-sm text-cream placeholder:text-mist/60 focus:outline-none focus:border-gold" />
              <button type="submit" disabled={busy || !input.trim()} data-testid="chat-send" aria-label="Gửi" className="w-11 h-11 bg-gold text-ink grid place-items-center disabled:opacity-50 hover:bg-gold-light transition-colors"><Send className="w-4 h-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
