import { Check } from 'lucide-react';

interface StageCardProps {
  title: string;
  subtitle: string;
  items: string[];
  cta: string;
  highlightItem?: string;
  onCtaClick?: () => void;
}

export default function StageCard({ title, subtitle, items, cta, highlightItem, onCtaClick }: StageCardProps) {
  return (
    <div className="bg-bg-primary rounded-card p-6 md:p-8 border border-[rgba(200,150,62,0.15)]">
      <h3 className="font-display text-2xl md:text-3xl font-medium text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary mb-6 leading-relaxed">{subtitle}</p>
      <ul className="space-y-3 mb-8">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-success" />
            </span>
            <span className={highlightItem && item.includes('Free') ? 'text-accent-gold font-medium' : 'text-text-secondary'}>
              {item}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={onCtaClick}
        className="btn-secondary text-sm px-6 py-2.5"
      >
        {cta}
      </button>
    </div>
  );
}
