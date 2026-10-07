import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Layers, Compass, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const IntelligenceExplainer = ({ explainer = {}, className = '' }) => {
  const steps = explainer.steps || [
    {
      stepNumber: '01',
      name: 'YOUR PROFILE',
      points: ['Declared competencies & ratings', 'Academic background & experience', 'Target career goals'],
      description: 'Your declared skills and academic baseline form your verified profile graph.',
    },
    {
      stepNumber: '02',
      name: 'SKILL INTELLIGENCE',
      points: ['Role taxonomy requirements', 'Skill co-occurrence links', 'Illustrative market signals'],
      description: 'SkillSetu models target archetypes and maps adjacent skill dependencies.',
    },
    {
      stepNumber: '03',
      name: 'CAREER INSIGHTS',
      points: ['Role compatibility scores', 'High-impact gap prioritization', 'Recommended learning steps'],
      description: 'Synthesizes focused next steps to help you close capability gaps systematically.',
    },
  ];

  const getStepIcon = (num) => {
    switch (num) {
      case '01':
        return <ShieldCheck className="w-4 h-4 text-brand-700" />;
      case '02':
        return <Layers className="w-4 h-4 text-brand-700" />;
      case '03':
        return <Compass className="w-4 h-4 text-brand-700" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-700" />;
    }
  };

  return (
    <Card className={`border-brand-200/80 bg-gradient-to-br from-surface to-brand-50/20 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-100 text-brand-800 border border-brand-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>{explainer.title || 'How SkillSetu reads your profile'}</CardTitle>
              <CardDescription>
                {explainer.subtitle || 'Transparent, structured capability mapping without black-box hype.'}
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-brand-800 bg-brand-100/70 px-2 py-0.5 rounded-xs border border-brand-200">
            Methodology
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((st, idx) => (
            <motion.div
              key={st.stepNumber}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.06 }}
              className="p-4 rounded-lg bg-surface border border-surface-border flex flex-col justify-between space-y-3 relative shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-xs bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs">
                      {st.stepNumber}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-900">
                      {st.name}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
                  {st.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-surface-border">
                  {st.points.map((pt) => (
                    <div key={pt} className="flex items-center gap-2 text-[11px] text-charcoal-700 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligenceExplainer;
