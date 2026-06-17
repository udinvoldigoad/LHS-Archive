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
    Tags,
    Trash2,
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
    createAdminCategory,
    createAdminLink,
    createAdminMember,
    createAdminMoment,
    createAdminPhoto,
    deleteAdminCategory,
    deleteAdminLink,
    deleteAdminMember,
    deleteAdminMessage,
    deleteAdminMoment,
    deleteAdminPhoto,
    fetchAdminDashboard,
    updateAdminCategory,
    updateAdminLink,
    updateAdminMember,
    updateAdminMessageVisibility,
    updateAdminMoment,
    updateAdminPhoto,
    updateAdminSettings,
} from '../services/api.js';
import AdminEmptyState from '../components/admin/AdminEmptyState.jsx';
import AdminModal from '../components/admin/AdminModal.jsx';
import UploadField from '../components/admin/UploadField.jsx';
import { formatMediaName } from '../utils/media.js';

const adminPanels = [
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
                {activePanel === 'categories' ? (
                    <CategoriesPanel categories={adminData.categories} onChanged={loadDashboard} token={token} />
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
                {activePanel === 'settings' ? (
                    <SettingsPanel
                        bestMoment={adminData.bestMoment}
                        onChanged={loadDashboard}
                        siteSettings={adminData.siteSettings}
                        token={token}
                    />
                ) : null}
                {activePanel === 'video' ? (
                    <VideoPanel
                        bestMoment={adminData.bestMoment}
                        onChanged={loadDashboard}
                        siteSettings={adminData.siteSettings}
                        token={token}
                    />
                ) : null}
                {activePanel === 'members' ? (
                    <MembersPanel members={adminData.members} onChanged={loadDashboard} token={token} />
                ) : null}
                {activePanel === 'messages' ? (
                    <MessagesPanel messages={adminData.messages} onChanged={loadDashboard} token={token} />
                ) : null}
                {activePanel === 'music' ? (
                    <MusicPanel
                        bestMoment={adminData.bestMoment}
                        onChanged={loadDashboard}
                        siteSettings={adminData.siteSettings}
                        token={token}
                    />
                ) : null}
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
            id: 'categories',
            title: 'Categories',
            description: 'Kelola grup link archive.',
            meta: 'link groups',
            icon: Tags,
        },
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
            id: 'settings',
            title: 'Site Settings',
            description: 'Atur judul dan tagline halaman publik.',
            meta: 'global copy',
            icon: Settings,
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
                    <p className="archive-kicker">Welcome Admin</p>
                    <h3>Panel admin ini untuk upload dokumentasi LHS.</h3>
                    <ul>
                        <li>Semua anggota LHS bisa akses panel ini.</li>
                        <li>Silahkan upload apa aja.</li>
                        <li>Kalo ada yang kurang kasih saran ke udin.</li>
                    </ul>
                </aside>
            </div>
        </section>
    );
}

