import { Trash2, AlertTriangle } from 'lucide-react';
import './ConfirmationDialog.css';

export default function ConfirmationDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Delete',
  isDanger = true,
  onConfirm,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card confirmation-card" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrap">
          {isDanger ? <Trash2 size={26} className="danger-icon" /> : <AlertTriangle size={26} className="warn-icon" />}
        </div>

        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions-row">
          <button 
            type="button" 
            className="btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>

          <button 
            type="button" 
            className={isDanger ? 'btn-danger' : 'btn-primary'}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
