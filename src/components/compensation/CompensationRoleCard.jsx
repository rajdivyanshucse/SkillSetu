import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, MapPin, Briefcase, Sparkles, CheckCircle2, TrendingUp, Plus, Check } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';

export const CompensationRoleCard = ({
  role,
  isSelectedForCompare = false,
  onToggleCompare,
  className = '',
}) => {
  const { navigate } = useRouter();

  if (!role) return null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className={`bg-surface rounded-lg border transition-all p-4 flex flex-col justify-between shadow-xs ${
        isSelectedForCompare
          ? 'border-brand-500 ring-1 ring-brand-500/20 bg-brand-500/5'
          : 'border-surface-border hover:border-brand-300'
      } ${className}`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
              {role.category || role.department}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-charcoal-900 leading-snug">
              {role.title}
            </h3>
          </div>
          {role.growthSignal && (
            <Badge
              variant={
                role.growthSignal.includes('High')
                  ? 'success'
                  : role.growthSignal.includes('Strategic')
                  ? 'brand'
                  : 'neutral'
              }
              size="sm"
            >
              {role.growthSignal}
            </Badge>
          )}
        </div>

        {/* Advertised Comp Highlight */}
        <div className="my-3 p-2.5 rounded-md bg-canvas-subtle/70 border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
              Advertised Median
            </span>
            <span className="text-base sm:text-lg font-extrabold text-charcoal-900">
              ₹{role.medianLpa || role.calculatedMedian} LPA
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
              Typical Span
            </span>
            <span className="text-xs sm:text-sm font-semibold text-charcoal-700">
              {role.typicalRange || role.calculatedRange}
            </span>
          </div>
        </div>

        {/* Role Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs text-charcoal-600 mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
            <span className="truncate">{role.commonExperience || '1–5 years'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
            <span className="truncate">{role.primaryWorkMode || 'Hybrid'}</span>
          </div>
        </div>

        {/* Top Associated Skills */}
        {role.topSkills && role.topSkills.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-charcoal-500 block mb-1.5">
              Associated Key Skills
            </span>
            <div className="flex flex-wrap gap-1">
              {role.topSkills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded-xs bg-canvas-muted text-charcoal-700 text-[11px] font-medium border border-surface-border/60"
                >
                  {skill}
                </span>
              ))}
              {role.topSkills.length > 4 && (
                <span className="px-1.5 py-0.5 rounded-xs bg-canvas-muted text-charcoal-500 text-[10px] font-medium">
                  +{role.topSkills.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-surface-border/70 flex items-center justify-between gap-2">
        {onToggleCompare && (
          <button
            type="button"
            onClick={() => onToggleCompare(role.id)}
            className={`text-xs font-semibold px-2 py-1.5 rounded-sm border transition-colors flex items-center gap-1 cursor-pointer ${
              isSelectedForCompare
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-surface text-charcoal-700 hover:bg-canvas-subtle border-surface-border'
            }`}
          >
            {isSelectedForCompare ? (
              <>
                <Check className="w-3 h-3" /> Selected
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" /> Compare
              </>
            )}
          </button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/dashboard/compensation/roles/${role.id}`)}
          className="ml-auto text-xs flex items-center gap-1.5"
        >
          View Intelligence
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};
