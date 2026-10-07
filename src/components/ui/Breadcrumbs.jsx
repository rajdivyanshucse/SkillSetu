import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = ({
  items = [],
  showHome = true,
  onItemClick,
  className = '',
}) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs ${className}`}>
      {showHome && (
        <>
          <button
            type="button"
            onClick={() => onItemClick && onItemClick({ label: 'Home', href: '/' })}
            className="text-charcoal-400 hover:text-charcoal-700 transition-colors p-0.5 rounded-xs"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
          {items.length > 0 && (
            <ChevronRight className="w-3 h-3 text-charcoal-300 shrink-0" />
          )}
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.label || index}>
            {isLast ? (
              <span className="font-semibold text-charcoal-800 truncate">
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onItemClick && onItemClick(item)}
                className="text-charcoal-500 hover:text-charcoal-800 transition-colors truncate"
              >
                {item.label}
              </button>
            )}

            {!isLast && (
              <ChevronRight className="w-3 h-3 text-charcoal-300 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
