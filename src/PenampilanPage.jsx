import { useState } from 'react';
import logoWebp from './assets/TanjakEmas_logo.webp';

// ─── Data lengkap semua sekolah ──────────────────────────────────────────────
// Isi videoId saat peserta mengirimkan video.
// Format: videoId: 'ID_YOUTUBE' (dari URL: youtube.com/watch?v=ID_YOUTUBE)
// Kosongkan dengan '' jika belum tersedia.

const penampilanData = {
  sdmi: {
    label: 'SD/MI',
    schools: [
      'MI Miftahul Huda Pandantoyo, Nganjuk, Jawa Timur',
      'MI Negeri 1 Trenggalek, Jawa Timur',
      'MINU Al Hikmah Tajinan, Kab. Malang, Jawa Timur',
      'MI Sunan Pandanaran, Sleman, DI Yogyakarta',
      'SD AL ARAF ISLAMIC SCHOOL',
      'SD Ibrahimy, Sumenep, Jawa Timur',
      'SD Islam Salafiyah, Kab. Malang, Jawa Timur',
      'SD Negeri 2 Pakisjajar, Kab. Malang, Jawa Timur',
      'SD Negeri 4 Reno Basuki, Lampung Tengah, Lampung',
      'SD Negeri Jurang Mangu Barat 01, Tangerang Selatan, Banten',
      'SDIT Nur El Qolam, Serang, Banten',
    ],
    yelYel: {},       // { schoolName: 'videoId' }
    semaphoreDance: {},
  },
  smpmts: {
    label: 'SMP/MTs',
    schools: [
      'MTs Islamiyah Nguwok, Lamongan, Jawa Timur',
      'MTs Negeri 1 Jepara, Jawa Tengah',
      'MTs Negeri 1 Kab. Madiun, Jawa Timur',
      'MTs Negeri 2 Madiun, Jawa Timur',
      'MTs Negeri 2 Nganjuk, Jawa Timur',
      'MTs Negeri 2 Pekanbaru, Riau',
      'MTs Negeri 6 Cirebon, Jawa Barat',
      'MTs Surya Buana, Malang, Jawa Timur',
      'MTs Wali Songo, Melaya, Jembrana, Bali',
      'SMP ABBS, Surakarta, Jawa Tengah',
      'SMP An Nur Al Anwar, Malang, Jawa Timur',
      'SMP Ibrahimy, Sumenep, Jawa Timur',
      'SMP Islam Plus Alfatih, Medan, Sumatera Utara',
      'SMP Islam Roushon Fikr, Jombang, Jawa Timur',
      'SMP Islam Teluk Jambe, Karawang, Jawa Barat',
      'SMP IT Cordova, Samarinda, Kalimantan Timur',
      'SMP IT Tahfidzul Quran Ulil Albab, Karanganyar, Jawa Tengah',
      'SMP Negeri 1 Banyuwangi, Jawa Timur',
      'SMP Negeri 1 Batealit, Jepara, Jawa Tengah',
      'SMP Negeri 1 Kertosono, Nganjuk, Jawa Timur',
      'SMP Negeri 1 Ngetos, Nganjuk, Jawa Timur',
      'SMP Negeri 1 Sawa, Konawe Utara, Sulawesi Tenggara',
      'SMP Negeri 11 Pasuruan, Jawa Timur',
      'SMP Negeri 2 Bangil, Pasuruan, Jawa Timur',
      'SMP Negeri 2 Mojo, Kediri, Jawa Timur',
      'SMP Negeri 2 Ngetos, Nganjuk, Jawa Timur',
      'SMP Negeri 2 Taman, Sidoarjo, Jawa Timur',
      'SMP Negeri 3 Purwodadi, Jawa Tengah',
      'SMP Negeri 4 Balikpapan, Kalimantan Timur',
      'SMP Negeri 5 Karawang, Jawa Barat',
      'SMP Negeri 7 Kota Madiun, Jawa Timur',
      'SMP Negeri 7 Surakarta, Jawa Tengah',
      'SMP Negeri 9 Jambi',
      'SMP Negeri 37 Batam, Kepulauan Riau',
      'SMP Negeri 44 Batam, Kepulauan Riau',
      'SMP Negeri Giriyoso, Musi Rawas, Sumatera Selatan',
    ],
    yelYel: {},
    semaphoreDance: {},
  },
  sma: {
    label: 'SMA/MA/SMK',
    schools: [
      'MA Al I\u2019Dadiyyah Bahrul Ulum, Jombang, Jawa Timur',
      'MA Al Khidmah, Ngronggot, Nganjuk, Jawa Timur',
      'MA Negeri 1 Batam, Kepulauan Riau',
      'MA Negeri 1 Magetan, Jawa Timur',
      'MA Negeri 1 Surakarta, Jawa Tengah',
      'MA Negeri 4 Jakarta Selatan, DKI Jakarta',
      'MA Negeri Paser, Kalimantan Timur',
      'MA Nurul Hasan, Melaya, Jembrana, Bali',
      'MAN 2 Tulungagung, Jawa Timur',
      'SAKA Wanabakti Sumba Timur (Penegak), Nusa Tenggara Timur',
      'SMA IT Assyifa Boarding School, Subang, Jawa Barat',
      'SMA IT Darul Quran, Kab. Bogor, Jawa Barat',
      'SMA Negeri 1 Malinau, Kalimantan Utara',
      'SMA Negeri 1 Prambanan, Klaten, Jawa Tengah',
      'SMA Negeri 1 Tanjung Sari, Lampung Selatan, Lampung',
      'SMA Negeri 6 Balikpapan, Kalimantan Timur',
      'SMA S Perintis 1 Bandar Lampung, Lampung',
      'SMA Wawonii Utara, Konawe Kepulauan, Sulawesi Tenggara',
      'SMK Islam Sumedang, Jawa Barat',
      'SMK Negeri 1 Abang, Karangasem, Bali',
      'SMK Negeri 1 Kubutambahan, Buleleng, Bali',
      'SMK Negeri 2 Madiun, Jawa Timur',
      'SMK Negeri 19 Jakarta Pusat, DKI Jakarta',
      'SMK Negeri 68 Jakarta',
      'SMK Syubbanul Wathon, Secang, Magelang, Jawa Tengah',
      'SMK Yadika 2 Grogol Petamburan, Jakarta Barat, DKI Jakarta',
    ],
    yelYel: {},
    semaphoreDance: {},
  },
  terpadu: {
    label: 'Pangkalan Terpadu',
    schools: [
      'Pesantren Terpadu Darrutaqwa, Kab. Bogor, Jawa Barat',
    ],
    yelYel: {},
    semaphoreDance: {},
  },
};

