import { ArrowUpRight, Building2, Briefcase, Plane, Heart, Map, KeyRound } from "lucide-react";
import { SERVICES, zaloWith } from "@/data/site";
import { Reveal, Chapter } from "./Reveal";
import { trackCta } from "@/lib/track";
import { ZaloIcon } from "./icons";

const ICONS = { "dai-han": Building2, "cong-vu": Briefcase, "san-bay": Plane, "cuoi-hoi": Heart, "du-lich": Map, "tu-lai": KeyRound };

const Card = ({ s, i }) => {
  const Icon = ICONS[s.id];
  return (
    <Reveal delay={i * 0.06} data-testid={`service-card-${s.id}`}
      className={`gfa-card group flex flex-col justify-between p-6 md:p-8 ${s.big ? "md:col-span-6 min-h-[280px]" : "md:col-span-6 lg:col-span-3 min-h-[240px]"}`}>
      <div>
        <div className="flex items-start justify-between mb-6">
          <span className="gfa-icon-ring group-hover:bg-gold group-hover:text-ink transition-colors duration-300"><Icon className="w-5 h-5" /></span>
          <span className="gfa-eyebrow text-[10px] border border-gold/25 px-2.5 py-1 rounded-full">{s.tag}</span>
        </div>
        <h3 className={`gfa-h3 font-semibold text-cream ${s.big ? "text-2xl md:text-3xl" : "text-lg"}`}>{s.title}</h3>
        <p className="mt-3 text-sm text-mist leading-relaxed max-w-md">{s.desc}</p>
      </div>
      <a href={zaloWith(`Chào GFA, tôi cần tư vấn dịch vụ: ${s.title}`)} target="_blank" rel="noopener noreferrer"
        onClick={() => trackCta("zalo", `service-${s.id}`)} data-testid={`service-zalo-${s.id}`}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-light hover:text-gold transition-colors">
        <ZaloIcon className="w-5 h-5" /> Tư vấn qua Zalo <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </Reveal>
  );
};

export const Services = () => (
  <section id="dich-vu" data-testid="services-section" className="gfa-section gfa-section-alt">
    <div className="mx-auto max-w-6xl px-5">
      <Chapter no="03" sub="Dịch vụ" title="Thuê xe theo nhu cầu của bạn" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {SERVICES.map((s, i) => <Card key={s.id} s={s} i={i} />)}
      </div>
    </div>
  </section>
);
