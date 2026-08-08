import { useState } from 'react';
import { supabase } from './supabase.js';
import logoWebp from './assets/TanjakEmas_logo.webp';

// Bcrypt-compatible check via simple hash stored in Supabase
// Kita pakai pendekatan: username + password di-check via RPC supabase
// Password di-hash di sisi server (SQL function)

export default function AdminLogin({ onLogin }) {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Panggil RPC yang memverifikasi password di sisi database
      const { data, error: rpcError } = await supabase
        .rpc('verify_admin_login', {
          p_username: username.trim().toUpperCase(),
          p_password: password,
        });

      if (rpcError) throw new Error(rpcError.message);

      if (!data || data.length === 0) {
        setError('Username atau password salah.');
        setLoading(false);
        return;
      }

      const admin = data[0];
      // Simpan sesi di sessionStorage
      sessionStorage.setItem('admin_session', JSON.stringify({
        id: admin.id,
        username: admin.username,
        role: admin.role,
      }));

      onLogin(admin);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <img src={logoWebp} alt="Tanjak Emas" className="admin-login-logo" draggable={false} />

        <div className="admin-login-header">
          <p className="admin-login-eyebrow">Tanjak Emas 2026</p>
          <h1 className="admin-login-title">Admin Panel</h1>
          <p className="admin-login-sub">Masuk untuk mengelola poin pangkalan</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              autoComplete="username"
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Memverifikasi...' : 'Masuk'}
          </button>
        </form>

        <p className="admin-login-back">
          <a href="/">Kembali ke Dashboard</a>
        </p>
      </div>
    </div>
  );
}
