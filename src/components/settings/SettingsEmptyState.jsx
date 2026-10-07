import React from 'react';
import { Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export const SettingsEmptyState = ({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'There are currently no items configured or logged in this section.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <Card className={`p-8 text-center border-dashed border-surface-border bg-canvas-subtle/40 ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-body-sm font-bold text-charcoal-900 font-serif">{title}</h4>
      <p className="text-caption text-charcoal-500 max-w-sm mx-auto mt-1 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SettingsEmptyState;
