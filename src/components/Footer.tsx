import { Facebook, Linkedin, MessageCircle, Twitter, Shield, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router';

interface FooterProps {
  onNavigate: (target: string) => void;
}

const quickLinks = [
  { label: 'Pipeline', target: '#pipeline' },
  { label: 'Packages', target: '#packages' },
  { label: 'About', target: '#lead-magnet' },
  { label: 'Contact', target: '#contact' },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/26772402849?text=Hello%20Prospero%2C%20I%27m%20interested%20in%20your%20business%20launch%20services' },
  { icon: Twitter, label: 'Twitter', href: '#' },
];

export default function Footer({ onNavigate }: FooterProps) {
  const navigate = useNavigate();
  const handleNav = (target: string) => { onNavigate(target); };

  return (
    <footer className="bg-bg-secondary border-t border-[rgba(200,150,62,0.15)]">
      <div className="max-w-content mx-auto px-6 md:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10">
          {/* Logo & Contact */}
          <div>
            <span className="font-display text-2xl font-medium text-accent-gold flex items-center gap-2">
              <Shield className="w-6 h-6" />
              PROSPERO
            </span>
            <p className="mt-2 text-text-muted text-sm">Launching Botswana&apos;s Entrepreneurs</p>
            <div className="mt-4 space-y-1.5 text-sm">
              <a href="mailto:info@prosperokings.com" className="text-text-muted hover:text-accent-gold transition-colors block">
                info@prosperokings.com
              </a>
              <a href="mailto:walterkadibadiba@gmail.com" className="text-text-muted hover:text-accent-gold transition-colors block">
                walterkadibadiba@gmail.com
              </a>
              <p className="text-text-muted">+267 72 402849 / +267 71 881185</p>
              <p className="text-text-muted">Gaborone, Botswana</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-text-primary font-medium text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.target}>
                  <button
                    onClick={() => handleNav(link.target)}
                    className="text-text-muted hover:text-accent-gold transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/qr')}
                  className="text-text-muted hover:text-accent-gold transition-colors text-sm flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Get QR Code
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-text-primary font-medium text-sm mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-text-muted hover:text-accent-gold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(200,150,62,0.15)] pt-6 text-center">
          <p className="text-text-muted text-xs">
            &copy; 2026 Prospero Business Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
