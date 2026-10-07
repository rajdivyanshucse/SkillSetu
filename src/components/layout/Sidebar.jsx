import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  Compass,
  Users,
  Target,
  BarChart3,
  Settings,
  HelpCircle,
  Building,
  GraduationCap
} from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export const Sidebar = ({
  collapsed = false,
  onToggleCollapse,
  activeItem = 'intelligence',
  onItemSelect,
  className = '',
}) => {
  const [openSubmenus, setOpenSubmenus] = useState({ taxonomy: true });

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navGroups = [
    {
      title: 'Workforce Core',
      items: [
        { id: 'intelligence', label: 'Workforce Radar', icon: <Compass className="w-4 h-4" /> },
        { 
          id: 'taxonomy', 
          label: 'Skill Taxonomies', 
          icon: <Layers className="w-4 h-4" />,
          hasChildren: true,
          children: [
            { id: 'taxonomy-roles', label: 'Role Archetypes' },
            { id: 'taxonomy-benchmarks', label: 'Skill Benchmarks' },
          ]
        },
        { id: 'pathways', label: 'Career Pathways', icon: <Sparkles className="w-4 h-4" />, badge: 'AI' },
      ]
    },
    {
      title: 'Talent & Growth',
      items: [
        { id: 'talent', label: 'Talent Benchmarking', icon: <Users className="w-4 h-4" /> },
        { id: 'goals', label: 'Capability Goals', icon: <Target className="w-4 h-4" /> },
        { id: 'analytics', label: 'Intelligence Reports', icon: <BarChart3 className="w-4 h-4" /> },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
        { id: 'support', label: 'Help & Docs', icon: <HelpCircle className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <aside
      className={`
        relative bg-surface border-r border-surface-border flex flex-col justify-between
        transition-all duration-200 h-full select-none
        ${collapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
    >
      {/* Top Header & Branding */}
      <div>
        <div className="h-16 px-4 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-md bg-brand-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-subtle">
              <GraduationCap className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-body-sm font-bold text-charcoal-900 tracking-tight leading-none truncate">
                  SkillSetu
                </span>
                <span className="text-[10px] font-medium text-brand-600 mt-1 uppercase tracking-wider truncate">
                  Intelligence OS
                </span>
              </div>
            )}
          </div>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 rounded-sm text-charcoal-400 hover:text-charcoal-800 hover:bg-canvas-subtle transition-colors cursor-pointer"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Organization / Workspace selector preview */}
        {!collapsed && (
          <div className="p-3 mx-2 my-2 rounded-md bg-canvas-subtle/70 border border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-xs bg-charcoal-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                <Building className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-charcoal-900 truncate leading-none">Acme Global</span>
                <span className="text-[10px] text-charcoal-500 mt-0.5 truncate">Enterprise Org</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
          </div>
        )}

        {/* Navigation Items */}
        <div className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navGroups.map((group, gIdx) => (
            <div key={group.title || gIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
                  {group.title}
                </div>
              )}

              {group.items.map((item) => {
                const isActive = activeItem === item.id;
                const hasChildren = item.hasChildren && item.children;
                const isSubmenuOpen = openSubmenus[item.id];

                const navItemContent = (
                  <button
                    type="button"
                    onClick={() => {
                      if (hasChildren && !collapsed) {
                        toggleSubmenu(item.id);
                      } else {
                        onItemSelect && onItemSelect(item.id);
                      }
                    }}
                    className={`
                      w-full flex items-center justify-between px-2.5 py-2 rounded-sm text-body-sm
                      font-medium transition-colors duration-150 cursor-pointer text-left
                      ${isActive
                        ? 'bg-brand-50 text-brand-800 font-semibold border border-brand-200/60'
                        : 'text-charcoal-700 hover:bg-canvas-subtle hover:text-charcoal-900 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`${isActive ? 'text-brand-600' : 'text-charcoal-500'} shrink-0`}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!collapsed && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-xs font-semibold bg-brand-100 text-brand-700">
                            {item.badge}
                          </span>
                        )}
                        {hasChildren && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-charcoal-400 transition-transform duration-150 ${
                              isSubmenuOpen ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </div>
                    )}
                  </button>
                );

                return (
                  <div key={item.id}>
                    {collapsed ? (
                      <Tooltip content={item.label} position="right">
                        {navItemContent}
                      </Tooltip>
                    ) : (
                      navItemContent
                    )}

                    {/* Submenu Accordion */}
                    {hasChildren && !collapsed && (
                      <AnimatePresence>
                        {isSubmenuOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden pl-7 pr-1 py-1 space-y-1"
                          >
                            {item.children.map((child) => {
                              const isChildActive = activeItem === child.id;
                              return (
                                <button
                                  key={child.id}
                                  type="button"
                                  onClick={() => onItemSelect && onItemSelect(child.id)}
                                  className={`
                                    w-full text-left px-2 py-1.5 text-xs rounded-xs font-medium transition-colors
                                    ${isChildActive
                                      ? 'text-brand-700 bg-brand-50/50 font-semibold'
                                      : 'text-charcoal-500 hover:text-charcoal-800 hover:bg-canvas-subtle'
                                    }
                                  `}
                                >
                                  {child.label}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile / User Info Card */}
      <div className="p-3 border-t border-surface-border">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 text-brand-800 flex items-center justify-center font-bold text-xs shrink-0">
                DS
              </div>
              <div className="flex flex-col truncate">
                <span className="text-body-sm font-semibold text-charcoal-900 truncate leading-none">
                  Devina Sharma
                </span>
                <span className="text-[11px] text-charcoal-500 mt-1 truncate">
                  VP of Workforce Dev
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Tooltip content="Devina Sharma (VP Workforce)" position="right">
              <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 text-brand-800 flex items-center justify-center font-bold text-xs cursor-pointer">
                DS
              </div>
            </Tooltip>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
