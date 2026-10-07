import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  UserCheck,
  PlusCircle,
  Compass,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const RecentActivity = ({ activity = [], className = '' }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck className="w-3.5 h-3.5 text-brand-700" />;
      case 'PlusCircle':
        return <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />;
      case 'Compass':
        return <Compass className="w-3.5 h-3.5 text-brand-700" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-charcoal-600" />;
    }
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Telemetry log of profile actions & calibration updates.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500 bg-canvas-subtle px-2 py-0.5 rounded-xs border border-surface-border">
            Audit Trail
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-surface-border before:z-0">
          {activity.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className="relative z-10 flex items-start gap-3 text-xs"
            >
              <div className="w-7 h-7 rounded-full bg-canvas-subtle border border-surface-border flex items-center justify-center shrink-0 shadow-xs">
                {getIcon(item.icon)}
              </div>

              <div className="min-w-0 flex-1 pt-1 flex items-center justify-between gap-2">
                <span className="font-semibold text-charcoal-900 truncate">
                  {item.event}
                </span>
                <span className="text-[10px] text-charcoal-400 shrink-0 font-medium">
                  {item.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
