import { ArrowUpRight } from "lucide-react";
import { FLEET, FLEET_BRANDS, zaloWith } from "@/data/site";
import { Reveal, Chapter } from "./Reveal";
import { trackCta } from "@/lib/track";
import { ZaloIcon } from "./icons";

export const Fleet = () => (
  <section id="doi-xe" data-testid="fleet-section" className="gfa-section gfa-section-alt">
    <div className="overflow-hidden border-y border-gold/20 py-4 mb-16" data-testid="brand-marquee">
      <div className="gfa-fleet-marquee gfa-eyebrow text-sm">
        {[...FLEET_BRANDS, ...FLEET_BRANDS].map((b, i) => <span key={`${b}-${i}`}>{b}</span>)}
      </div>
    </div>
    <div className="mx-auto max-w-6xl px-5">
      <Chapter no="04" sub="Dòng xe tiêu biểu" title="Một số dòng xe trong đội xe GFA" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {FLEET.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.1} className="gfa-fleet-card group" data-testid={`fleet-card-${c.id}`}>
            <div className="gfa-photo-ratio spotlight">
              <img src={c.image} alt={c.name} loading="lazy" className="gfa-fleet-photo" />
              <span className="absolute top-3 left-3 z-[1] text-[10px] font-semibold tracking-[0.2em] uppercase bg-ink/70 backdrop-blur-md text-gold-light px-2.5 py-1 rounded-full">{c.seats}</span>
            </div>
            <div className="gfa-fleet-caption">
              <h3 className="gfa-h3 text-base font-semibold text-cream">{c.name}</h3>
              <p className="mt-1 text-xs text-mist">{c.models} · {c.use}</p>
              <a href={zaloWith(`Chào GFA, tôi muốn xem thêm xe cùng phân khúc ${c.name} (${c.seats})`)} target="_blank" rel="noopener noreferrer"
                onClick={() => trackCta("zalo", `fleet-${c.id}`)} data-testid={`fleet-zalo-${c.id}`}
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-gold-light hover:text-gold transition-colors">
                <ZaloIcon className="w-4 h-4 text-[#0068FF]" /> Xem thêm xe cùng phân khúc — Nhắn Zalo <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-5 text-xs text-mist">Hình minh hoạ mang tính tham khảo, xe thực tế bàn giao có thể khác đôi chút tuỳ thời điểm.</p>
    </div>
  </section>
);
