import { useEffect } from "react";
import "@/gfa-brand.css";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { useLenis } from "@/hooks/useLenis";
import { initTracking } from "@/lib/track";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Fleet } from "@/components/Fleet";
import { Gallery } from "@/components/Gallery";
import { Clients } from "@/components/Clients";
import { Reviews } from "@/components/Reviews";
import { QuoteForm } from "@/components/QuoteForm";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { ChatWidget } from "@/components/ChatWidget";

function App() {
  useLenis();
  useEffect(() => { initTracking(); }, []);

  return (
    <div className="App gfa-root">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <About />
        <Services />
        <Fleet />
        <Gallery />
        <Clients />
        <Reviews />
        <QuoteForm />
      </main>
      <Footer />
      <MobileBar />
      <ChatWidget />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
