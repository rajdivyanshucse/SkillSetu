import React, { useState, useEffect } from 'react';
import { X, Briefcase, ExternalLink, Trash2, Check, Sparkles, Layers, Award } from 'lucide-react';
import Drawer from '../ui/Drawer';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';

export const ProjectDetailDrawer = ({
  isOpen = false,
  onClose,
  project = null,
  onSaveProject,
  onDeleteProject,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Backend Developer',
    description: '',
    skills: '',
    status: 'Completed',
    targetRole: 'Backend Software Engineer',
    evidenceType: 'GitHub Repository',
    evidenceUrl: '',
    metrics: '',
    learningOutcomes: '',
    challenges: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        role: project.role || 'Backend Developer',
        description: project.description || '',
        skills: Array.isArray(project.skills) ? project.skills.join(', ') : project.skills || '',
        status: project.status || 'Completed',
        targetRole: project.targetRole || 'Backend Software Engineer',
        evidenceType: project.evidenceType || 'GitHub Repository',
        evidenceUrl: project.evidenceUrl || '',
        metrics: project.metrics || '',
        learningOutcomes: project.learningOutcomes || '',
        challenges: project.challenges || '',
      });
    } else {
      setFormData({
        name: '',
        role: 'Backend Developer',
        description: '',
        skills: 'Java, Spring Boot, SQL, Docker',
        status: 'In Progress',
        targetRole: 'Backend Software Engineer',
        evidenceType: 'GitHub Repository',
        evidenceUrl: '',
        metrics: '',
        learningOutcomes: '',
        challenges: '',
      });
    }
  }, [project, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const formattedProject = {
      ...(project || {}),
      id: project?.id || `proj-${Date.now()}`,
      name: formData.name.trim(),
      role: formData.role.trim(),
      description: formData.description.trim(),
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      status: formData.status,
      targetRole: formData.targetRole,
      evidenceType: formData.evidenceType,
      evidenceUrl: formData.evidenceUrl.trim(),
      metrics: formData.metrics.trim(),
      learningOutcomes: formData.learningOutcomes.trim(),
      challenges: formData.challenges.trim(),
      completionDate: project?.completionDate || new Date().toISOString().split('T')[0],
    };

    if (onSaveProject) {
      onSaveProject(formattedProject);
    }
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="md"
      title={project ? 'Project & Evidence Details' : 'Add New Portfolio Project'}
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
        {/* Project Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider block">
            Project Title *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Distributed Telemetry & Worker Pipeline"
            className="w-full p-2 bg-canvas-subtle border border-surface-border rounded-md text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Role & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider block">
              Your Role in Project
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Lead Backend Engineer"
              className="w-full p-2 bg-canvas-subtle border border-surface-border rounded-md text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider block">
              Development Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 bg-canvas-subtle border border-surface-border rounded-md text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Planning">Planning</option>
            </select>
          </div>
        </div>

        {/* Demonstrated Skills */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider block">
            Skills Demonstrated (comma-separated)
          </label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="Java, Spring Boot, PostgreSQL, Docker, AWS"
            className="w-full p-2 bg-canvas-subtle border border-surface-border rounded-md text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider block">
            Project Overview & Architecture
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the problem, architectural choices, and tech stack utilized..."
            className="w-full p-2 bg-canvas-subtle border border-surface-border rounded-md text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Evidence Link & Type */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider block">
              Evidence Type
            </label>
            <select
              value={formData.evidenceType}
              onChange={(e) => setFormData({ ...formData, evidenceType: e.target.value })}
              className="w-full p-2 bg-canvas-subtle border border-surface-border rounded-md text-charcoal-900 focus:outline-none cursor-pointer"
            >
              <option value="GitHub Repository">GitHub Repository</option>
              <option value="Live Staging Demo">Live Staging Demo</option>
              <option value="Architecture Document">Architecture Document</option>
              <option value="Portfolio Case Study">Portfolio Case Study</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider block">
              Evidence Link (Optional)
            </label>
            <input
              type="text"
              value={formData.evidenceUrl}
              onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full p-2 bg-canvas-subtle border border-surface-border rounded-md text-charcoal-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Engineering Metrics / Results */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider block">
            Measured Engineering Results (Latency, Scale, Efficiency)
          </label>
          <input
            type="text"
            value={formData.metrics}
            onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
            placeholder="e.g. Handles 2,500 req/sec with <30ms p99 latency in load tests"
            className="w-full p-2 bg-canvas-subtle border border-surface-border rounded-md text-charcoal-900 focus:outline-none"
          />
        </div>

        {/* Learning Outcomes & Challenges */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-charcoal-600 uppercase tracking-wider block">
            Key Learning Outcomes
          </label>
          <input
            type="text"
            value={formData.learningOutcomes}
            onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
            placeholder="What capability did this project solidify?"
            className="w-full p-2 bg-canvas-subtle border border-surface-border rounded-md text-charcoal-900 focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-surface-border flex items-center justify-between gap-3">
          {project && onDeleteProject && (
            <button
              type="button"
              onClick={() => {
                onDeleteProject(project.id);
                onClose();
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Project
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              className="flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              {project ? 'Save Changes' : 'Add Project'}
            </Button>
          </div>
        </div>
      </form>
    </Drawer>
  );
};

export default ProjectDetailDrawer;
