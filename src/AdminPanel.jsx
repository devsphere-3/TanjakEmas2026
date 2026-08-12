import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase.js';
import logoWebp from './assets/TanjakEmas_logo.webp';

const CAT_MAP = {
  sdmi:    'SD/MI',
  smpmts:  'SMP/MTs',
  sma:     'SMA/MA/SMK',
  terpadu: 'Pangkalan Terpadu',
};

const TABS = [
  { id: 'points', label: 'Kelola Poin' },
  { id: 'logs',   label: 'Log Aktivitas' },
  { id: 'admins', label: 'Kelola Admin' },
];

export default function AdminPanel({ admin, onLogout }) {
  const [activeTab, setActiveTab]       = useState('points');
  const [schools, setSchools]           = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [activeCat, setActiveCat]       = useState('sdmi');
  const [search, setSearch]             = useState('');
  const [selectedId, setSelectedId]     = useState('');
  const [pointInput, setPointInput]     = useState('');
  const [note, setNote]                 = useState('');
  const [action, setAction]             = useState('add');
  const [submitting, setSubmitting]     = useState(false);
  const [feedback, setFeedback]         = useState(null);

  const [logs, setLogs]                 = useState([]);
  const [logsLoading, setLogsLoading]   = useState(false);
  const [logFilter, setLogFilter]       = useState('');

  const [admins, setAdmins]             = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [newUsername, setNewUsername]   = useState('');
  const [newPassword, setNewPassword]   = useState('');
  const [adminFeedback, setAdminFeedback] = useState(null);
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  // ── Fetch schools ─────────────────────────────────────────────────────────
  const fetchSchools = useCallback(async () => {
    setSchoolsLoading(true);
    const { data, error } = await supabase
      .from('votes')
      .select('id, school_name, category, vote_count');
    if (!error) {
      // Sort: group by category prefix, lalu by nomor index (numerik)
      const catOrder = { 'sdmi': 0, 'smpmts': 1, 'sma': 2, 'terpadu': 3 };
      const sorted = (data ?? []).sort((a, b) => {
        const [aCat, aNum] = a.id.split('-');
        const [bCat, bNum] = b.id.split('-');
        const catDiff = (catOrder[aCat] ?? 99) - (catOrder[bCat] ?? 99);
        if (catDiff !== 0) return catDiff;
        return Number(aNum) - Number(bNum);
      });
      setSchools(sorted);
    }
    setSchoolsLoading(false);
  }, []);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  // ── Realtime votes ────────────────────────────────────────────────────────
  useEffect(() => {
    const ch = supabase.channel('admin-votes-rt')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'votes' },
        (p) => setSchools((prev) =>
          prev.map((s) => s.id === p.new.id ? { ...s, vote_count: p.new.vote_count } : s)
        ))
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  // ── Fetch logs ────────────────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    const { data } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    setLogs(data ?? []);
    setLogsLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab, fetchLogs]);

  // Realtime log
  useEffect(() => {
    const ch = supabase.channel('admin-logs-rt')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_logs' },
        (p) => setLogs((prev) => [p.new, ...prev].slice(0, 100)))
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  // ── Fetch admins ──────────────────────────────────────────────────────────
  const fetchAdmins = useCallback(async () => {
    setAdminsLoading(true);
    const { data } = await supabase
      .from('admins')
      .select('id, username, role, created_at')
      .order('created_at', { ascending: true });
    setAdmins(data ?? []);
    setAdminsLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'admins') fetchAdmins();
  }, [activeTab, fetchAdmins]);

  // ── Submit poin ───────────────────────────────────────────────────────────
  const handleSubmitPoints = async (e) => {
    e.preventDefault();
    setFeedback(null);
    if (!selectedId) { setFeedback({ type: 'err', msg: 'Pilih sekolah terlebih dahulu.' }); return; }
    const points = Number(pointInput);
    if (action !== 'reset' && (!Number.isInteger(points) || points <= 0)) {
      setFeedback({ type: 'err', msg: 'Jumlah poin harus bilangan bulat positif.' }); return;
    }
    const school = schools.find((s) => s.id === selectedId);
    if (!school) return;
    setSubmitting(true);
    try {
      const newCount =
        action === 'add'      ? school.vote_count + points :
        action === 'subtract' ? Math.max(0, school.vote_count - points) : 0;

      const { error: uErr } = await supabase
        .from('votes').update({ vote_count: newCount }).eq('id', selectedId);
      if (uErr) throw new Error(uErr.message);

      await supabase.from('admin_logs').insert({
        admin_username: admin.username,
        school_id:      selectedId,
        school_name:    school.school_name,
        action,
        points_changed: action === 'reset' ? school.vote_count : points,
        note:           note.trim() || null,
      });

      setFeedback({ type: 'ok', msg: `Berhasil — ${school.school_name} sekarang ${newCount} poin.` });
      setPointInput(''); setNote('');
      // Update state lokal langsung tanpa tunggu realtime
      setSchools((prev) =>
        prev.map((s) => s.id === selectedId ? { ...s, vote_count: newCount } : s)
      );
    } catch (err) {
      setFeedback({ type: 'err', msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Tambah admin ──────────────────────────────────────────────────────────
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAdminFeedback(null);
    if (!newUsername.trim() || !newPassword.trim()) {
      setAdminFeedback({ type: 'err', msg: 'Username dan password wajib diisi.' }); return;
    }
    if (newPassword.length < 6) {
      setAdminFeedback({ type: 'err', msg: 'Password minimal 6 karakter.' }); return;
    }
    setAdminSubmitting(true);
    try {
      const { error } = await supabase.rpc('create_admin', {
        p_username: newUsername.trim().toUpperCase(),
        p_password: newPassword,
        p_role: 'admin',
      });
      if (error) throw new Error(error.message);
      setAdminFeedback({ type: 'ok', msg: `Admin ${newUsername.toUpperCase()} berhasil ditambahkan.` });
      setNewUsername(''); setNewPassword('');
      fetchAdmins();
    } catch (err) {
      setAdminFeedback({ type: 'err', msg: err.message });
    } finally {
      setAdminSubmitting(false);
    }
  };

  // ── Hapus admin ───────────────────────────────────────────────────────────
  const handleDeleteAdmin = async (id, username) => {
    if (!window.confirm(`Hapus admin "${username}"?`)) return;
    const { error } = await supabase.rpc('delete_admin', { p_id: id });
    if (error) { alert(error.message); return; }
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const filteredSchools = schools.filter((s) =>
    s.category === CAT_MAP[activeCat] &&
    (search.trim() === '' || s.school_name.toLowerCase().includes(search.toLowerCase()))
  );
  const selectedSchool = schools.find((s) => s.id === selectedId);
  const filteredLogs = logFilter
    ? logs.filter((l) => l.admin_username.toLowerCase().includes(logFilter.toLowerCase()))
    : logs;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <img src={logoWebp} alt="logo" className="admin-nav-logo" />
          <div>
            <p className="admin-nav-title">Admin Panel</p>
            <p className="admin-nav-sub">Tanjak Emas 2026</p>
          </div>
        </div>
        <div className="admin-header-right">
          <span className="admin-badge">{admin.role === 'master' ? 'Master' : 'Admin'}</span>
          <span className="admin-username">{admin.username}</span>
          <button className="admin-logout-btn" onClick={onLogout}>Keluar</button>
        </div>
      </header>

      {/* Tab navigasi */}
      <div className="admin-tabs-nav">
        {TABS.filter((t) => t.id !== 'admins' || admin.role === 'master').map((t) => (
          <button
            key={t.id}
            className={activeTab === t.id ? 'admin-tab-btn active' : 'admin-tab-btn'}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB: KELOLA POIN ═══ */}
      {activeTab === 'points' && (
        <div className="admin-body">
          <aside className="admin-sidebar">
            <div className="admin-cat-tabs">
              {Object.entries(CAT_MAP).map(([id, label]) => (
                <button
                  key={id}
                  className={activeCat === id ? 'admin-cat-btn active' : 'admin-cat-btn'}
                  onClick={() => { setActiveCat(id); setSelectedId(''); setFeedback(null); }}
                >{label}</button>
              ))}
            </div>
            <div className="admin-search">
              <input type="search" placeholder="Cari sekolah..." value={search}
                onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="admin-school-list">
              {schoolsLoading
                ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton admin-school-skeleton" />)
                : filteredSchools.length === 0
                  ? <p className="admin-empty">Tidak ada data.</p>
                  : filteredSchools.map((s) => (
                      <button
                        key={s.id}
                        className={selectedId === s.id ? 'admin-school-item active' : 'admin-school-item'}
                        onClick={() => { setSelectedId(s.id); setFeedback(null); }}
                      >
                        <span className="admin-school-name">{s.school_name}</span>
                        <span className="admin-school-pts">{s.vote_count} pts</span>
                      </button>
                    ))
              }
            </div>
          </aside>

          <main className="admin-main">
            <div className="admin-main-inner">
              {selectedSchool ? (
                <div className="admin-selected-card">
                  <div>
                    <p className="admin-selected-label">Sekolah dipilih</p>
                    <p className="admin-selected-name">{selectedSchool.school_name}</p>
                    <p className="admin-selected-cat">{selectedSchool.category}</p>
                  </div>
                  <div className="admin-selected-pts">
                    <span>{selectedSchool.vote_count}</span>
                    <small>pts saat ini</small>
                  </div>
                </div>
              ) : (
                <div className="admin-empty-select">Pilih sekolah dari daftar untuk mengelola poin.</div>
              )}

              <form className="admin-form" onSubmit={handleSubmitPoints}>
                <h2 className="admin-form-title">Kelola Poin</h2>
                <div className="admin-action-tabs">
                  {[{val:'add',label:'Tambah'},{val:'subtract',label:'Kurangi'},{val:'reset',label:'Reset ke 0'}].map(({val,label}) => (
                    <button key={val} type="button"
                      className={action === val ? `admin-action-btn active action-${val}` : `admin-action-btn action-${val}`}
                      onClick={() => setAction(val)}
                    >{label}</button>
                  ))}
                </div>

                {action !== 'reset' && (
                  <div className="admin-field">
                    <label>Jumlah Poin</label>
                    <input type="number" min="1" value={pointInput}
                      onChange={(e) => setPointInput(e.target.value.replace(/\D/g,''))}
                      placeholder="Contoh: 5  (Rp 5.000 = 5 poin)" />
                    {pointInput && (
                      <p className="admin-field-hint">
                        Setara Rp {(Number(pointInput)*1000).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                )}

                <div className="admin-field">
                  <label>Catatan <span className="optional">(opsional)</span></label>
                  <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
                    placeholder="Misal: Donasi Saweria 12:30 — Budi" />
                </div>

                {feedback && (
                  <div className={feedback.type === 'ok' ? 'admin-feedback ok' : 'admin-feedback err'}>
                    {feedback.msg}
                  </div>
                )}

                <button type="submit" className="admin-submit-btn"
                  disabled={submitting || !selectedId}>
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            </div>
          </main>
        </div>
      )}

      {/* ═══ TAB: LOG AKTIVITAS ═══ */}
      {activeTab === 'logs' && (
        <div className="admin-log-page">
          <div className="admin-log-toolbar">
            <h2 className="admin-form-title" style={{margin:0}}>Log Aktivitas</h2>
            <input type="search" placeholder="Filter username admin..."
              value={logFilter} onChange={(e) => setLogFilter(e.target.value)}
              className="admin-log-filter-input" />
            <button className="admin-log-refresh" onClick={fetchLogs}>Refresh</button>
          </div>

          {logsLoading ? (
            <div className="admin-log-list">
              {Array.from({length:8}).map((_,i) => <div key={i} className="skeleton" style={{height:56,borderRadius:12}} />)}
            </div>
          ) : filteredLogs.length === 0 ? (
            <p className="admin-empty">Belum ada aktivitas.</p>
          ) : (
            <div className="admin-log-list">
              {filteredLogs.map((log) => (
                <div key={log.id} className="admin-log-item">
                  <div className="admin-log-left">
                    <span className={`admin-log-action action-${log.action}`}>
                      {log.action === 'add' ? '+' : log.action === 'subtract' ? '-' : '0'}
                      {log.action !== 'reset' ? ` ${log.points_changed} pts` : ' Reset'}
                    </span>
                    <div>
                      <p className="admin-log-school">{log.school_name}</p>
                      {log.note && <p className="admin-log-note">{log.note}</p>}
                    </div>
                  </div>
                  <div className="admin-log-right">
                    <span className="admin-log-who">{log.admin_username}</span>
                    <small>{new Date(log.created_at).toLocaleString('id-ID')}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* ═══ TAB: KELOLA ADMIN (master only) ═══ */}
      {activeTab === 'admins' && admin.role === 'master' && (
        <div className="admin-log-page">

          {/* Form tambah admin */}
          <form className="admin-form" style={{ maxWidth: 480 }} onSubmit={handleAddAdmin}>
            <h2 className="admin-form-title">Tambah Admin Baru</h2>

            <div className="admin-field">
              <label>Username</label>
              <input type="text" value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Contoh: PANITIA01" />
            </div>

            <div className="admin-field">
              <label>Password</label>
              <input type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter" />
            </div>

            {adminFeedback && (
              <div className={adminFeedback.type === 'ok' ? 'admin-feedback ok' : 'admin-feedback err'}>
                {adminFeedback.msg}
              </div>
            )}

            <button type="submit" className="admin-submit-btn" disabled={adminSubmitting}>
              {adminSubmitting ? 'Menyimpan...' : 'Tambah Admin'}
            </button>
          </form>

          {/* Daftar admin */}
          <div style={{ marginTop: 28 }}>
            <h2 className="admin-form-title" style={{ marginBottom: 14 }}>Daftar Admin</h2>

            {adminsLoading ? (
              <p className="admin-empty">Memuat...</p>
            ) : (
              <div className="admin-admins-list">
                {admins.map((a) => (
                  <div key={a.id} className="admin-admin-item">
                    <div className="admin-admin-info">
                      <span className="admin-admin-name">{a.username}</span>
                      <span className={a.role === 'master' ? 'admin-badge' : 'admin-badge admin-badge--regular'}>
                        {a.role === 'master' ? 'Master' : 'Admin'}
                      </span>
                    </div>
                    <div className="admin-admin-meta">
                      <small>Dibuat: {new Date(a.created_at).toLocaleDateString('id-ID')}</small>
                      {a.role !== 'master' && (
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDeleteAdmin(a.id, a.username)}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
