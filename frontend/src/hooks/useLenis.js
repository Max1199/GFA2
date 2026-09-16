import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
}
