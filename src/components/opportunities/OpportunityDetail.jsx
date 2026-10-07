import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Bookmark,
  Send,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { SaveOpportunityButton } from './SaveOpportunityButton';
import { OpportunityMatchBreakdown } from './OpportunityMatchBreakdown';
import { RelatedOpportunityCard } from './RelatedOpportunityCard';
import {
  opportunitiesData,
  getStoredSavedOpportunities,
  saveStoredSavedOpportunities,
  getStoredApplicationStatuses,
  saveStoredApplicationStatuses,
} from '../../data/opportunityData';

export const OpportunityDetail = ({ opportunityId }) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [savedIds, setSavedIds] = useState(() => getStoredSavedOpportunities());
  const [appStatuses, setAppStatuses] = useState(() => getStoredApplicationStatuses());
  const [showTrackModal, setShowTrackModal] = useState(false);

  const matchedJob =
    opportunitiesData.find((j) => j.id === opportunityId) || opportunitiesData[0];

  const isSaved = savedIds.includes(matchedJob.id);
  const applicationData = appStatuses[matchedJob.id];
  const isTracked = Boolean(applicationData);

  const handleToggleSave = (nextSavedState, updatedList) => {
    setSavedIds(updatedList);
  };

  const handleTrackApplication = (status = 'Applied') => {
    const updated = {
      ...appStatuses,
      [matchedJob.id]: {
        status,
        appliedDate: new Date().toISOString().split('T')[0],
        notes: 'Tracked from opportunity detail view.',
        nextAction:
          status === 'Applied'
            ? 'Await talent partner screening review'
            : status === 'Interview'
            ? 'Prepare for technical discussion'
            : 'Track milestone progress',
      },
    };

    setAppStatuses(updated);
    saveStoredApplicationStatuses(updated);
    setShowTrackModal(false);

    addToast({
      title: 'Application Tracked',
      message: `"${matchedJob.title}" added to your application pipeline (${status}).`,
      type: 'success',
      duration: 3500,
    });
  };

  const relatedOpportunities = opportunitiesData
    .filter((j) => j.id !== matchedJob.id && j.category === matchedJob.category)
    .slice(0, 3);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/dashboard/jobs')}
          className="text-xs font-semibold text-charcoal-700"
        >
          Back to All Opportunities
        </Button>

        <div className="flex items-center gap-2">
          <SaveOpportunityButton
            jobId={matchedJob.id}
            isSaved={isSaved}
            onToggle={handleToggleSave}
            showLabel={true}
          />

          <Button
            variant={isTracked ? 'secondary' : 'primary'}
            size="sm"
            leftIcon={<Send className="w-4 h-4" />}
            onClick={() => {
              if (isTracked) {
                navigate('/dashboard/applications');
              } else {
                handleTrackApplication('Applied');
              }
            }}
          >
            {isTracked ? `Tracking: ${applicationData.status}` : 'Track Application'}
          </Button>
        </div>
      </div>

      {/* Main Top Header Banner */}
      <div className="bg-surface border border-brand-200 rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200">
              {matchedJob.company}
            </span>
            <span className="text-xs text-charcoal-400">•</span>
            <span className="text-xs font-semibold text-charcoal-600">
              {matchedJob.category} Engineering
            </span>
            {matchedJob.isFeatured && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                Recommended Match
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            {matchedJob.title}
          </h1>

          {/* Key metadata pills */}
          <div className="flex items-center flex-wrap gap-y-1.5 gap-x-2 text-xs text-charcoal-600 font-medium pt-1">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
              {matchedJob.location}
            </span>
            <span className="text-charcoal-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-charcoal-400" />
              {matchedJob.workMode}
            </span>
            <span className="text-charcoal-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-charcoal-400" />
              {matchedJob.experience}
            </span>
            <span className="text-charcoal-300">•</span>
            <span className="font-bold text-charcoal-900 bg-canvas-subtle px-2 py-0.5 rounded-xs border border-surface-border">
              {matchedJob.salary}
            </span>
          </div>
        </div>

        {/* Big Profile Fit Dial */}
        <div className="p-4 rounded-xl bg-canvas-subtle/90 border border-surface-border text-center shrink-0 min-w-40 shadow-2xs">
          <div className="text-3xl font-black text-brand-700">
            {matchedJob.compatibility}%
          </div>
          <div className="text-[10px] uppercase font-bold text-charcoal-500 mt-0.5">
            Profile Compatibility
          </div>
          <div className="w-24 h-1.5 bg-canvas-muted rounded-full overflow-hidden mx-auto mt-2">
            <div
              className="h-full bg-brand-500 rounded-full"
              style={{ width: `${matchedJob.compatibility}%` }}
            />
          </div>
          <span className="text-[10px] text-charcoal-400 block mt-1">
            Illustrative Alignment
          </span>
        </div>
      </div>

      {/* 2-Column Main Layout: Left = Details & Competencies, Right = Intelligence & Related */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Why this opportunity appears relevant card */}
          <Card className="p-5 space-y-3 bg-brand-50/40 border-brand-200/80">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-sm bg-brand-100 text-brand-800 border border-brand-300">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-body-sm font-bold text-brand-900">
                Why this opportunity appears relevant
              </h3>
            </div>

            <ul className="space-y-1.5 text-xs text-charcoal-700">
              {matchedJob.whyRelevant.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Matching Skills & Development Focus Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matching Skills */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-body-sm font-bold text-charcoal-900">
                    Matching Skills You Have
                  </h3>
                  <span className="text-[10px] text-charcoal-500">
                    Directly present in your profile
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {matchedJob.matchingSkills.map((sk) => (
                  <div
                    key={sk}
                    className="flex items-center justify-between p-2 rounded-md bg-canvas-subtle border border-surface-border text-xs"
                  >
                    <span className="font-bold text-charcoal-900">{sk}</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                      Profile Aligned
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Focus Development Areas */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-body-sm font-bold text-charcoal-900">
                    Focus Development Areas
                  </h3>
                  <span className="text-[10px] text-charcoal-500">
                    Skills to build for this role
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {matchedJob.developmentAreas.map((area) => {
                  const areaName = typeof area === 'string' ? area : area.name;
                  const skillId = typeof area === 'object' ? area.skillId : area.toLowerCase();
                  return (
                    <div
                      key={areaName}
                      className="p-2.5 rounded-md bg-canvas-subtle border border-surface-border text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-charcoal-900">{areaName}</span>
                        <span className="text-[10px] font-bold text-brand-800 bg-brand-50 px-1.5 py-0.5 rounded-xs border border-brand-200">
                          {area.currentLevel || 'Beginner'} → {area.targetLevel || 'Intermediate'}
                        </span>
                      </div>

                      {skillId && (
                        <Button
                          variant="outline"
                          size="xs"
                          rightIcon={<ArrowRight className="w-3 h-3" />}
                          onClick={() =>
                            navigate(`/dashboard/career-roadmap/skill/${skillId}`)
                          }
                          className="w-full text-[11px] justify-center"
                        >
                          View {areaName} Roadmap Plan
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Role Overview & Details */}
          <Card className="p-6 space-y-5">
            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-body-md font-bold text-charcoal-900">
                Role Overview
              </h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                {matchedJob.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2 pt-3 border-t border-surface-border">
              <h3 className="text-body-md font-bold text-charcoal-900">
                Key Responsibilities
              </h3>
              <ul className="space-y-1.5 text-xs text-charcoal-700 list-disc list-inside leading-relaxed">
                {matchedJob.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="space-y-2 pt-3 border-t border-surface-border">
              <h3 className="text-body-md font-bold text-charcoal-900">
                Candidate Requirements
              </h3>
              <ul className="space-y-1.5 text-xs text-charcoal-700 list-disc list-inside leading-relaxed">
                {matchedJob.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Preferred Skills */}
            {matchedJob.preferredSkills?.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-surface-border">
                <h3 className="text-body-md font-bold text-charcoal-900">
                  Preferred & Bonus Skills
                </h3>
                <div className="flex items-center flex-wrap gap-1.5">
                  {matchedJob.preferredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-xs font-semibold px-2.5 py-1 rounded-sm bg-canvas-subtle text-charcoal-700 border border-surface-border"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Compatibility Breakdown Card */}
          <OpportunityMatchBreakdown
            compatibility={matchedJob.compatibility}
            breakdown={matchedJob.compatibilityBreakdown}
          />

          {/* Compensation Intelligence Card */}
          <Card className="p-5 space-y-3 bg-surface border border-surface-border shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-charcoal-900">
                <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
                <span>Compensation Intelligence</span>
              </div>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-brand-50 text-brand-800 border border-brand-200/60">
                Prototype Signal
              </span>
            </div>

            <div className="p-2.5 rounded bg-canvas-subtle/70 border border-surface-border flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                  Advertised Listing
                </span>
                <span className="font-extrabold text-charcoal-900 text-sm">
                  {matchedJob.salary}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                  Observed Median
                </span>
                <span className="font-semibold text-charcoal-700">
                  ₹11.0 LPA
                </span>
              </div>
            </div>

            <p className="text-[11px] text-charcoal-500 leading-relaxed">
              Advertised opportunity range in prototype catalog. Observed median across similar role parameters.
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/compensation')}
              className="w-full text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              Explore Compensation Intelligence
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>

          {/* Quick Action Application Card */}
          <Card className="p-5 space-y-4 bg-canvas-subtle/80 border border-surface-border">
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Track in Your Workflow
            </h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Keep notes, record interview dates, and monitor your progress across opportunities.
            </p>

            <div className="space-y-2">
              <Button
                variant={isTracked ? 'secondary' : 'primary'}
                size="sm"
                leftIcon={<Send className="w-3.5 h-3.5" />}
                onClick={() => {
                  if (isTracked) {
                    navigate('/dashboard/applications');
                  } else {
                    handleTrackApplication('Applied');
                  }
                }}
                className="w-full justify-center"
              >
                {isTracked ? 'View in Application Tracker' : 'Mark as Applied'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard/career-roadmap')}
                className="w-full justify-center text-xs"
              >
                Open Full Career Roadmap
              </Button>
            </div>
          </Card>

          {/* Similar Opportunities */}
          {relatedOpportunities.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-body-sm font-bold text-charcoal-900">
                Similar {matchedJob.category} Opportunities
              </h3>
              <div className="space-y-2.5">
                {relatedOpportunities.map((relJob) => (
                  <RelatedOpportunityCard key={relJob.id} opportunity={relJob} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
