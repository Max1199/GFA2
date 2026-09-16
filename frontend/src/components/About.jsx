import { Phone, Mail, Clock } from "lucide-react";
import { CONTACT, FLEET_BRANDS } from "@/data/site";
import { Reveal, Chapter } from "./Reveal";
import { trackCta } from "@/lib/track";

export const About = () => (
  <section id="about" data-testid="about-section" className="gfa-section">
    <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <Chapter no="02" sub="Giới thiệu" title="Về GFA Việt Nam" />
        <Reveal>
          <p className="-mt-6 text-mist leading-relaxed">
            Công ty TNHH GFA Việt Nam là đơn vị cho thuê xe có trụ sở tại phường Phú Diễn, Hà Nội, hoạt động từ năm 2006.
            GFA cung cấp dịch vụ thuê xe dài hạn và thuê xe theo chuyến, với đội xe đa dạng từ 4 đến 45 chỗ,
            gồm các dòng xe Toyota, Honda, Ford, Hyundai, Mercedes, BMW, Lexus, Nissan, Mitsubishi, Porsche và Jaguar.
            Bên cạnh dịch vụ thuê xe, GFA còn vận hành <span className="text-cream">GFA Auto</span> và <span className="text-cream">GFA Tour</span>.
          </p>
          <div className="mt-8 flex flex-wrap gap-2" data-testid="about-brands">
            {FLEET_BRANDS.map((b) => (
              <span key={b} className="text-xs border border-gold/25 text-mist px-3 py-1.5 rounded-full hover:border-gold hover:text-gold-light transition-colors cursor-default">{b}</span>
            ))}
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.12} className="gfa-card p-6 md:p-8 self-start" data-testid="about-quick-contact">
        <p className="gfa-eyebrow mb-5">Liên hệ nhanh</p>
        <ul className="space-y-4 text-sm">
          <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold" /><a href={`tel:${CONTACT.hotlineTel}`} onClick={() => trackCta("phone", "about")} className="text-cream font-semibold text-lg hover:text-gold-light transition-colors">{CONTACT.hotline}</a></li>
          <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold" /><a href={`tel:${CONTACT.landlineTel}`} className="hover:text-gold-light transition-colors">Bàn: {CONTACT.landline}</a></li>
          <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-gold" /><a href={`mailto:${CONTACT.email}`} className="hover:text-gold-light transition-colors">{CONTACT.email}</a></li>
          <li className="flex items-start gap-3 text-mist"><Clock className="w-4 h-4 text-gold mt-0.5" />{CONTACT.hours}</li>
        </ul>
      </Reveal>
    </div>
  </section>
);
