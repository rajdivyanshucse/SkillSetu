import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Clock, Award, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';
import { initialValidationActivities } from '../../data/learningData';

export const LearningValidation = ({
  activities = initialValidationActivities,
}) => {
  const { navigate } = useRouter();

  if (!activities || activities.length === 0) return null;

  return (
    <div className="p-5 rounded-lg bg-surface border border-surface-border shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-body-sm font-bold text-charcoal-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Development Validation Activities
          </h3>
          <p className="text-xs text-charcoal-500">
            Case studies, assessments, and portfolio reviews verifying practical concept application
          </p>
        </div>

        <Badge variant="neutral" size="sm">
          Development Validation Model
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activities.map((act, idx) => (
          <motion.div
            key={act.id || idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: idx * 0.04 }}
            className="p-3.5 rounded-md bg-canvas border border-surface-border flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.2 rounded border border-brand-200/60">
                  {act.type}
                </span>
                <Badge
                  variant={
                    act.status === 'Completed'
                      ? 'success'
                      : act.status === 'In Progress'
                      ? 'info'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {act.status}
                </Badge>
              </div>

              <h4 className="text-xs font-bold text-charcoal-900 leading-snug">
                {act.title}
              </h4>
              <span className="text-[11px] text-charcoal-500 mt-0.5 block">
                Skill: <strong>{act.skill}</strong> • Path: {act.relatedPath}
              </span>
            </div>

            <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-800 text-[11px]">
                {act.resultText || (act.status === 'Completed' ? 'Validated' : 'Pending')}
              </span>
              <span className="text-[10px] text-charcoal-400">
                {act.date || '—'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-1 text-[11px] text-charcoal-500 flex items-center gap-1.5 border-t border-surface-border/50">
        <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span>
          Validation activities are self-directed engineering evaluations and do not replace third-party certifications or university degrees.
        </span>
      </div>
    </div>
  );
};

export default LearningValidation;
