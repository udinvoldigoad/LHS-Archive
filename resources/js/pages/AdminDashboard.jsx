import { useMemo, useState } from 'react';
import {
    Bell,
    Camera,
    CheckCircle2,
    Clapperboard,
    Edit3,
    Eye,
    FileText,
    ImagePlus,
    LayoutDashboard,
    Link2,
    LogOut,
    MessageSquareText,
    Music,
    Plus,
    Save,
    Settings,
    Trash2,
    Upload,
    UsersRound,
    Volume2,
} from 'lucide-react';
import {
    archiveLinks,
    bestMoment,
    members,
    messages,
    moments,
    siteSettings,
} from '../data/archiveData.js';

const adminPanels = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'moments', label: 'Polaroid Moments', icon: Camera },
    { id: 'video', label: 'Best Moment Video', icon: Clapperboard },
    { id: 'members', label: 'Members', icon: UsersRound },
    { id: 'messages', label: 'Messages', icon: MessageSquareText },
    { id: 'music', label: 'Music', icon: Music },
];

const momentPhotoCounts = [12, 8, 3, 24, 5];

export default function AdminDashboard({ onLogout }) {
    const [activePanel, setActivePanel] = useState('dashboard');
    const activeMeta = adminPanels.find((panel) => panel.id === activePanel) ?? adminPanels[0];

    const totals = useMemo(() => ({
        links: archiveLinks.length,
        moments: moments.length,
        members: members.length,
        messages: messages.length,
    }), []);

    return (
        <div className="admin-dashboard-shell">
            <AdminSidebar
                activePanel={activePanel}
                onLogout={onLogout}
                onSelectPanel={setActivePanel}
            />

            <main className="admin-dashboard-main">
                <AdminTopbar title={activeMeta.label} />

                {activePanel === 'dashboard' ? (
                    <OverviewPanel totals={totals} onSelectPanel={setActivePanel} />
                ) : null}
                {activePanel === 'links' ? <LinksPanel /> : null}
                {activePanel === 'moments' ? <MomentsPanel /> : null}
                {activePanel === 'video' ? <VideoPanel /> : null}
                {activePanel === 'members' ? <MembersPanel /> : null}
                {activePanel === 'messages' ? <MessagesPanel /> : null}
                {activePanel === 'music' ? <MusicPanel /> : null}
            </main>
        </div>
    );
}

