import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, ExternalLink, Edit3, Trash2, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { ProjectDetailDrawer } from './ProjectDetailDrawer';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';

export const ProjectPortfolio = ({
  projects = [],
  onSaveProject,
  onDeleteProject,
  className = '',
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenAdd = () => {
    setSelectedProject(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              Project Evidence & Implementation Portfolio
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Practical repositories, architecture case studies, and engineering deliverables.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj, idx) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            className="p-4 rounded-lg bg-canvas-subtle/40 border border-surface-border hover:border-brand-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                    {proj.role}
                  </span>
                  <h4 className="text-sm font-bold text-charcoal-900">
                    {proj.name}
                  </h4>
                </div>
                <Badge
                  variant={
                    proj.status === 'Completed'
                      ? 'success'
                      : proj.status === 'In Progress'
                      ? 'brand'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {proj.status}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs text-charcoal-700 leading-relaxed mb-2.5">
                {proj.description}
              </p>

              {/* Metrics if present */}
              {proj.metrics && (
                <div className="p-2 rounded bg-surface border border-surface-border/60 text-[11px] text-charcoal-800 font-semibold mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-brand-600 shrink-0" />
                  <span>{proj.metrics}</span>
                </div>
              )}

              {/* Skills Demonstrated */}
              <div className="flex flex-wrap gap-1 mb-2">
                {proj.skills?.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-1.5 py-0.5 rounded-xs bg-surface text-charcoal-700 text-[10px] font-medium border border-surface-border/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-xs text-charcoal-500">
              <span className="text-[11px]">
                {proj.completionDate ? `Completed: ${proj.completionDate}` : 'In Progress'}
              </span>

              <div className="flex items-center gap-2">
                {proj.evidenceUrl && (
                  <a
                    href={proj.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-0.5 text-[11px]"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Evidence
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(proj)}
                  className="text-charcoal-500 hover:text-charcoal-900 p-1 rounded hover:bg-canvas-muted cursor-pointer"
                  title="Edit project details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Drawer */}
      <ProjectDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        project={selectedProject}
        onSaveProject={onSaveProject}
        onDeleteProject={onDeleteProject}
      />
    </div>
  );
};

export default ProjectPortfolio;
