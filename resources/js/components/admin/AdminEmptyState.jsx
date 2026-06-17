import { FileText } from 'lucide-react';

export default function AdminEmptyState({ children, icon: Icon = FileText, title }) {
    return (
        <div className="admin-empty-state">
            <Icon size={28} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{children}</p>
        </div>
    );
}
