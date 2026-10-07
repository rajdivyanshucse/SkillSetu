import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Layers, GitBranch, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const GapMethodology = ({ methodology = {}, className = '' }) => {
  const stages = methodology.stages || [
    {
      step: '01',
      name: 'Understand Your Profile',
      points: ['Declared skills & ratings', 'Academic background', 'Target career goals'],
      desc: 'Your declared skills and academic baseline form your verified profile graph.',
    },
    {
      step: '02',
      name: 'Model Target Role',
      points: ['Taxonomy requirement benchmarks', 'Skill co-occurrence links', 'Seniority expectations'],
      desc: 'SkillSetu models target archetypes and maps adjacent skill dependencies.',
    },
    {
      step: '03',
      name: 'Compare Capability',
      points: ['Current level rating', 'Required benchmark level', 'Calculated gap delta'],
      desc: 'Calculates the specific delta between your current proficiency and target standards.',
    },
    {
      step: '04',
      name: 'Prioritize Development',
      points: ['Role importance weight', 'Market demand signals', 'Future relevance trajectory'],
      desc: 'Synthesizes focused priority rankings so you know exactly which competency to build first.',
    },
  ];

  return (
    <Card className={`border-brand-200/80 bg-gradient-to-br from-surface to-brand-50/20 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-100 text-brand-800 border border-brand-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>{methodology.title || 'How SkillSetu identifies skill gaps'}</CardTitle>
              <CardDescription>
                Transparent, deterministic capability modeling without proprietary black-box claims.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-brand-800 bg-brand-100/70 px-2 py-0.5 rounded-xs border border-brand-200">
            Intelligence Standard
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((st, idx) => (
            <motion.div
              key={st.step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="p-4 rounded-lg bg-surface border border-surface-border flex flex-col justify-between space-y-2.5 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-xs bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {st.step}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-900">
                    {st.name}
                  </span>
                </div>

                <p className="text-xs text-charcoal-600 leading-relaxed mb-2.5">
                  {st.desc}
                </p>

                <div className="space-y-1 pt-2 border-t border-surface-border">
                  {st.points.map((pt) => (
                    <div key={pt} className="flex items-center gap-1.5 text-[11px] text-charcoal-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer Note */}
        <div className="p-3 rounded-lg bg-canvas-subtle border border-surface-border flex items-start gap-2.5 text-xs text-charcoal-600">
          <Info className="w-4 h-4 text-charcoal-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            {methodology.disclaimer ||
              'Skill gap insights are intended to support career development and should not be interpreted as hiring predictions.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GapMethodology;
