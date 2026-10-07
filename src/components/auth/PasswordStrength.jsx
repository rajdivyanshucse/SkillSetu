import React from 'react';
import { Check, X } from 'lucide-react';

export const PasswordStrength = ({ password = '' }) => {
  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passedCount = [hasLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

  let strengthLabel = 'Very Weak';
  let barColor = 'bg-charcoal-200';
  let textColor = 'text-charcoal-400';

  if (password.length > 0) {
    if (passedCount === 1) {
      strengthLabel = 'Weak';
      barColor = 'bg-status-danger-dot';
      textColor = 'text-status-danger-text';
    } else if (passedCount === 2) {
      strengthLabel = 'Fair';
      barColor = 'bg-status-warning-dot';
      textColor = 'text-status-warning-text';
    } else if (passedCount === 3) {
      strengthLabel = 'Good';
      barColor = 'bg-brand-500';
      textColor = 'text-brand-700';
    } else if (passedCount === 4) {
      strengthLabel = 'Strong';
      barColor = 'bg-status-success-dot';
      textColor = 'text-status-success-text';
    }
  }

  const requirements = [
    { label: '8+ characters', met: hasLength },
    { label: 'Uppercase letter', met: hasUppercase },
    { label: 'Number', met: hasNumber },
    { label: 'Special symbol', met: hasSpecial },
  ];

  return (
    <div className="space-y-2.5 pt-1">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-charcoal-500 font-medium">Password Strength</span>
          <span className={`font-semibold ${textColor}`}>{password ? strengthLabel : '—'}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 h-1">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-full rounded-full transition-colors duration-200 ${
                step <= passedCount && password.length > 0 ? barColor : 'bg-canvas-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements Matrix */}
      <div className="grid grid-cols-2 gap-1.5 pt-1">
        {requirements.map((req) => (
          <div key={req.label} className="flex items-center gap-1.5 text-[11px]">
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                req.met
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-canvas-subtle text-charcoal-400 border border-surface-border'
              }`}
            >
              {req.met ? (
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              ) : (
                <span className="w-1 h-1 rounded-full bg-charcoal-400" />
              )}
            </div>
            <span className={req.met ? 'text-charcoal-800 font-medium' : 'text-charcoal-500'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
