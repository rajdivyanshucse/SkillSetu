import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export const GapReasonCard = ({
  prioritySkills = [],
  onSelectSkill,
  className = '',
}) => {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Why These Gaps Matter</CardTitle>
              <CardDescription>
                Workforce context explaining how each priority skill connects with target responsibilities.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500 bg-canvas-subtle px-2 py-0.5 rounded-xs border border-surface-border">
            Contextual Intelligence
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prioritySkills.map((s, idx) => (
            <motion.div
              key={s.id || s.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="p-4 rounded-xl bg-canvas-subtle/70 border border-surface-border hover:border-surface-border-strong transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                      {s.name.slice(0, 2).toUpperCase()}
                    </div>
                    <h4 className="text-body-sm font-bold text-charcoal-900">
                      {s.name}
                    </h4>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400">
                    {s.category}
                  </span>
                </div>

                <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
                  {s.whyItMatters}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-border/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-charcoal-500">
                  Target: <strong className="text-charcoal-800">{s.requiredLevel}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => onSelectSkill && onSelectSkill(s)}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Strategy</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GapReasonCard;
