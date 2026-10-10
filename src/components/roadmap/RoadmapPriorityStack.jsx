import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Hammer,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MarketSignalBadge } from '../capability/MarketSignalBadge';

/**
 * RoadmapPriorityStack Component
 * Phase 37: "WHAT TO WORK ON FIRST"
 * Ranks actionable roadmap capabilities with explainable signal traceability.
 */
export const RoadmapPriorityStack = ({
  priorityItems = [],
  activeSkillName = '',
  onSelectSkill,
  className = '',
}) => {
  const defaultItems = [
    {
      id: 'prio-docker',
      name: 'Docker',
      priorityBadge: 'High Priority',
      priorityVariant: 'danger',
      category: 'Containerization',
      marketSignal: 'GROWING',
      marketTrajectory: '+24% YoY',
      currentState: 'Evidence Needed',
      targetRequirement: 'Required for Target Role',
      why: 'Required for Backend Engineer benchmark • +24% market demand signal • Currently missing project evidence.',
      nextStep: 'Build a production Dockerfile for REST API',
      stageNumber: '02',
    },
    {
      id: 'prio-springboot',
      name: 'Spring Boot',
      priorityBadge: 'High Priority',
      priorityVariant: 'danger',
      category: 'Backend Frameworks',
      marketSignal: 'GROWING',
      marketTrajectory: '+18% YoY',
      currentState: 'Developing',
      targetRequirement: 'Required for Target Role',
      why: 'Core microservice framework • Active in-progress milestones • Essential for Spring Security & JPA.',
      nextStep: 'Implement JWT auth and Redis caching',
      stageNumber: '02',
    },
    {
      id: 'prio-aws',
      name: 'AWS Cloud Deployment',
      priorityBadge: 'High Priority',
      priorityVariant: 'danger',
      category: 'Cloud Infrastructure',
      marketSignal: 'GROWING',
      marketTrajectory: '+28% YoY',
      currentState: 'Developing',
      targetRequirement: 'Required for Target Role',
      why: 'Highest growing cloud signal (+28%) • Needed for cloud execution • Connects to ECS & RDS.',
      nextStep: 'Deploy Spring Boot API to AWS App Runner',
      stageNumber: '03',
    },
    {
      id: 'prio-sysdesign',
      name: 'System Design',
      priorityBadge: 'Medium Priority',
      priorityVariant: 'warning',
      category: 'Software Architecture',
      marketSignal: 'GROWING',
      marketTrajectory: '+22% YoY',
      currentState: 'Self-Reported',
      targetRequirement: 'Required for Target Role',
      why: 'Architecture requirement for scalable backends • Solidify caching and database partitioning.',
      nextStep: 'Design distributed caching & read-replica plan',
      stageNumber: '04',
    },
  ];

  const items = priorityItems.length > 0 ? priorityItems : defaultItems;

  return (
    <Card className={`overflow-hidden border-surface-border shadow-xs ${className}`}>
      <CardHeader className="bg-surface border-b border-surface-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200/60">
                <Sparkles className="w-4 h-4" />
              </div>
              <CardTitle className="text-base sm:text-lg">
                What to Work on First — Priority Stack
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Calibrated development priorities combining role requirements, market signals, and current evidence gaps.
            </CardDescription>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-50 text-brand-800 border border-brand-200 self-start sm:self-auto">
            {items.length} Focus Competencies
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item, index) => {
            const isActive = activeSkillName.toLowerCase().includes(item.name.toLowerCase());

            return (
              <div
                key={item.id || index}
                onClick={() => onSelectSkill && onSelectSkill(item)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-brand-50/40 border-brand-500 ring-2 ring-brand-200 shadow-xs'
                    : 'bg-surface border-surface-border hover:border-brand-300 hover:shadow-2xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-charcoal-100 text-charcoal-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-charcoal-900">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-charcoal-500 font-semibold block">
                          Stage {item.stageNumber} • {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MarketSignalBadge signal={item.marketSignal} size="xs" short />
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.priorityVariant === 'danger'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {item.priorityBadge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-600 leading-relaxed pt-1">
                    {item.why}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-surface-border/70 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-brand-800 truncate max-w-[220px]">
                    Next: {item.nextStep}
                  </span>

                  <span className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 shrink-0">
                    {isActive ? 'Active Plan' : 'Select'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoadmapPriorityStack;
