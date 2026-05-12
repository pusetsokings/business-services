import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Loader2, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const businessStages = [
  'Just starting',
  'Registered but need branding',
  'Ready for documentation',
  'Need digital presence',
  'Starter Package',
  'Growth Package',
  'Complete Package',
];

interface ContactSectionProps {
  preselectedStage?: string;
}

export default function ContactSection({ preselectedStage }: ContactSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    stage: preselectedStage || '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (preselectedStage) {
      setFormData((prev) => ({ ...prev, stage: preselectedStage }));
    }
  }, [preselectedStage]);

  useEffect(() => {
    if (!sectionRef.current || !leftRef.current || !rightRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
    });
    tl.fromTo(leftRef.current, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' })
      .fromTo(rightRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, '-=0.7');
    return () => { tl.kill(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setStatusMsg(data.message || 'Thank you! We will contact you shortly.');
        setFormData({ name: '', email: '', phone: '', stage: '', message: '' });
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setStatusMsg('Network error. Please check your connection and try again.');
    }
  };

  const inputClass =
    'w-full bg-bg-secondary border border-[rgba(200,150,62,0.15)] rounded-card px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition-colors duration-200';

  return (
    <section id="contact" ref={sectionRef} className="bg-bg-primary section-padding content-padding pb-16">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Left: Contact Info */}
          <div ref={leftRef}>
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-medium text-text-primary leading-tight tracking-tight mb-6 text-balance">
              Ready to Launch?
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-md text-balance">
              Book a free 30-minute consultation. We&apos;ll assess your needs and recommend
              the right stage to start with.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-accent-gold" />
                </span>
                <div>
                  <a href="mailto:info@prosperokings.com" className="text-text-secondary hover:text-accent-gold transition-colors block text-sm">
                    info@prosperokings.com
                  </a>
                  <a href="mailto:walterkadibadiba@gmail.com" className="text-text-muted hover:text-accent-gold transition-colors block text-xs mt-0.5">
                    walterkadibadiba@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-accent-gold" />
                </span>
                <div className="text-text-secondary text-sm">
                  <a href="tel:+26772402849" className="hover:text-accent-gold transition-colors block">+267 72 402849</a>
                  <a href="tel:+26771881185" className="hover:text-accent-gold transition-colors block">+267 71 881185</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-accent-gold" />
                </span>
                <span className="text-text-secondary text-sm">Gaborone, Botswana</span>
              </div>
              {/* WhatsApp quick link */}
              <a
                href="https://wa.me/26772402849?text=Hello%20Prospero%2C%20I'm%20interested%20in%20your%20business%20launch%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#25D366] hover:text-[#128C7E] transition-colors mt-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div ref={rightRef}>
            {status === 'success' ? (
              <div className="bg-bg-secondary rounded-card p-8 text-center border border-success/30">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="font-display text-xl text-text-primary mb-2">Message Sent!</h3>
                <p className="text-text-secondary text-sm mb-6">{statusMsg}</p>
                <button onClick={() => setStatus('idle')} className="btn-secondary text-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="">Select your business stage</option>
                    {businessStages.map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <textarea
                    placeholder="Tell us about your business idea..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${inputClass} min-h-[120px] resize-none`}
                    rows={4}
                  />
                </div>
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {statusMsg}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Book Consultation'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
