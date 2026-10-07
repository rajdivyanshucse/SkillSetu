import React, { useState } from 'react';
import {
  Bell,
  Search,
  Menu,
  User,
  HelpCircle,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  Layers,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import Breadcrumbs from '../ui/Breadcrumbs';
import { IconButton, Button } from '../ui/Button';
import Dropdown, { DropdownItem, DropdownDivider, DropdownHeader } from '../ui/Dropdown';
import Badge from '../ui/Badge';
import { useToast } from '../ui/Toast';

export const DashboardTopbar = ({
  breadcrumbItems = [{ label: 'Individual Workspace' }, { label: 'Career Intelligence' }],
  onMenuClick,
  userProfile = {},
  onSearchOpen,
  className = '',
}) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [hasUnread, setHasUnread] = useState(true);

  const notifications = [
    {
      id: 1,
      title: 'Target Role Alignment Updated',
      desc: 'Backend Software Engineer compatibility calculated at 84%.',
      time: '10m ago',
      read: false,
    },
    {
      id: 2,
      title: 'New Priority Skill Gap Identified',
      desc: 'AWS & Cloud Computing flagged as high-impact for your goals.',
      time: '1h ago',
      read: false,
    },
    {
      id: 3,
      title: 'Profile Calibration Complete',
      desc: 'All core profile pillars successfully calibrated.',
      time: '1d ago',
      read: true,
    },
  ];

  const handleSignOut = () => {
    addToast({
      title: 'Signed Out',
      message: 'You have been safely signed out of SkillSetu.',
      type: 'info',
    });
    navigate('/login');
  };

  return (
    <header
      className={`
        h-16 px-4 sm:px-6 bg-surface border-b border-surface-border
        flex items-center justify-between gap-4 select-none shrink-0 sticky top-0 z-30
        ${className}
      `}
    >
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <IconButton
            icon={<Menu className="w-5 h-5" />}
            size="sm"
            variant="ghost"
            onClick={onMenuClick}
            ariaLabel="Toggle mobile menu"
            className="md:hidden text-charcoal-700"
          />
        )}
        <div className="hidden sm:block">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Right: Search, Telemetry, Notifications, User */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Environment / Intelligence Status Badge */}
        <div className="hidden lg:flex items-center">
          <Badge status="verified" size="sm" showDot>
            Intelligence Active
          </Badge>
        </div>

        {/* Global Search trigger */}
        <button
          type="button"
          onClick={onSearchOpen}
          className="
            hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-sm bg-canvas-subtle border border-surface-border
            text-xs text-charcoal-500 hover:border-surface-border-strong hover:text-charcoal-800 transition-all cursor-pointer
          "
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-charcoal-400" />
            <span>Search skills, roles & gaps...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-surface-border rounded-xs text-charcoal-500">
            ⌘K
          </kbd>
        </button>

        {/* Search icon for mobile screens */}
        <IconButton
          icon={<Search className="w-4 h-4" />}
          size="sm"
          variant="ghost"
          onClick={onSearchOpen}
          ariaLabel="Search"
          className="sm:hidden text-charcoal-600"
        />

        {/* Notification Dropdown with unread badge */}
        <Dropdown
          align="right"
          trigger={
            <div className="relative">
              <IconButton
                icon={<Bell className="w-4 h-4" />}
                size="sm"
                variant="ghost"
                ariaLabel="Notifications"
                className="text-charcoal-600 hover:text-charcoal-900"
              />
              {hasUnread && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-surface" />
              )}
            </div>
          }
        >
          <div className="w-72 sm:w-80">
            <div className="p-3 border-b border-surface-border flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal-900 uppercase tracking-wider">
                Notifications
              </span>
              {hasUnread && (
                <button
                  type="button"
                  onClick={() => setHasUnread(false)}
                  className="text-[11px] text-brand-600 hover:text-brand-800 font-medium cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-surface-border">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 text-left transition-colors hover:bg-canvas-subtle ${
                    !item.read ? 'bg-brand-50/30' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-charcoal-900">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-charcoal-400 shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-600 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-surface-border text-center">
              <span className="text-[10px] text-charcoal-400">
                Telemetry notifications active
              </span>
            </div>
          </div>
        </Dropdown>

        {/* User profile dropdown menu */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 p-1 pl-2 rounded-sm hover:bg-canvas-subtle transition-colors cursor-pointer border border-transparent hover:border-surface-border">
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {userProfile.avatarInitials || 'RS'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 hidden sm:block" />
            </div>
          }
        >
          <DropdownHeader>Individual Profile</DropdownHeader>
          <div className="px-3 py-2 text-xs border-b border-surface-border bg-canvas-subtle/50">
            <div className="font-semibold text-charcoal-900 truncate">
              {userProfile.fullName || 'Rahul Sharma'}
            </div>
            <div className="text-[11px] text-charcoal-500 truncate mt-0.5">
              Target: {userProfile.targetRole || 'Backend Engineer'}
            </div>
          </div>

          <DropdownItem
            icon={<User className="w-4 h-4" />}
            onClick={() => navigate('/onboarding/review')}
          >
            Profile Calibration ({userProfile.completeness || 92}%)
          </DropdownItem>

          <DropdownItem
            icon={<Layers className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/skill-intelligence')}
          >
            Skill Intelligence
          </DropdownItem>

          <DropdownItem
            icon={<Compass className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/career-intelligence')}
          >
            Career Intelligence
          </DropdownItem>

          <DropdownItem
            icon={<ShieldCheck className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/settings')}
          >
            Settings & Privacy
          </DropdownItem>

          <DropdownDivider />

          <DropdownItem
            icon={<LogOut className="w-4 h-4" />}
            variant="destructive"
            onClick={handleSignOut}
          >
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};

export default DashboardTopbar;
