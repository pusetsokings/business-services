import { Check } from 'lucide-react';

interface PackageCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  onSelect?: () => void;
}

export default function PackageCard({ name, price, description, features, highlighted, badge, onSelect }: PackageCardProps) {
  return (
    <div
      className={`relative bg-bg-primary rounded-card p-8 flex flex-col h-full ${
        highlighted
          ? 'border-[3px] border-accent-gold shadow-glow'
          : 'border border-[rgba(200,150,62,0.15)]'
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-gold text-bg-primary text-xs font-medium px-4 py-1 rounded-pill">
          {badge}
        </span>
      )}

      <h3 className="font-display text-xl font-medium text-text-primary mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="font-display text-[2.5rem] font-medium text-text-primary">{price}</span>
      </div>
      <p className="text-text-secondary text-sm mb-6 leading-relaxed">{description}</p>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-success" />
            </span>
            <span className="text-text-secondary text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-3 rounded-pill font-medium text-sm transition-all duration-300 ${
          highlighted
            ? 'bg-accent-gold text-bg-primary hover:bg-accent-amber'
            : 'border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-bg-primary'
        }`}
      >
        Select {name}
      </button>
    </div>
  );
}
