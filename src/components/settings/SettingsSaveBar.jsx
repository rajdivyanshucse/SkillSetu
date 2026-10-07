import React from 'react';
import { Check, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

export const SettingsSaveBar = ({
  hasChanges = false,
  onSave,
  onCancel,
  isSaving = false,
  saveText = 'Save Changes',
  cancelText = 'Cancel',
  className = '',
}) => {
  return (
    <div
      className={`
        p-4 rounded-xl bg-white border border-surface-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            hasChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
          }`}
        />
        <span className="text-body-sm text-charcoal-700">
          {hasChanges ? 'You have unsaved changes in this section.' : 'All preferences are synchronized.'}
        </span>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={!hasChanges || isSaving}
          >
            {cancelText}
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onSave}
          isLoading={isSaving}
          disabled={!hasChanges && !onSave}
        >
          <Check className="w-3.5 h-3.5 mr-1" />
          {saveText}
        </Button>
      </div>
    </div>
  );
};

export default SettingsSaveBar;
