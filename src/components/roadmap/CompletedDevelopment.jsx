import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const CompletedDevelopment = ({
  milestones = [],
  className = '',
}) => {
  const defaultMilestones = [
    { title: 'Java Fundamentals & OOP', detail: 'Advanced rating declared · Verified in baseline profile' },
    { title: 'SQL Querying & Normalization', detail: 'Intermediate rating declared · Relational databases mapped' },
    { title: 'JavaScript Syntax & Web Basics', detail: 'Intermediate rating declared · Frontend baseline mapped' },
    { title: 'Profile Calibration & Taxonomy Sync', detail: 'Completed 100% individual profile calibration' },
  ];

  const items = milestones.length > 0 ? milestones : defaultMilestones;

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Completed Milestones</CardTitle>
              <CardDescription>
                Competencies and calibration achievements already aligned.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
            Based on your profile
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="space-y-2.5">
          {items.map((m, idx) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className="p-3 rounded-lg bg-canvas-subtle/70 border border-surface-border flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-body-sm font-bold text-charcoal-900 truncate">
                  {m.title}
                </h4>
                <p className="text-[11px] text-charcoal-500 mt-0.5">
                  {m.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletedDevelopment;
