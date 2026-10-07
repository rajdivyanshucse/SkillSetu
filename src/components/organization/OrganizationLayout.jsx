import React, { useState } from 'react';
import {
  Building2,
  LayoutDashboard,
  Users,
  Layers,
  Compass,
  GitBranch,
  ShieldCheck,
  Briefcase,
  CalendarCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOrganizationOnboarding } from '../organization-onboarding/OrganizationOnboardingContext';
import { useToast } from '../ui/Toast';

export const OrganizationLayout = ({
  activeRoute = '/organization/dashboard',
  children,
}) => {
  const { navigate } = useRouter();
  const { data, completeness } = useOrganizationOnboarding();
  const { addToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      route: '/organization/dashboard',
      badge: 'Active',
    },
    {
      id: 'executive-radar',
      label: 'Executive Radar',
      icon: <TrendingUp className="w-4 h-4" />,
      route: '/intelligence',
      badge: 'Synthesis',
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: <Sparkles className="w-4 h-4" />,
      route: '/organization/recommendations',
      badge: 'Multi-Signal',
    },
    {
      id: 'workforce',
      label: 'Workforce',
      icon: <Users className="w-4 h-4" />,
      route: '/organization/workforce',
      badge: 'Active',
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Layers className="w-4 h-4" />,
      route: '/organization/workforce',
    },
    {
      id: 'skill-gaps',
      label: 'Skill Gaps',
      icon: <GitBranch className="w-4 h-4" />,
      route: '/organization/skill-gaps',
      badge: 'Preview',
      isFuture: true,
    },
    {
      id: 'future-skills',
      label: 'Future Skills',
      icon: <Compass className="w-4 h-4" />,
      route: '/organization/future-skills',
      badge: 'Preview',
      isFuture: true,
    },
    {
      id: 'talent',
      label: 'Talent Discovery',
      icon: <Briefcase className="w-4 h-4" />,
      route: '/organization/talent',
      badge: 'Active',
    },
    {
      id: 'planning',
      label: 'Planning',
      icon: <CalendarCheck className="w-4 h-4" />,
      route: '/organization/planning',
      badge: 'Active',
    },
    {
      id: 'compensation',
      label: 'Compensation',
      icon: <TrendingUp className="w-4 h-4" />,
      route: '/organization/compensation',
      badge: 'Active',
    },
    {
      id: 'growth',
      label: 'Growth',
      icon: <TrendingUp className="w-4 h-4" />,
      route: '/organization/growth',
      badge: 'Active',
    },
    {
      id: 'learning',
      label: 'Learning',
      icon: <BookOpen className="w-4 h-4" />,
      route: '/organization/learning',
      badge: 'Active',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <Building2 className="w-4 h-4" />,
      route: '/organization/profile',
      badge: `${completeness}%`,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      route: '/organization/settings',
      badge: 'Active',
    },
  ];

  return (
    <div className="min-h-screen bg-canvas flex text-charcoal-900 font-sans">
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col justify-between bg-surface border-r border-surface-border
          transition-all duration-200 h-screen sticky top-0 select-none z-20 shrink-0
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div>
          {/* Header */}
          <div className="h-16 px-4 border-b border-surface-border flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/organization/dashboard')}
              className="flex items-center gap-2.5 overflow-hidden text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-subtle group-hover:bg-brand-700 transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-body-sm font-bold text-charcoal-900 tracking-tight leading-none truncate">
                    SkillSetu
                  </span>
                  <span className="text-[10px] font-semibold text-brand-600 mt-1 uppercase tracking-wider truncate">
                    Workforce Intelligence
                  </span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-sm text-charcoal-400 hover:text-charcoal-800 hover:bg-canvas-subtle transition-colors cursor-pointer"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Org context pill */}
          {!collapsed && (
            <div className="p-3 mx-2.5 my-2.5 rounded-md bg-canvas-subtle/70 border border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-xs bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-charcoal-900 truncate leading-none">
                    {data.company?.name || 'TechNova Solutions'}
                  </span>
                  <span className="text-[10px] text-charcoal-500 mt-0.5 truncate">
                    {data.company?.type || 'Enterprise'} • {data.company?.size || '201–500'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav aria-label="Organization Navigation" className="p-2 space-y-1">
            {navItems.map((item) => {
              const isActive = item.route && (
                activeRoute === item.route ||
                (item.route !== '/organization/dashboard' && activeRoute.startsWith(`${item.route}/`))
              );
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.route) {
                      navigate(item.route);
                    }
                  }}
                  className={`
                    w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-body-sm
                    font-medium transition-colors cursor-pointer text-left
                    ${
                      isActive
                        ? 'bg-brand-50 text-brand-800 font-semibold border border-brand-200/60 shadow-xs'
                        : 'text-charcoal-700 hover:bg-canvas-subtle hover:text-charcoal-900 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`${isActive ? 'text-brand-600' : 'text-charcoal-500'} shrink-0`}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span
                      className={`
                        text-[10px] px-1.5 py-0.2 rounded-xs font-semibold
                        ${
                          isActive
                            ? 'bg-brand-200/80 text-brand-900'
                            : item.isFuture
                            ? 'bg-canvas-muted text-charcoal-500 border border-surface-border'
                            : 'bg-brand-100 text-brand-800'
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-surface-border bg-canvas-subtle/30">
          {!collapsed && (
            <button
              type="button"
              onClick={() => navigate('/organization/onboarding/review')}
              className="w-full text-left p-2 rounded-md hover:bg-canvas-subtle text-xs text-charcoal-600 font-medium cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span>Profile Calibration</span>
                <span className="font-mono font-bold text-brand-700">{completeness}%</span>
              </div>
              <div className="w-full h-1 bg-canvas-muted rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-16 bg-surface border-b border-surface-border px-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-md text-charcoal-600 hover:bg-canvas-subtle cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-body-sm font-bold text-charcoal-900 truncate">
                {data.company?.name || 'SkillSetu Enterprise'}
              </span>
            </div>
          </div>

          <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200">
            {completeness}%
          </span>
        </header>

        {/* Mobile Slide-out Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-surface border-b border-surface-border p-4 space-y-2 z-20">
            {navItems.map((item) => {
              const isActive = item.route && (
                activeRoute === item.route ||
                (item.route !== '/organization/dashboard' && activeRoute.startsWith(`${item.route}/`))
              );
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    if (item.route) navigate(item.route);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-md text-xs font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-charcoal-800 hover:bg-canvas-subtle'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-brand-50 text-brand-800 font-semibold border border-brand-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OrganizationLayout;
