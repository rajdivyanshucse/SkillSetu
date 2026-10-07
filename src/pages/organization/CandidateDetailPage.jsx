import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  GitCompare,
  Bookmark,
  GraduationCap,
  Award,
  FolderGit2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { getCandidateById, STORAGE_KEY_TALENT_SHORTLIST, STORAGE_KEY_TALENT_COMPARE } from '../../data/talentData';
import { getTalentRoleById, talentRoles, STORAGE_KEY_SELECTED_TALENT_ROLE } from '../../data/talentRoleData';
import {
  calculateTalentCompatibility,
  getMatchingSkills,
  getDevelopmentAreas,
} from '../../utils/talentMatching';
import { ShortlistButton } from '../../components/talent/ShortlistButton';
import { TalentMatchBreakdown } from '../../components/talent/TalentMatchBreakdown';
import { TalentMatchExplanation } from '../../components/talent/TalentMatchExplanation';
import { CandidateSkillMatrix } from '../../components/talent/CandidateSkillMatrix';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const CandidateDetailPage = ({ candidateId }) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [explanationOpen, setExplanationOpen] = useState(false);

  const candidate = useMemo(() => getCandidateById(candidateId), [candidateId]);

  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SELECTED_TALENT_ROLE) || talentRoles[0].id;
    } catch (e) {
      return talentRoles[0].id;
    }
  });

  const activeRole = useMemo(() => getTalentRoleById(selectedRoleId), [selectedRoleId]);

  const [shortlist, setShortlist] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TALENT_SHORTLIST);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [compareList, setCompareList] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TALENT_COMPARE);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const isCompared = compareList.includes(candidate.id);
  const compatibility = calculateTalentCompatibility(candidate, activeRole);
  const { strongMatches, developmentAreas } = getMatchingSkills(candidate, activeRole);

  const handleToggleCompare = () => {
    let updated;
    if (isCompared) {
      updated = compareList.filter((id) => id !== candidate.id);
      addToast({
        title: 'Removed from Comparison',
        message: `${candidate.name} was removed from the comparison matrix.`,
        type: 'info',
        duration: 2500,
      });
    } else {
      if (compareList.length >= 4) {
        addToast({
          title: 'Comparison Limit Reached',
          message: 'Comparison supports up to 4 candidates simultaneously.',
          type: 'warning',
          duration: 3500,
        });
        return;
      }
      updated = [...compareList, candidate.id];
      addToast({
        title: 'Added to Comparison',
        message: `${candidate.name} is ready for side-by-side comparison.`,
        type: 'success',
        duration: 2500,
      });
    }

    try {
      localStorage.setItem(STORAGE_KEY_TALENT_COMPARE, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to persist comparison list:', err);
    }
    setCompareList(updated);
  };

  return (
    <OrganizationLayout activeRoute="/organization/talent">
      <div className="space-y-6 pb-12">
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/organization/talent')}
            className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Talent Discovery</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-500 font-medium">Evaluating Against:</span>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="text-xs font-semibold text-charcoal-800 bg-surface border border-surface-border rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {talentRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Candidate Header Profile Card */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-subtle">
              {candidate.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-heading font-bold text-charcoal-900 tracking-tight">
                  {candidate.name}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 border border-brand-200">
                  {candidate.workMode}
                </span>
              </div>
              <p className="text-body-sm text-charcoal-600">
                {candidate.headline}
              </p>
              <div className="flex items-center gap-3 text-xs text-charcoal-500 flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
                  {candidate.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-charcoal-400" />
                  {candidate.experienceYears} Years Professional Experience
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-charcoal-800">
                  <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                  Availability: {candidate.availability}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <ShortlistButton
              candidateId={candidate.id}
              candidateName={candidate.name}
              shortlist={shortlist}
              onToggleShortlist={setShortlist}
            />

            <button
              type="button"
              onClick={handleToggleCompare}
              className={`
                px-3.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer
                ${
                  isCompared
                    ? 'bg-brand-50 text-brand-800 border-brand-300 hover:bg-brand-100 font-bold'
                    : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:text-charcoal-900'
                }
              `}
            >
              <GitCompare className="w-3.5 h-3.5 text-brand-600" />
              <span>{isCompared ? 'In Comparison' : 'Compare Candidate'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Detail Layout: Left (Profile & Experience), Right (Role Match Diagnostics) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Profile Info (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Professional Summary */}
            <div className="bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-2.5">
              <h3 className="text-body-sm font-bold text-charcoal-900 uppercase tracking-wider text-[11px]">
                Professional Summary
              </h3>
              <p className="text-body-sm text-charcoal-700 leading-relaxed">
                {candidate.bio}
              </p>
            </div>

            {/* Complete Technical Skill Proficiency */}
            <div className="bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-body-sm font-bold text-charcoal-900 uppercase tracking-wider text-[11px]">
                  Technical Skill Inventory
                </h3>
                <span className="text-[11px] text-charcoal-500 font-medium">
                  {Object.keys(candidate.skills || {}).length} Competencies
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(candidate.skills || {}).map(([skill, score]) => (
                  <div
                    key={skill}
                    className="p-3 rounded-xl bg-canvas-subtle/70 border border-surface-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-charcoal-900">{skill}</span>
                      <span className="font-mono text-charcoal-700 font-semibold">{score}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          score >= 8 ? 'bg-emerald-500' : score >= 6 ? 'bg-brand-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${score * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work History */}
            {candidate.experience?.length > 0 && (
              <div className="bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-4">
                <h3 className="text-body-sm font-bold text-charcoal-900 uppercase tracking-wider text-[11px]">
                  Professional Experience
                </h3>
                <div className="space-y-4">
                  {candidate.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-canvas-subtle/50 border border-surface-border space-y-1.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-body-sm font-bold text-charcoal-900">
                            {exp.role}
                          </h4>
                          <span className="text-xs text-charcoal-600 font-medium">
                            {exp.company}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-charcoal-500 font-medium">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-600 leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Projects */}
            {candidate.projects?.length > 0 && (
              <div className="bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-4">
                <h3 className="text-body-sm font-bold text-charcoal-900 uppercase tracking-wider text-[11px]">
                  Featured Projects & Evidence
                </h3>
                <div className="space-y-3">
                  {candidate.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-surface-border bg-canvas-subtle/50 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-brand-600" />
                        <h4 className="text-body-sm font-bold text-charcoal-900">
                          {proj.title}
                        </h4>
                      </div>
                      <p className="text-xs text-charcoal-600 leading-relaxed">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.tech?.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-xs bg-canvas text-charcoal-700 border border-surface-border"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-2xl border border-surface-border shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-charcoal-900 font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  <span>Education</span>
                </div>
                <p className="text-xs text-charcoal-700 font-medium">
                  {candidate.education}
                </p>
              </div>

              <div className="bg-surface p-4 rounded-2xl border border-surface-border shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-charcoal-900 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-accent-600" />
                  <span>Certifications</span>
                </div>
                <ul className="text-xs text-charcoal-700 space-y-1 list-disc list-inside">
                  {candidate.certifications?.map((c, i) => (
                    <li key={i} className="line-clamp-1">{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Role Compatibility Diagnostics (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Compatibility Breakdown Card */}
            <TalentMatchBreakdown
              breakdown={compatibility}
              onOpenExplanation={() => setExplanationOpen(true)}
            />

            {/* Matching & Development Areas Summary */}
            <div className="bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-4">
              <h4 className="text-body-sm font-bold text-charcoal-900 uppercase tracking-wider text-[11px]">
                Target Role Diagnostics: {activeRole.title}
              </h4>

              {/* Strong Matches */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Strong Competency Matches ({strongMatches.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {strongMatches.map((m) => (
                    <span
                      key={m.name}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      {m.name} ({m.proficiency})
                    </span>
                  ))}
                </div>
              </div>

              {/* Development Areas */}
              {developmentAreas.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-surface-border/60">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Candidate Development Areas ({developmentAreas.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {developmentAreas.map((da) => (
                      <span
                        key={da.name}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-canvas-subtle text-charcoal-700 border border-surface-border"
                      >
                        {da.name} ({da.proficiency})
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-charcoal-500 leading-relaxed pt-1">
                    Development areas indicate skills where internal cohort training or mentoring can bridge remaining gap points.
                  </p>
                </div>
              )}
            </div>

            {/* Detailed Requirement Matrix */}
            <CandidateSkillMatrix candidate={candidate} role={activeRole} />
          </div>
        </div>
      </div>

      {/* Calculation Explanation Modal */}
      <TalentMatchExplanation
        isOpen={explanationOpen}
        onClose={() => setExplanationOpen(false)}
        candidateName={candidate.name}
        roleTitle={activeRole.title}
      />
    </OrganizationLayout>
  );
};

export default CandidateDetailPage;
