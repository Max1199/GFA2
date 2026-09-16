import { CLIENTS } from "@/data/site";
import { Reveal, Chapter } from "./Reveal";

export const Clients = () => (
  <section id="khach-hang" data-testid="clients-section" className="gfa-section">
    <div className="mx-auto max-w-6xl px-5">
      <Chapter no="06" sub="Khách hàng doanh nghiệp" title="Khách hàng doanh nghiệp tin dùng" />
      <Reveal><p className="text-mist max-w-xl -mt-8 mb-12">Đối tác dài hạn của hàng trăm doanh nghiệp tại Hà Nội — từ nhà máy khu công nghiệp đến khách sạn và tập đoàn FDI.</p></Reveal>
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-gold/15" data-testid="clients-logo-grid">
        {CLIENTS.map((name, i) => (
          <Reveal key={name} delay={i * 0.05}
            className="group aspect-[5/2.4] border-r border-b border-gold/15 grid place-items-center px-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:bg-charcoal transition-[filter,opacity,background-color] duration-300 cursor-default"
            data-testid={`client-logo-${i}`}>
            <span className="gfa-h3 text-center font-bold text-base md:text-lg leading-tight" style={{ color: ["#e0c38a", "#4d8bff", "#f3efe6", "#6ee7b7", "#f87171", "#c4a05a", "#93c5fd", "#fb923c"][i % 8] }}>{name}</span>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
