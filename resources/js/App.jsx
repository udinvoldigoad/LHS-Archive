import { lazy, Suspense, useState } from 'react';
import Home from './pages/Home.jsx';
import { clearAdminToken, logoutAdmin, readAdminToken, storeAdminToken } from './services/api.js';

const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

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
        return (
            <Suspense fallback={<div className="route-loading">Loading admin...</div>}>
                {adminToken ? (
                    <AdminDashboard token={adminToken} onLogout={handleAdminLogout} />
                ) : (
                    <AdminLogin onLogin={handleAdminLogin} />
                )}
            </Suspense>
        );
    }

    return <Home />;
}
