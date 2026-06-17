import { AlertTriangle, Trash2, X } from 'lucide-react';
import AdminModal from './AdminModal.jsx';

export default function AdminConfirmModal({
    body,
    confirmLabel = 'Delete',
    isOpen,
    isWorking = false,
    onClose,
    onConfirm,
    title = 'Delete item?',
}) {
    return (
        <AdminModal eyebrow="Confirm Delete" isOpen={isOpen} onClose={isWorking ? undefined : onClose} size="small" title={title}>
            <div className="admin-confirm-copy">
                <span className="admin-confirm-icon" aria-hidden="true">
                    <AlertTriangle size={24} />
                </span>
                <p>{body}</p>
            </div>
            <div className="admin-confirm-actions">
                <button className="admin-secondary-button" type="button" disabled={isWorking} onClick={onClose}>
                    <X size={18} aria-hidden="true" />
                    Cancel
                </button>
                <button className="admin-danger-button" type="button" disabled={isWorking} onClick={onConfirm}>
                    <Trash2 size={18} aria-hidden="true" />
                    {isWorking ? 'Deleting...' : confirmLabel}
                </button>
            </div>
        </AdminModal>
    );
}
