import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';
import PackageCard from '@/components/PackageCard';

gsap.registerPlugin(ScrollTrigger);

const packages = [
  {
    name: 'Starter',
    price: 'P4,500',
    description: 'Perfect for getting legally operational',
    features: [
      'Company registration with CIPA',
      'Tax clearance certificate',
      'Business banking setup',
      'Council trade license',
      'PPR procurement registration',
    ],
  },
  {
    name: 'Growth',
    price: 'P8,500',
    description: 'Everything to launch with a professional identity',
    features: [
      'All Starter features',
      'Custom logo design',
      'Business card design & print',
      'Branded invoice & quotation generator',
      'Letterhead & email signature',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Complete',
    price: 'P15,000',
    description: 'The full pipeline from idea to digital launch',
    features: [
      'All Growth features',
      'Comprehensive business plan',
      'Professional company profile',
      'Landing page setup',
      'Social media page setup',
      'Explainer video production',
    ],
  },
];

interface PackagesSectionProps {
  onSelectPackage: (packageName: string) => void;
}

export default function PackagesSection({ onSelectPackage }: PackagesSectionProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.children;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === cardsRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section
      id="packages"
      className="bg-bg-secondary section-padding content-padding"
    >
      <div className="max-w-content mx-auto">
        <SectionHeader
          label="PRICING"
          headline="Choose Your Launch Package"
          subheadline="Bundle stages together and save. Every package includes Foundation as standard."
        />

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.name}
              name={pkg.name}
              price={pkg.price}
              description={pkg.description}
              features={pkg.features}
              highlighted={pkg.highlighted}
              badge={pkg.badge}
              onSelect={() => onSelectPackage(pkg.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
