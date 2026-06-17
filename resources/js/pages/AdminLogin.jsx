import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck, Terminal, UserRound } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import MusicToggle from '../components/MusicToggle.jsx';
import { heroPhotos, siteSettings } from '../data/archiveData.js';
import { loginAdmin } from '../services/api.js';

export default function AdminLogin({ onLogin }) {
    const [form, setForm] = useState({
        username: 'admin',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!form.password.trim()) {
            setStatus('empty');
            return;
        }

        setIsSubmitting(true);
        setStatus('loading');

        try {
            const response = await loginAdmin(form.password);
            setStatus('ready');
            onLogin?.(response.token);
        } catch (error) {
            setStatus(error.status === 422 ? 'mismatch' : 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    const statusMessage = {
        empty: 'Password belum diisi. Arsipnya masih pura-pura terkunci.',
        loading: 'Lagi cek kunci admin ke backend...',
        mismatch: 'Password admin belum cocok.',
        error: 'Login gagal. Cek server Laravel atau koneksi API dulu.',
        ready: 'Gate admin siap. Masuk ke dashboard.',
    }[status];

    return (
        <div className="site-shell admin-shell">
            <Navbar title={siteSettings.title} />

            <main className="admin-login-page" aria-labelledby="admin-login-title">
                <div className="admin-login-polaroids" aria-hidden="true">
                    {heroPhotos.slice(0, 3).map((photo, index) => (
                        <div className={`admin-login-polaroid admin-login-polaroid-${index + 1}`} key={photo.src}>
                            <img src={photo.src} alt="" decoding="async" />
                        </div>
                    ))}
                </div>

                <section className="admin-login-card">
                    <a className="admin-back-link" href="/#archive">
                        <ArrowLeft size={16} aria-hidden="true" />
                        Back to Archive
                    </a>

                    <div className="admin-login-mark" aria-hidden="true">
                        <LockKeyhole size={24} />
                    </div>

                    <p className="archive-kicker">Restricted Memory Room</p>
                    <h1 id="admin-login-title">Admin Login</h1>
                    <p className="admin-login-copy">
                        Pintu kecil buat kurator arsip: upload link, foto, member, pesan, dan video best moment nanti
                        lewat sini.
                    </p>

                    <form className="admin-login-form" onSubmit={handleSubmit}>
                        <label htmlFor="admin-username">
                            <span>Username</span>
                            <div className="admin-input-shell">
                                <UserRound size={18} aria-hidden="true" />
                                <input
                                    id="admin-username"
                                    name="username"
                                    type="text"
                                    value={form.username}
                                    onChange={updateField}
                                    autoComplete="username"
                                />
                            </div>
                        </label>

                        <label htmlFor="admin-password">
                            <span>Password</span>
                            <div className="admin-input-shell">
                                <LockKeyhole size={18} aria-hidden="true" />
                                <input
                                    id="admin-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={updateField}
                                    placeholder="Masukkan password admin"
                                    autoComplete="current-password"
                                />
                                <button
                                    className="admin-password-toggle"
                                    type="button"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                                </button>
                            </div>
                        </label>

                        {statusMessage ? (
                            <p className={`admin-login-status admin-login-status-${status}`} role="status">
                                {statusMessage}
                            </p>
                        ) : null}

                        <button className="archive-button archive-button-primary admin-submit" type="submit">
                            <ShieldCheck size={18} aria-hidden="true" />
                            {isSubmitting ? 'Checking...' : 'Unlock Archive'}
                        </button>
                    </form>

                    <p className="admin-login-note">
                        <Terminal size={16} aria-hidden="true" />
                        Production sebaiknya pakai <strong>ADMIN_PASSWORD_HASH</strong> di backend.
                    </p>
                </section>

                <aside className="admin-login-memo" aria-label="Admin roadmap">
                    <p className="archive-kicker">Next Admin Concept</p>
                    <h2>Belum auth beneran, tapi tempatnya sudah disiapkan.</h2>
                    <ul>
                        <li>Password hash dari env backend.</li>
                        <li>Token sederhana untuk akses dashboard.</li>
                        <li>Form CRUD untuk link, foto, member, pesan, dan best moment.</li>
                    </ul>
                </aside>
            </main>

            <Footer />
            <MusicToggle music={siteSettings.music} />
        </div>
    );
}
