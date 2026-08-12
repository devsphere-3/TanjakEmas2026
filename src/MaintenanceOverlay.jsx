// ─── Toggle maintenance ───────────────────────────────────────────────────────
// true  = website ditutup (tampilkan overlay)
// false = website terbuka normal
export const MAINTENANCE_MODE = false;

// ─────────────────────────────────────────────────────────────────────────────

export default function MaintenanceOverlay() {
  if (!MAINTENANCE_MODE) return null;

  return (
    <div className="maint-overlay" role="dialog" aria-modal="true" aria-label="Halaman sedang maintenance">

      {/* Partikel latar */}
      <div className="maint-particles" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="maint-particle" style={{ '--i': i + 1 }} />
        ))}
      </div>

      {/* Card */}
      <div className="maint-card">

        <div className="maint-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
            width="52" height="52">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.77 3.77z" />
          </svg>
        </div>

        <p className="maint-eyebrow">Tanjak Emas 2026</p>
        <h1 className="maint-title">Sedang Maintenance</h1>
        <p className="maint-desc">
          Kami sedang melakukan pemeliharaan sistem untuk pengalaman yang lebih baik.
          Halaman akan segera kembali aktif.
        </p>

        <p className="maint-note">Terima kasih atas kesabaran Anda. 🙏</p>
      </div>
    </div>
  );
}
