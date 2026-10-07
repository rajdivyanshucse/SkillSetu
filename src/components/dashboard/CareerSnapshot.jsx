import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Layers,
  Compass,
  GitBranch,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Card } from '../ui/Card';

export const CareerSnapshot = ({ kpiStats = [], className = '' }) => {
  const getIcon = (id) => {
    switch (id) {
      case 'kpi-completeness':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'kpi-coverage':
        return <Layers className="w-4 h-4 text-brand-600" />;
      case 'kpi-compatibility':
        return <Compass className="w-4 h-4 text-brand-600" />;
      case 'kpi-gaps':
        return <GitBranch className="w-4 h-4 text-amber-600" />;
      default:
        return <Award className="w-4 h-4 text-charcoal-600" />;
    }
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {kpiStats.map((kpi, idx) => (
        <motion.div
          key={kpi.id || idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: idx * 0.05 }}
        >
          <Card className="p-5 flex flex-col justify-between h-full hover:border-surface-border-strong hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                {kpi.title}
              </span>
              <div className="p-1.5 rounded-sm bg-canvas-subtle border border-surface-border">
                {getIcon(kpi.id)}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
                {kpi.value}
              </div>
              <p className="text-xs text-charcoal-500 mt-1 leading-normal">
                {kpi.subtext}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-surface-border flex items-center justify-between text-[11px]">
              <span className="font-semibold text-charcoal-700">{kpi.trend}</span>
              <span className="text-charcoal-400">Baseline Metric</span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default CareerSnapshot;
