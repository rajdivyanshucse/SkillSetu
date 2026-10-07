import React, { useState } from 'react';
import { AlertTriangle, Trash2, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { resetAllIndividualSettings } from '../../utils/settingsIntelligence';

export const DeleteAccountPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleConfirmDeletion = () => {
    resetAllIndividualSettings();
    setIsDeleted(true);
    addToast({
      title: 'Account Closure Recorded',
      message: 'All local session states and preferences have been cleared in prototype mode.',
      type: 'info',
    });
  };

  if (isDeleted) {
    return (
      <SettingsLayout activeRoute="/dashboard/settings/delete-account">
        <Card className="p-8 text-center bg-surface border-surface-border space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-body-lg font-bold text-charcoal-900 font-serif">
              Account Closure Request Recorded
            </h3>
            <p className="text-body-sm text-charcoal-600 leading-relaxed">
              Your local profile calibration, saved learning paths, and personal preferences have been wiped in prototype mode.
            </p>
          </div>
          <div className="pt-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </SettingsLayout>
    );
  }

  const affectedItems = [
    { label: 'Calibrated Skill Profile', desc: 'All self-assessments, verified badges, and skill gap calculations' },
    { label: 'Career Roadmaps & Milestones', desc: 'Active multi-stage career paths and stage transitions' },
    { label: 'Learning Intelligence State', desc: 'Completed curriculum modules, project milestones, and validation status' },
    { label: 'Professional Growth Evidence', desc: 'Verified repository code artifacts, blueprints, and milestone records' },
    { label: 'Saved Opportunities & Alerts', desc: 'Bookmarked job listings and notification thresholds' },
    { label: 'Personal & Account Preferences', desc: 'Display density, notification categories, and contact information' },
  ];

  return (
    <SettingsLayout activeRoute="/dashboard/settings/delete-account">
      <div className="space-y-6">
        <SettingsHeader
          title="Account Closure & Data Erasure"
          subtitle="Permanently erase your local calibration state, learning records, and workspace preferences."
          badge="Destructive Action"
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
        />

        {/* Warning Banner */}
        <div className="p-5 rounded-xl bg-red-50/80 border border-red-200 text-red-900 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-status-danger-text shrink-0" />
            <h4 className="text-body-md font-bold font-serif">
              Warning: Account Closure is Irreversible
            </h4>
          </div>
          <p className="text-body-sm text-red-800 leading-relaxed max-w-2xl">
            Closing your account will immediately purge all stored LocalStorage entries, calibrated skill scores, and active learning paths associated with this device.
          </p>
        </div>

        {/* Affected Data Summary */}
        <Card className="p-6 bg-surface border-surface-border space-y-4">
          <h3 className="text-body-md font-bold text-charcoal-900 font-serif">
            What will be affected in this prototype:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {affectedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-red-100 bg-red-50/30 space-y-1"
              >
                <div className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-danger-text shrink-0" />
                  {item.label}
                </div>
                <p className="text-caption text-charcoal-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/settings')}
            >
              Keep My Account & Cancel
            </Button>

            <Button
              variant="destructive-solid"
              size="sm"
              onClick={() => setShowConfirmModal(true)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Permanently Delete Account
            </Button>
          </div>
        </Card>

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmDeletion}
          title="Confirm Account Closure?"
          message="Are you completely sure you want to permanently erase your account and all local calibration state? This action cannot be undone."
          confirmText="Yes, Permanently Delete"
          cancelText="Cancel"
          isDestructive={true}
        />
      </div>
    </SettingsLayout>
  );
};

export default DeleteAccountPage;
