import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from '@/components/SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    image: '/images/img-stage-foundation.jpg',
    title: 'Foundation',
    description: 'Company registration, legal compliance, tax, banking, and all required licenses.',
  },
  {
    image: '/images/img-stage-branding.jpg',
    title: 'Branding',
    description: 'Logo, business cards, invoice generator, and visual identity.',
  },
  {
    image: '/images/img-stage-docs.jpg',
    title: 'Documentation',
    description: 'Business plans, company profiles, and proposal templates.',
  },
  {
    image: '/images/img-stage-digital.jpg',
    title: 'Digital',
    description: 'Landing pages, social media setup, and video content.',
  },
];

export default function PipelineOverviewSection() {
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
        stagger: 0.12,
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
      id="pipeline-overview"
      className="bg-bg-primary section-padding content-padding"
    >
      <div className="max-w-content mx-auto">
        <SectionHeader
          label="THE PIPELINE"
          headline="Four Stages. One Seamless Journey."
        />

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stages.map((stage) => (
            <div
              key={stage.title}
              className="bg-bg-secondary rounded-card p-6 border-t-2 border-[rgba(200,150,62,0.15)] hover:border-accent-gold transition-all duration-500 group"
            >
              <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center mb-5 overflow-hidden">
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="w-12 h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-medium text-text-primary mb-2">
                {stage.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {stage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
