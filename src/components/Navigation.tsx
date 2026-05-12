import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Menu, X, Shield, BarChart3 } from 'lucide-react';

interface NavigationProps {
  onNavigate: (target: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

const navLinks = [
  { label: 'Pipeline', target: '#pipeline' },
  { label: 'Packages', target: '#packages' },
  { label: 'About', target: '#lead-magnet' },
  { label: 'Contact', target: '#contact' },
];

export default function Navigation({ onNavigate, isAdmin, onToggleAdmin }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 100); };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Admin toggle: type "admin" anywhere to toggle
  useEffect(() => {
    let buffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      buffer = (buffer + e.key).slice(-5);
      if (buffer === 'admin') { onToggleAdmin(); buffer = ''; }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleAdmin]);

  const handleNav = (target: string) => {
    setMobileOpen(false);
    if (!isHome) { navigate('/'); setTimeout(() => onNavigate(target), 100); }
    else { onNavigate(target); }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-elevated/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-content mx-auto px-6 md:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button onClick={() => handleNav('#hero')} className="font-display text-xl md:text-2xl font-medium text-accent-gold tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6" />
            PROSPERO
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isHome && navLinks.map((link) => (
              <button key={link.target} onClick={() => handleNav(link.target)} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
                {link.label}
              </button>
            ))}
            {!isHome && (
              <button onClick={() => navigate('/')} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200">
                Home
              </button>
            )}
            {isAdmin && (
              <button onClick={() => navigate('/admin')} className="text-sm font-medium text-accent-gold hover:text-accent-amber transition-colors duration-200 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                Dashboard
              </button>
            )}
            {isAdmin && (
              <span className="text-xs font-medium text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded-pill flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => handleNav('#contact')} className="btn-secondary text-sm px-5 py-2">
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-text-primary" aria-label="Toggle menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-bg-primary transition-all duration-300 md:hidden ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {isHome ? (
            navLinks.map((link) => (
              <button key={link.target} onClick={() => handleNav(link.target)} className="font-display text-2xl font-medium text-text-primary hover:text-accent-gold transition-colors">
                {link.label}
              </button>
            ))
          ) : (
            <button onClick={() => { setMobileOpen(false); navigate('/'); }} className="font-display text-2xl font-medium text-text-primary hover:text-accent-gold transition-colors">
              Home
            </button>
          )}
          {isAdmin && (
            <button onClick={() => { setMobileOpen(false); navigate('/admin'); }} className="font-display text-2xl font-medium text-accent-gold hover:text-accent-amber transition-colors flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Dashboard
            </button>
          )}
          {isAdmin && (
            <span className="text-sm text-accent-gold flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Admin Mode Active
            </span>
          )}
          <button onClick={() => handleNav('#contact')} className="btn-primary mt-4">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
