import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { CONTACT } from "@/data/site";
import { scrollToId } from "@/hooks/useLenis";
import { trackCta } from "@/lib/track";

const LINKS = [
  ["about", "Giới thiệu"],
  ["dich-vu", "Dịch vụ"],
  ["doi-xe", "Đội xe"],
  ["danh-gia", "Đánh giá"],
  ["lien-he", "Địa chỉ"],
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => { setOpen(false); scrollToId(id); };

  return (
    <header data-testid="navbar" className={`fixed top-0 inset-x-0 z-40 transition-[background-color,border-color] duration-300 backdrop-blur-xl ${scrolled || open ? "bg-ink/80 border-b border-gold/20" : "bg-ink/30 border-b border-transparent"}`}>
      <div className="mx-auto max-w-6xl px-5 h-[68px] flex items-center justify-between gap-4">
        <button onClick={() => go("top")} className="flex items-center gap-3 group" data-testid="nav-logo">
          <span className="gfa-logo-badge" style={{ width: 36, height: 36 }}>
            <img src="/assets/favicon-48.png" alt="GFA Việt Nam" width={26} height={26} />
          </span>
          <span className="leading-tight text-left">
            <span className="gfa-brand-word block text-sm font-semibold tracking-wide text-cream">GFA VIỆT NAM</span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-gold-light">Cho thuê xe · 20 năm</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} data-testid={`nav-link-${id}`}
              className="text-sm text-mist hover:text-gold-light transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-gold hover:after:w-full after:transition-[width] after:duration-300">
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${CONTACT.hotlineTel}`} onClick={() => trackCta("phone", "navbar")} data-testid="nav-hotline"
            className="gfa-call-pill hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Phone className="w-4 h-4" /> Gọi {CONTACT.hotline}
          </a>
          <button onClick={() => setOpen(!open)} className="md:hidden text-cream p-2" aria-label="Menu" data-testid="nav-menu-toggle">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gold/20 bg-ink/95 px-5 py-6 flex flex-col gap-4" data-testid="nav-mobile-menu">
          {LINKS.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className="text-left text-lg text-cream hover:text-gold-light">{label}</button>
          ))}
        </div>
      )}
    </header>
  );
};
