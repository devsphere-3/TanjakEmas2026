import logoWebp from './assets/TanjakEmas_logo.webp';

export default function PaymentSuccess() {
  const params = new URLSearchParams(window.location.search);
  const school = params.get('school') ?? 'Pangkalan';
  const votes  = params.get('votes')  ?? '1';
  const amount = Number(params.get('amount') ?? 0);

  return (
    <div className="result-page">
      <div className="result-particles" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="result-particle" style={{ '--i': i }} />
        ))}
      </div>

      <div className="result-card">
        <img src={logoWebp} alt="Tanjak Emas" className="result-logo" draggable={false} />

        <div className="result-icon result-icon--success" aria-hidden="true">
          <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 27l8 8 16-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="result-body">
          <p className="result-eyebrow">Pembayaran Berhasil</p>
          <h1 className="result-title">Suara Tercatat</h1>
          <p className="result-desc">
            Terima kasih telah memberikan dukunganmu. Suaramu sudah resmi tercatat untuk:
          </p>

          <div className="result-detail-card">
            <div className="result-detail-row">
              <span>Pangkalan</span>
              <strong>{school}</strong>
            </div>
            <div className="result-detail-row">
              <span>Jumlah suara</span>
              <strong>{votes} suara</strong>
            </div>
            {amount > 0 && (
              <div className="result-detail-row">
                <span>Total bayar</span>
                <strong>Rp {amount.toLocaleString('id-ID')}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="result-actions">
          <a href="/" className="result-btn result-btn--primary">
            Kembali ke Dashboard
          </a>
          <a href="/" className="result-btn result-btn--ghost">
            Tambah Suara Lagi
          </a>
        </div>

        <p className="result-footer">Tanjak Emas 2026 &mdash; Badang Perkasa</p>
      </div>
    </div>
  );
}
