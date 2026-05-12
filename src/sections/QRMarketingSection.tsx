import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { QRCodeSVG } from 'qrcode.react';
import { Check, MessageCircle, Copy, CheckCircle, Mail, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  'Links to your Prospero pipeline',
  'Works on phones, posters, cards',
  'Place at business hubs & events',
  'Track scans via analytics',
];

const SITE_URL = 'https://business-services-three.vercel.app/';
const WHATSAPP_URL = 'https://wa.me/26772402849?text=Hello%20Prospero%2C%20I%27m%20interested%20in%20your%20business%20launch%20services.%20Please%20share%20more%20information.';
const EMAIL_URL = 'mailto:info@prosperokings.com?subject=Business%20Launch%20Inquiry&body=Hello%20Prospero%2C%0A%0AI%20am%20interested%20in%20your%20business%20launch%20services.%20Please%20contact%20me.%0A%0AThank%20you.';

type QRMode = 'website' | 'whatsapp' | 'email';

export default function QRMarketingSection() {
  const qrRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<QRMode>('website');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!qrRef.current || !textRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: qrRef.current.parentElement, start: 'top 75%', toggleActions: 'play none none none' },
    });
    tl.fromTo(qrRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo(textRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    return () => { tl.kill(); };
  }, []);

  const getQrValue = () => {
    switch (mode) {
      case 'whatsapp': return WHATSAPP_URL;
      case 'email': return EMAIL_URL;
      default: return SITE_URL;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case 'whatsapp': return 'Scan to chat on WhatsApp';
      case 'email': return 'Scan to send email';
      default: return 'Scan to visit website';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getQrValue()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="bg-bg-primary section-padding content-padding">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center">
          {/* Left: QR Code */}
          <div ref={qrRef} className="md:col-span-2 flex flex-col items-center">
            {/* Mode tabs */}
            <div className="flex gap-1 bg-bg-secondary rounded-pill p-1 mb-6">
              <button
                onClick={() => setMode('website')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-medium transition-all ${
                  mode === 'website' ? 'bg-accent-gold text-bg-primary' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Website
              </button>
              <button
                onClick={() => setMode('whatsapp')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-medium transition-all ${
                  mode === 'whatsapp' ? 'bg-[#25D366] text-white' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </button>
              <button
                onClick={() => setMode('email')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-medium transition-all ${
                  mode === 'email' ? 'bg-accent-gold text-bg-primary' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </button>
            </div>

            <div className="bg-bg-secondary p-8 rounded-card border border-[rgba(200,150,62,0.15)] relative">
              {mode === 'whatsapp' && (
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg z-10">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
              )}
              <QRCodeSVG
                key={mode}
                value={getQrValue()}
                size={200}
                bgColor="#1A1814"
                fgColor="#C8963E"
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="mt-4 text-text-muted text-xs tracking-[0.08em] uppercase text-center">
              {getLabel()}
            </p>
            <button
              onClick={handleCopy}
              className="mt-3 flex items-center gap-1.5 text-xs text-accent-gold hover:text-accent-amber transition-colors"
            >
              {copied ? (
                <><CheckCircle className="w-3.5 h-3.5" /> Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy link</>
              )}
            </button>
          </div>

          {/* Right: Marketing Copy */}
          <div ref={textRef} className="md:col-span-3">
            <span className="section-label mb-4 block">MARKETING TOOL</span>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-medium text-text-primary leading-tight tracking-tight mb-6 text-balance">
              Place This Where Investors Gather
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-lg text-balance">
              Generate QR codes for your website, WhatsApp, or email. Place them at business hubs,
              conference centres, co-working spaces, and government offices. A simple scan connects
              potential clients to your pipeline instantly.
            </p>

            <ul className="space-y-3 mb-8">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-success" />
                  </span>
                  <span className="text-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" /> Visit Site
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-medium bg-[#25D366] text-white hover:bg-[#128C7E] transition-all">
                <MessageCircle className="w-4 h-4" /> Test WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
