import { X } from 'lucide-react';

export default function Modal({ open, onClose, labelledBy, children }) {
    if (!open) {
        return null;
    }

    return (
        <div className="modal-backdrop" role="presentation" onClick={onClose}>
            <section
                className="modal-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelledBy}
                onClick={(event) => event.stopPropagation()}
            >
                <button className="modal-close" type="button" onClick={onClose} title="Close modal">
                    <X size={20} aria-hidden="true" />
                </button>
                {children}
            </section>
        </div>
    );
}
