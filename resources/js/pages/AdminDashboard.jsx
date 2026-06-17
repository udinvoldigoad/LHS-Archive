import { useCallback, useEffect, useMemo, useState } from 'react';
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
    archiveLinks as fallbackArchiveLinks,
    bestMoment as fallbackBestMoment,
    members as fallbackMembers,
    messages as fallbackMessages,
    moments as fallbackMoments,
    siteSettings as fallbackSiteSettings,
} from '../data/archiveData.js';
import {
    createAdminLink,
    createAdminMoment,
    createAdminPhoto,
    deleteAdminLink,
    deleteAdminMoment,
    deleteAdminPhoto,
    fetchAdminDashboard,
    updateAdminLink,
    updateAdminMoment,
    updateAdminPhoto,
} from '../services/api.js';

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

export default function AdminDashboard({ token, onLogout }) {
    const [activePanel, setActivePanel] = useState('dashboard');
    const [dashboard, setDashboard] = useState(null);
    const [status, setStatus] = useState('loading');
    const activeMeta = adminPanels.find((panel) => panel.id === activePanel) ?? adminPanels[0];

    const loadDashboard = useCallback(async () => {
        setStatus((current) => (current === 'ready' ? 'refreshing' : 'loading'));

        try {
            const data = await fetchAdminDashboard(token);
            setDashboard(data);
            setStatus('ready');
        } catch (error) {
            if (error.status === 401) {
                onLogout?.();
                return;
            }

            setStatus('error');
        }
    }, [onLogout, token]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const adminData = useMemo(() => mapAdminDashboard(dashboard), [dashboard]);
    const totals = adminData.stats;

    return (
        <div className="admin-dashboard-shell">
            <AdminSidebar
                activePanel={activePanel}
                onLogout={onLogout}
                onSelectPanel={setActivePanel}
                profilePhoto={adminData.members[0]?.photoUrl ?? fallbackMembers[0].photoUrl}
            />

            <main className="admin-dashboard-main">
                <AdminTopbar title={activeMeta.label} />
                {status === 'loading' ? <p className="admin-api-status">Loading archive database...</p> : null}
                {status === 'refreshing' ? <p className="admin-api-status">Refreshing archive database...</p> : null}
                {status === 'error' ? (
                    <p className="admin-api-status admin-api-status-error">
                        API dashboard belum bisa diambil. Menampilkan fallback sementara.
                    </p>
                ) : null}

                {activePanel === 'dashboard' ? (
                    <OverviewPanel totals={totals} onSelectPanel={setActivePanel} />
                ) : null}
                {activePanel === 'links' ? (
                    <LinksPanel
                        categories={adminData.categories}
                        links={adminData.links}
                        onChanged={loadDashboard}
                        token={token}
                    />
                ) : null}
                {activePanel === 'moments' ? (
                    <MomentsPanel moments={adminData.moments} onChanged={loadDashboard} token={token} />
                ) : null}
                {activePanel === 'video' ? <VideoPanel bestMoment={adminData.bestMoment} /> : null}
                {activePanel === 'members' ? <MembersPanel members={adminData.members} /> : null}
                {activePanel === 'messages' ? <MessagesPanel messages={adminData.messages} /> : null}
                {activePanel === 'music' ? <MusicPanel siteSettings={adminData.siteSettings} /> : null}
            </main>
        </div>
    );
}

function AdminSidebar({ activePanel, onSelectPanel, onLogout, profilePhoto }) {
    return (
        <aside className="admin-sidebar">
            <div className="admin-profile">
                <img src={profilePhoto} alt="Admin avatar" />
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

function PanelHeader({ title, description, actionLabel, actionIcon: ActionIcon = Plus, onAction }) {
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
                        <li>Data dashboard sudah dibaca dari API Laravel.</li>
                        <li>Token admin aktif selama cache backend masih menyimpan kunci.</li>
                        <li>CRUD form visual akan disambung ke endpoint yang sudah dibuat.</li>
                    </ul>
                </aside>
            </div>
        </section>
    );
}

function LinksPanel({ categories, links, onChanged, token }) {
    const [editingLink, setEditingLink] = useState(null);
    const [form, setForm] = useState(createEmptyLinkForm(categories));
    const [formStatus, setFormStatus] = useState('idle');
    const [formError, setFormError] = useState('');
    const [panelError, setPanelError] = useState('');
    const isEditing = Boolean(editingLink);

    function openCreateForm() {
        setEditingLink(null);
        setForm(createEmptyLinkForm(categories));
        setFormStatus('editing');
        setFormError('');
        setPanelError('');
    }

    function openEditForm(link) {
        setEditingLink(link);
        setForm({
            category_id: link.categoryId ? String(link.categoryId) : '',
            title: link.title ?? '',
            description: link.description ?? '',
            url: link.url ?? '',
            thumbnail_url: link.thumbnailUrl ?? '',
            is_featured: Boolean(link.isFeatured),
            sort_order: String(link.sortOrder ?? 0),
        });
        setFormStatus('editing');
        setFormError('');
        setPanelError('');
    }

    function closeForm() {
        setEditingLink(null);
        setForm(createEmptyLinkForm(categories));
        setFormStatus('idle');
        setFormError('');
    }

    function updateForm(event) {
        const { checked, name, type, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    async function submitForm(event) {
        event.preventDefault();
        setFormStatus('saving');
        setFormError('');
        setPanelError('');

        const payload = {
            category_id: form.category_id ? Number(form.category_id) : null,
            title: form.title.trim(),
            description: form.description.trim() || null,
            url: form.url.trim(),
            thumbnail_url: form.thumbnail_url.trim() || null,
            is_featured: Boolean(form.is_featured),
            sort_order: Number(form.sort_order || 0),
        };

        try {
            if (isEditing) {
                await updateAdminLink(token, editingLink.id, payload);
            } else {
                await createAdminLink(token, payload);
            }

            await onChanged?.();
            closeForm();
        } catch (error) {
            setFormStatus('editing');
            setFormError(resolveFormError(error));
        }
    }

    async function deleteLink(link) {
        const confirmed = window.confirm(`Hapus link "${link.title}" dari archive?`);

        if (!confirmed) {
            return;
        }

        setPanelError('');

        try {
            await deleteAdminLink(token, link.id);
            await onChanged?.();
        } catch (error) {
            setPanelError(resolveFormError(error));
        }
    }

    return (
        <section className="admin-panel">
            <PanelHeader
                title="Manage Links"
                description="Preview link seperti Linktree yang naik kelas dan punya bukti visual."
                actionLabel="Add New Link"
                actionIcon={Plus}
                onAction={openCreateForm}
            />

            {formStatus !== 'idle' ? (
                <form className="admin-link-form" onSubmit={submitForm}>
                    <div className="admin-link-form-heading">
                        <div>
                            <p className="archive-kicker">{isEditing ? 'Edit Link' : 'New Link'}</p>
                            <h3>{isEditing ? editingLink.title : 'Tambah Link Archive'}</h3>
                        </div>
                        <button type="button" onClick={closeForm}>
                            Cancel
                        </button>
                    </div>

                    <div className="admin-link-form-grid">
                        <label>
                            Title
                            <input
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={updateForm}
                                placeholder="Google Drive Folder"
                                required
                            />
                        </label>
                        <label>
                            Category
                            <select name="category_id" value={form.category_id} onChange={updateForm}>
                                <option value="">No category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            URL
                            <input
                                name="url"
                                type="url"
                                value={form.url}
                                onChange={updateForm}
                                placeholder="https://example.com"
                                required
                            />
                        </label>
                        <label>
                            Thumbnail URL
                            <input
                                name="thumbnail_url"
                                type="url"
                                value={form.thumbnail_url}
                                onChange={updateForm}
                                placeholder="https://images.example.com/photo.jpg"
                            />
                        </label>
                        <label className="admin-link-form-wide">
                            Description
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={updateForm}
                                placeholder="Keterangan singkat link archive"
                                rows="3"
                            />
                        </label>
                        <label>
                            Sort Order
                            <input
                                name="sort_order"
                                type="number"
                                min="0"
                                value={form.sort_order}
                                onChange={updateForm}
                            />
                        </label>
                        <label className="admin-checkbox-field">
                            <input
                                name="is_featured"
                                type="checkbox"
                                checked={form.is_featured}
                                onChange={updateForm}
                            />
                            Featured link
                        </label>
                    </div>

                    {formError ? <p className="admin-form-error">{formError}</p> : null}

                    <div className="admin-link-form-actions">
                        <button className="admin-action-button" type="submit" disabled={formStatus === 'saving'}>
                            <Save size={18} aria-hidden="true" />
                            {formStatus === 'saving' ? 'Saving...' : isEditing ? 'Save Link' : 'Create Link'}
                        </button>
                    </div>
                </form>
            ) : null}

            {panelError ? <p className="admin-form-error">{panelError}</p> : null}

            <div className="admin-link-grid">
                {links.map((link, index) => (
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
                            <AdminCardActions onDelete={() => deleteLink(link)} onEdit={() => openEditForm(link)} />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function MomentsPanel({ moments, onChanged, token }) {
    const [editingMoment, setEditingMoment] = useState(null);
    const [momentForm, setMomentForm] = useState(createEmptyMomentForm());
    const [momentFormStatus, setMomentFormStatus] = useState('idle');
    const [photoMoment, setPhotoMoment] = useState(null);
    const [editingPhoto, setEditingPhoto] = useState(null);
    const [photoForm, setPhotoForm] = useState(createEmptyPhotoForm());
    const [photoFormStatus, setPhotoFormStatus] = useState('idle');
    const [panelError, setPanelError] = useState('');
    const isEditingMoment = Boolean(editingMoment);
    const isEditingPhoto = Boolean(editingPhoto);

    function openCreateMomentForm() {
        setEditingMoment(null);
        setMomentForm(createEmptyMomentForm());
        setMomentFormStatus('editing');
        setPanelError('');
    }

    function openEditMomentForm(moment) {
        setEditingMoment(moment);
        setMomentForm({
            title: moment.title ?? '',
            description: moment.description ?? '',
            slug: moment.slug ?? '',
        });
        setMomentFormStatus('editing');
        setPanelError('');
    }

    function closeMomentForm() {
        setEditingMoment(null);
        setMomentForm(createEmptyMomentForm());
        setMomentFormStatus('idle');
    }

    function updateMomentForm(event) {
        const { name, value } = event.target;

        setMomentForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function submitMomentForm(event) {
        event.preventDefault();
        setMomentFormStatus('saving');
        setPanelError('');

        const payload = {
            title: momentForm.title.trim(),
            description: momentForm.description.trim() || null,
            slug: momentForm.slug.trim() || null,
        };

        try {
            if (isEditingMoment) {
                await updateAdminMoment(token, editingMoment.id, payload);
            } else {
                await createAdminMoment(token, payload);
            }

            await onChanged?.();
            closeMomentForm();
        } catch (error) {
            setMomentFormStatus('editing');
            setPanelError(resolveFormError(error));
        }
    }

    async function deleteMoment(moment) {
        const confirmed = window.confirm(`Hapus moment "${moment.title}" beserta semua fotonya?`);

        if (!confirmed) {
            return;
        }

        setPanelError('');

        try {
            await deleteAdminMoment(token, moment.id);
            if (photoMoment?.id === moment.id) {
                closePhotoForm();
            }
            await onChanged?.();
        } catch (error) {
            setPanelError(resolveFormError(error));
        }
    }

    function openCreatePhotoForm(moment) {
        setPhotoMoment(moment);
        setEditingPhoto(null);
        setPhotoForm(createEmptyPhotoForm(moment));
        setPhotoFormStatus('editing');
        setPanelError('');
    }

    function openEditPhotoForm(moment, photo) {
        setPhotoMoment(moment);
        setEditingPhoto(photo);
        setPhotoForm({
            moment_id: String(moment.id),
            image_url: photo.imageUrl ?? '',
            caption: photo.caption ?? '',
            rotation: photo.rotation ?? '',
            sort_order: String(photo.sortOrder ?? 0),
        });
        setPhotoFormStatus('editing');
        setPanelError('');
    }

    function closePhotoForm() {
        setPhotoMoment(null);
        setEditingPhoto(null);
        setPhotoForm(createEmptyPhotoForm());
        setPhotoFormStatus('idle');
    }

    function updatePhotoForm(event) {
        const { name, value } = event.target;

        setPhotoForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function submitPhotoForm(event) {
        event.preventDefault();
        setPhotoFormStatus('saving');
        setPanelError('');

        const payload = {
            moment_id: Number(photoForm.moment_id),
            image_url: photoForm.image_url.trim(),
            caption: photoForm.caption.trim() || null,
            rotation: photoForm.rotation.trim() || null,
            sort_order: Number(photoForm.sort_order || 0),
        };

        try {
            if (isEditingPhoto) {
                await updateAdminPhoto(token, editingPhoto.id, payload);
            } else {
                await createAdminPhoto(token, payload);
            }

            await onChanged?.();
            closePhotoForm();
        } catch (error) {
            setPhotoFormStatus('editing');
            setPanelError(resolveFormError(error));
        }
    }

    async function deletePhoto(moment, photo) {
        const confirmed = window.confirm(`Hapus foto dari moment "${moment.title}"?`);

        if (!confirmed) {
            return;
        }

        setPanelError('');

        try {
            await deleteAdminPhoto(token, photo.id);
            await onChanged?.();
        } catch (error) {
            setPanelError(resolveFormError(error));
        }
    }

    return (
        <section className="admin-panel">
            <PanelHeader
                title="Manage Polaroid Moments"
                description="Curate the chaotic memory archive."
                actionLabel="New Moment"
                actionIcon={ImagePlus}
                onAction={openCreateMomentForm}
            />

            {panelError ? <p className="admin-form-error">{panelError}</p> : null}

            {momentFormStatus !== 'idle' ? (
                <form className="admin-link-form" onSubmit={submitMomentForm}>
                    <div className="admin-link-form-heading">
                        <div>
                            <p className="archive-kicker">{isEditingMoment ? 'Edit Moment' : 'New Moment'}</p>
                            <h3>{isEditingMoment ? editingMoment.title : 'Tambah Polaroid Moment'}</h3>
                        </div>
                        <button type="button" onClick={closeMomentForm}>
                            Cancel
                        </button>
                    </div>

                    <div className="admin-link-form-grid">
                        <label>
                            Title
                            <input
                                name="title"
                                type="text"
                                value={momentForm.title}
                                onChange={updateMomentForm}
                                placeholder="Malam paling chaos"
                                required
                            />
                        </label>
                        <label>
                            Slug
                            <input
                                name="slug"
                                type="text"
                                value={momentForm.slug}
                                onChange={updateMomentForm}
                                placeholder="malam-paling-chaos"
                            />
                        </label>
                        <label className="admin-link-form-wide">
                            Description
                            <textarea
                                name="description"
                                value={momentForm.description}
                                onChange={updateMomentForm}
                                placeholder="Deskripsi singkat moment"
                                rows="3"
                            />
                        </label>
                    </div>

                    <div className="admin-link-form-actions">
                        <button className="admin-action-button" type="submit" disabled={momentFormStatus === 'saving'}>
                            <Save size={18} aria-hidden="true" />
                            {momentFormStatus === 'saving' ? 'Saving...' : isEditingMoment ? 'Save Moment' : 'Create Moment'}
                        </button>
                    </div>
                </form>
            ) : null}

            {photoFormStatus !== 'idle' ? (
                <form className="admin-link-form" onSubmit={submitPhotoForm}>
                    <div className="admin-link-form-heading">
                        <div>
                            <p className="archive-kicker">{isEditingPhoto ? 'Edit Photo' : 'New Photo'}</p>
                            <h3>{photoMoment?.title ?? 'Foto Moment'}</h3>
                        </div>
                        <button type="button" onClick={closePhotoForm}>
                            Cancel
                        </button>
                    </div>

                    <div className="admin-link-form-grid">
                        <label>
                            Image URL
                            <input
                                name="image_url"
                                type="url"
                                value={photoForm.image_url}
                                onChange={updatePhotoForm}
                                placeholder="https://images.example.com/photo.jpg"
                                required
                            />
                        </label>
                        <label>
                            Rotation
                            <input
                                name="rotation"
                                type="text"
                                value={photoForm.rotation}
                                onChange={updatePhotoForm}
                                placeholder="-2deg"
                            />
                        </label>
                        <label>
                            Sort Order
                            <input
                                name="sort_order"
                                type="number"
                                min="0"
                                value={photoForm.sort_order}
                                onChange={updatePhotoForm}
                            />
                        </label>
                        <label className="admin-link-form-wide">
                            Caption
                            <textarea
                                name="caption"
                                value={photoForm.caption}
                                onChange={updatePhotoForm}
                                placeholder="Foto blur, memorinya jelas."
                                rows="3"
                            />
                        </label>
                    </div>

                    {photoMoment?.photos?.length ? (
                        <div className="admin-photo-manager-list">
                            {photoMoment.photos.map((photo) => (
                                <article className="admin-photo-manager-item" key={photo.id}>
                                    <img src={photo.imageUrl} alt={photo.caption || photoMoment.title} />
                                    <div>
                                        <strong>{photo.caption || 'No caption yet'}</strong>
                                        <span>{photo.rotation || '0deg'} / order {photo.sortOrder ?? 0}</span>
                                    </div>
                                    <AdminCardActions
                                        onDelete={() => deletePhoto(photoMoment, photo)}
                                        onEdit={() => openEditPhotoForm(photoMoment, photo)}
                                    />
                                </article>
                            ))}
                        </div>
                    ) : null}

                    <div className="admin-link-form-actions">
                        <button className="admin-action-button" type="submit" disabled={photoFormStatus === 'saving'}>
                            <Save size={18} aria-hidden="true" />
                            {photoFormStatus === 'saving' ? 'Saving...' : isEditingPhoto ? 'Save Photo' : 'Create Photo'}
                        </button>
                    </div>
                </form>
            ) : null}

            <div className="admin-polaroid-grid">
                {moments.map((moment, index) => (
                    <article
                        className={photoMoment?.id === moment.id ? 'admin-polaroid-admin-card is-selected' : 'admin-polaroid-admin-card'}
                        key={moment.id ?? moment.title}
                        style={{ '--tilt': moment.rotation }}
                    >
                        <div className="admin-polaroid-photo">
                            {moment.imageUrl ? (
                                <img src={moment.imageUrl} alt={moment.title} />
                            ) : (
                                <div className="admin-empty-photo">
                                    <Camera size={42} aria-hidden="true" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p>{moment.title}</p>
                            <span>{moment.photoCount ?? momentPhotoCounts[index] ?? 6} Photos</span>
                        </div>
                        <AdminFloatingActions
                            onAddPhoto={() => openCreatePhotoForm(moment)}
                            onDelete={() => deleteMoment(moment)}
                            onEdit={() => openEditMomentForm(moment)}
                        />
                    </article>
                ))}
            </div>
        </section>
    );
}

function VideoPanel({ bestMoment }) {
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

function MembersPanel({ members }) {
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

function MessagesPanel({ messages }) {
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

function MusicPanel({ siteSettings }) {
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

function mapAdminDashboard(dashboard) {
    if (!dashboard) {
        return {
            stats: {
                links: fallbackArchiveLinks.length,
                moments: fallbackMoments.length,
                members: fallbackMembers.length,
                messages: fallbackMessages.length,
            },
            categories: [],
            links: fallbackArchiveLinks,
            moments: fallbackMoments.map((moment, index) => ({
                ...moment,
                photoCount: momentPhotoCounts[index] ?? 1,
            })),
            members: fallbackMembers,
            messages: fallbackMessages,
            siteSettings: fallbackSiteSettings,
            bestMoment: fallbackBestMoment,
        };
    }

    const settings = dashboard.settings ?? {};

    const mappedLinks = (dashboard.links ?? []).map((link, index) => ({
        id: link.id,
        title: link.title,
        description: link.description,
        url: link.url,
        thumbnailUrl: link.thumbnail_url,
        category: link.category?.name ?? 'Archive',
        categoryId: link.category_id,
        buttonLabel: 'Buka Link',
        isFeatured: Boolean(link.is_featured),
        sortOrder: link.sort_order ?? index,
        rotation: index % 3 === 0 ? '-0.7deg' : index % 3 === 1 ? '0deg' : '0.8deg',
    }));

    const mappedMoments = (dashboard.moments ?? []).map((moment, index) => {
        const photos = moment.photos ?? [];
        const firstPhoto = photos[0] ?? {};

        return {
            id: moment.id,
            title: moment.title,
            description: moment.description,
            slug: moment.slug,
            caption: firstPhoto.caption ?? moment.description,
            imageUrl: firstPhoto.image_url,
            rotation: firstPhoto.rotation ?? (index % 2 === 0 ? '-1deg' : '1deg'),
            photoCount: photos.length,
            photos: photos.map((photo) => ({
                id: photo.id,
                title: moment.title,
                caption: photo.caption,
                imageUrl: photo.image_url,
                rotation: photo.rotation,
                sortOrder: photo.sort_order,
            })),
        };
    });

    const mappedMembers = (dashboard.members ?? []).map((member) => ({
        id: member.id,
        name: member.name,
        nickname: member.nickname,
        role: member.role,
        quote: member.quote,
        photoUrl: member.photo_url,
        instagramUrl: member.instagram_url,
        funFact: member.fun_fact,
        sortOrder: member.sort_order,
    }));

    const mappedMessages = (dashboard.messages ?? []).map((message, index) => ({
        id: message.id,
        name: message.name,
        message: message.message,
        isVisible: Boolean(message.is_visible),
        rotation: index % 2 === 0 ? '1deg' : '-1deg',
    }));

    return {
        stats: {
            links: dashboard.stats?.links ?? mappedLinks.length,
            moments: dashboard.stats?.moments ?? mappedMoments.length,
            members: dashboard.stats?.members ?? mappedMembers.length,
            messages: dashboard.stats?.messages ?? mappedMessages.length,
        },
        categories: (dashboard.categories ?? []).map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
        })),
        links: mappedLinks.length ? mappedLinks : fallbackArchiveLinks,
        moments: mappedMoments.length ? mappedMoments : fallbackMoments,
        members: mappedMembers.length ? mappedMembers : fallbackMembers,
        messages: mappedMessages.length ? mappedMessages : fallbackMessages,
        siteSettings: {
            ...fallbackSiteSettings,
            title: settings.site_title ?? fallbackSiteSettings.title,
            tagline: settings.tagline ?? fallbackSiteSettings.tagline,
            music: {
                ...fallbackSiteSettings.music,
                url: settings.background_music_url ?? fallbackSiteSettings.music.url,
            },
        },
        bestMoment: {
            ...fallbackBestMoment,
            title: settings.best_moment_title ?? fallbackBestMoment.title,
            description: settings.best_moment_description ?? fallbackBestMoment.description,
            videoUrl: settings.best_moment_video_url ?? fallbackBestMoment.videoUrl,
        },
    };
}

function createEmptyLinkForm(categories) {
    return {
        category_id: categories[0]?.id ? String(categories[0].id) : '',
        title: '',
        description: '',
        url: '',
        thumbnail_url: '',
        is_featured: false,
        sort_order: '0',
    };
}

function createEmptyMomentForm() {
    return {
        title: '',
        description: '',
        slug: '',
    };
}

function createEmptyPhotoForm(moment = null) {
    return {
        moment_id: moment?.id ? String(moment.id) : '',
        image_url: '',
        caption: '',
        rotation: '',
        sort_order: String(moment?.photos?.length ?? 0),
    };
}

function resolveFormError(error) {
    if (error.payload?.errors) {
        return Object.values(error.payload.errors).flat().join(' ');
    }

    return error.message || 'Action failed. Cek input atau koneksi API.';
}

function AdminCardActions({ onDelete, onEdit }) {
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

function AdminFloatingActions({ onAddPhoto, onDelete, onEdit }) {
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
