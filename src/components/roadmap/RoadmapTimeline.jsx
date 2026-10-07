import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Target,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RoadmapSkillCard } from './RoadmapSkillCard';

export const RoadmapTimeline = ({
  stages = [],
  onSelectSkill,
  onOpenStage,
  className = '',
}) => {
  // By default, expand active/in-progress/first 3 stages
  const [expandedStages, setExpandedStages] = useState({
    foundation: true,
    'backend-development': true,
    'cloud-deployment': true,
    'system-design': false,
    'role-readiness': false,
  });

  const toggleStage = (stageId) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const getStageBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            Completed
          </span>
        );
      case 'In Progress':
      case 'Mostly Complete':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-800 border border-brand-200">
            {status}
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-medium bg-canvas-muted text-charcoal-600 border border-surface-border">
            Upcoming Stage
          </span>
        );
    }
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Career Roadmap Timeline</CardTitle>
              <CardDescription>
                Sequenced learning, practical building and role readiness stages.
              </CardDescription>
            </div>
          </div>

          <span className="text-xs font-semibold text-charcoal-500">
            {stages.length} Structured Stages
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-surface-border">
          {stages.map((stage, idx) => {
            const isExpanded = Boolean(expandedStages[stage.id]);
            const isCompleted = stage.status === 'Completed';
            const isInProgress = stage.status === 'In Progress' || stage.status === 'Mostly Complete';

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="relative"
              >
                {/* Pin Node on the line */}
                <div
                  className={`
                    absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-[10px] z-10 transition-colors shadow-xs
                    ${
                      isCompleted
                        ? 'bg-emerald-500 border-white text-white'
                        : isInProgress
                        ? 'bg-brand-600 border-white text-white ring-4 ring-brand-100'
                        : 'bg-surface border-charcoal-300 text-charcoal-600'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    stage.stageNumber
                  )}
                </div>

                {/* Stage Header Accordion Box */}
                <div
                  className={`
                    rounded-xl border transition-all overflow-hidden
                    ${
                      isInProgress
                        ? 'bg-brand-50/20 border-brand-200 shadow-xs'
                        : 'bg-canvas-subtle/70 border-surface-border'
                    }
                  `}
                >
                  <div
                    onClick={() => toggleStage(stage.id)}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-canvas-subtle/90 transition-colors select-none"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-brand-700">
                          STAGE {stage.stageNumber}
                        </span>
                        <h3 className="text-body-md font-extrabold text-charcoal-900 truncate">
                          {stage.title}
                        </h3>
                        {getStageBadge(stage.status)}
                      </div>
                      <p className="text-xs text-charcoal-600 leading-normal">
                        {stage.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-bold text-charcoal-800">
                          {stage.progress}%
                        </span>
                        <div className="w-20 h-1.5 bg-canvas-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-brand-500 rounded-full"
                            style={{ width: `${stage.progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenStage && onOpenStage(stage.id);
                        }}
                        className="text-xs font-semibold text-brand-700 hover:text-brand-900 underline hidden sm:inline-block cursor-pointer"
                      >
                        Deep Dive
                      </button>

                      <div className="p-1 rounded-sm text-charcoal-400 hover:text-charcoal-700">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Skills Grid */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-surface-border p-4 bg-surface/80 space-y-3"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(stage.skills || []).map((skill) => (
                            <RoadmapSkillCard
                              key={skill.id || skill.name}
                              skill={skill}
                              stageTitle={stage.title}
                              onSelectSkill={onSelectSkill}
                            />
                          ))}
                        </div>

                        <div className="pt-2 flex items-center justify-between text-xs text-charcoal-500">
                          <span>
                            {(stage.skills || []).length} Competencies in this stage
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenStage && onOpenStage(stage.id)}
                            className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open Stage Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoadmapTimeline;
