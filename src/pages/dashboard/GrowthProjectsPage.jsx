import React, { useState, useEffect } from 'react';
import { Link } from '../../router/Router';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import ProjectPortfolio from '../../components/growth/ProjectPortfolio';
import ProjectDetailDrawer from '../../components/growth/ProjectDetailDrawer';
import GrowthDisclaimer from '../../components/growth/GrowthDisclaimer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { FolderGit2, ArrowLeft, Plus } from 'lucide-react';
import { loadProjects, saveProjects, calculateProjectEvidence, loadGrowthData, saveGrowthData } from '../../utils/growthIntelligence';

export default function GrowthProjectsPage() {
  const [projects, setProjects] = useState(() => loadProjects());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const handleOpenAdd = () => {
    setActiveProject(null);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleSelectProject = (project) => {
    setActiveProject(project);
    setIsEditMode(false);
    setIsDrawerOpen(true);
  };

  const handleSaveProject = (projectData) => {
    let updatedProjects;
    const isExisting = projects.some((p) => p.id === projectData.id);

    if (isExisting) {
      updatedProjects = projects.map((p) => (p.id === projectData.id ? projectData : p));
    } else {
      updatedProjects = [projectData, ...projects];
    }

    saveProjects(updatedProjects);
    setProjects(updatedProjects);
    setIsDrawerOpen(false);

    // Record activity in growth log
    const growthData = loadGrowthData();
    const updatedActivities = [
      {
        id: `act_${Date.now()}`,
        activity: isExisting ? `Updated project details: ${projectData.name}` : `Added new project: ${projectData.name}`,
        date: 'Just now',
        relatedSkill: projectData.skills?.[0] || 'Technical Portfolio',
        impact: `Evidence recorded (${projectData.status})`,
        type: isExisting ? 'project_added' : 'project_completed'
      },
      ...(growthData.activities || [])
    ];
    saveGrowthData({ ...growthData, activities: updatedActivities });
  };

  const handleDeleteProject = (projectId) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    saveProjects(updatedProjects);
    setProjects(updatedProjects);
    setIsDrawerOpen(false);
  };

  const projectStats = calculateProjectEvidence(projects);

  return (
    <DashboardLayout activeRoute="/dashboard/growth">
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-charcoal-light/10 pb-5">
          <div>
            <Link
              to="/dashboard/growth"
              className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-warm-brown transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Professional Growth Overview
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-warm-charcoal tracking-tight">
                Project & Experience Portfolio
              </h1>
              <Badge variant="primary" size="sm">
                {projects.length} Initiatives
              </Badge>
            </div>
            <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
              Tangible engineering projects, architectural case studies, and initiatives demonstrating practical skill mastery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-warm-sand/40 border border-charcoal-light/10 rounded-lg px-3.5 py-2 text-right">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
                Completed Evidence
              </span>
              <span className="text-lg font-bold text-sage-dark">
                {projectStats.completedProjects} / {projects.length}
              </span>
            </div>
            <Button variant="primary" size="sm" onClick={handleOpenAdd} className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Portfolio Grid */}
        <ProjectPortfolio
          projects={projects}
          onSelectProject={handleSelectProject}
          onAddProject={handleOpenAdd}
        />

        {/* Project Detail / Edit Drawer */}
        <ProjectDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          project={activeProject}
          isEditing={isEditMode}
          onSave={handleSaveProject}
          onDelete={handleDeleteProject}
        />

        <GrowthDisclaimer />
      </div>
    </DashboardLayout>
  );
}
