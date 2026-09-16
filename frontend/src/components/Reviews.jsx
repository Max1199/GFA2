import { Star, ExternalLink } from "lucide-react";
import { CONTACT, REVIEWS } from "@/data/site";
import { Reveal, Chapter } from "./Reveal";
import { GoogleG } from "./icons";
import { trackCta } from "@/lib/track";

const Stars = ({ n }) => (
  <span className="flex gap-0.5">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`w-4 h-4 ${i <= n ? "fill-[#FBBC04] text-[#FBBC04]" : "text-mist/40"}`} />)}</span>
);

export const Reviews = () => (
  <section id="danh-gia" data-testid="reviews-section" className="gfa-section gfa-section-alt">
    <div className="mx-auto max-w-6xl px-5">
      <div className="lg:flex lg:items-end lg:justify-between gap-12">
        <Chapter no="07" sub="Được khách hàng đánh giá" title="Khách hàng nói gì về GFA" />
        <Reveal className="mb-14 md:mb-20">
          <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("google_reviews", "badge")} className="gfa-rating-badge" data-testid="google-rating-badge">
            <GoogleG className="w-7 h-7" />
            <span className="flex flex-col leading-tight">
              <span className="flex items-center gap-2"><span className="gfa-h2 text-2xl font-bold text-cream">{CONTACT.rating}</span><span className="gfa-star text-sm">★★★★★</span></span>
              <span className="text-xs text-mist">Xem trên Google Maps</span>
            </span>
          </a>
        </Reveal>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {REVIEWS.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.07} className="gfa-card p-6 flex flex-col" data-testid={`review-card-${i}`}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-gold text-ink font-bold grid place-items-center">{r.name.split(" ").slice(-1)[0][0]}</span>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-cream truncate">{r.name}</div>
                <div className="text-xs text-mist truncate">{r.role}</div>
              </div>
              <GoogleG className="w-5 h-5 ml-auto shrink-0" />
            </div>
            <div className="mt-4 flex items-center gap-2"><Stars n={r.stars} /><span className="text-xs text-mist">{r.time}</span></div>
            <p className="mt-3 text-sm leading-relaxed text-cream/85 flex-1">{r.text}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10">
        <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackCta("google_reviews", "reviews")} data-testid="reviews-all-link" className="inline-flex items-center gap-2 text-sm font-semibold text-cream border-b border-gold/60 pb-1 hover:text-gold-light transition-colors">
          Xem tất cả đánh giá trên Google Maps <ExternalLink className="w-4 h-4" />
        </a>
      </Reveal>
    </div>
  </section>
);
