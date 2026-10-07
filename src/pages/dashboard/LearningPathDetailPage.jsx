import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Briefcase,
  TrendingUp,
  Flame,
  Info,
  ChevronRight,
  Code,
  ShieldCheck,
  Compass,
  Play
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LearningModuleList from '../../components/learning/LearningModuleList';
import LearningDisclaimer from '../../components/learning/LearningDisclaimer';
import LearningMethodology from '../../components/learning/LearningMethodology';
import { initialLearningPaths, initialLearningProjects, initialValidationActivities } from '../../data/learningData';
import { getStoredLearningState, calculatePathProgress } from '../../utils/learningIntelligence';

const LearningPathDetailPage = () => {
  const { currentPath, navigate } = useRouter();
  // Extract pathId from URL /dashboard/learning/path/:pathId
  const pathId = currentPath.split('/dashboard/learning/path/')[1]?.split('/')[0]?.split('?')[0] || 'path-backend-foundations';

  const [path, setPath] = useState(null);
  const [learningState, setLearningState] = useState(getStoredLearningState());
  const [activeTab, setActiveTab] = useState('curriculum'); // curriculum | projects | validation | context

  useEffect(() => {
    const found = initialLearningPaths.find(p => p.id === pathId) || initialLearningPaths[0];
    setPath(found);
  }, [pathId]);

  const handleStateChange = (newState) => {
    setLearningState(newState);
  };

  if (!path) {
    return (
      <DashboardLayout activeRoute="/dashboard/learning">
        <div className="p-8 text-center text-stone-500">Loading learning path details...</div>
      </DashboardLayout>
    );
  }

  const pathProgress = calculatePathProgress(path, learningState);
  const relatedProjects = initialLearningProjects.filter(prj => path.projects?.includes(prj.id) || prj.skills.some(s => path.skills.includes(s)));
  const relatedValidations = initialValidationActivities.filter(val => path.validationActivities?.includes(val.id) || path.skills.includes(val.skill));

  const stages = [
    { key: 'LEARN', label: '1. Foundation', icon: BookOpen, desc: 'Conceptual mastery & theory' },
    { key: 'PRACTICE', label: '2. Practice', icon: Code, desc: 'Interactive coding & labs' },
    { key: 'BUILD', label: '3. Build', icon: Layers, desc: 'Full-scope portfolio projects' },
    { key: 'VALIDATE', label: '4. Validate', icon: ShieldCheck, desc: 'Skills & architecture assessments' }
  ];

  return (
    <DashboardLayout activeRoute="/dashboard/learning">
      <div className="space-y-8 pb-16">
        {/* Navigation Breadcrumb / Back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard/learning')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Learning Intelligence
          </button>
          <Badge variant="outline" className="text-stone-600 border-stone-300">
            {path.difficulty} Level
          </Badge>
        </div>

        {/* Path Hero Header */}
        <div className="rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Compass className="w-3.5 h-3.5" />
                Structured Learning Path
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700">
                <Clock className="w-3.5 h-3.5" />
                {path.estimatedDuration}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-800 text-stone-300 border border-stone-700">
                <Layers className="w-3.5 h-3.5" />
                {path.modules.length} Core Modules
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
              {path.title}
            </h1>

            <p className="text-sm md:text-base text-stone-300 leading-relaxed max-w-3xl">
              {path.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-stone-400 font-medium">Target Roles:</span>
              {path.targetRoles.map(role => (
                <span key={role} className="text-xs px-2.5 py-1 rounded-md bg-stone-800/80 text-amber-200 border border-stone-700">
                  {role}
                </span>
              ))}
            </div>

            {/* Overall Progress Bar */}
            <div className="pt-4 border-t border-stone-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-xs text-stone-300 mb-1.5">
                  <span className="font-medium">Path Completion Progress</span>
                  <span className="font-bold text-amber-400">{pathProgress}%</span>
                </div>
                <div className="w-full bg-stone-700/80 h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pathProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  className="bg-amber-600 hover:bg-amber-500 text-white border-none text-xs font-semibold shadow-md"
                  onClick={() => {
                    const firstIncomplete = path.modules.find(m => learningState.moduleProgress[m.id]?.status !== 'Completed');
                    if (firstIncomplete) {
                      setActiveTab('curriculum');
                    }
                  }}
                >
                  <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  {pathProgress > 0 ? 'Continue Path' : 'Start Path'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stage Learning Pipeline Architecture */}
        <Card className="p-6 bg-white border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 font-serif">
                4-Stage Developmental Pipeline
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Progression follows SkillSetu's unified standard: Learn foundational concepts, practice via exercises, build production artifacts, and validate through assessment.
              </p>
            </div>
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-200">
              Aligned with Career Roadmap
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {stages.map((stg, idx) => {
              const Icon = stg.icon;
              return (
                <div
                  key={stg.key}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 relative flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-800 flex items-center justify-center font-bold text-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                      Phase 0{idx + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{stg.label}</h4>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">{stg.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 overflow-x-auto gap-4">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'curriculum'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum & Modules ({path.modules.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Linked Projects ({relatedProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'validation'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Validation Activities ({relatedValidations.length})
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={`pb-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
              activeTab === 'context'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Career & Opportunity Context
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <LearningModuleList
              modules={path.modules}
              pathId={path.id}
              onProgressUpdate={handleStateChange}
            />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900">Project Milestones</h3>
                <p className="text-xs text-stone-500">Apply curriculum knowledge to build verifiable proof of capability.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => navigate('/dashboard/growth/projects')}
              >
                Track in Professional Growth
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedProjects.map(proj => (
                <Card key={proj.id} className="p-5 border-stone-200 hover:border-amber-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs bg-stone-50 text-stone-700">
                        {proj.difficulty}
                      </Badge>
                      <span className="text-xs text-stone-500 font-mono">~{proj.estimatedHours} hrs</span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900">{proj.title}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{proj.description}</p>

                    <div className="mt-3 p-2.5 rounded-lg bg-stone-50 border border-stone-200/70 text-xs text-stone-600">
                      <span className="font-semibold text-stone-800">Validation: </span>
                      {proj.validationCriteria}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.skills.map(s => (
                        <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      Deliverables: {proj.deliverables.length} artifacts
                    </span>
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs bg-amber-700 hover:bg-amber-800 text-white"
                      onClick={() => navigate('/dashboard/learning/projects')}
                    >
                      View Full Specs
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">Skill Validation Activities</h3>
              <p className="text-xs text-stone-500">Structured checkpoints to self-evaluate readiness before roadmap transitions.</p>
            </div>

            <div className="space-y-3">
              {relatedValidations.map(val => (
                <div key={val.id} className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[11px] bg-stone-100 text-stone-700">
                        {val.type}
                      </Badge>
                      <span className="text-xs font-bold text-amber-800">{val.skill}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-stone-900">{val.title}</h4>
                    <p className="text-xs text-stone-500">{val.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-500 font-mono">Passing: {val.passingScore}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => navigate('/dashboard/growth')}
                    >
                      Verify in Growth
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'context' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Career Roadmap Link */}
            <Card className="p-5 border-stone-200 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Career Roadmap Connection</h4>
                  <p className="text-xs text-stone-500">Roadmap Alignment</p>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                This learning path directly supports progression into target stages of your configured career roadmap:
              </p>
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium">
                {path.roadmapConnection?.stageTitle || 'Stage 02 — Core Technical Competency'}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate('/dashboard/career-roadmap')}
              >
                View in Career Roadmap
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Card>

            {/* Opportunity Context Link */}
            <Card className="p-5 border-stone-200 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-xs">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Prototype Opportunity Signals</h4>
                  <p className="text-xs text-stone-500">Market Alignment</p>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Skills in this path ({path.skills.slice(0, 3).join(', ')}) appear in active prototype opportunity listings with the following market salary distribution:
              </p>
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700">
                <span className="font-semibold text-stone-900">Observed Range: </span>
                ₹10–22 LPA in prototype postings.
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate('/dashboard/jobs')}
              >
                Explore Relevant Opportunities
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Card>
          </div>
        )}

        {/* Methodology & Disclaimer */}
        <div className="space-y-6 pt-4">
          <LearningMethodology />
          <LearningDisclaimer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LearningPathDetailPage;
