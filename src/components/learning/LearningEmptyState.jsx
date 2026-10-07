import React from 'react';
import { BookOpen } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export const LearningEmptyState = ({
  icon: Icon = BookOpen,
  title = 'No learning resources found',
  description = 'Try adjusting your search criteria, category filters, or explore our recommended learning paths.',
  actionLabel,
  onAction,
}) => {
  return (
    <Card className="p-8 text-center border-dashed border-charcoal-light/30">
      <div className="w-12 h-12 rounded-xl bg-warm-sand/50 text-warm-brown flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-warm-charcoal mb-1">{title}</h3>
      <p className="text-xs text-charcoal-muted max-w-md mx-auto mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default LearningEmptyState;
