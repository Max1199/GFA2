import { useState } from "react";
import axios from "axios";
import { CheckCircle2, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONTACT, SERVICE_OPTIONS, zaloWith } from "@/data/site";
import { Reveal, Chapter } from "./Reveal";
import { track, trackCta } from "@/lib/track";
import { ZaloIcon } from "./icons";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const EMPTY = { name: "", phone: "", service: "", date: "", note: "" };
const inputCls = "h-12 bg-ink/60 border-gold/25 text-cream placeholder:text-mist focus-visible:ring-gold focus-visible:ring-offset-0 rounded-[8px]";

export const QuoteForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? e.target.value : e });

  const submit = async (e) => {
    e.preventDefault();
    if (!/^(\+84|0)\d{8,10}$/.test(form.phone.replace(/[\s.]/g, ""))) {
      toast.error("Số điện thoại chưa đúng định dạng Việt Nam");
      return;
    }
    if (!form.service) { toast.error("Vui lòng chọn loại dịch vụ"); return; }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/quote`, { ...form, date: form.date || null, note: form.note || null });
      track("quote_submit", { service: form.service });
      setDone(data);
    } catch (err) {
      toast.error(err.response?.data?.detail?.[0]?.msg || "Gửi thất bại, vui lòng gọi hotline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="bao-gia" data-testid="quote-section" className="bg-charcoal relative overflow-hidden">
      <div className="absolute -right-40 -top-40 w-[520px] h-[520px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-24 md:py-32 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <Chapter no="06" sub="Báo giá" title="Yêu cầu báo giá trong 15 phút" />
          <Reveal>
            <p className="text-mist -mt-8 leading-relaxed">Để lại thông tin, nhân viên GFA sẽ gọi lại hoặc gửi báo giá qua Zalo. Không phát sinh, không ràng buộc.</p>
            <div className="mt-10 space-y-3 text-sm">
              <a href={`tel:${CONTACT.hotlineTel}`} onClick={() => trackCta("phone", "quote")} data-testid="quote-hotline" className="flex items-center gap-3 text-cream hover:text-gold transition-colors"><Phone className="w-4 h-4 text-gold" /> Hotline {CONTACT.hotline}</a>
              <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("zalo", "quote")} data-testid="quote-zalo-link" className="flex items-center gap-3 text-cream hover:text-gold transition-colors"><ZaloIcon className="w-4 h-4 text-[#0068FF]" /> Zalo {CONTACT.hotline}</a>
            </div>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7" delay={0.1}>
          {done ? (
            <div data-testid="quote-success" className="border border-gold/40 gfa-card backdrop-blur-xl p-8 md:p-12">
              <CheckCircle2 className="w-12 h-12 text-gold" />
              <h3 className="mt-6 text-2xl md:text-3xl font-bold text-cream tracking-tight">Đã nhận yêu cầu, cảm ơn {done.name}!</h3>
              <p className="mt-3 text-mist">Chúng tôi sẽ liên hệ số <span className="text-cream">{done.phone}</span> trong 15 phút (giờ làm việc). Muốn nhanh hơn? Nhắn Zalo ngay bên dưới.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={zaloWith(`Chào GFA, tôi vừa gửi yêu cầu báo giá ${done.service} (mã ${done.id.slice(0, 8)})`)} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("zalo", "quote-success")} data-testid="quote-success-zalo"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#0068FF] text-cream font-semibold hover:bg-[#1a78ff] transition-colors"><ZaloIcon /> Nhắn Zalo ngay</a>
                <button onClick={() => { setDone(null); setForm(EMPTY); }} data-testid="quote-reset" className="h-12 px-6 rounded-full border border-gold/30 text-cream hover:border-white/60 transition-colors">Gửi yêu cầu khác</button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} data-testid="quote-form" className="border border-gold/20 gfa-card backdrop-blur-xl p-6 md:p-10 grid sm:grid-cols-2 gap-5">
              <label className="block text-xs uppercase tracking-[0.2em] text-mist">Họ tên *
                <Input required minLength={2} value={form.name} onChange={set("name")} placeholder="Nguyễn Văn A" data-testid="quote-name" className={`${inputCls} mt-2`} />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-mist">Số điện thoại *
                <Input required type="tel" value={form.phone} onChange={set("phone")} placeholder="09xx xxx xxx" data-testid="quote-phone" className={`${inputCls} mt-2`} />
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-mist">Loại dịch vụ *
                <Select value={form.service} onValueChange={set("service")}>
                  <SelectTrigger data-testid="quote-service" className={`${inputCls} mt-2`}><SelectValue placeholder="Chọn dịch vụ" /></SelectTrigger>
                  <SelectContent className="bg-surface border-gold/20 text-cream">
                    {SERVICE_OPTIONS.map((o) => <SelectItem key={o} value={o} data-testid={`quote-service-option-${o}`}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>
              <label className="block text-xs uppercase tracking-[0.2em] text-mist">Ngày cần xe
                <Input type="date" value={form.date} onChange={set("date")} data-testid="quote-date" className={`${inputCls} mt-2 [color-scheme:dark]`} />
              </label>
              <label className="block sm:col-span-2 text-xs uppercase tracking-[0.2em] text-mist">Ghi chú
                <Textarea rows={4} value={form.note} onChange={set("note")} placeholder="Số lượng người, lộ trình, thời gian thuê, yêu cầu đặc biệt..." data-testid="quote-note" className="mt-2 bg-ink/60 border-gold/25 text-cream placeholder:text-mist focus-visible:ring-gold focus-visible:ring-offset-0 rounded-[8px]" />
              </label>
              <button type="submit" disabled={loading} data-testid="quote-submit"
                className="sm:col-span-2 h-14 gfa-btn-primary font-bold text-base disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />} Gửi yêu cầu báo giá
              </button>
              <p className="sm:col-span-2 text-xs text-mist">Thông tin chỉ dùng để liên hệ báo giá, không chia sẻ cho bên thứ ba.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
};