const KATEGORI_TABS = [
  { id: 'sdmi',    label: 'SD/MI' },
  { id: 'smpmts',  label: 'SMP/MTs' },
  { id: 'sma',     label: 'SMA/MA/SMK' },
  { id: 'terpadu', label: 'Terpadu' },
];

// ─── Kartu video ─────────────────────────────────────────────────────────────
function VideoCard({ school, videoId, index }) {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return (
    <div
      className="vid-card"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="vid-thumb-wrap">
        {videoId ? (
          loaded ? (
            <iframe
              className="vid-iframe"
              src={embedUrl}
              title={school}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              className="vid-thumb-btn"
              onClick={() => setLoaded(true)}
              aria-label={`Putar video ${school}`}
            >
              <img src={thumbUrl} alt={school} className="vid-thumb-img" loading="lazy" />
              <div className="vid-play-overlay">
                <div className="vid-play-btn" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            </button>
          )
        ) : (
          <div className="vid-thumb-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
              width="28" height="28" opacity="0.25">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Belum tersedia</span>
          </div>
        )}
      </div>
      <div className="vid-info">
        <p className="vid-school">{school}</p>
      </div>
    </div>
  );
}

// ─── Grid per jenis lomba ─────────────────────────────────────────────────────
function LombaGrid({ title, icon, schools, videoMap }) {
  return (
    <div className="lomba-block">
      <div className="lomba-block-header">
        <span className="lomba-icon" aria-hidden="true">{icon}</span>
        <div>
          <h3 className="lomba-title">{title}</h3>
          <p className="lomba-count">{schools.length} pangkalan</p>
        </div>
      </div>
      <div className="vid-grid">
        {schools.map((school, i) => (
          <VideoCard
            key={school}
            school={school}
            videoId={videoMap[school] ?? ''}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Halaman utama ────────────────────────────────────────────────────────────
export default function PenampilanPage() {
  const [activeCat, setActiveCat] = useState(null);
  const data = activeCat ? penampilanData[activeCat] : null;

  return (
    <div className="penam-page">

      {/* ── Coming Soon Overlay ── */}
      <div className="coming-soon-overlay" aria-live="polite">
        <div className="coming-soon-card">
          <div className="coming-soon-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.2" width="52" height="52">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="coming-soon-eyebrow">Segera Hadir</p>
          <h2 className="coming-soon-title">Coming Soon</h2>
          <p className="coming-soon-desc">
            Video penampilan peserta sedang dalam proses pengumpulan.
            Halaman ini akan aktif setelah seluruh tim mengirimkan video mereka.
          </p>
          <a href="/" className="coming-soon-back-btn">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
            </svg>
            Kembali ke Dashboard
          </a>
        </div>
      </div>

      {/* ── Konten halaman (terblur di balik overlay) ── */}
      <div className="penam-page-inner">

        {/* Header */}
        <header className="penam-header">
          <div className="penam-header-top">
            <a href="/" className="penam-back-link" aria-label="Kembali ke Dashboard">
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
              </svg>
              <span>Dashboard</span>
            </a>
            <img src={logoWebp} alt="Tanjak Emas" className="penam-logo" />
          </div>

          <div className="penam-title-block">
            <p className="penam-eyebrow">Tanjak Emas 2026</p>
            <h1 className="penam-title">Penampilan Tim</h1>
            <p className="penam-subtitle">
              Saksikan aksi terbaik setiap pangkalan dalam dua kategori lomba unggulan —
              Yel-Yel dan Semaphore Dance.
            </p>
          </div>
        </header>

        {/* Pilih Kategori */}
        <div className="penam-cat-section">
          <p className="penam-cat-label">
            {activeCat ? 'Menampilkan kategori:' : 'Pilih kategori untuk melihat penampilan'}
          </p>
          <div className="penam-cat-tabs">
            {KATEGORI_TABS.map(({ id, label }) => (
              <button
                key={id}
                className={activeCat === id ? 'penam-cat-btn active' : 'penam-cat-btn'}
                onClick={() => setActiveCat(id)}
              >
                {label}
                <small>{penampilanData[id].schools.length} tim</small>
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {!activeCat && (
          <div className="penam-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.1" width="56" height="56" opacity="0.2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
              <polygon points="10 8 16 11 10 14 10 8" fill="currentColor" stroke="none" opacity="0.7" />
            </svg>
            <p>Pilih kategori di atas untuk melihat daftar penampilan tim.</p>
          </div>
        )}

        {/* Konten grid */}
        {data && (
          <div className="penam-content">
            <div className="penam-divider">
              <span className="line" />
              <span className="penam-divider-label">{data.label}</span>
              <span className="line" />
            </div>

            <LombaGrid
              title="Yel-Yel"
              icon="📣"
              schools={data.schools}
              videoMap={data.yelYel}
            />

            <LombaGrid
              title="Semaphore Dance"
              icon="🚩"
              schools={data.schools}
              videoMap={data.semaphoreDance}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="penam-footer">
          <p>&copy; 2026 Badang Perkasa. Seluruh hak cipta dilindungi.</p>
        </footer>
      </div>
    </div>
  );
}
