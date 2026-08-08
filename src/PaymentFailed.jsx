import logoWebp from './assets/TanjakEmas_logo.webp';

export default function PaymentFailed() {
  const params = new URLSearchParams(window.location.search);
  const reason = params.get('reason') ?? 'Pembayaran tidak dapat diproses.';

  return (
    <div className="result-page">
      <div className="result-card">
        <img src={logoWebp} alt="Tanjak Emas" className="result-logo" draggable={false} />

        <div className="result-icon result-icon--failed" aria-hidden="true">
          <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M18 18l16 16M34 18L18 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="result-body">
          <p className="result-eyebrow result-eyebrow--failed">Pembayaran Gagal</p>
          <h1 className="result-title">Transaksi Tidak Berhasil</h1>
          <p className="result-desc">
            Suaramu belum tercatat. Kamu bisa mencoba kembali atau pilih metode pembayaran lain.
          </p>

          <div className="result-detail-card result-detail-card--failed">
            <div className="result-detail-row">
              <span>Keterangan</span>
              <strong>{reason}</strong>
            </div>
          </div>
        </div>

        <div className="result-actions">
          <a href="/" className="result-btn result-btn--primary">
            Coba Lagi
          </a>
          <a href="/" className="result-btn result-btn--ghost">
            Kembali ke Dashboard
          </a>
        </div>

        <p className="result-footer">Tanjak Emas 2026 &mdash; Badang Perkasa</p>
      </div>
    </div>
  );
}
