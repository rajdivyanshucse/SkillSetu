import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Compass,
  Layers,
  Sparkles,
  GitBranch,
  Briefcase,
  Bookmark,
  Send,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import Tooltip from '../ui/Tooltip';
import { useToast } from '../ui/Toast';

export const DashboardSidebar = ({
  collapsed = false,
  onToggleCollapse,
  activeRoute = '/dashboard',
  userProfile = {},
  className = '',
}) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          route: '/dashboard',
          badge: null,
        },
        {
          id: 'executive-intelligence',
          label: 'Executive Radar',
          icon: <TrendingUp className="w-4 h-4" />,
          route: '/intelligence',
          badge: 'Synthesis',
        },
        {
          id: 'recommendations',
          label: 'Recommendations',
          icon: <Sparkles className="w-4 h-4" />,
          route: '/dashboard/recommendations',
          badge: 'Explainable',
        },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: 'skill-intelligence',
          label: 'Skill Intelligence',
          icon: <Layers className="w-4 h-4" />,
          route: '/dashboard/skill-intelligence',
          badge: 'Preview',
        },
        {
          id: 'career-intelligence',
          label: 'Career Intelligence',
          icon: <Compass className="w-4 h-4" />,
          route: '/dashboard/career-intelligence',
          badge: 'Preview',
        },
        {
          id: 'skill-gaps',
          label: 'Skill Gaps',
          icon: <GitBranch className="w-4 h-4" />,
          route: '/dashboard/skill-gaps',
          badge: 'Calibrated',
        },
        {
          id: 'career-roadmap',
          label: 'Career Roadmap',
          icon: <Sparkles className="w-4 h-4" />,
          route: '/dashboard/career-roadmap',
          badge: 'Active',
        },
        {
          id: 'growth',
          label: 'Growth',
          icon: <TrendingUp className="w-4 h-4" />,
          route: '/dashboard/growth',
          badge: 'Active',
        },
        {
          id: 'learning',
          label: 'Learning',
          icon: <BookOpen className="w-4 h-4" />,
          route: '/dashboard/learning',
          badge: 'Active',
        },
      ],
    },
    {
      title: 'OPPORTUNITIES',
      items: [
        {
          id: 'jobs',
          label: 'Jobs & Opportunities',
          icon: <Briefcase className="w-4 h-4" />,
          route: '/dashboard/jobs',
          badge: '12 Matches',
        },
        {
          id: 'compensation',
          label: 'Compensation',
          icon: <TrendingUp className="w-4 h-4" />,
          route: '/dashboard/compensation',
          badge: 'Active',
        },
        {
          id: 'saved',
          label: 'Saved',
          icon: <Bookmark className="w-4 h-4" />,
          route: '/dashboard/saved',
          badge: null,
        },
        {
          id: 'applications',
          label: 'Applications',
          icon: <Send className="w-4 h-4" />,
          route: '/dashboard/applications',
          badge: null,
        },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        {
          id: 'profile',
          label: 'Profile Calibration',
          icon: <User className="w-4 h-4" />,
          route: '/onboarding/review',
          badge: `${userProfile.completeness || 92}%`,
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings className="w-4 h-4" />,
          route: '/dashboard/settings',
          badge: 'Active',
        },
      ],
    },
  ];

  return (
    <aside
      className={`
        relative bg-surface border-r border-surface-border flex flex-col justify-between
        transition-all duration-200 h-full select-none shrink-0 z-20
        ${collapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
    >
      {/* Top Header & Branding */}
      <div>
        <div className="h-16 px-4 border-b border-surface-border flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 overflow-hidden text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-md bg-brand-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-subtle group-hover:bg-brand-600 transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-body-sm font-bold text-charcoal-900 tracking-tight leading-none truncate">
                  SkillSetu
                </span>
                <span className="text-[10px] font-semibold text-brand-600 mt-1 uppercase tracking-wider truncate">
                  Career Intelligence
                </span>
              </div>
            )}
          </button>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 rounded-sm text-charcoal-400 hover:text-charcoal-800 hover:bg-canvas-subtle transition-colors cursor-pointer"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Workspace role context indicator */}
        {!collapsed && (
          <div className="p-3 mx-2 my-2.5 rounded-md bg-canvas-subtle/70 border border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-xs bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-charcoal-900 truncate leading-none">
                  {userProfile.targetRole || 'Backend Engineer'}
                </span>
                <span className="text-[10px] text-charcoal-500 mt-0.5 truncate">
                  Individual Workspace
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-190px)]">
          {navSections.map((group) => (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                  {group.title}
                </div>
              )}

              {group.items.map((item) => {
                const isActive = item.route && (
                  activeRoute === item.route ||
                  (item.route !== '/dashboard' && activeRoute.startsWith(`${item.route}/`))
                );

                const navItemContent = (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.route) {
                        navigate(item.route);
                      } else if (item.action) {
                        item.action();
                      }
                    }}
                    className={`
                      w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-body-sm
                      font-medium transition-colors duration-150 cursor-pointer text-left
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

                return collapsed ? (
                  <Tooltip key={item.id} content={item.label} position="right">
                    {navItemContent}
                  </Tooltip>
                ) : (
                  navItemContent
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile Pill */}
      <div className="p-3 border-t border-surface-border bg-canvas-subtle/30">
        {!collapsed ? (
          <button
            type="button"
            onClick={() => navigate('/onboarding/review')}
            className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-canvas-subtle border border-transparent hover:border-surface-border transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 text-brand-800 flex items-center justify-center font-bold text-xs shrink-0">
                {userProfile.avatarInitials || 'RS'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-body-sm font-semibold text-charcoal-900 truncate leading-none">
                  {userProfile.fullName || 'Rahul Sharma'}
                </span>
                <span className="text-[11px] text-charcoal-500 mt-1 truncate">
                  {userProfile.currentRole || 'Student'}
                </span>
              </div>
            </div>
          </button>
        ) : (
          <div className="flex justify-center">
            <Tooltip content={`${userProfile.fullName || 'User'} (${userProfile.currentRole || 'Student'})`} position="right">
              <button
                type="button"
                onClick={() => navigate('/onboarding/review')}
                className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 text-brand-800 flex items-center justify-center font-bold text-xs cursor-pointer hover:ring-2 hover:ring-brand-400 transition-all"
              >
                {userProfile.avatarInitials || 'RS'}
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
