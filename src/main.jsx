import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import SplashScreen from './SplashScreen';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import PenampilanPage from './PenampilanPage';
import MaintenanceOverlay from './MaintenanceOverlay';
import './index.css';

const path = window.location.pathname;

// Admin tidak kena maintenance overlay — panitia tetap bisa bekerja
const isAdminRoute = path === '/admin' || path === '/admin-login';

// ── Halaman Admin ─────────────────────────────────────────────────────────────
if (path === '/admin' || path === '/admin-login') {
  function AdminRoot() {
    const [admin, setAdmin] = useState(() => {
      try {
        const saved = sessionStorage.getItem('admin_session');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    });

    const handleLogin = (adminData) => setAdmin(adminData);

    const handleLogout = () => {
      sessionStorage.removeItem('admin_session');
      setAdmin(null);
    };

    if (!admin) return <AdminLogin onLogin={handleLogin} />;
    return <AdminPanel admin={admin} onLogout={handleLogout} />;
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode><AdminRoot /><Analytics /></React.StrictMode>
  );

// ── Halaman Penampilan Tim ────────────────────────────────────────────────────
} else if (path === '/penampilan') {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      {!isAdminRoute && <MaintenanceOverlay />}
      <PenampilanPage />
      <Analytics />
    </React.StrictMode>
  );

// ── Halaman Payment Result ────────────────────────────────────────────────────
} else if (path === '/payment-success') {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      {!isAdminRoute && <MaintenanceOverlay />}
      <PaymentSuccess />
      <Analytics />
    </React.StrictMode>
  );

} else if (path === '/payment-failed') {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      {!isAdminRoute && <MaintenanceOverlay />}
      <PaymentFailed />
      <Analytics />
    </React.StrictMode>
  );

// ── Dashboard utama dengan splash ─────────────────────────────────────────────
} else {
  function Root() {
    const [splashDone, setSplashDone] = useState(false);
    return (
      <>
        <MaintenanceOverlay />
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
        <div style={splashDone ? undefined : { visibility: 'hidden', pointerEvents: 'none' }}>
          <App />
        </div>
        <Analytics />
      </>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode><Root /></React.StrictMode>
  );
}
