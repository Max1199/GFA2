import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 26, ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const Chapter = ({ no, title, sub }) => (
  <Reveal className="mb-12 md:mb-16 max-w-3xl">
    <div className="flex items-center gap-4 mb-4">
      <span className="font-mono text-xs tracking-[0.3em] text-gold">{no}</span>
      <span className="h-px w-12 bg-gold/50" />
      <span className="gfa-eyebrow">{sub}</span>
    </div>
    <h2 className="gfa-h2 text-3xl sm:text-4xl font-semibold leading-[1.1] text-cream">{title}</h2>
  </Reveal>
);
