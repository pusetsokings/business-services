import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

gssap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    if (!sectionRef.current || !leftRef.current || !rightRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
    });
    tl.fromTo(leftRef.current, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' })
      .fromTo(rightRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, '-=0.7');
    return () => { tl.kill(); };
  }, []);

  const inputClass = 'w-full bg-bg-secondary border border-[rgba(200,150,62,0.15)] rounded-card px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition-colors duration-200';

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
              Book a free 30-minute consultation. We'll assess your needs and recommend
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
              <a href="https://wa.me/26772402849?text=Hello%20Prospero%2C%20I'm%20interested%20in%20your%20business%20launch%20services" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#25D366] hover:text-[#128C7E] transition-colors mt-2">
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right: Formspree Form */}
          <div ref={rightRef}>
            <form action="https://formspree.io/f/mrejjowj" method="POST" className="space-y-5">
              <div>
                <input type="text" name="name" placeholder="Your Name *" className={inputClass} required />
              </div>
              <div>
                <input type="email" name="email" placeholder="Email Address *" className={inputClass} required />
              </div>
              <div>
                <input type="tel" name="phone" placeholder="Phone Number" className={inputClass} />
              </div>
              <div>
                <select name="stage" defaultValue={preselectedStage || ''} className={`${inputClass} appearance-none cursor-pointer`}>
                  <option value="">Select your business stage</option>
                  {businessStages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div>
                <textarea name="message" placeholder="Tell us about your business idea..." className={`${inputClass} min-h-[120px] resize-none`} rows={4} />
              </div>
              <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <input type="hidden" name="_subject" value="New Prospero Lead" />
              <input type="hidden" name="_replyto" value="info@prosperokings.com" />
              <button type="submit" className="btn-primary w-full">Book Consultation</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
