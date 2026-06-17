import { useState } from 'react';
import Home from './pages/Home.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function readAdminSession() {
    try {
        return window.sessionStorage.getItem('lhs-admin-unlocked') === 'true';
    } catch {
        return false;
    }
}

export default function App() {
    const [adminUnlocked, setAdminUnlocked] = useState(readAdminSession);

    function handleAdminLogin() {
        try {
            window.sessionStorage.setItem('lhs-admin-unlocked', 'true');
        } catch {
            // The dashboard can still open for this tab if storage is blocked.
        }

        setAdminUnlocked(true);
    }

    function handleAdminLogout() {
        try {
            window.sessionStorage.removeItem('lhs-admin-unlocked');
        } catch {
            // Ignore storage access failures.
        }

        setAdminUnlocked(false);
    }

    if (window.location.pathname.startsWith('/admin')) {
        return adminUnlocked ? <AdminDashboard onLogout={handleAdminLogout} /> : <AdminLogin onLogin={handleAdminLogin} />;
    }

    return <Home />;
}
