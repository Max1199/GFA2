import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { CONTACT } from "@/data/site";
import { trackCta } from "@/lib/track";
import { ZaloIcon } from "./icons";

export const MobileBar = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div data-testid="mobile-action-bar" className={`md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-ink/85 backdrop-blur-xl border-t border-gold/20 grid grid-cols-2 gap-3 transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-full"}`}>
      <a href={`tel:${CONTACT.hotlineTel}`} onClick={() => trackCta("phone", "mobile-bar")} data-testid="mobile-bar-call" className="gfa-call-pill h-12 text-sm inline-flex items-center justify-center gap-2 active:scale-[0.97]">
        <Phone className="w-4 h-4" /> Gọi ngay
      </a>
      <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("zalo", "mobile-bar")} data-testid="mobile-bar-zalo" className="h-12 rounded-full bg-[#0068FF] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
        <ZaloIcon /> Nhắn Zalo
      </a>
    </div>
  );
};
