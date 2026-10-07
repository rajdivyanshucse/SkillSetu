import Card from '../ui/Card';
import Button from '../ui/Button';
import { Sparkles } from 'lucide-react';

export default function GrowthEmptyState({
  icon: Icon = Sparkles,
  title = 'No items recorded yet',
  description = 'Start adding activities, projects, or tracking your skill progress to build your professional growth record.',
  actionLabel,
  onAction
}) {
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
}
