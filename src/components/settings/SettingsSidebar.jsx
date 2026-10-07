import React from 'react';
import {
  User,
  Shield,
  Compass,
  Bell,
  BookOpen,
  Briefcase,
  Lock,
  Palette,
  Activity,
  HelpCircle,
  MessageSquare,
  Trash2,
  Building2,
  Users,
  Sliders,
  CalendarCheck,
} from 'lucide-react';
import { useRouter } from '../../router/Router';

export const individualSettingsNav = [
  {
    group: 'ACCOUNT',
    items: [
      { id: 'overview', label: 'Overview Hub', route: '/dashboard/settings', icon: Sliders },
      { id: 'account', label: 'Personal Information', route: '/dashboard/settings/account', icon: User },
      { id: 'profile', label: 'Profile & Visibility', route: '/dashboard/settings/profile', icon: Shield },
      { id: 'activity', label: 'Account Activity', route: '/dashboard/settings/activity', icon: Activity },
    ],
  },
  {
    group: 'CAREER & LEARNING',
    items: [
      { id: 'career', label: 'Career Preferences', route: '/dashboard/settings/career', icon: Compass },
      { id: 'learning', label: 'Learning Preferences', route: '/dashboard/settings/learning', icon: BookOpen },
      { id: 'opportunities', label: 'Opportunity Preferences', route: '/dashboard/settings/opportunities', icon: Briefcase },
    ],
  },
  {
    group: 'COMMUNICATION & PRIVACY',
    items: [
      { id: 'notifications', label: 'Notifications', route: '/dashboard/settings/notifications', icon: Bell },
      { id: 'privacy', label: 'Privacy & Data Controls', route: '/dashboard/settings/privacy', icon: Lock },
      { id: 'appearance', label: 'Appearance & Display', route: '/dashboard/settings/appearance', icon: Palette },
    ],
  },
  {
    group: 'SUPPORT & FEEDBACK',
    items: [
      { id: 'support', label: 'Help & Support', route: '/dashboard/settings/support', icon: HelpCircle },
      { id: 'feedback', label: 'Feedback & Suggestions', route: '/dashboard/settings/feedback', icon: MessageSquare },
      { id: 'delete', label: 'Account Closure', route: '/dashboard/settings/delete-account', icon: Trash2, isDanger: true },
    ],
  },
];

export const organizationSettingsNav = [
  {
    group: 'ORGANIZATION',
    items: [
      { id: 'overview', label: 'Overview Hub', route: '/organization/settings', icon: Sliders },
      { id: 'company', label: 'Company Profile', route: '/organization/settings/company', icon: Building2 },
      { id: 'members', label: 'Members & Roles', route: '/organization/settings/members', icon: Users },
      { id: 'activity', label: 'Organization Activity', route: '/organization/settings/activity', icon: Activity },
    ],
  },
  {
    group: 'WORKFORCE & ALERTS',
    items: [
      { id: 'workforce', label: 'Workforce Preferences', route: '/organization/settings/workforce', icon: CalendarCheck },
      { id: 'notifications', label: 'Notification Preferences', route: '/organization/settings/notifications', icon: Bell },
    ],
  },
  {
    group: 'DATA & SUPPORT',
    items: [
      { id: 'privacy', label: 'Privacy & Data Controls', route: '/organization/settings/privacy', icon: Lock },
      { id: 'appearance', label: 'Appearance Preferences', route: '/organization/settings/appearance', icon: Palette },
      { id: 'support', label: 'Help & Support', route: '/organization/settings/support', icon: HelpCircle },
    ],
  },
];

export const SettingsSidebar = ({ type = 'individual', activeRoute = '' }) => {
  const { navigate, currentPath } = useRouter();
  const effectiveRoute = activeRoute || currentPath;
  const sections = type === 'organization' ? organizationSettingsNav : individualSettingsNav;

  return (
    <nav aria-label="Settings navigation" className="space-y-6">
      {/* Mobile Horizontal Tabs */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-surface-border scrollbar-none">
        {sections.flatMap((s) => s.items).map((item) => {
          const Icon = item.icon;
          const isActive = effectiveRoute === item.route;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.route)}
              className={`
                px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer
                ${
                  isActive
                    ? 'bg-brand-50 text-brand-800 border border-brand-200 shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-canvas-subtle bg-white border border-surface-border'
                }
                ${item.isDanger && !isActive ? 'hover:text-status-danger-text' : ''}
              `}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Menu */}
      <div className="hidden lg:block space-y-5">
        {sections.map((sec) => (
          <div key={sec.group} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
              {sec.group}
            </div>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = effectiveRoute === item.route;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.route)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all text-left cursor-pointer
                      ${
                        isActive
                          ? 'bg-brand-50 text-brand-900 font-semibold border border-brand-200/80 shadow-xs'
                          : 'text-charcoal-600 hover:bg-canvas-subtle hover:text-charcoal-900 border border-transparent'
                      }
                      ${item.isDanger && !isActive ? 'text-charcoal-500 hover:text-status-danger-text hover:bg-red-50/50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-brand-600'
                            : item.isDanger
                            ? 'text-charcoal-400'
                            : 'text-charcoal-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default SettingsSidebar;
