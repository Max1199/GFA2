# GFA Việt Nam — PRD

## Original problem statement
Improve the existing GFA Việt Nam marketing site (Vietnamese only, lead-gen). Source project: https://github.com/Max1199/GFA (TanStack Start + Cloudflare, Higgsfield scaffold). Ported into this environment (React CRA + FastAPI + MongoDB) keeping the user's brand CSS (`gfa-brand.css`), assets, copy and contact data; then implemented the 11-point improvement plan + Claude AI features.

## Users
- Primary: corporate procurement/admin (long-term contracts, airport pickup, executive cars)
- Secondary: individuals (weddings, tourism, airport transfers)

## Architecture
- Frontend: React 19 (CRA/craco), Tailwind, framer-motion, Lenis smooth scroll, shadcn (Dialog/Select/Input/Textarea/Sonner). `/app/frontend/src/components/*`, data in `/app/frontend/src/data/site.js`, tracking in `/app/frontend/src/lib/track.js`.
- Backend: FastAPI `/app/backend/server.py` — `POST /api/quote`, `GET /api/leads`, `POST /api/chat` (SSE), `GET /api/chat/{session_id}`.
- DB: MongoDB collections `leads`, `chat_messages`.
- AI: Claude Sonnet 4.6 via emergentintegrations (EMERGENT_LLM_KEY) — chat assistant + lead classification (category/priority/summary).
- Email: Resend (`RESEND_API_KEY` empty → email skipped, lead still stored; `LEAD_NOTIFY_EMAIL=info.gfavietnam@gmail.com`).

## Implemented (2026-06)
- Hero rework: "20 năm kinh nghiệm cho thuê xe tại Hà Nội" masked line reveal, parallax on user's hero video, 4 CTAs, oversized "20" kinetic numeral.
- Trust strip (01), Về GFA (02, ported), Services 6 cards w/ Zalo deep-links, dài hạn + công vụ first (03), Fleet (Camry/Fortuner/Innova, brand marquee, Zalo CTA) (04), Facilities gallery + lightbox (05), Corporate clients grid (06, placeholder names), Google reviews cards (07, sample text), Footer/contact + embedded map + directions + legal line (08).
- Quote form → MongoDB + Claude classification + Resend (skipped until key) + success state with Zalo redirect.
- Claude chat widget "Trợ lý tư vấn GFA" with SSE streaming + persisted history.
- Mobile sticky Call+Zalo bar, GA4/FB Pixel hooks (env IDs), CTA click tracking, SEO meta/OG/JSON-LD (real addresses, geo, hours), robots.txt, sitemap.xml, favicons.
- Tested: /app/test_reports/iteration_1.json — all pass.

## Pending / user inputs needed
- RESEND_API_KEY (+ verified sender domain) to actually send lead emails.
- Real client logos (replace `CLIENTS` in site.js), real Google reviews (replace `REVIEWS`), tax code (`CONTACT.taxCode`).
- Higher-res facility photos (current 340×190) and WebP conversion; hero.mp4 is 8.7 MB (compress recommended).
- REACT_APP_GA_MEASUREMENT_ID / REACT_APP_FB_PIXEL_ID.

## Backlog
- P1: Fleet size strip ("Quy mô đội xe"), compress hero video, WebP images.
- P2: English version, full fleet catalog, admin leads dashboard, blog.
