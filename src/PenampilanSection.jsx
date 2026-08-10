import { useState } from 'react';

// ─── Data video penampilan ──────────────────────────────────────────────────
// Isi videoId dengan ID YouTube masing-masing tim.
// Contoh URL: https://www.youtube.com/watch?v=XXXXXXXXXXX → videoId: 'XXXXXXXXXXX'
// Kosongkan videoId: '' jika video belum tersedia. 

const penampilanData = {
  sdmi: {
    label: 'SD/MI',
    yelYel: [
      { school: 'MI Miftahul Huda Pandantoyo', videoId: '' },
      { school: 'MI Negeri 1 Trenggalek', videoId: '' },
      { school: 'MINU Al Hikmah Tajinan', videoId: '' },
      { school: 'MI Sunan Pandanaran', videoId: '' },
      { school: 'SD Ibrahimy', videoId: '' },
      { school: 'SD Islam Salafiyah', videoId: '' },
      { school: 'SD Negeri 2 Pakisjajar', videoId: '' },
      { school: 'SD Negeri 4 Reno Basuki', videoId: '' },
      { school: 'SD Negeri Jurang Mangu Barat 01', videoId: '' },
      { school: 'SDIT Nur El Qolam', videoId: '' },
    ],
    semaphoreDance: [
      { school: 'MI Miftahul Huda Pandantoyo', videoId: '' },
      { school: 'MI Negeri 1 Trenggalek', videoId: '' },
      { school: 'MINU Al Hikmah Tajinan', videoId: '' },
      { school: 'MI Sunan Pandanaran', videoId: '' },
      { school: 'SD Ibrahimy', videoId: '' },
      { school: 'SD Islam Salafiyah', videoId: '' },
      { school: 'SD Negeri 2 Pakisjajar', videoId: '' },
      { school: 'SD Negeri 4 Reno Basuki', videoId: '' },
      { school: 'SD Negeri Jurang Mangu Barat 01', videoId: '' },
      { school: 'SDIT Nur El Qolam', videoId: '' },
    ],
  },
  smpmts: {
    label: 'SMP/MTs',
    yelYel: [
      { school: 'MTs Islamiyah Nguwok', videoId: '' },
      { school: 'MTs Negeri 1 Jepara', videoId: '' },
      { school: 'MTs Negeri 1 Kab. Madiun', videoId: '' },
      { school: 'MTs Negeri 2 Madiun', videoId: '' },
      { school: 'MTs Negeri 2 Nganjuk', videoId: '' },
      { school: 'MTs Negeri 2 Pekanbaru', videoId: '' },
      { school: 'MTs Negeri 6 Cirebon', videoId: '' },
      { school: 'MTs Surya Buana', videoId: '' },
      { school: 'MTs Wali Songo', videoId: '' },
      { school: 'SMP ABBS Surakarta', videoId: '' },
    ],
    semaphoreDance: [
      { school: 'MTs Islamiyah Nguwok', videoId: '' },
      { school: 'MTs Negeri 1 Jepara', videoId: '' },
      { school: 'MTs Negeri 1 Kab. Madiun', videoId: '' },
      { school: 'MTs Negeri 2 Madiun', videoId: '' },
      { school: 'MTs Negeri 2 Nganjuk', videoId: '' },
      { school: 'MTs Negeri 2 Pekanbaru', videoId: '' },
      { school: 'MTs Negeri 6 Cirebon', videoId: '' },
      { school: 'MTs Surya Buana', videoId: '' },
      { school: 'MTs Wali Songo', videoId: '' },
      { school: 'SMP ABBS Surakarta', videoId: '' },
    ],
  },
  sma: {
    label: 'SMA/MA/SMK',
    yelYel: [
      { school: 'MA Al I\'dadiyyah Bahrul Ulum', videoId: '' },
      { school: 'MA Al Khidmah Nganjuk', videoId: '' },
      { school: 'MA Negeri 1 Batam', videoId: '' },
      { school: 'MA Negeri 1 Magetan', videoId: '' },
      { school: 'MA Negeri 1 Surakarta', videoId: '' },
      { school: 'MA Negeri 4 Jakarta Selatan', videoId: '' },
      { school: 'MA Negeri Paser', videoId: '' },
      { school: 'MA Nurul Hasan', videoId: '' },
      { school: 'MAN 2 Tulungagung', videoId: '' },
      { school: 'SMA IT Assyifa Boarding School', videoId: '' },
    ],
    semaphoreDance: [
      { school: 'MA Al I\'dadiyyah Bahrul Ulum', videoId: '' },
      { school: 'MA Al Khidmah Nganjuk', videoId: '' },
      { school: 'MA Negeri 1 Batam', videoId: '' },
      { school: 'MA Negeri 1 Magetan', videoId: '' },
      { school: 'MA Negeri 1 Surakarta', videoId: '' },
      { school: 'MA Negeri 4 Jakarta Selatan', videoId: '' },
      { school: 'MA Negeri Paser', videoId: '' },
      { school: 'MA Nurul Hasan', videoId: '' },
      { school: 'MAN 2 Tulungagung', videoId: '' },
      { school: 'SMA IT Assyifa Boarding School', videoId: '' },
    ],
  },
};

