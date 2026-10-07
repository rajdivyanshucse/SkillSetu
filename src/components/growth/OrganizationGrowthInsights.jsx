import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Lightbulb, TrendingUp, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from '../../router/Router';

const typeIcons = {
  observation: Lightbulb,
  priority: TrendingUp,
  alignment: Compass,
  action: ArrowRight
};

const badgeStyles = {
  observation: { label: 'Aggregate Pattern', variant: 'neutral' },
  priority: { label: 'Strategic Priority', variant: 'warning' },
  alignment: { label: 'Plan Alignment', variant: 'primary' },
  action: { label: 'Capability Focus', variant: 'success' }
};

export default function OrganizationGrowthInsights({ insights = [] }) {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-warm-charcoal flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warm-brown" />
            Aggregate Growth & Capability Signals
          </h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Planning observations derived from configured workforce plans and active development programs
          </p>
        </div>
        <Badge variant="neutral" size="sm" className="text-xs">
          Planning Observations Only
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const Icon = typeIcons[insight.type] || Lightbulb;
          const badge = badgeStyles[insight.type] || badgeStyles.observation;

          return (
            <Card key={insight.id} className="p-4 border-charcoal-light/10 hover:border-warm-brown/30 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-warm-brown/10 flex items-center justify-center shrink-0 mt-0.5 text-warm-brown">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <Badge variant={badge.variant} size="sm">
                      {badge.label}
                    </Badge>
                    {insight.area && (
                      <span className="text-xs font-mono text-charcoal-muted">
                        Area: {insight.area}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-warm-charcoal leading-relaxed font-medium mb-2">
                    {insight.observation}
                  </p>

                  <div className="bg-warm-sand/20 rounded-md p-2.5 text-xs text-charcoal-muted border border-charcoal-light/10 mb-3">
                    <span className="font-semibold text-warm-charcoal block mb-0.5">Strategic Context:</span>
                    {insight.context}
                  </div>

                  {insight.link && (
                    <Link
                      to={insight.link}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-brown hover:text-warm-brown/80 transition-colors"
                    >
                      {insight.linkText || 'Explore Details'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="bg-warm-sand/30 border border-charcoal-light/10 rounded-lg p-3 flex items-center gap-2.5 text-xs text-charcoal-muted">
        <ShieldCheck className="w-4 h-4 text-warm-brown shrink-0" />
        <span>
          <strong>Privacy & Governance:</strong> These insights reflect high-level organizational capability metrics. Individual employee scores, rankings, or performance reviews are strictly excluded.
        </span>
      </div>
    </div>
  );
}
