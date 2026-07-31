import { useEffect, useState } from 'react';
import logoWebp from './assets/TanjakEmas_logo.webp';

// Durasi minimum splash ditampilkan (ms)
const SPLASH_DURATION = 3200;

export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Setelah SPLASH_DURATION, mulai fade-out
    const timer = setTimeout(() => setFading(true), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // Saat transisi fade-out selesai, panggil onDone
  const handleTransitionEnd = () => {
    if (fading) onDone();
  };

  return (
    <div
      className={fading ? 'splash splash-exit' : 'splash'}
      onTransitionEnd={handleTransitionEnd}
    >
      {/* Partikel mengambang */}
      <div className="splash-particles" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="splash-particle" style={{ '--i': i }} />
        ))}
      </div>

      {/* Konten tengah */}
      <div className="splash-content">
        <div className="splash-logo-wrap">
          <img
            src={logoWebp}
            alt="Tanjak Emas 2026"
            className="splash-logo"
            draggable={false}
          />
        </div>

        <div className="splash-text">
          <p className="splash-eyebrow">Pangkalan Terfavorit</p>
          <h1 className="splash-title">Tanjak Emas 2026</h1>
          <p className="splash-sub">Perhelatan Jawara Pramuka Emas</p>
        </div>

        <div className="splash-bar-track" aria-hidden="true">
          <div className="splash-bar-fill" />
        </div>
        <p className="splash-loading-text">Memuat...</p>
      </div>
    </div>
  );
}