function CategoriesPanel({ categories, onChanged, token }) {
    const [editingCategory, setEditingCategory] = useState(null);
    const [form, setForm] = useState(createEmptyCategoryForm());
    const [formStatus, setFormStatus] = useState('idle');
    const [panelError, setPanelError] = useState('');
    const isEditing = Boolean(editingCategory);

    function openCreateForm() {
        setEditingCategory(null);
        setForm(createEmptyCategoryForm());
        setFormStatus('editing');
        setPanelError('');
    }

    function openEditForm(category) {
        setEditingCategory(category);
        setForm({
            name: category.name ?? '',
            slug: category.slug ?? '',
        });
        setFormStatus('editing');
        setPanelError('');
    }

    function closeForm() {
        setEditingCategory(null);
        setForm(createEmptyCategoryForm());
        setFormStatus('idle');
        setPanelError('');
    }

    function updateForm(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function submitForm(event) {
        event.preventDefault();
        setFormStatus('saving');
        setPanelError('');

        const payload = {
            name: form.name.trim(),
            slug: form.slug.trim() || null,
        };

        try {
            if (isEditing) {
                await updateAdminCategory(token, editingCategory.id, payload);
            } else {
                await createAdminCategory(token, payload);
            }

            await onChanged?.();
            closeForm();
        } catch (error) {
            setFormStatus('editing');
            setPanelError(resolveFormError(error));
        }
    }

    async function deleteCategory(category) {
        const confirmed = window.confirm(`Hapus category "${category.name}"? Link yang memakai category ini akan jadi tanpa category.`);

        if (!confirmed) {
            return;
        }

        setPanelError('');

        try {
            await deleteAdminCategory(token, category.id);
            await onChanged?.();
        } catch (error) {
            setPanelError(resolveFormError(error));
        }
    }

    return (
        <section className="admin-panel">
            <PanelHeader
                title="Manage Categories"
                description="Rapikan grup link archive sebelum semuanya jadi laci campur aduk."
                actionLabel="Add Category"
                actionIcon={Tags}
                onAction={openCreateForm}
            />

            {panelError && formStatus === 'idle' ? <p className="admin-form-error">{panelError}</p> : null}

            <AdminModal
                eyebrow={isEditing ? 'Edit Category' : 'New Category'}
                isOpen={formStatus !== 'idle'}
                onClose={closeForm}
                title={isEditing ? editingCategory.name : 'Tambah Category'}
            >
                <form className="admin-link-form" onSubmit={submitForm}>
                    <div className="admin-link-form-grid">
                        <label>
                            Name
                            <input
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={updateForm}
                                placeholder="Dokumentasi"
                                required
                            />
                        </label>
                        <label>
                            Slug
                            <input
                                name="slug"
                                type="text"
                                value={form.slug}
                                onChange={updateForm}
                                placeholder="dokumentasi"
                            />
                        </label>
                    </div>

                    {panelError ? <p className="admin-form-error">{panelError}</p> : null}

                    <div className="admin-link-form-actions">
                        <button className="admin-action-button" type="submit" disabled={formStatus === 'saving'}>
                            <Save size={18} aria-hidden="true" />
                            {formStatus === 'saving' ? 'Saving...' : isEditing ? 'Save Category' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {categories.length ? (
                <div className="admin-category-grid">
                    {categories.map((category, index) => (
                        <article
                            className="admin-category-card"
                            key={category.id ?? category.slug}
                            style={{ '--tilt': index % 2 === 0 ? '-0.4deg' : '0.5deg' }}
                        >
                            <span>Category</span>
                            <h3>{category.name}</h3>
                            <p>/{category.slug}</p>
                            <AdminCardActions
                                onDelete={() => deleteCategory(category)}
                                onEdit={() => openEditForm(category)}
                            />
                        </article>
                    ))}
                </div>
            ) : (
                <AdminEmptyState icon={Tags} title="No categories yet">
                    Tambah category pertama supaya link archive lebih gampang dibaca.
                </AdminEmptyState>
            )}
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

            <AdminModal
                eyebrow={isEditing ? 'Edit Link' : 'New Link'}
                isOpen={formStatus !== 'idle'}
                onClose={closeForm}
                title={isEditing ? editingLink.title : 'Tambah Link Archive'}
            >
                <form className="admin-link-form" onSubmit={submitForm}>
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
                        <div className="admin-field-stack">
                            <span className="admin-field-label">Thumbnail</span>
                            <UploadField
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                currentUrl={form.thumbnail_url}
                                kind="image"
                                label="Upload thumbnail"
                                token={token}
                                onClear={() => setForm((current) => ({ ...current, thumbnail_url: '' }))}
                                onUploaded={(url) => setForm((current) => ({ ...current, thumbnail_url: url }))}
                            />
                        </div>
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
            </AdminModal>

            {panelError && formStatus === 'idle' ? <p className="admin-form-error">{panelError}</p> : null}

            {links.length ? (
                <div className="admin-link-grid">
                    {links.map((link, index) => (
                        <article
                            className="admin-link-card"
                            key={link.id ?? link.title}
                            style={{ '--tilt': index % 3 === 0 ? '-0.7deg' : index % 3 === 1 ? '0deg' : '0.8deg' }}
                        >
                            <div className="admin-link-thumb">
                                {link.thumbnailUrl ? (
                                    <img src={link.thumbnailUrl} alt={link.title} />
                                ) : (
                                    <div className="admin-empty-photo">
                                        <Link2 size={34} aria-hidden="true" />
                                    </div>
                                )}
                                <span>{link.category}</span>
                            </div>
                            <h3>{link.title}</h3>
                            <p>{link.description}</p>
                            <div className="admin-card-footer">
                                <span>Order: {link.sortOrder ?? index}</span>
                                <AdminCardActions onDelete={() => deleteLink(link)} onEdit={() => openEditForm(link)} />
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <AdminEmptyState icon={Link2} title="No links yet">
                    Tambah link pertama untuk mulai mengisi archive.
                </AdminEmptyState>
            )}
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
        closePhotoForm();
        setEditingMoment(null);
        setMomentForm(createEmptyMomentForm());
        setMomentFormStatus('editing');
        setPanelError('');
    }

    function openEditMomentForm(moment) {
        closePhotoForm();
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
        closeMomentForm();
        setPhotoMoment(moment);
        setEditingPhoto(null);
        setPhotoForm(createEmptyPhotoForm(moment));
        setPhotoFormStatus('editing');
        setPanelError('');
    }

    function openEditPhotoForm(moment, photo) {
        closeMomentForm();
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

        if (!photoForm.image_url.trim()) {
            setPhotoFormStatus('editing');
            setPanelError('Upload photo dulu sebelum menyimpan.');
            return;
        }

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

            {panelError && momentFormStatus === 'idle' && photoFormStatus === 'idle' ? (
                <p className="admin-form-error">{panelError}</p>
            ) : null}

            <AdminModal
                eyebrow={isEditingMoment ? 'Edit Moment' : 'New Moment'}
                isOpen={momentFormStatus !== 'idle'}
                onClose={closeMomentForm}
                title={isEditingMoment ? editingMoment.title : 'Tambah Polaroid Moment'}
            >
                <form className="admin-link-form" onSubmit={submitMomentForm}>
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

                    {panelError ? <p className="admin-form-error">{panelError}</p> : null}

                    <div className="admin-link-form-actions">
                        <button className="admin-action-button" type="submit" disabled={momentFormStatus === 'saving'}>
                            <Save size={18} aria-hidden="true" />
                            {momentFormStatus === 'saving' ? 'Saving...' : isEditingMoment ? 'Save Moment' : 'Create Moment'}
                        </button>
                    </div>
                </form>
            </AdminModal>

            <AdminModal
                eyebrow={isEditingPhoto ? 'Edit Photo' : 'New Photo'}
                isOpen={photoFormStatus !== 'idle'}
                onClose={closePhotoForm}
                title={photoMoment?.title ?? 'Foto Moment'}
            >
                <form className="admin-link-form" onSubmit={submitPhotoForm}>
                    <div className="admin-link-form-grid">
                        <div className="admin-field-stack">
                            <span className="admin-field-label">Photo File</span>
                            <UploadField
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                currentUrl={photoForm.image_url}
                                kind="image"
                                label="Upload photo"
                                token={token}
                                onUploaded={(url) => setPhotoForm((current) => ({ ...current, image_url: url }))}
                            />
                        </div>
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

                    {panelError ? <p className="admin-form-error">{panelError}</p> : null}

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
            </AdminModal>

            {moments.length ? (
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
            ) : (
                <AdminEmptyState icon={Camera} title="No moments yet">
                    Buat moment pertama, lalu tambahkan foto-foto polaroidnya.
                </AdminEmptyState>
            )}
        </section>
    );
}

function SettingsPanel({ bestMoment, onChanged, siteSettings, token }) {
    const [form, setForm] = useState(createSiteSettingsForm(siteSettings));
    const [formStatus, setFormStatus] = useState('idle');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        setForm(createSiteSettingsForm(siteSettings));
    }, [siteSettings.tagline, siteSettings.title]);

    function updateForm(event) {
        const { name, value } = event.target;

        setFormStatus('idle');
        setFormError('');
        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function submitForm(event) {
        event.preventDefault();
        setFormStatus('saving');
        setFormError('');

        try {
            await updateAdminSettings(
                token,
                createSettingsPayload(siteSettings, bestMoment, {
                    site_title: form.site_title.trim(),
                    tagline: form.tagline.trim() || null,
                }),
            );
            await onChanged?.();
            setFormStatus('saved');
        } catch (error) {
            setFormStatus('idle');
            setFormError(resolveFormError(error));
        }
    }

    return (
        <section className="admin-panel">
            <PanelHeader
                title="Site Settings"
                description="Atur identitas utama yang muncul di halaman publik."
            />

            <form className="admin-form-card admin-settings-form" onSubmit={submitForm}>
                <h3>Public Copy</h3>
                <label>
                    Site Title
                    <input
                        name="site_title"
                        type="text"
                        value={form.site_title}
                        onChange={updateForm}
                        placeholder="LHS Archive"
                        required
                    />
                </label>
                <label>
                    Tagline
                    <textarea
                        name="tagline"
                        rows="4"
                        value={form.tagline}
                        onChange={updateForm}
                        placeholder="Tempat kecil buat nyimpen semua hal yang pernah rame bareng."
                    />
                </label>

                {formError ? <p className="admin-form-error">{formError}</p> : null}
                {formStatus === 'saved' ? <p className="admin-form-success">Site settings saved.</p> : null}

                <div className="admin-link-form-actions">
                    <button className="admin-action-button" type="submit" disabled={formStatus === 'saving'}>
                        <Save size={18} aria-hidden="true" />
                        {formStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </section>
    );
}

function VideoPanel({ bestMoment, onChanged, siteSettings, token }) {
    const [form, setForm] = useState(createVideoSettingsForm(bestMoment));
    const [formStatus, setFormStatus] = useState('idle');
    const [formError, setFormError] = useState('');
    const previewTitle = form.best_moment_title || bestMoment.title;
    const previewDescription = form.best_moment_description || bestMoment.description;

    useEffect(() => {
        setForm(createVideoSettingsForm(bestMoment));
    }, [bestMoment.description, bestMoment.title, bestMoment.videoUrl]);

    function updateForm(event) {
        const { name, value } = event.target;

        setFormStatus('idle');
        setFormError('');
        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function submitForm(event) {
        event.preventDefault();
        setFormStatus('saving');
        setFormError('');

        try {
            await updateAdminSettings(
                token,
                createSettingsPayload(siteSettings, bestMoment, {
                    best_moment_title: form.best_moment_title.trim() || null,
                    best_moment_description: form.best_moment_description.trim() || null,
                    best_moment_video_url: form.best_moment_video_url.trim() || null,
                }),
            );
            await onChanged?.();
            setFormStatus('saved');
        } catch (error) {
            setFormStatus('idle');
            setFormError(resolveFormError(error));
        }
    }

    return (
        <section className="admin-panel">
            <PanelHeader
                title="Best Moment Video"
                description="Manage the featured video spotlight. This video will set the tone on the public archive."
            />

            <div className="admin-video-layout">
                <div className="admin-video-settings">
                    <form className="admin-form-card" onSubmit={submitForm}>
                        <h3>Video Details</h3>
                        <label>
                            Video Title
                            <input
                                name="best_moment_title"
                                type="text"
                                value={form.best_moment_title}
                                onChange={updateForm}
                                placeholder="Malam Keakraban 2023"
                            />
                        </label>
                        <label>
                            Description
                            <textarea
                                name="best_moment_description"
                                rows="4"
                                value={form.best_moment_description}
                                onChange={updateForm}
                                placeholder="Satu video buat membuktikan kalau chaos juga bisa terlihat sinematik."
                            />
                        </label>
                        <div className="admin-field-stack">
                            <span className="admin-field-label">Video File</span>
                            <UploadField
                                accept="video/mp4,video/webm,video/quicktime"
                                currentUrl={form.best_moment_video_url}
                                kind="video"
                                label="Upload video"
                                token={token}
                                onClear={() => setForm((current) => ({ ...current, best_moment_video_url: '' }))}
                                onUploaded={(url) => setForm((current) => ({ ...current, best_moment_video_url: url }))}
                            />
                        </div>
                        {formError ? <p className="admin-form-error">{formError}</p> : null}
                        {formStatus === 'saved' ? <p className="admin-form-success">Best moment saved.</p> : null}
                        <div className="admin-link-form-actions">
                            <button className="admin-action-button" type="submit" disabled={formStatus === 'saving'}>
                                <Save size={18} aria-hidden="true" />
                                {formStatus === 'saving' ? 'Saving...' : 'Save Video'}
                            </button>
                        </div>
                    </form>

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
                            <h3>{previewTitle}</h3>
                            <p>{previewDescription}</p>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}

function MembersPanel({ members, onChanged, token }) {
    const [editingMember, setEditingMember] = useState(null);
    const [form, setForm] = useState(createEmptyMemberForm());
    const [formStatus, setFormStatus] = useState('idle');
    const [panelError, setPanelError] = useState('');
    const isEditing = Boolean(editingMember);

    function openCreateForm() {
        setEditingMember(null);
        setForm(createEmptyMemberForm());
        setFormStatus('editing');
        setPanelError('');
    }

    function openEditForm(member) {
        setEditingMember(member);
        setForm({
            name: member.name ?? '',
            nickname: member.nickname ?? '',
            role: member.role ?? '',
            quote: member.quote ?? '',
            photo_url: member.photoUrl ?? '',
            instagram_url: member.instagramUrl ?? '',
            fun_fact: member.funFact ?? '',
            sort_order: String(member.sortOrder ?? 0),
        });
        setFormStatus('editing');
        setPanelError('');
    }

    function closeForm() {
        setEditingMember(null);
        setForm(createEmptyMemberForm());
        setFormStatus('idle');
    }

    function updateForm(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function submitForm(event) {
        event.preventDefault();
        setFormStatus('saving');
        setPanelError('');

        const payload = {
            name: form.name.trim(),
            nickname: form.nickname.trim() || null,
            role: form.role.trim() || null,
            quote: form.quote.trim() || null,
            photo_url: form.photo_url.trim() || null,
            instagram_url: form.instagram_url.trim() || null,
            fun_fact: form.fun_fact.trim() || null,
            sort_order: Number(form.sort_order || 0),
        };

        try {
            if (isEditing) {
                await updateAdminMember(token, editingMember.id, payload);
            } else {
                await createAdminMember(token, payload);
            }

            await onChanged?.();
            closeForm();
        } catch (error) {
            setFormStatus('editing');
            setPanelError(resolveFormError(error));
        }
    }

    async function deleteMember(member) {
        const confirmed = window.confirm(`Hapus member "${member.name}" dari archive?`);

        if (!confirmed) {
            return;
        }

        setPanelError('');

        try {
            await deleteAdminMember(token, member.id);
            await onChanged?.();
        } catch (error) {
            setPanelError(resolveFormError(error));
        }
    }

    return (
        <section className="admin-panel">
            <PanelHeader
                title="Manage Members"
                description="Archived humans, role absurd, quote, fun fact, dan link sosial."
                actionLabel="Add Member"
                actionIcon={UsersRound}
                onAction={openCreateForm}
            />

            {panelError && formStatus === 'idle' ? <p className="admin-form-error">{panelError}</p> : null}

            <AdminModal
                eyebrow={isEditing ? 'Edit Member' : 'New Member'}
                isOpen={formStatus !== 'idle'}
                onClose={closeForm}
                title={isEditing ? editingMember.name : 'Tambah Archived Human'}
            >
                <form className="admin-link-form" onSubmit={submitForm}>
                    <div className="admin-link-form-grid">
                        <label>
                            Name
                            <input
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={updateForm}
                                placeholder="Nama asli"
                                required
                            />
                        </label>
                        <label>
                            Nickname
                            <input
                                name="nickname"
                                type="text"
                                value={form.nickname}
                                onChange={updateForm}
                                placeholder="Nama panggilan"
                            />
                        </label>
                        <label>
                            Role
                            <input
                                name="role"
                                type="text"
                                value={form.role}
                                onChange={updateForm}
                                placeholder="Ketua dokumentasi chaos"
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
                        <div className="admin-field-stack admin-link-form-wide">
                            <span className="admin-field-label">Photo File</span>
                            <UploadField
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                currentUrl={form.photo_url}
                                kind="image"
                                label="Upload member photo"
                                token={token}
                                onClear={() => setForm((current) => ({ ...current, photo_url: '' }))}
                                onUploaded={(url) => setForm((current) => ({ ...current, photo_url: url }))}
                            />
                        </div>
                        <label className="admin-link-form-wide">
                            Instagram URL
                            <input
                                name="instagram_url"
                                type="url"
                                value={form.instagram_url}
                                onChange={updateForm}
                                placeholder="https://instagram.com/username"
                            />
                        </label>
                        <label className="admin-link-form-wide">
                            Quote
                            <textarea
                                name="quote"
                                value={form.quote}
                                onChange={updateForm}
                                placeholder="Kalimat paling ikonik dari orang ini"
                                rows="3"
                            />
                        </label>
                        <label className="admin-link-form-wide">
                            Fun Fact
                            <textarea
                                name="fun_fact"
                                value={form.fun_fact}
                                onChange={updateForm}
                                placeholder="Fakta kecil yang terlalu spesifik untuk dilupakan"
                                rows="3"
                            />
                        </label>
                    </div>

                    {panelError ? <p className="admin-form-error">{panelError}</p> : null}

                    <div className="admin-link-form-actions">
                        <button className="admin-action-button" type="submit" disabled={formStatus === 'saving'}>
                            <Save size={18} aria-hidden="true" />
                            {formStatus === 'saving' ? 'Saving...' : isEditing ? 'Save Member' : 'Create Member'}
                        </button>
                    </div>
                </form>
            </AdminModal>

            {members.length ? (
                <div className="admin-member-grid">
                    {members.map((member, index) => (
                        <article
                            className="admin-member-admin-card"
                            key={member.id ?? member.name}
                            style={{ '--tilt': index % 2 === 0 ? '-0.6deg' : '0.7deg' }}
                        >
                            {member.photoUrl ? (
                                <img src={member.photoUrl} alt={member.name} />
                            ) : (
                                <div className="admin-member-empty-photo">
                                    <UsersRound size={38} aria-hidden="true" />
                                </div>
                            )}
                            <span>{member.role || 'Archived Human'}</span>
                            <h3>{member.name}</h3>
                            {member.nickname ? <small className="admin-member-nickname">@{member.nickname}</small> : null}
                            <p>{member.quote || 'Belum ada quote. Masih misterius, masih valid.'}</p>
                            {member.funFact ? <small className="admin-member-fun-fact">{member.funFact}</small> : null}
                            {member.id ? (
                                <AdminCardActions onDelete={() => deleteMember(member)} onEdit={() => openEditForm(member)} />
                            ) : null}
                        </article>
                    ))}
                </div>
            ) : (
                <AdminEmptyState icon={UsersRound} title="No members yet">
                    Tambah manusia pertama yang layak masuk arsip.
                </AdminEmptyState>
            )}
        </section>
    );
}

function MessagesPanel({ messages, onChanged, token }) {
    const [panelError, setPanelError] = useState('');
    const [actionId, setActionId] = useState('');

    async function toggleVisibility(message) {
        setActionId(`visibility-${message.id}`);
        setPanelError('');

        try {
            await updateAdminMessageVisibility(token, message.id, !message.isVisible);
            await onChanged?.();
        } catch (error) {
            setPanelError(resolveFormError(error));
        } finally {
            setActionId('');
        }
    }

    async function deleteMessage(message) {
        const confirmed = window.confirm(`Hapus pesan dari "${message.name}"?`);

        if (!confirmed) {
            return;
        }

        setActionId(`delete-${message.id}`);
        setPanelError('');

        try {
            await deleteAdminMessage(token, message.id);
            await onChanged?.();
        } catch (error) {
            setPanelError(resolveFormError(error));
        } finally {
            setActionId('');
        }
    }

    return (
        <section className="admin-panel">
            <PanelHeader
                title="Visitor Messages"
                description="Moderasi pesan kenangan sebelum sticky note-nya jadi legenda publik."
                actionIcon={FileText}
            />

            {panelError ? <p className="admin-form-error">{panelError}</p> : null}

            {messages.length ? (
                <div className="admin-message-grid">
                    {messages.map((message) => {
                        const isVisible = message.isVisible !== false;

                        return (
                            <article
                                className={isVisible ? 'admin-message-note' : 'admin-message-note is-hidden'}
                                key={message.id ?? `${message.name}-${message.message}`}
                                style={{ '--tilt': message.rotation }}
                            >
                                <p>{message.message}</p>
                                <span>{message.name}</span>
                                <small className="admin-message-status">{isVisible ? 'Visible' : 'Hidden'}</small>
                                <div>
                                    <button
                                        type="button"
                                        disabled={!message.id || actionId === `visibility-${message.id}`}
                                        onClick={() => toggleVisibility(message)}
                                    >
                                        <CheckCircle2 size={17} aria-hidden="true" />
                                        {isVisible ? 'Hide' : 'Show'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!message.id || actionId === `delete-${message.id}`}
                                        onClick={() => deleteMessage(message)}
                                    >
                                        <Trash2 size={17} aria-hidden="true" />
                                        Delete
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <AdminEmptyState icon={MessageSquareText} title="No messages yet">
                    Belum ada pesan masuk dari halaman publik.
                </AdminEmptyState>
            )}
        </section>
    );
}

function MusicPanel({ bestMoment, onChanged, siteSettings, token }) {
    const [form, setForm] = useState(createMusicSettingsForm(siteSettings));
    const [formStatus, setFormStatus] = useState('idle');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        setForm(createMusicSettingsForm(siteSettings));
    }, [siteSettings.music?.url]);

    function updateForm(event) {
        const { name, value } = event.target;

        setFormStatus('idle');
        setFormError('');
        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function submitForm(event) {
        event.preventDefault();
        setFormStatus('saving');
        setFormError('');

        try {
            await updateAdminSettings(
                token,
                createSettingsPayload(siteSettings, bestMoment, {
                    background_music_url: form.background_music_url.trim() || null,
                }),
            );
            await onChanged?.();
            setFormStatus('saved');
        } catch (error) {
            setFormStatus('idle');
            setFormError(resolveFormError(error));
        }
    }

    return (
        <section className="admin-panel">
            <PanelHeader
                title="Music Background"
                description="Atur lagu yang muncul lewat tombol Play Memory di kanan bawah halaman publik."
            />

            <div className="admin-music-layout">
                <form className="admin-form-card" onSubmit={submitForm}>
                    <h3>Audio Settings</h3>
                    <div className="admin-field-stack">
                        <span className="admin-field-label">Audio File</span>
                        <UploadField
                            accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4"
                            currentUrl={form.background_music_url}
                            kind="audio"
                            label="Upload audio"
                            token={token}
                            onClear={() => setForm((current) => ({ ...current, background_music_url: '' }))}
                            onUploaded={(url) => setForm((current) => ({ ...current, background_music_url: url }))}
                        />
                    </div>
                    {formError ? <p className="admin-form-error">{formError}</p> : null}
                    {formStatus === 'saved' ? <p className="admin-form-success">Music saved.</p> : null}
                    <div className="admin-link-form-actions">
                        <button className="admin-action-button" type="submit" disabled={formStatus === 'saving'}>
                            <Volume2 size={18} aria-hidden="true" />
                            {formStatus === 'saving' ? 'Saving...' : 'Save Music'}
                        </button>
                    </div>
                </form>

                <aside className="admin-music-preview">
                    <p className="archive-kicker">Public Button Preview</p>
                    <button type="button">
                        <Volume2 size={18} aria-hidden="true" />
                        {siteSettings.music.title}
                    </button>
                    <p>{form.background_music_url ? formatMediaName(form.background_music_url) : 'No audio uploaded yet.'}</p>
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
        links: mappedLinks,
        moments: mappedMoments,
        members: mappedMembers,
        messages: mappedMessages,
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

function createEmptyCategoryForm() {
    return {
        name: '',
        slug: '',
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

function createEmptyMemberForm() {
    return {
        name: '',
        nickname: '',
        role: '',
        quote: '',
        photo_url: '',
        instagram_url: '',
        fun_fact: '',
        sort_order: '0',
    };
}

function createSiteSettingsForm(siteSettings) {
    return {
        site_title: siteSettings.title ?? fallbackSiteSettings.title,
        tagline: siteSettings.tagline ?? '',
    };
}

function createVideoSettingsForm(bestMoment) {
    return {
        best_moment_title: bestMoment.title ?? '',
        best_moment_description: bestMoment.description ?? '',
        best_moment_video_url: bestMoment.videoUrl ?? '',
    };
}

function createMusicSettingsForm(siteSettings) {
    return {
        background_music_url: siteSettings.music?.url ?? '',
    };
}

function createSettingsPayload(siteSettings, bestMoment, overrides = {}) {
    return {
        site_title: siteSettings.title ?? fallbackSiteSettings.title,
        tagline: siteSettings.tagline ?? null,
        best_moment_title: bestMoment.title ?? null,
        best_moment_description: bestMoment.description ?? null,
        best_moment_video_url: bestMoment.videoUrl || null,
        background_music_url: siteSettings.music?.url || null,
        ...overrides,
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
