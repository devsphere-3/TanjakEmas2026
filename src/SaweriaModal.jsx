const SAWERIA_URL = 'https://saweria.co/PramukaBadangPerkasa';
const POINT_RATE  = 1000; // Rp 1.000 = 1 poin

export default function SaweriaModal({ school, onClose }) {
  if (!school) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label="Panduan donasi">

        <button className="modal-close" onClick={onClose} aria-label="Tutup">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-header">
          <p className="modal-eyebrow">Cara Memberi Dukungan</p>
          <h2 className="modal-title">Donasi via Saweria</h2>
        </div>

        <div className="modal-selected-school">
          <span>Pangkalan dipilih</span>
          <strong>{school.name}</strong>
        </div>

        <div className="modal-rate-badge">
          Rp 1.000 = 1 Poin
        </div>

        <ol className="modal-steps">
          <li>
            <span className="step-num">1</span>
            <div>
              <strong>Buka halaman donasi Saweria</strong>
              <p>Klik tombol di bawah untuk membuka halaman donasi Saweria Badang Perkasa.</p>
            </div>
          </li>
          <li>
            <span className="step-num">2</span>
            <div>
              <strong>Isi nama pangkalan di kolom komentar</strong>
              <p>
                Wajib tulis nama pangkalan pilihanmu di kolom komentar/pesan agar panitia bisa
                menambahkan poin ke sekolah yang benar.
              </p>
              <div className="modal-copy-box">
                <code>{school.name}</code>
                <button
                  className="modal-copy-btn"
                  onClick={() => navigator.clipboard?.writeText(school.name)}
                >
                  Salin
                </button>
              </div>
            </div>
          </li>
          <li>
            <span className="step-num">3</span>
            <div>
              <strong>Selesaikan donasi</strong>
              <p>
                Poin akan ditambahkan oleh panitia setelah pembayaran terverifikasi.
                Setiap Rp 1.000 bernilai 1 poin.
              </p>
            </div>
          </li>
        </ol>

        <a
          href={SAWERIA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="modal-saweria-btn"
        >
          Buka Halaman Saweria
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
          </svg>
        </a>

        <p className="modal-note">
          Poin hanya akan ditambahkan setelah panitia memverifikasi donasi kamu.
        </p>
      </div>
    </div>
  );
}
