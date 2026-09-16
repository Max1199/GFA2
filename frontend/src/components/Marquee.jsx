const PHRASES = [
  "Thuê xe dài hạn cho doanh nghiệp", "Xe công vụ & lãnh đạo", "Đưa đón sân bay Nội Bài 24/7",
  "Tài xế kinh nghiệm · đúng giờ", "Hoá đơn VAT đầy đủ", "Xe dự phòng thay trong 24h",
];

export const Marquee = ({ light = false }) => (
  <div data-testid="editorial-marquee" className={`overflow-hidden py-6 border-y ${light ? "border-navy/10 bg-cream text-navy" : "border-white/10 bg-navy text-slate-200"}`}>
    <div className="marquee-track flex gap-12 whitespace-nowrap w-max">
      {[...PHRASES, ...PHRASES].map((p, i) => (
        <span key={i} className="flex items-center gap-12 text-lg md:text-2xl font-medium tracking-tight">
          {p}
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
        </span>
      ))}
    </div>
  </div>
);
