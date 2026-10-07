import React from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';

export const LearningPriorityCards = ({ priorities = [] }) => {
  const { navigate } = useRouter();

  const defaultPriorities = [
    {
      id: 'prio-spring-boot',
      skill: 'Spring Boot',
      priority: 'High',
      skillGap: 'Level 3/10 → 8/10 (Gap: 5)',
      roleRelevance: 'High',
      progressPct: 62,
      reason: 'Essential development area for enterprise backend services and microservice architecture.',
      nextAction: 'Build REST API Project',
      pathId: 'path-backend-foundations',
      roadmapStage: 'Stage 02 — Enterprise Microservices',
    },
    {
      id: 'prio-aws',
      skill: 'AWS Cloud Architecture',
      priority: 'High',
      skillGap: 'Level 1/10 → 7/10 (Gap: 6)',
      roleRelevance: 'High',
      progressPct: 34,
      reason: 'Core capability gap relative to target role requirements with 11 matching market postings.',
      nextAction: 'Complete Cloud Fundamentals Module',
      pathId: 'path-cloud-engineering',
      roadmapStage: 'Stage 03 — Cloud & Distributed Systems',
    },
    {
      id: 'prio-system-design',
      skill: 'System Design',
      priority: 'Medium',
      skillGap: 'Level 2/10 → 8/10 (Gap: 6)',
      roleRelevance: 'High',
      progressPct: 18,
      reason: 'Target role architectural requirement for distributed caching, messaging, and fault tolerance.',
      nextAction: 'Practice Architecture Case Study',
      pathId: 'path-system-design',
      roadmapStage: 'Stage 04 — Production Readiness',
    },
    {
      id: 'prio-sql',
      skill: 'SQL & Query Optimization',
      priority: 'Medium',
      skillGap: 'Level 5/10 → 8/10 (Gap: 3)',
      roleRelevance: 'High',
      progressPct: 75,
      reason: 'Core database performance skill for sub-millisecond query execution and indexing.',
      nextAction: 'Review Execution Plan Analysis',
      pathId: 'path-backend-foundations',
      roadmapStage: 'Stage 01 — Core Foundation',
    },
  ];

  const displayList = priorities.length > 0 ? priorities : defaultPriorities;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-body-sm font-bold text-charcoal-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-600" />
            Current Priority Learning Areas
          </h3>
          <p className="text-xs text-charcoal-500">
            Competencies prioritized by skill gap depth, target-role relevance, and opportunity presence
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/learning/recommendations')}
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer"
        >
          All Recommendations <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayList.map((item, idx) => (
          <motion.div
            key={item.id || item.skill}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="p-4 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-body-sm font-bold text-charcoal-900">
                  {item.skill}
                </span>
                <Badge
                  variant={item.priority === 'High' ? 'danger' : 'warning'}
                  size="sm"
                >
                  {item.priority} Priority
                </Badge>
              </div>

              {/* Skill Gap & Role Relevance */}
              <div className="space-y-1.5 text-xs text-charcoal-600 mb-3">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-charcoal-500">Skill Gap:</span>
                  <span className="font-semibold text-charcoal-800">{item.skillGap}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-charcoal-500">Role Relevance:</span>
                  <span className="font-semibold text-brand-800">{item.roleRelevance}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3 space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-charcoal-700">
                  <span>Learning Progress</span>
                  <span className="font-mono text-brand-700">{item.progressPct}%</span>
                </div>
                <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${item.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Reason / Context */}
              <p className="text-[11px] text-charcoal-600 leading-relaxed mb-3 line-clamp-2">
                {item.reason}
              </p>

              {/* Next Action Box */}
              <div className="p-2 rounded bg-brand-50/70 border border-brand-100/70 text-[11px] text-brand-900 mb-4">
                <strong>Next:</strong> {item.nextAction}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-surface-border/70 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/learning/path/${item.pathId || 'path-backend-foundations'}`)}
                className="font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Study Path</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard/skill-gaps')}
                className="text-charcoal-400 hover:text-charcoal-700 cursor-pointer"
                title="View in Skill Gap Analysis"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearningPriorityCards;
