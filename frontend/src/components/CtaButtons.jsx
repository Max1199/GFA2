import { Phone, FileText } from "lucide-react";
import { CONTACT } from "@/data/site";
import { trackCta } from "@/lib/track";
import { scrollToId } from "@/hooks/useLenis";
import { ZaloIcon, FacebookIcon } from "./icons";

const base = "inline-flex items-center justify-center gap-2 h-12 px-5 text-sm font-semibold active:scale-[0.97] whitespace-nowrap";

export const CallButton = ({ location, className = "" }) => (
  <a href={`tel:${CONTACT.hotlineTel}`} onClick={() => trackCta("phone", location)} data-testid={`cta-call-${location}`}
    className={`gfa-btn-primary ${base} ${className}`}>
    <Phone className="w-4 h-4" /> Gọi ngay {CONTACT.hotline}
  </a>
);

export const ZaloButton = ({ location, label = "Zalo", href = CONTACT.zalo, className = "" }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("zalo", location)} data-testid={`cta-zalo-${location}`}
    className={`${base} rounded-[10px] bg-[#0068FF] text-white hover:bg-[#1a78ff] transition-[background-color,transform] duration-200 ${className}`}>
    <ZaloIcon className="w-5 h-5" /> {label}
  </a>
);

export const FacebookButton = ({ location, className = "" }) => (
  <a href={CONTACT.messenger} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("facebook", location)} data-testid={`cta-facebook-${location}`}
    className={`gfa-btn-outline ${base} ${className}`}>
    <FacebookIcon className="w-4 h-4" /> Facebook
  </a>
);

export const QuoteButton = ({ location, className = "" }) => (
  <button type="button" onClick={() => { trackCta("quote_form", location); scrollToId("bao-gia"); }} data-testid={`cta-quote-${location}`}
    className={`gfa-btn-outline ${base} text-gold-light ${className}`}>
    <FileText className="w-4 h-4" /> Nhận báo giá
  </button>
);