const KATEGORI_TABS = [
  { id: 'sdmi',   label: 'SD/MI' },
  { id: 'smpmts', label: 'SMP/MTs' },
  { id: 'sma',    label: 'SMA/MA/SMK' },
];

// ─── Komponen satu kartu video ──────────────────────────────────────────────
function VideoCard({ school, videoId, index }) {
  const [loaded, setLoaded] = useState(false);

  if (!videoId) {
    return (
      <div className="vid-card vid-card--empty" style={{ animationDelay: `${index * 0.05}s` }}>
        <div className="vid-thumb-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" opacity="0.3">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>Video belum tersedia</span>
        </div>
        <div className="vid-info">
          <p className="vid-school">{school}</p>
        </div>
      </div>
    );
  }

  const thumbUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div className="vid-card" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="vid-thumb-wrap">
        {loaded ? (
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
            <img
              src={thumbUrl}
              alt={school}
              className="vid-thumb-img"
              loading="lazy"
            />
            <div className="vid-play-overlay">
              <div className="vid-play-btn" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="vid-info">
        <p className="vid-school">{school}</p>
      </div>
    </div>
  );
}

// ─── Komponen grid per jenis lomba ──────────────────────────────────────────
function LombaGrid({ title, icon, videos }) {
  const hasAny = videos.some((v) => v.videoId);

  return (
    <div className="lomba-block">
      <div className="lomba-block-header">
        <span className="lomba-icon" aria-hidden="true">{icon}</span>
        <div>
          <h3 className="lomba-title">{title}</h3>
          <p className="lomba-count">
            {hasAny
              ? `${videos.filter((v) => v.videoId).length} dari ${videos.length} video tersedia`
              : 'Video segera hadir'}
          </p>
        </div>
      </div>

      <div className="vid-grid">
        {videos.map((v, i) => (
          <VideoCard key={v.school} school={v.school} videoId={v.videoId} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Komponen utama ─────────────────────────────────────────────────────────
export default function PenampilanSection() {
  const [activeCat, setActiveCat] = useState(null); // null = belum pilih

  const data = activeCat ? penampilanData[activeCat] : null;

  return (
    <section className="panel penampilan-panel">

      {/* Header section */}
      <div className="penampilan-header">
        <h2>Penampilan Tim</h2>
        <p className="panel-desc">
          Saksikan penampilan setiap pangkalan dalam dua kategori lomba unggulan.
        </p>
      </div>

      {/* Pilih Kategori */}
      <div className="penampilan-cat-wrap">
        <p className="penampilan-cat-label">
          {activeCat ? 'Kategori dipilih:' : 'Pilih kategori untuk melihat penampilan'}
        </p>
        <div className="penampilan-cat-tabs">
          {KATEGORI_TABS.map(({ id, label }) => (
            <button
              key={id}
              className={activeCat === id ? 'penam-cat-btn active' : 'penam-cat-btn'}
              onClick={() => setActiveCat(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* State: belum pilih kategori */}
      {!activeCat && (
        <div className="penampilan-empty">
          <div className="penampilan-empty-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="48" height="48">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
              <polygon points="10 8 16 11 10 14 10 8" fill="currentColor" stroke="none" opacity="0.6" />
            </svg>
          </div>
          <p>Pilih kategori di atas untuk menampilkan video penampilan tim.</p>
        </div>
      )}

      {/* Konten grid video */}
      {data && (
        <div className="penampilan-content">
          {/* Pembatas */}
          <div className="penampilan-divider">
            <span className="line" />
            <span className="penampilan-divider-label">{data.label}</span>
            <span className="line" />
          </div>

          <LombaGrid
            title="Yel-Yel"
            icon="📣"
            videos={data.yelYel}
          />

          <LombaGrid
            title="Semaphore Dance"
            icon="🚩"
            videos={data.semaphoreDance}
          />
        </div>
      )}
    </section>
  );
}
