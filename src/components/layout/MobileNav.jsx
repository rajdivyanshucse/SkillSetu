import React from 'react';
import { Compass, Sparkles, Layers, Users, Menu } from 'lucide-react';

export const MobileNav = ({
  activeItem = 'intelligence',
  onItemSelect,
  onOpenMenu,
  className = '',
}) => {
  const navItems = [
    { id: 'intelligence', label: 'Radar', icon: <Compass className="w-5 h-5" /> },
    { id: 'taxonomy', label: 'Taxonomies', icon: <Layers className="w-5 h-5" /> },
    { id: 'pathways', label: 'Pathways', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'talent', label: 'Talent', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className={`
        fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-surface-border
        px-2 py-1.5 flex items-center justify-around sm:hidden shadow-modal
        ${className}
      `}
    >
      {navItems.map((item) => {
        const isActive = activeItem === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemSelect && onItemSelect(item.id)}
            className={`
              flex flex-col items-center gap-0.5 px-3 py-1 rounded-sm text-[10px] font-medium transition-colors
              ${isActive ? 'text-brand-600 font-semibold' : 'text-charcoal-500 hover:text-charcoal-800'}
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={onOpenMenu}
        className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-sm text-[10px] font-medium text-charcoal-500 hover:text-charcoal-800"
      >
        <Menu className="w-5 h-5" />
        <span>Menu</span>
      </button>
    </nav>
  );
};

export default MobileNav;
