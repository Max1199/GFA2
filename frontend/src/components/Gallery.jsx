import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GALLERY, CONTACT } from "@/data/site";
import { Reveal, Chapter } from "./Reveal";

export const Gallery = () => {
  const [idx, setIdx] = useState(null);
  const step = (d) => setIdx((i) => (i + d + GALLERY.length) % GALLERY.length);

  return (
    <section id="co-so" data-testid="gallery-section" className="gfa-section">
      <div className="mx-auto max-w-6xl px-5">
        <Chapter no="05" sub="Cơ sở vật chất" title="Trụ sở & văn phòng GFA" />
        <Reveal><p className="-mt-8 mb-10 max-w-2xl text-sm text-mist leading-relaxed">Hình ảnh thực tế tại trụ sở GFA Building, {CONTACT.addresses[0].value}.</p></Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GALLERY.map((g, i) => (
            <Reveal key={g.src} delay={i * 0.08}>
              <button onClick={() => setIdx(i)} data-testid={`gallery-item-${i}`} className="gfa-fleet-card group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                <div className="gfa-photo-ratio">
                  <img src={g.src} alt={g.alt} loading="lazy" decoding="async" className="gfa-fleet-photo" style={{ objectPosition: g.position || "center" }} />
                </div>
                <div className="gfa-fleet-caption"><h3 className="gfa-h3 text-sm font-semibold text-cream">{g.alt}</h3></div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={idx !== null} onOpenChange={(o) => !o && setIdx(null)}>
        <DialogContent data-testid="gallery-lightbox" className="max-w-5xl w-[96vw] p-0 bg-transparent border-0 shadow-none [&>button]:hidden">
          {idx !== null && (
            <div className="relative">
              <img src={GALLERY[idx].src} alt={GALLERY[idx].alt} className="w-full max-h-[85vh] object-contain rounded-xl" />
              <p className="text-center text-sm text-mist mt-3">{GALLERY[idx].alt}</p>
              <button onClick={() => setIdx(null)} data-testid="lightbox-close" aria-label="Đóng" className="absolute -top-3 -right-3 md:top-3 md:right-3 w-10 h-10 grid place-items-center rounded-full bg-ink/80 text-cream hover:bg-gold hover:text-ink transition-colors"><X className="w-5 h-5" /></button>
              <button onClick={() => step(-1)} data-testid="lightbox-prev" aria-label="Ảnh trước" className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full bg-ink/70 text-cream hover:bg-gold hover:text-ink transition-colors"><ChevronLeft /></button>
              <button onClick={() => step(1)} data-testid="lightbox-next" aria-label="Ảnh sau" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full bg-ink/70 text-cream hover:bg-gold hover:text-ink transition-colors"><ChevronRight /></button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
