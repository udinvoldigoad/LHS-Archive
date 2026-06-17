import { useState } from 'react';
import Home from './pages/Home.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { clearAdminToken, logoutAdmin, readAdminToken, storeAdminToken } from './services/api.js';

export default function App() {
    const [adminToken, setAdminToken] = useState(readAdminToken);

    function handleAdminLogin(token) {
        storeAdminToken(token);
        setAdminToken(token);
    }

    async function handleAdminLogout() {
        const token = adminToken;
        clearAdminToken();
        setAdminToken('');

        try {
            await logoutAdmin(token);
        } catch {
            // Token cleanup in the browser is enough if the API is unreachable.
        }
    }

    if (window.location.pathname.startsWith('/admin')) {
        return adminToken ? (
            <AdminDashboard token={adminToken} onLogout={handleAdminLogout} />
        ) : (
            <AdminLogin onLogin={handleAdminLogin} />
        );
    }

    return <Home />;
}
