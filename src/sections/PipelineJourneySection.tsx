import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StageCard from '@/components/StageCard';

gsap.registerPlugin(ScrollTrigger);

const stageData = [
  {
    title: 'Foundation',
    subtitle: 'Company registration, legal compliance, tax, banking, and all required licenses.',
    items: [
      'Company registration with CIPA',
      'Tax clearance certificate',
      'Business banking setup',
      'Council trade license',
      'PPR procurement registration',
    ],
    cta: 'Get Started',
  },
  {
    title: 'Branding',
    subtitle: 'Professional identity that makes your business memorable.',
    items: [
      'Custom logo design',
      'Business card design & print',
      'Branded invoice & quotation generator',
      'Letterhead & email signature',
    ],
    cta: 'Explore Branding',
  },
  {
    title: 'Documentation',
    subtitle: 'The paperwork that wins contracts and attracts investors.',
    items: [
      'Comprehensive business plan',
      'Professional company profile',
      'Project proposals & pitch decks',
      'Free lead magnet: Simplified business plan template',
    ],
    cta: 'View Templates',
    highlightItem: 'Free',
  },
  {
    title: 'Digital Presence',
    subtitle: 'Your business visible and accessible online.',
    items: [
      'Professional landing page',
      'Social media page setup',
      'Explainer video production',
      'Google Business registration',
    ],
    cta: 'Go Digital',
  },
];

interface PipelineJourneySectionProps {
  onNavigate: (target: string) => void;
}

export default function PipelineJourneySection({ onNavigate }: PipelineJourneySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<(SVGCircleElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !pathRef.current) return;

    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    // Initialize path
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // Master scroll trigger for the line drawing
    const lineTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(path, {
          strokeDashoffset: pathLength * (1 - self.progress),
        });
      },
    });

    // Node activation triggers
    const nodeTriggers: ScrollTrigger[] = [];
    const nodePositions = [0.125, 0.375, 0.625, 0.875];

    nodesRef.current.forEach((node, i) => {
      if (!node) return;
      const card = cardsRef.current[i];

      // Initial state
      gsap.set(node, { fill: '#6B6255', scale: 1, transformOrigin: 'center' });
      if (card) {
        gsap.set(card, { opacity: 0.3, x: 30 });
      }

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: `top ${100 - nodePositions[i] * 100}%`,
        end: `top ${100 - nodePositions[i] * 100}%`,
        onEnter: () => {
          gsap.to(node, {
            fill: '#C8963E',
            scale: 1.5,
            duration: 0.3,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
          });
          if (card) {
            gsap.to(card, {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: 'power3.out',
            });
          }
        },
        onLeaveBack: () => {
          gsap.to(node, { fill: '#6B6255', scale: 1, duration: 0.3 });
          if (card) {
            gsap.to(card, { opacity: 0.3, x: 30, duration: 0.3 });
          }
        },
      });
      nodeTriggers.push(trigger);
    });

    return () => {
      lineTrigger.kill();
      nodeTriggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="relative bg-bg-secondary"
      style={{ minHeight: '300vh' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="max-w-content mx-auto px-6 md:px-8 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full items-center">
            {/* Left: SVG Line */}
            <div className="hidden md:flex items-center justify-center h-full">
              <svg
                viewBox="0 0 100 800"
                className="h-[70vh] w-auto"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Vertical path */}
                <path
                  ref={pathRef}
                  d="M 50 0 L 50 800"
                  fill="none"
                  stroke="#B8782E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Node circles */}
                {[200, 400, 600, 700].map((y, i) => (
                  <circle
                    key={i}
                    ref={(el) => { nodesRef.current[i] = el; }}
                    cx="50"
                    cy={y}
                    r="10"
                    fill="#6B6255"
                    stroke="#0F0E0C"
                    strokeWidth="3"
                  />
                ))}
              </svg>
            </div>

            {/* Right: Stage Cards */}
            <div className="space-y-8 py-20">
              {stageData.map((stage, i) => (
                <div
                  key={stage.title}
                  ref={(el) => { cardsRef.current[i] = el; }}
                >
                  <StageCard
                    title={stage.title}
                    subtitle={stage.subtitle}
                    items={stage.items}
                    cta={stage.cta}
                    highlightItem={stage.highlightItem}
                    onCtaClick={() => onNavigate('#contact')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
