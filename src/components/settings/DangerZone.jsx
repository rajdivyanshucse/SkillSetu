import React, { useState } from 'react';
import { AlertTriangle, Trash2, RotateCcw, LogOut } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ConfirmDialog } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export const DangerZone = ({
  actions = [], // [{ id, title, description, buttonText, onConfirm, isDestructive, confirmTitle, confirmMessage }]
  className = '',
}) => {
  const { addToast } = useToast();
  const [activeAction, setActiveAction] = useState(null);

  const handleTrigger = (action) => {
    setActiveAction(action);
  };

  const handleConfirm = () => {
    if (activeAction?.onConfirm) {
      activeAction.onConfirm();
    }
    setActiveAction(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-status-danger-text">
        <AlertTriangle className="w-4 h-4" />
        <h3 className="text-body-md font-bold font-serif">Danger Zone</h3>
      </div>

      <Card className="border-red-200/80 bg-red-50/20 divide-y divide-red-100 overflow-hidden">
        {actions.map((act) => (
          <div
            key={act.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-xl">
              <h4 className="text-body-sm font-bold text-charcoal-900">{act.title}</h4>
              <p className="text-caption text-charcoal-600 leading-relaxed">
                {act.description}
              </p>
            </div>

            <Button
              variant={act.isDestructive ? 'destructive-solid' : 'outline'}
              size="sm"
              className="shrink-0 self-start sm:self-center"
              onClick={() => handleTrigger(act)}
            >
              {act.buttonText}
            </Button>
          </div>
        ))}
      </Card>

      {/* Confirmation Dialog */}
      {activeAction && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setActiveAction(null)}
          onConfirm={handleConfirm}
          title={activeAction.confirmTitle || 'Confirm Action'}
          message={
            activeAction.confirmMessage ||
            'Are you sure you want to proceed with this destructive action?'
          }
          confirmText={activeAction.buttonText || 'Confirm'}
          cancelText="Cancel"
          isDestructive={true}
        />
      )}
    </div>
  );
};

export default DangerZone;
