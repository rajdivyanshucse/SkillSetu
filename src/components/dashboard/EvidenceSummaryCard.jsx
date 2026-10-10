import React from 'react';
import { FolderGit2, Briefcase, BookOpen, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Button from '../ui/Button';

/**
 * EvidenceSummaryCard Component
 * Displays honest breakdown of attached portfolio artifacts, projects, and learning history.
 */
export const EvidenceSummaryCard = ({
  projects = [],
  counts = { demonstrated: 6, selfReported: 2, evidenceNeeded: 2 },
  className = '',
}) => {
  const { navigate } = useRouter();

  return (
    <div className={`bg-surface border border-surface-border rounded-xl p-5 shadow-xs space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-charcoal-900">Evidence Composition</h3>
            <p className="text-xs text-charcoal-500">
              Verifiable implementation artifacts grounding your capability profile
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/growth')}
          className="text-xs font-semibold"
        >
          View Portfolio
        </Button>
      </div>

      {/* Honest Composition Metrics */}
      <div className="grid grid-cols-3 gap-3 text-center bg-canvas-subtle/70 rounded-xl p-3 border border-surface-border/70">
        <div>
          <span className="text-xl font-bold text-emerald-700 block">{counts.demonstrated}</span>
          <span className="text-[11px] text-charcoal-500 font-medium">With Project Proof</span>
        </div>
        <div>
          <span className="text-xl font-bold text-slate-700 block">{counts.selfReported}</span>
          <span className="text-[11px] text-charcoal-500 font-medium">Self-Reported</span>
        </div>
        <div>
          <span className="text-xl font-bold text-rose-700 block">{counts.evidenceNeeded}</span>
          <span className="text-[11px] text-charcoal-500 font-medium">Evidence Gaps</span>
        </div>
      </div>

      {/* Recent Project Evidence Artifacts */}
      <div>
        <span className="text-xs font-semibold text-charcoal-600 uppercase tracking-wider block mb-2">
          Attached Project Artifacts
        </span>
        <div className="space-y-2">
          {projects.slice(0, 3).map((proj) => (
            <div
              key={proj.id}
              className="p-3 bg-surface rounded-lg border border-surface-border hover:border-surface-border-strong transition-all flex items-start justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="font-semibold text-xs text-charcoal-900 line-clamp-1">{proj.name}</span>
                </div>
                <p className="text-[11px] text-charcoal-500 line-clamp-1">{proj.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.skills?.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-1.5 py-0.2 bg-canvas text-charcoal-600 text-[10px] rounded border border-surface-border"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {proj.evidenceUrl && (
                <a
                  href={proj.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-charcoal-400 hover:text-brand-700 p-1 shrink-0"
                  title="View Artifact"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvidenceSummaryCard;
