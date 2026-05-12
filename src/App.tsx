import { useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/sections/HeroSection';
import PipelineOverviewSection from '@/sections/PipelineOverviewSection';
import PipelineJourneySection from '@/sections/PipelineJourneySection';
import LeadMagnetSection from '@/sections/LeadMagnetSection';
import PackagesSection from '@/sections/PackagesSection';
import QRMarketingSection from '@/sections/QRMarketingSection';
import ContactSection from '@/sections/ContactSection';
import AdminDashboard from '@/pages/AdminDashboard';
import QRPage from '@/pages/QRPage';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.1,
      duration: 1.2,
    });

    instance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      instance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      instance.destroy();
    };
  }, []);

  const handleNavigate = useCallback(
    (target: string) => {
      const element = document.querySelector(target);
      if (element && lenis) {
        lenis.scrollTo(element as HTMLElement, { offset: -80 });
      } else if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [lenis]
  );

  const handleSelectPackage = useCallback(
    (packageName: string) => {
      setSelectedPackage(packageName);
      setTimeout(() => {
        const element = document.querySelector('#contact');
        if (element && lenis) {
          lenis.scrollTo(element as HTMLElement, { offset: -80 });
        } else if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    },
    [lenis]
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation onNavigate={handleNavigate} isAdmin={isAdmin} onToggleAdmin={() => setIsAdmin(!isAdmin)} />

      <Routes>
        <Route
          path="/"
          element={
            <main>
              <HeroSection onNavigate={handleNavigate} />
              <PipelineOverviewSection />
              <PipelineJourneySection onNavigate={handleNavigate} />
              <LeadMagnetSection />
              <PackagesSection onSelectPackage={handleSelectPackage} />
              {isAdmin && <QRMarketingSection />}
              <ContactSection preselectedStage={selectedPackage} />
              <Footer onNavigate={handleNavigate} />
            </main>
          }
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/qr" element={<QRPage />} />
      </Routes>
    </div>
  );
}

export default App;
