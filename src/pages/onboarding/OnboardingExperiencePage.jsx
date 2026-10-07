import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Briefcase, FolderGit2, Calendar, Building2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingNavigation } from '../../components/onboarding/OnboardingNavigation';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Checkbox } from '../../components/ui/Checkbox';
import { Button } from '../../components/ui/Button';

export const OnboardingExperiencePage = () => {
  const { navigate } = useRouter();
  const { data, addExperience, updateExperience, removeExperience } = useOnboarding();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newExp, setNewExp] = useState({
    role: '',
    organization: '',
    startDate: '',
    endDate: '',
    isPresent: false,
    description: '',
    type: 'work',
  });

  const handleAddNew = () => {
    if (!newExp.role.trim() || !newExp.organization.trim()) return;
    addExperience(newExp);
    setNewExp({
      role: '',
      organization: '',
      startDate: '',
      endDate: '',
      isPresent: false,
      description: '',
      type: 'work',
    });
    setShowAddModal(false);
  };

  return (
    <OnboardingLayout stepIndex={3}>
      <div className="space-y-6">
        <OnboardingHeader
          stepNumber={3}
          badge="Step 03"
          title="Tell us about your experience"
          subtitle="Document past or current positions, key projects, internships, or academic research."
        />

        {/* Existing Experience Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-900">
              Added Experience Records ({data.experience.length})
            </span>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowAddModal(true)}
            >
              Add Experience
            </Button>
          </div>

          {data.experience.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-canvas-subtle/70 border border-dashed border-surface-border space-y-3">
              <Briefcase className="w-6 h-6 text-charcoal-400 mx-auto" />
              <div>
                <h4 className="text-body-sm font-semibold text-charcoal-800">No experience items added yet</h4>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Add projects, internships, or full-time roles to help contextualize your background.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setShowAddModal(true)}
              >
                Add Your First Experience
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {data.experience.map((exp) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 sm:p-5 rounded-lg bg-surface border border-surface-border shadow-card space-y-2 relative"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-xs bg-canvas-subtle border border-surface-border text-charcoal-700">
                            {exp.type === 'project' ? <FolderGit2 className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                          </span>
                          <h4 className="text-body-md font-bold text-charcoal-900 leading-tight">
                            {exp.role}
                          </h4>
                        </div>
                        <span className="text-xs font-medium text-charcoal-600 block mt-1 pl-6">
                          {exp.organization}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="p-1 text-charcoal-400 hover:text-status-danger-text rounded-xs hover:bg-canvas-subtle transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {(exp.startDate || exp.isPresent || exp.endDate) && (
                      <div className="flex items-center gap-2 text-xs text-charcoal-400 pl-6">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {exp.startDate || 'Started'} — {exp.isPresent ? 'Present' : exp.endDate || 'Ended'}
                        </span>
                      </div>
                    )}

                    {exp.description && (
                      <p className="text-xs text-charcoal-600 pl-6 leading-relaxed pt-1 border-t border-surface-border mt-2">
                        {exp.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Add Experience Inline Form */}
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-canvas-subtle/80 border border-surface-border shadow-subtle space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <span className="text-xs font-bold text-charcoal-900">New Experience Record</span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setNewExp({ ...newExp, type: 'work' })}
                  className={`px-2 py-1 rounded-xs font-semibold ${
                    newExp.type === 'work' ? 'bg-charcoal-900 text-white' : 'text-charcoal-600'
                  }`}
                >
                  Work / Internship
                </button>
                <button
                  type="button"
                  onClick={() => setNewExp({ ...newExp, type: 'project' })}
                  className={`px-2 py-1 rounded-xs font-semibold ${
                    newExp.type === 'project' ? 'bg-charcoal-900 text-white' : 'text-charcoal-600'
                  }`}
                >
                  Project / Research
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Role / Title / Project Name"
                placeholder="e.g. Backend Engineering Intern / Distributed DB"
                value={newExp.role}
                onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                required
              />
              <Input
                label="Organization / Company / Lab"
                placeholder="e.g. Open Source Project / Acme Labs"
                value={newExp.organization}
                onChange={(e) => setNewExp({ ...newExp, organization: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={newExp.startDate}
                onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
              />
              <div className="space-y-1.5">
                <Input
                  label="End Date"
                  type="month"
                  disabled={newExp.isPresent}
                  value={newExp.endDate}
                  onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                />
                <Checkbox
                  label="I currently work/contribute here"
                  checked={newExp.isPresent}
                  onChange={(e) => setNewExp({ ...newExp, isPresent: e.target.checked, endDate: '' })}
                />
              </div>
            </div>

            <Textarea
              label="Key Responsibilities / Impact (Optional)"
              rows={2}
              placeholder="e.g. Optimized SQL query latencies by 35% using indexing and Redis caching."
              value={newExp.description}
              onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddNew}>
                Save Record
              </Button>
            </div>
          </motion.div>
        )}

        <OnboardingNavigation
          onBack={() => navigate('/onboarding/skills')}
          onContinue={() => navigate('/onboarding/interests')}
          onSkip={() => navigate('/onboarding/interests')}
          continueLabel="Save & Continue to Interests"
        />
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingExperiencePage;