function AdminSidebar({ activePanel, onSelectPanel, onLogout }) {
    return (
        <aside className="admin-sidebar">
            <div className="admin-profile">
                <img src={members[0].photoUrl} alt="Admin avatar" />
                <div>
                    <h2>LHS Admin</h2>
                    <p>Archive Custodian</p>
                </div>
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

function AdminTopbar({ title }) {
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

function PanelHeader({ title, description, actionLabel, actionIcon: ActionIcon = Plus }) {
    return (
        <div className="admin-panel-header">
            <div>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            {actionLabel ? (
                <button className="admin-action-button" type="button">
                    <ActionIcon size={18} aria-hidden="true" />
                    {actionLabel}
                </button>
            ) : null}
        </div>
    );
}

function OverviewPanel({ totals, onSelectPanel }) {
    const stats = [
        { label: 'Live Links', value: totals.links, detail: 'preview cards ready', icon: Link2 },
        { label: 'Polaroid Moments', value: totals.moments, detail: 'scrapbook entries', icon: Camera },
        { label: 'Archived Humans', value: totals.members, detail: 'member profiles', icon: UsersRound },
        { label: 'Visitor Notes', value: totals.messages, detail: 'messages pending vibe check', icon: MessageSquareText },
    ];

    const quickPanels = [
        {
            id: 'links',
            title: 'Manage Links',
            description: 'Tambah, edit, dan rapikan link archive.',
            meta: `${totals.links} cards`,
            icon: Link2,
        },
        {
            id: 'moments',
            title: 'Polaroid Moments',
            description: 'Kurasi foto dan caption yang pantas jadi bukti sejarah.',
            meta: `${totals.moments} moments`,
            icon: Camera,
        },
        {
            id: 'video',
            title: 'Best Moment Video',
            description: 'Atur spotlight video utama di landing page.',
            meta: 'featured',
            icon: Clapperboard,
        },
        {
            id: 'members',
            title: 'Members',
            description: 'Kelola profil digital para archived humans.',
            meta: `${totals.members} people`,
            icon: UsersRound,
        },
        {
            id: 'messages',
            title: 'Messages',
            description: 'Moderasi sticky note dari pengunjung.',
            meta: `${totals.messages} notes`,
            icon: MessageSquareText,
        },
        {
            id: 'music',
            title: 'Music Background',
            description: 'Setel lagu yang bikin archive terasa hidup.',
            meta: 'audio',
            icon: Music,
        },
    ];

    return (
        <section className="admin-panel">
            <div className="admin-stat-grid">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <article className="admin-stat-card" key={stat.label}>
                            <Icon size={20} aria-hidden="true" />
                            <span>{stat.label}</span>
                            <strong>{stat.value}</strong>
                            <p>{stat.detail}</p>
                        </article>
                    );
                })}
            </div>

            <div className="admin-overview-grid">
                <section className="admin-overview-main">
                    <PanelHeader
                        title="Control Panels"
                        description="Panel cepat yang disiapkan sesuai struktur admin MVP."
                    />
                    <div className="admin-control-grid">
                        {quickPanels.map((panel, index) => {
                            const Icon = panel.icon;

                            return (
                                <button
                                    className="admin-control-card"
                                    key={panel.id}
                                    style={{ '--tilt': index % 2 === 0 ? '-0.7deg' : '0.8deg' }}
                                    type="button"
                                    onClick={() => onSelectPanel(panel.id)}
                                >
                                    <span className="admin-control-icon">
                                        <Icon size={22} aria-hidden="true" />
                                    </span>
                                    <span className="admin-control-meta">{panel.meta}</span>
                                    <strong>{panel.title}</strong>
                                    <span>{panel.description}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <aside className="admin-scrap-note">
                    <p className="archive-kicker">Archive Health</p>
                    <h3>Prototype panel aktif. Backend belum disambung.</h3>
                    <ul>
                        <li>Data masih placeholder dari file React.</li>
                        <li>Password masih demo untuk sesi browser.</li>
                        <li>CRUD asli masuk setelah API Laravel siap.</li>
                    </ul>
                </aside>
            </div>
        </section>
    );
}

function LinksPanel() {
    return (
        <section className="admin-panel">
            <PanelHeader
                title="Manage Links"
                description="Preview link seperti Linktree yang naik kelas dan punya bukti visual."
                actionLabel="Add New Link"
                actionIcon={Plus}
            />

            <div className="admin-link-grid">
                {archiveLinks.map((link, index) => (
                    <article
                        className="admin-link-card"
                        key={link.title}
                        style={{ '--tilt': index % 3 === 0 ? '-0.7deg' : index % 3 === 1 ? '0deg' : '0.8deg' }}
                    >
                        <div className="admin-link-thumb">
                            <img src={link.thumbnailUrl} alt={link.title} />
                            <span>{link.category}</span>
                        </div>
                        <h3>{link.title}</h3>
                        <p>{link.description}</p>
                        <div className="admin-card-footer">
                            <span>Added: Jun {12 + index}, 2026</span>
                            <AdminCardActions />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function MomentsPanel() {
    return (
        <section className="admin-panel">
            <PanelHeader
                title="Manage Polaroid Moments"
                description="Curate the chaotic memory archive."
                actionLabel="New Moment"
                actionIcon={ImagePlus}
            />

            <div className="admin-polaroid-grid">
                {moments.map((moment, index) => (
                    <article
                        className="admin-polaroid-admin-card"
                        key={moment.title}
                        style={{ '--tilt': moment.rotation }}
                    >
                        <div className="admin-polaroid-photo">
                            <img src={moment.imageUrl} alt={moment.title} />
                        </div>
                        <div>
                            <p>{moment.title}</p>
                            <span>{momentPhotoCounts[index] ?? 6} Photos</span>
                        </div>
                        <AdminFloatingActions />
                    </article>
                ))}
            </div>
        </section>
    );
}

function VideoPanel() {
    return (
        <section className="admin-panel">
            <PanelHeader
                title="Best Moment Video"
                description="Manage the featured video spotlight. This video will set the tone on the public archive."
                actionLabel="Save Changes"
                actionIcon={Save}
            />

            <div className="admin-video-layout">
                <div className="admin-video-settings">
                    <section className="admin-form-card">
                        <h3>Video Details</h3>
                        <label>
                            Video Title
                            <input type="text" defaultValue={bestMoment.title} />
                        </label>
                        <label>
                            Description
                            <textarea rows="4" defaultValue={bestMoment.description} />
                        </label>
                        <label>
                            Source URL
                            <input type="url" defaultValue="https://example.com/best-moment.mp4" />
                        </label>
                        <div className="admin-upload-zone">
                            <Upload size={28} aria-hidden="true" />
                            <p>Drag & Drop or <span>Browse</span></p>
                            <small>MP4, WebM (Max 50MB)</small>
                        </div>
                    </section>

                    <aside className="admin-director-note">
                        <p className="archive-kicker">Director's Note</p>
                        <p>Keep it under 60 seconds. High contrast and gritty filters work best with the charcoal archive.</p>
                    </aside>
                </div>

                <section className="admin-video-preview-card">
                    <p className="archive-kicker">
                        <Eye size={14} aria-hidden="true" />
                        Live Preview
                    </p>
                    <div className="admin-video-preview">
                        <img src={bestMoment.thumbnailUrl} alt={bestMoment.title} />
                        <button type="button" title="Preview video">
                            <Clapperboard size={32} aria-hidden="true" />
                        </button>
                        <div>
                            <span>Featured</span>
                            <h3>{bestMoment.title}</h3>
                            <p>{bestMoment.description}</p>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}

function MembersPanel() {
    return (
        <section className="admin-panel">
            <PanelHeader
                title="Manage Members"
                description="Archived humans, role absurd, quote, fun fact, dan link sosial."
                actionLabel="Add Member"
                actionIcon={UsersRound}
            />

            <div className="admin-member-grid">
                {members.map((member, index) => (
                    <article
                        className="admin-member-admin-card"
                        key={member.name}
                        style={{ '--tilt': index % 2 === 0 ? '-0.6deg' : '0.7deg' }}
                    >
                        <img src={member.photoUrl} alt={member.name} />
                        <span>{member.role}</span>
                        <h3>{member.name}</h3>
                        <p>{member.quote}</p>
                        <AdminCardActions />
                    </article>
                ))}
            </div>
        </section>
    );
}

function MessagesPanel() {
    return (
        <section className="admin-panel">
            <PanelHeader
                title="Visitor Messages"
                description="Moderasi pesan kenangan sebelum sticky note-nya jadi legenda publik."
                actionLabel="Export Notes"
                actionIcon={FileText}
            />

            <div className="admin-message-grid">
                {messages.map((message, index) => (
                    <article
                        className="admin-message-note"
                        key={`${message.name}-${message.message}`}
                        style={{ '--tilt': message.rotation }}
                    >
                        <p>{message.message}</p>
                        <span>{message.name}</span>
                        <div>
                            <button type="button">
                                <CheckCircle2 size={17} aria-hidden="true" />
                                Visible
                            </button>
                            <button type="button">
                                <Trash2 size={17} aria-hidden="true" />
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function MusicPanel() {
    return (
        <section className="admin-panel">
            <PanelHeader
                title="Music Background"
                description="Atur lagu yang muncul lewat tombol Play Memory di kanan bawah halaman publik."
                actionLabel="Save Music"
                actionIcon={Volume2}
            />

            <div className="admin-music-layout">
                <section className="admin-form-card">
                    <h3>Audio Settings</h3>
                    <label>
                        Button Label
                        <input type="text" defaultValue={siteSettings.music.title} />
                    </label>
                    <label>
                        Audio URL
                        <input type="url" defaultValue={siteSettings.music.url} />
                    </label>
                    <label>
                        Default Volume
                        <input type="range" min="0" max="100" defaultValue="20" />
                    </label>
                </section>

                <aside className="admin-music-preview">
                    <p className="archive-kicker">Public Button Preview</p>
                    <button type="button">
                        <Volume2 size={18} aria-hidden="true" />
                        {siteSettings.music.title}
                    </button>
                    <p>Browser biasanya butuh interaksi user sebelum musik bisa play. Jadi tombol tetap jadi kontrol utama.</p>
                </aside>
            </div>
        </section>
    );
}

function AdminCardActions() {
    return (
        <div className="admin-card-actions">
            <button type="button" title="Edit">
                <Edit3 size={18} aria-hidden="true" />
            </button>
            <button type="button" title="Delete">
                <Trash2 size={18} aria-hidden="true" />
            </button>
        </div>
    );
}

function AdminFloatingActions() {
    return (
        <div className="admin-floating-actions" aria-label="Moment actions">
            <button type="button" title="Edit">
                <Edit3 size={18} aria-hidden="true" />
            </button>
            <button type="button" title="Delete">
                <Trash2 size={18} aria-hidden="true" />
            </button>
        </div>
    );
}
