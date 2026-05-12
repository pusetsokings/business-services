import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  label: string;
  headline: string;
  subheadline?: string;
  align?: 'center' | 'left';
}

export default function SectionHeader({ label, headline, subheadline, align = 'center' }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const children = el.children;

    gsap.fromTo(
      children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div ref={ref} className={`flex flex-col ${alignClass} mb-12 md:mb-16`}>
      <span className="section-label mb-4">{label}</span>
      <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-medium leading-tight text-text-primary tracking-tight max-w-3xl text-balance">
        {headline}
      </h2>
      {subheadline && (
        <p className="mt-4 text-text-secondary max-w-2xl text-lg leading-relaxed text-balance">
          {subheadline}
        </p>
      )}
    </div>
  );
}
