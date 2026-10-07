import React from 'react';

export const AuthDivider = ({ text = 'OR' }) => {
  return (
    <div className="relative flex items-center justify-center my-5">
      <div className="w-full border-t border-surface-border" />
      <span className="absolute bg-surface px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-charcoal-400">
        {text}
      </span>
    </div>
  );
};

export default AuthDivider;
