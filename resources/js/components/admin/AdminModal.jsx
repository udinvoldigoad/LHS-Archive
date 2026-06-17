import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

export default function AdminModal({ children, eyebrow, isOpen, onClose, size = 'regular', title }) {
    const dialogRef = useRef(null);
    const titleId = useId();

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const previousActiveElement = document.activeElement;
        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            const firstFocusable =
                getFocusableElements(dialogRef.current?.querySelector('.admin-modal-body'))[0] ??
                getFocusableElements(dialogRef.current)[0];
            firstFocusable?.focus();
        });

        function handleModalKeydown(event) {
            if (event.key === 'Escape') {
                onClose?.();
                return;
            }

            if (event.key !== 'Tab') {
                return;
            }

            const focusableElements = getFocusableElements(dialogRef.current);

            if (!focusableElements.length) {
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        window.addEventListener('keydown', handleModalKeydown);

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
            window.removeEventListener('keydown', handleModalKeydown);
            previousActiveElement?.focus?.();
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    function closeFromBackdrop(event) {
        if (event.target === event.currentTarget) {
            onClose?.();
        }
    }

    return (
        <div className="admin-modal-backdrop" onMouseDown={closeFromBackdrop}>
            <section
                aria-labelledby={titleId}
                aria-modal="true"
                className={`admin-modal admin-modal-${size}`}
                ref={dialogRef}
                role="dialog"
            >
                <header className="admin-modal-header">
                    <div className="admin-modal-title-block">
                        {eyebrow ? <p className="archive-kicker">{eyebrow}</p> : null}
                        <h3 id={titleId}>{title}</h3>
                    </div>
                    <button className="admin-modal-close" type="button" title="Close modal" onClick={onClose}>
                        <X size={20} aria-hidden="true" />
                    </button>
                </header>
                <div className="admin-modal-body">{children}</div>
            </section>
        </div>
    );
}

function getFocusableElements(root) {
    if (!root) {
        return [];
    }

    return Array.from(
        root.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
    );
}
