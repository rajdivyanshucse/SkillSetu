import React, { useState } from 'react';
import {
  Activity,
  BookOpen,
  Briefcase,
  GitBranch,
  Sliders,
  Shield,
  Clock,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { ConfirmDialog } from '../ui/Modal';
import SettingsEmptyState from './SettingsEmptyState';

const iconMap = {
  learning: BookOpen,
  growth: TrendingUp,
  opportunity: Briefcase,
  skill_gap: GitBranch,
  settings: Sliders,
  security: Shield,
  planning: Sliders,
  talent: Briefcase,
  workforce: Activity,
};

export const AccountActivityTimeline = ({
  activities = [],
  onClear,
  title = 'Recent Activity Log',
  subtitle = 'Chronological log of changes, calibrations, and interactions in this workspace session.',
}) => {
  const [filter, setFilter] = useState('ALL');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = filter === 'ALL'
    ? activities
    : activities.filter((a) => a.type === filter);

  const categories = ['ALL', 'learning', 'growth', 'opportunity', 'skill_gap', 'settings'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-body-md font-bold text-charcoal-900 font-serif">{title}</h3>
          <p className="text-body-sm text-charcoal-500 mt-0.5">{subtitle}</p>
        </div>

        {activities.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-status-danger-text hover:bg-red-50 border-red-200 self-start sm:self-auto"
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear Activity History
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      {activities.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`
                px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer
                ${
                  filter === cat
                    ? 'bg-brand-700 text-white shadow-xs'
                    : 'bg-canvas-subtle text-charcoal-600 hover:bg-stone-200/80 border border-surface-border'
                }
              `}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Timeline List */}
      {filtered.length > 0 ? (
        <Card className="divide-y divide-surface-border border-surface-border bg-surface overflow-hidden">
          {filtered.map((item) => {
            const Icon = iconMap[item.type] || Activity;
            return (
              <div
                key={item.id}
                className="p-4 hover:bg-canvas-subtle/30 transition-colors flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-brand-50 text-brand-700 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-body-sm font-bold text-charcoal-900">{item.title}</h4>
                      <Badge variant="outline" className="text-[10px] bg-stone-50 text-charcoal-600 border-stone-200 capitalize">
                        {item.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-caption text-charcoal-600 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-charcoal-400 pt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                      {item.source && <span>• Source: {item.source}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      ) : (
        <SettingsEmptyState
          icon={Activity}
          title="No activity recorded"
          description="Your actions, calibrations, and learning progress will appear here as you navigate SkillSetu."
        />
      )}

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          onClear && onClear();
          setShowClearConfirm(false);
        }}
        title="Clear Activity History?"
        message="Are you sure you want to clear your local activity history? This action clears the session timeline from LocalStorage."
        confirmText="Clear History"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default AccountActivityTimeline;
