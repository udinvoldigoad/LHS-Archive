import {
    Bell,
    Camera,
    Clapperboard,
    Edit3,
    ImagePlus,
    LayoutDashboard,
    Link2,
    LogOut,
    MessageSquareText,
    Music,
    Plus,
    Settings,
    Tags,
    Trash2,
    UsersRound,
} from 'lucide-react';

export const adminPanels = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'moments', label: 'Polaroid Moments', icon: Camera },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'video', label: 'Best Moment Video', icon: Clapperboard },
    { id: 'members', label: 'Members', icon: UsersRound },
    { id: 'messages', label: 'Messages', icon: MessageSquareText },
    { id: 'music', label: 'Music', icon: Music },
];

export function AdminSidebar({ activePanel, onSelectPanel, onLogout }) {
    return (
        <aside className="admin-sidebar">
            <div className="admin-profile">
                <h2>LHS Admin</h2>
                <p>Archive Custodian</p>
            </div>

            <nav className="admin-sidebar-nav" aria-label="Admin panels">
                {adminPanels.map((panel) => {
                    const Icon = panel.icon;

                    return (
                        <button
                            className={activePanel === panel.id ? 'is-active' : undefined}
                            key={panel.id}
                            type="button"
                            onClick={() => onSelectPanel(panel.id)}
                        >
                            <Icon size={20} aria-hidden="true" />
                            {panel.label}
                        </button>
                    );
                })}
            </nav>

            <div className="admin-sidebar-footer">
                <a href="/#archive">View Public Archive</a>
                <button type="button" onClick={onLogout}>
                    <LogOut size={20} aria-hidden="true" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export function AdminTopbar({ title }) {
    return (
        <header className="admin-topbar">
            <div>
                <h1>{title}</h1>
            </div>
            <div className="admin-topbar-actions" aria-label="Admin utilities">
                <button type="button" title="Notifications">
                    <Bell size={20} aria-hidden="true" />
                </button>
                <button type="button" title="Settings">
                    <Settings size={20} aria-hidden="true" />
                </button>
            </div>
        </header>
    );
}

export function PanelHeader({ title, description, actionLabel, actionIcon: ActionIcon = Plus, onAction }) {
    return (
        <div className="admin-panel-header">
            <div>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            {actionLabel ? (
                <button className="admin-action-button" type="button" onClick={onAction}>
                    <ActionIcon size={18} aria-hidden="true" />
                    {actionLabel}
                </button>
            ) : null}
        </div>
    );
}

export function AdminCardActions({ onDelete, onEdit }) {
    return (
        <div className="admin-card-actions">
            <button type="button" title="Edit" onClick={onEdit}>
                <Edit3 size={18} aria-hidden="true" />
            </button>
            <button type="button" title="Delete" onClick={onDelete}>
                <Trash2 size={18} aria-hidden="true" />
            </button>
        </div>
    );
}

export function AdminFloatingActions({ onAddPhoto, onDelete, onEdit }) {
    return (
        <div className="admin-floating-actions" aria-label="Moment actions">
            <button type="button" title="Edit moment" onClick={onEdit}>
                <Edit3 size={18} aria-hidden="true" />
            </button>
            <button type="button" title="Add photo" onClick={onAddPhoto}>
                <ImagePlus size={18} aria-hidden="true" />
            </button>
            <button type="button" title="Delete moment" onClick={onDelete}>
                <Trash2 size={18} aria-hidden="true" />
            </button>
        </div>
    );
}
