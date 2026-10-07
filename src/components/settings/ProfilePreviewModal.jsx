import React from 'react';
import { User, MapPin, Briefcase, Award, Layers, CheckCircle2, Shield, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export const ProfilePreviewModal = ({
  isOpen = false,
  onClose,
  profile = {},
  visibilitySettings = {},
  careerPrefs = {},
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Public Profile Preview">
      <div className="space-y-6">
        {/* Header Preview Banner */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-stone-900 via-stone-800 to-brand-950 text-white space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                {profile.fullName?.slice(0, 2).toUpperCase() || 'AM'}
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white leading-tight">
                  {profile.fullName || 'Arjun Mehta'}
                </h3>
                <p className="text-xs text-brand-200 mt-0.5">
                  {careerPrefs.primaryTargetRole || 'Backend Software Engineer'}
                </p>
              </div>
            </div>

            <Badge className="bg-white/10 text-white border border-white/20 text-[10px]">
              {visibilitySettings.visibilityLevel === 'visible_organizations'
                ? 'Visible to Organizations'
                : 'Visible to Opportunities'}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-2 border-t border-white/10">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              {profile.location || 'Bengaluru, India'}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-brand-400" />
              {careerPrefs.experienceLevel || 'Mid Level (3-5 years)'}
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              Calibrated Candidate
            </span>
          </div>
        </div>

        {/* Visibility Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Skills Card */}
          {visibilitySettings.showSkills && (
            <div className="p-4 rounded-xl border border-surface-border bg-canvas-subtle/40 space-y-2">
              <h4 className="text-xs font-bold text-charcoal-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-brand-600" />
                Verified Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Java', 'Spring Boot', 'AWS', 'Docker', 'PostgreSQL', 'REST APIs', 'System Design'].map((sk) => (
                  <span
                    key={sk}
                    className="text-[11px] font-medium px-2.5 py-1 rounded bg-white text-charcoal-800 border border-surface-border"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Target Role & Modality */}
          {visibilitySettings.showTargetRole && (
            <div className="p-4 rounded-xl border border-surface-border bg-canvas-subtle/40 space-y-2">
              <h4 className="text-xs font-bold text-charcoal-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-brand-600" />
                Work Preferences
              </h4>
              <div className="space-y-1 text-xs text-charcoal-700">
                <div>
                  <span className="text-charcoal-500">Mode: </span>
                  <strong>{careerPrefs.workMode || 'Hybrid'}</strong>
                </div>
                <div>
                  <span className="text-charcoal-500">Preferred Cities: </span>
                  <span>Bengaluru, Hyderabad, Remote</span>
                </div>
                <div>
                  <span className="text-charcoal-500">Timeline: </span>
                  <span className="text-brand-800 font-semibold">{careerPrefs.careerTimeline || 'Actively developing'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Portfolio Projects Card */}
        {visibilitySettings.showProjects && (
          <div className="p-4 rounded-xl border border-surface-border bg-white space-y-2">
            <h4 className="text-xs font-bold text-charcoal-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-600" />
              Verified Portfolio Projects
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-canvas-subtle border border-surface-border flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-charcoal-900">Distributed Inventory API</h5>
                  <p className="text-[11px] text-charcoal-500">Spring Boot, Redis, Kafka, Docker</p>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200">
                  Verified Code
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfilePreviewModal;
