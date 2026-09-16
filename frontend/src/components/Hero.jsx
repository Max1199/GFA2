import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CallButton, ZaloButton, FacebookButton, QuoteButton } from "./CtaButtons";

const LINES = ["20 năm", "kinh nghiệm", "cho thuê xe", "tại Hà Nội"];

const MaskedLine = ({ text, i, gold }) => (
  <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
    <motion.span
      className={`block ${gold ? "text-gold-light" : "text-cream"}`}
      initial={{ y: "110%", rotate: 2 }}
      animate={{ y: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.span>
  </span>
);

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="top" ref={ref} data-testid="hero-section" className="gfa-hero">
      <div className="gfa-hero-layer gfa-hero-sky" />
      <motion.div style={{ y: videoY }} className="gfa-hero-layer gfa-hero-video-wrap" aria-hidden="true">
        <video className="gfa-hero-video" autoPlay muted loop playsInline preload="metadata" poster="/assets/poster.jpg" data-testid="hero-video">
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>
      <motion.div style={{ y: glowY }} className="gfa-hero-layer gfa-hero-glow" aria-hidden="true" />
      <div className="gfa-hero-vignette" />
      <div className="absolute inset-0 z-[3] grain pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
        className="absolute right-4 top-24 md:right-12 md:top-28 z-[3] select-none pointer-events-none" aria-hidden="true">
        <span className="block font-display font-bold leading-none text-[28vw] md:text-[18vw] lg:text-[14vw] text-transparent bg-clip-text bg-gradient-to-b from-gold/25 to-gold/0 tracking-tighter">20</span>
      </motion.div>

      <motion.div style={{ y: textY, opacity: fade }} className="gfa-hero-content mx-auto max-w-6xl w-full px-5 pt-36 pb-28 md:pb-24">
        <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
          className="gfa-eyebrow flex items-center gap-3 mb-6" data-testid="hero-eyebrow">
          <span className="h-px w-10 bg-gold" /> GFA Việt Nam · Hà Nội · Từ 2006
        </motion.p>

        <h1 className="gfa-h1 font-bold leading-[0.95] text-[13vw] sm:text-6xl lg:text-[5.5rem] max-w-4xl" data-testid="hero-headline">
          <MaskedLine text={LINES[0]} i={0} gold />
          <MaskedLine text={LINES[1]} i={1} />
          <MaskedLine text={LINES[2]} i={2} />
          <MaskedLine text={LINES[3]} i={3} />
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-8 max-w-xl text-base md:text-lg text-mist leading-relaxed" data-testid="hero-subheadline">
          Đội xe <span className="text-cream font-semibold">4 – 45 chỗ</span> Toyota, Ford, Hyundai, Mercedes… Chuyên
          <span className="text-cream font-semibold"> thuê xe dài hạn</span> cho doanh nghiệp, xe công vụ, đưa đón sân bay, cưới hỏi và du lịch — tại Hà Nội và các tỉnh lân cận.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.7 }}
          className="mt-10 flex flex-wrap gap-3" data-testid="hero-cta-group">
          <CallButton location="hero" />
          <ZaloButton location="hero" label="Nhắn Zalo" />
          <FacebookButton location="hero" />
          <QuoteButton location="hero" />
        </motion.div>
      </motion.div>
      <div className="gfa-scrollcue hidden md:block" aria-hidden="true" />
    </section>
  );
};
