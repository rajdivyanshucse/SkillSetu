import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export const SettingsCard = ({
  icon: Icon,
  title,
  description,
  items = [],
  route,
  badge,
  className = '',
}) => {
  const { navigate } = useRouter();

  return (
    <Card
      className={`p-6 border-surface-border bg-surface hover:border-brand-300 hover:shadow-subtle transition-all flex flex-col justify-between cursor-pointer group ${className}`}
      onClick={() => route && navigate(route)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold shrink-0 group-hover:bg-brand-100 transition-colors">
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          {badge && (
            <Badge variant="outline" className="text-xs bg-stone-50 text-charcoal-600 border-stone-200">
              {badge}
            </Badge>
          )}
        </div>

        <div>
          <h3 className="text-body-md font-bold text-charcoal-900 font-serif group-hover:text-brand-900 transition-colors">
            {title}
          </h3>
          <p className="text-caption text-charcoal-500 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {items.length > 0 && (
          <ul className="pt-2 border-t border-surface-border space-y-1.5 text-xs text-charcoal-600">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                <span className="truncate">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-surface-border/70 flex items-center justify-between text-xs font-semibold text-brand-700 group-hover:text-brand-900">
        <span>Configure Settings</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Card>
  );
};

export default SettingsCard;
