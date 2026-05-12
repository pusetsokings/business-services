import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown, MessageCircle } from 'lucide-react';
import ParticleCanvas from '@/components/ParticleCanvas';

interface HeroSectionProps {
  onNavigate: (target: string) => void;
}

const WHATSAPP_URL = 'https://wa.me/26772402849?text=Hello%20Prospero%2C%20I%27m%20interested%20in%20your%20business%20launch%20services.%20Please%20share%20more%20information.';

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const children = contentRef.current.children;
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(children[0], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .fromTo(children[1], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .fromTo(children[2], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo(children[3], { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');
    return () => { tl.kill(); };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#0F0E0C' }}>
      <ParticleCanvas />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'radial-gradient(ellipse at center, rgba(15, 14, 12, 0.3) 0%, rgba(15, 14, 12, 0.7) 100%)' }} />

      <div ref={contentRef} className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1 className="font-display text-[clamp(3rem,8vw,6rem)] font-medium text-text-primary leading-[1.05] tracking-tight mb-6 text-balance">
          From Idea to Operating Business
        </h1>
        <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10 text-balance">
          The complete launch pipeline for entrepreneurs in Botswana.
          Registration, branding, documentation, and digital presence — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => onNavigate('#pipeline')} className="btn-primary">
            Start Your Journey
          </button>
          <button onClick={() => onNavigate('#packages')} className="btn-secondary">
            View Packages
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill text-sm font-medium bg-[#25D366] text-white hover:bg-[#128C7E] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
          </a>
        </div>

        <div className="mt-16 animate-pulse-opacity">
          <button onClick={() => onNavigate('#pipeline-overview')} className="text-text-muted hover:text-accent-gold transition-colors" aria-label="Scroll down">
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
