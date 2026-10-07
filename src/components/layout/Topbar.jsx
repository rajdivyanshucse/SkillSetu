import React from 'react';
import { Bell, Search, Menu, User, HelpCircle, ShieldAlert, LogOut, ChevronDown } from 'lucide-react';
import Breadcrumbs from '../ui/Breadcrumbs';
import { IconButton } from '../ui/Button';
import Dropdown, { DropdownItem, DropdownDivider, DropdownHeader } from '../ui/Dropdown';
import Badge from '../ui/Badge';

export const Topbar = ({
  breadcrumbItems = [{ label: 'Workforce Intelligence' }, { label: 'Capability Benchmarks' }],
  onSearchClick,
  onMenuClick,
  onNotificationClick,
  unreadNotifications = 3,
  className = '',
}) => {
  return (
    <header className={`h-16 px-4 sm:px-6 bg-surface border-b border-surface-border flex items-center justify-between gap-4 select-none ${className}`}>
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

      {/* Right: Search, Status, Notifications, User */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Environment / Intelligence Status Badge */}
        <div className="hidden lg:flex items-center">
          <Badge status="verified" size="sm" showDot>
            Telemetry Active
          </Badge>
        </div>

        {/* Global Search trigger */}
        <button
          type="button"
          onClick={onSearchClick}
          className="
            hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-sm bg-canvas-subtle border border-surface-border
            text-xs text-charcoal-500 hover:border-surface-border-strong hover:text-charcoal-800 transition-all cursor-pointer
          "
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-charcoal-400" />
            <span>Search intelligence & skills...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-surface-border rounded-xs text-charcoal-500">
            ⌘K
          </kbd>
        </button>

        {/* Search icon for small mobile */}
        <IconButton
          icon={<Search className="w-4 h-4" />}
          size="sm"
          variant="ghost"
          onClick={onSearchClick}
          ariaLabel="Search"
          className="sm:hidden text-charcoal-600"
        />

        {/* Notification Bell with Badge */}
        <div className="relative">
          <IconButton
            icon={<Bell className="w-4 h-4" />}
            size="sm"
            variant="ghost"
            onClick={onNotificationClick}
            ariaLabel="Notifications"
            className="text-charcoal-600 hover:text-charcoal-900"
          />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-surface" />
          )}
        </div>

        {/* User profile dropdown menu */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 p-1 pl-2 rounded-sm hover:bg-canvas-subtle transition-colors cursor-pointer border border-transparent hover:border-surface-border">
              <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                DS
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 hidden sm:block" />
            </div>
          }
        >
          <DropdownHeader>Workforce Workspace</DropdownHeader>
          <div className="px-2.5 py-1.5 text-xs text-charcoal-500">
            Signed in as <span className="font-semibold text-charcoal-800">devina@enterprise.io</span>
          </div>
          <DropdownDivider />
          <DropdownItem icon={<User className="w-4 h-4" />}>
            Personal Profile
          </DropdownItem>
          <DropdownItem icon={<HelpCircle className="w-4 h-4" />}>
            Documentation & Support
          </DropdownItem>
          <DropdownItem icon={<ShieldAlert className="w-4 h-4" />} shortcut="⌘S">
            Security & Compliance
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={<LogOut className="w-4 h-4" />} variant="destructive">
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};

export default Topbar;
