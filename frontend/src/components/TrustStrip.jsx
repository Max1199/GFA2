import { Reveal } from "./Reveal";
import { GoogleG } from "./icons";

const ITEMS = [
  { big: "20+", label: "năm hoạt động", sub: "Từ 2006 tại Hà Nội" },
  { big: "4–45", label: "chỗ ngồi", sub: "Sedan, SUV, 16 – 45 chỗ" },
  { big: "11", label: "thương hiệu xe", sub: "Toyota, Mercedes, Ford…" },
  { big: "4.7★", label: "đánh giá Google", sub: "Khách hàng xác thực", google: true },
  { big: "24/7", label: "phục vụ", sub: "Theo lịch đặt, kể cả lễ Tết" },
];

export const TrustStrip = () => (
  <section id="vi-sao" data-testid="trust-strip" className="relative bg-ink border-y border-gold/20">
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-16">
      <Reveal className="flex items-center gap-4 mb-10">
        <span className="font-mono text-xs tracking-[0.3em] text-gold">01</span>
        <span className="h-px w-16 bg-gold/50" />
        <span className="gfa-eyebrow">Vì sao chọn GFA</span>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gold/15 border-l border-gold/15">
        {ITEMS.map((it, i) => (
          <Reveal key={it.label} delay={i * 0.07} className="pl-5 pr-3 py-3 md:py-0" data-testid={`trust-item-${i}`}>
            <div className="gfa-h2 flex items-center gap-2 text-4xl md:text-5xl font-bold text-cream">
              {it.big}
              {it.google && <GoogleG className="w-6 h-6" />}
            </div>
            <div className="mt-2 text-sm font-semibold text-gold-light">{it.label}</div>
            <div className="text-xs text-mist mt-1">{it.sub}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
