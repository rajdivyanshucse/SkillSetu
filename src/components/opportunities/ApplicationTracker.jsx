import React, { useState } from 'react';
import {
  Send,
  Calendar,
  Sparkles,
  ArrowRight,
  MoreVertical,
  Trash2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import {
  opportunitiesData,
  getStoredApplicationStatuses,
  saveStoredApplicationStatuses,
} from '../../data/opportunityData';
import { OpportunityEmptyState } from './OpportunityEmptyState';

export const ApplicationTracker = ({ className = '' }) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [appStatuses, setAppStatuses] = useState(() => getStoredApplicationStatuses());

  const handleStatusChange = (jobId, newStatus) => {
    const existing = appStatuses[jobId] || {
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
      nextAction: 'Review follow-up timeline',
    };

    const updated = {
      ...appStatuses,
      [jobId]: {
        ...existing,
        status: newStatus,
      },
    };

    setAppStatuses(updated);
    saveStoredApplicationStatuses(updated);

    addToast({
      title: 'Application Status Updated',
      message: `Status updated to ${newStatus}.`,
      type: 'success',
      duration: 3000,
    });
  };

  const handleRemoveApplication = (jobId, jobTitle) => {
    const updated = { ...appStatuses };
    delete updated[jobId];
    setAppStatuses(updated);
    saveStoredApplicationStatuses(updated);

    addToast({
      title: 'Application Untracked',
      message: `Removed ${jobTitle} from application tracker.`,
      type: 'info',
      duration: 2500,
    });
  };

  // Map tracked job IDs to opportunity records
  const trackedJobIds = Object.keys(appStatuses);
  const trackedOpportunities = trackedJobIds
    .map((id) => {
      const opp = opportunitiesData.find((j) => j.id === id);
      if (!opp) return null;
      return {
        ...opp,
        applicationData: appStatuses[id],
      };
    })
    .filter(Boolean);

  if (trackedOpportunities.length === 0) {
    return <OpportunityEmptyState type="applications" />;
  }

  const statusOptions = ['Saved', 'Applied', 'Interview', 'Offer', 'Closed'];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Desktop List / Table View */}
      <div className="hidden md:block bg-surface border border-surface-border rounded-xl shadow-subtle overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-canvas-subtle/80 border-b border-surface-border font-bold text-[10px] uppercase tracking-wider text-charcoal-500">
            <tr>
              <th className="py-3.5 px-4">Opportunity & Company</th>
              <th className="py-3.5 px-4">Compatibility</th>
              <th className="py-3.5 px-4">Date Tracked</th>
              <th className="py-3.5 px-4">Application Status</th>
              <th className="py-3.5 px-4">Next Suggested Action</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {trackedOpportunities.map((item) => (
              <tr key={item.id} className="hover:bg-canvas-subtle/50 transition-colors">
                {/* Opportunity Title & Company */}
                <td className="py-3.5 px-4">
                  <div>
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/jobs/${item.id}`)}
                      className="font-bold text-charcoal-900 hover:text-brand-700 transition-colors text-left block"
                    >
                      {item.title}
                    </button>
                    <span className="text-[11px] text-charcoal-500 font-medium">
                      {item.company} • {item.location}
                    </span>
                  </div>
                </td>

                {/* Compatibility */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-brand-800">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    <span>{item.compatibility}%</span>
                  </div>
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-600">
                  {item.applicationData?.appliedDate || '2026-09-28'}
                </td>

                {/* Status Dropdown */}
                <td className="py-3.5 px-4">
                  <select
                    value={item.applicationData?.status || 'Applied'}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="px-2 py-1 text-[11px] font-bold uppercase rounded-xs bg-canvas-subtle border border-surface-border text-charcoal-800 focus:ring-1 focus:ring-brand-500 cursor-pointer"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Next Action */}
                <td className="py-3.5 px-4 max-w-xs">
                  <p className="text-[11px] text-charcoal-700 leading-tight">
                    {item.applicationData?.nextAction || 'Await talent partner feedback'}
                  </p>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => navigate(`/dashboard/jobs/${item.id}`)}
                      rightIcon={<ArrowRight className="w-3 h-3" />}
                    >
                      Details
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleRemoveApplication(item.id, item.title)}
                      className="p-1 rounded-sm text-charcoal-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                      title="Untrack application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden space-y-3">
        {trackedOpportunities.map((item) => (
          <Card key={item.id} className="p-4 space-y-3 bg-surface">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-charcoal-500">
                  {item.company}
                </span>
                <h4
                  onClick={() => navigate(`/dashboard/jobs/${item.id}`)}
                  className="text-body-sm font-bold text-charcoal-900 cursor-pointer hover:text-brand-700"
                >
                  {item.title}
                </h4>
              </div>

              <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded-xs border border-brand-200">
                {item.compatibility}% Fit
              </span>
            </div>

            <div className="pt-2 border-t border-surface-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-bold text-charcoal-400">
                  Status:
                </span>
                <select
                  value={item.applicationData?.status || 'Applied'}
                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  className="px-2 py-1 text-[11px] font-bold uppercase rounded-xs bg-canvas-subtle border border-surface-border text-charcoal-800"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] text-charcoal-600 bg-canvas-subtle p-2 rounded-md">
                <strong className="text-charcoal-800 block text-[10px] uppercase">
                  Next Action:
                </strong>
                {item.applicationData?.nextAction || 'Await talent partner screening review'}
              </div>
            </div>

            <div className="pt-2 border-t border-surface-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleRemoveApplication(item.id, item.title)}
                className="text-xs text-rose-600 font-semibold"
              >
                Untrack
              </button>

              <Button
                variant="outline"
                size="xs"
                rightIcon={<ArrowRight className="w-3 h-3" />}
                onClick={() => navigate(`/dashboard/jobs/${item.id}`)}
              >
                View Opportunity
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTracker;
