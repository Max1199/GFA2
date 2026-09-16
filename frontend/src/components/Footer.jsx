import { Phone, Mail, MapPin, Clock, PhoneCall, Navigation, ExternalLink } from "lucide-react";
import { CONTACT, directionsUrl } from "@/data/site";
import { Reveal, Chapter } from "./Reveal";
import { trackCta } from "@/lib/track";
import { ZaloIcon, FacebookIcon } from "./icons";

const Row = ({ icon: Icon, label, children, testId }) => (
  <div className="flex gap-4" data-testid={testId}>
    <Icon className="w-5 h-5 text-gold shrink-0 mt-0.5" />
    <div>
      <div className="gfa-eyebrow text-[10px]">{label}</div>
      <div className="text-cream mt-1 text-sm leading-relaxed">{children}</div>
    </div>
  </div>
);

export const Footer = () => (
  <footer id="lien-he" data-testid="footer-section" className="gfa-footer">
    <div className="mx-auto max-w-6xl px-5 py-24 md:py-28 grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5">
        <Chapter no="08" sub="Giờ làm việc & Địa chỉ" title="Ghé thăm văn phòng GFA" />
        <div className="space-y-6 -mt-6">
          <Row icon={Phone} label="Hotline (Gọi / Zalo)" testId="footer-hotline">
            <a href={`tel:${CONTACT.hotlineTel}`} onClick={() => trackCta("phone", "footer")} className="text-xl font-bold hover:text-gold-light transition-colors">{CONTACT.hotline}</a>
            <span className="text-mist"> · </span>
            <a href={`tel:${CONTACT.phone2Tel}`} className="hover:text-gold-light transition-colors">{CONTACT.phone2}</a>
          </Row>
          <Row icon={PhoneCall} label="Điện thoại bàn" testId="footer-landline"><a href={`tel:${CONTACT.landlineTel}`} className="hover:text-gold-light transition-colors">{CONTACT.landline}</a></Row>
          <Row icon={Mail} label="Email" testId="footer-email">
            <a href={`mailto:${CONTACT.email}`} className="hover:text-gold-light transition-colors block">{CONTACT.email}</a>
            <a href={`mailto:${CONTACT.email2}`} className="hover:text-gold-light transition-colors block text-mist">{CONTACT.email2}</a>
          </Row>
          {CONTACT.addresses.map((a, i) => (
            <Row key={a.label} icon={MapPin} label={a.label} testId={`footer-address-${i}`}>
              {a.value}
              <a href={directionsUrl(a.value)} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("directions", `footer-${i}`)} data-testid={`footer-directions-${i}`}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-gold-light hover:text-gold transition-colors"><Navigation className="w-3 h-3" /> Chỉ đường trên Google Maps</a>
            </Row>
          ))}
          <Row icon={Clock} label="Giờ làm việc" testId="footer-hours">{CONTACT.hours}</Row>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("zalo", "footer")} data-testid="footer-zalo" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-[#0068FF] text-white text-sm font-semibold hover:bg-[#1a78ff] transition-colors"><ZaloIcon /> Zalo</a>
            <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("facebook", "footer")} data-testid="footer-facebook" className="gfa-btn-outline inline-flex items-center gap-2 h-11 px-5 text-sm font-semibold"><FacebookIcon /> Messenger</a>
            <a href={CONTACT.website} target="_blank" rel="noopener noreferrer" data-testid="footer-website" className="gfa-btn-outline inline-flex items-center gap-2 h-11 px-5 text-sm"><ExternalLink className="w-4 h-4" /> gfavietnam.com.vn</a>
          </div>
        </div>
      </div>
      <Reveal className="lg:col-span-7" delay={0.1}>
        <div className="gfa-map-frame h-[360px] lg:h-full min-h-[360px]">
          <iframe title="Bản đồ GFA Việt Nam" src={CONTACT.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-full border-0" data-testid="footer-map" />
        </div>
      </Reveal>
    </div>
    <div className="border-t border-gold/20">
      <div className="mx-auto max-w-6xl px-5 py-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-mist pb-24 md:pb-6">
        <span data-testid="footer-legal">© {new Date().getFullYear()} {CONTACT.legalName}{CONTACT.taxCode ? ` · MST: ${CONTACT.taxCode}` : ""}</span>
        <span>Cho thuê xe 4 – 45 chỗ tại Hà Nội từ 2006.</span>
      </div>
    </div>
  </footer>
);
