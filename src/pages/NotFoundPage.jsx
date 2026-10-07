import React from 'react';
import { Compass, ArrowLeft, Home, Building2, LayoutDashboard } from 'lucide-react';
import { useRouter } from '../router/Router';
import Button from '../components/ui/Button';

export const NotFoundPage = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 font-sans text-charcoal-900">
      <div className="max-w-md w-full bg-surface border border-surface-border rounded-xl shadow-modal p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto shadow-subtle">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-600">
            Error 404 • Location Unmapped
          </span>
          <h1 className="text-page-title font-bold text-charcoal-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-body-sm text-charcoal-600 leading-relaxed">
            The telemetry intelligence path you requested does not exist or has been relocated within the SkillSetu architecture.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-canvas-subtle border border-surface-border text-left space-y-2">
          <span className="text-[11px] uppercase font-bold text-charcoal-400">
            Recommended Destinations
          </span>
          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-surface border border-transparent hover:border-surface-border text-xs font-medium text-charcoal-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-3.5 h-3.5 text-brand-600" />
                <span>Individual Intelligence Dashboard</span>
              </div>
              <ArrowLeft className="w-3 h-3 rotate-180 text-charcoal-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/organization/dashboard')}
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-surface border border-transparent hover:border-surface-border text-xs font-medium text-charcoal-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Enterprise Workforce Workspace</span>
              </div>
              <ArrowLeft className="w-3 h-3 rotate-180 text-charcoal-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Home className="w-3.5 h-3.5" />}
            onClick={() => navigate('/')}
          >
            Return Home
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.history.length > 1 ? window.history.back() : navigate('/dashboard')}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
