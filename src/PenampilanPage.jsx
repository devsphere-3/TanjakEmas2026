import { useState, useEffect, useCallback } from 'react';
import logoWebp from './assets/TanjakEmas_logo.webp';

// ─── Data Video SD ────────────────────────────────────────────────────────────
const videoSD = [
  { nomor: 1,  kode: 'S001',  kategori: 'SD', videoId: 'JaJYqBowvvk' },
  { nomor: 2,  kode: 'S001',  kategori: 'SD', videoId: 'fDGnyMXzsdk' },
  { nomor: 3,  kode: 'S002',  kategori: 'SD', videoId: '8zguNMV__Ig' },
  { nomor: 4,  kode: 'S002',  kategori: 'SD', videoId: 'nXzlfXMbIyE' },
  { nomor: 5,  kode: 'S004A', kategori: 'SD', videoId: 'rYnp6e0qBLI' },
  { nomor: 6,  kode: 'S004B', kategori: 'SD', videoId: 'XSQ4f9ZylIE' },
  { nomor: 7,  kode: 'S006',  kategori: 'SD', videoId: 'Da0G-Rz-TvM' },
  { nomor: 8,  kode: 'S007',  kategori: 'SD', videoId: 'HiSXlRRQSfc' },
  { nomor: 9,  kode: 'S007',  kategori: 'SD', videoId: '59kpoJgEmmM' },
  { nomor: 10, kode: 'S008',  kategori: 'SD', videoId: '9cW9PWG7mxk' },
  { nomor: 11, kode: 'S009A', kategori: 'SD', videoId: 'Gpzzxhp42Mk' },
  { nomor: 12, kode: 'S009B', kategori: 'SD', videoId: '7VXjGbjCcq0' },
  { nomor: 13, kode: 'S010',  kategori: 'SD', videoId: 'MBBgTGc9Mas' },
  { nomor: 14, kode: 'S010',  kategori: 'SD', videoId: 'ckK79t3OlQU' },
];

const videoSMP = [
  ['G002','RGYhvTHzHmg'],['G002','9zBhf6v1Ma4'],['G005','vbdh_YkkuvI'],
  ['G006','5KYFeHpPg9Y'],['G006','SWPNegXHQS8'],['G007','kErw_y94iKk'],
  ['G008','FQyq_SZlFXU'],['G009','hbVWgOzAHbc'],['G009','XtlkOZU-3GY'],
  ['G010','c1EShvcbcVg'],['G010','8b78ALAfQ6o'],['G011A','KUbREgnNfRA'],
  ['G011B','oF-X9Cpf47M'],['G013','DRNyqNxdeJw'],['G013','8JA_DHXlWVk'],
  ['G014','uwpqPydw2PY'],['G014','sSroSfLCpfM'],['G015','hwrzXTyU_7w'],
  ['G015','7ZlwEGskavM'],['G016','ufDpPywM5_Q'],['G018','G_Sm-fNb7pI'],
  ['G018A','KKhZMJdE5as'],['G018B','n4j_wbm7VEE'],['G019','fIBFXEPifks'],
  ['G021','w7VhhaUI0Vc'],['G022','XDd_yDhVsX0'],['G022','Q0qSBd58pdQ'],
  ['G023','V1gn5I00Wrg'],['G026','YkwQp1hdcL0'],['G027','Fh4FRC-fPag'],
  ['G028','wCHJElI_DWU'],['G029A','EHbKaKKMrVM'],['G029A','Zq-4PFQ3L6w'],
  ['G029B','kD-IgfaOlT8'],['G029B','-ndmZqLyS7E'],['G029C','npmeGzjCwx0'],
  ['G030','Hq76L_I281g'],['G030','brZYsmCnX1M'],['G031A','ui4cJl3yEQg'],
  ['G031B','T79VFSJBhds'],['G032','yk47gTTh--4'],['G032','kqKGUDn6If8'],
  ['G033','X6qthpdQmcA'],['G035','7FjTKOaIwxs'],['G037','dcJ9JsUyKZA'],
].map(([kode, videoId], i) => ({ nomor: i + 1, kode, kategori: 'SMP', videoId }));

const videoSMA = [
  ['T001','DaFAjTZbmMI'],['T002','Cthp2H-gQJg'],['T003','YofR3PlGGgs'],
  ['T003','ErGzWXcqyAk'],['T006','0NCdkz5D2rw'],['T006A','cNBuXR051lY'],
  ['T006B','JjGqeUWcRXg'],['T007','W-ECR34IY18'],['T007','dwVeJ4Ur0uY'],
  ['T011','cocsHPftgRg'],['T011','OX-QCEntr2A'],['T012','4q1Kb7qQ0hI'],
  ['T016','PrW4R2aGRWs'],['T016','u5ugCrmzgco'],['T017','Ec9Tr5zLS7k'],
  ['T018','PLF00AhFBWM'],['T019','4GJkO_lpSHY'],['T021','jzuAFDCmswI'],
  ['T021A','oHNkR1wPYcA'],['T021B','OiDcKaCx8fg'],['T022','YxQLX_xi_oY'],
  ['T022','-pHJBtrMSPk'],['T027','EJ5wFhSPazw'],['T027','JkbqWs0MSeo'],
].map(([kode, videoId], i) => ({ nomor: i + 1, kode, kategori: 'SMA', videoId }));

const allVideos = [...videoSD, ...videoSMP, ...videoSMA];

// Label panjang per kategori
const KAT_LABEL = {
  SD:  'Sekolah Dasar',
  SMP: 'Sekolah Menengah Pertama',
  SMA: 'Sekolah Menengah Atas',
};

const FILTER_TABS = [
  { id: 'SD',  label: 'SD'  },
  { id: 'SMP', label: 'SMP' },
  { id: 'SMA', label: 'SMA' },
];

// ─── Modal Video ──────────────────────────────────────────────────────────────
function VideoModal({ video, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="vm-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="vm-card">
        {/* Garis aksen atas */}
        <div className="vm-top-bar" />

        {/* Header */}
        <div className="vm-header">
          <div className="vm-header-left">
            <span className="vm-kat-badge">{video.kategori}</span>
            <div>
              <p className="vm-kode">{video.kode}</p>
              <p className="vm-sub">{KAT_LABEL[video.kategori]}</p>
            </div>
          </div>
          <button className="vm-close" onClick={onClose} aria-label="Tutup">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
              <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* iframe 16:9 */}
        <div className="vm-iframe-wrap">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
            title={video.kode}
            className="vm-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Footer */}
        <div className="vm-footer">
          <p className="vm-footer-text">
            {video.kategori} &middot; <strong>{video.kode}</strong>
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="vm-yt-btn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z"/>
            </svg>
            Buka YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Kartu Video ──────────────────────────────────────────────────────────────
function VideoCard({ video, index, onWatch }) {
  const thumb = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;

  return (
    <article
      className="vc-card"
      style={{ animationDelay: `${Math.min(index, 24) * 0.035}s` }}
    >
      {/* Title bar */}
      <div className="vc-title-bar">
        <div className="vc-title-accent" />
        <div className="vc-title-main">
          <span className="vc-kode">{video.kode}</span>
          <span className="vc-kat-pill">{video.kategori}</span>
        </div>
      </div>

      {/* Thumbnail */}
      <button
        className="vc-thumb-btn"
        onClick={() => onWatch(video)}
        aria-label={`Tonton video ${video.kode}`}
      >
        <img src={thumb} alt={video.kode} className="vc-thumb-img" loading="lazy" />
        <div className="vc-thumb-gradient" />
        <div className="vc-play-wrap">
          <div className="vc-play-ring">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
        </div>
      </button>

      {/* Footer card */}
      <div className="vc-footer">
        <p className="vc-footer-label">{KAT_LABEL[video.kategori]}</p>
        <button className="vc-watch-btn" onClick={() => onWatch(video)}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
          Tonton Video
        </button>
      </div>
    </article>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────
export default function PenampilanPage() {
  const [activeFilter, setActiveFilter] = useState('SD');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filtered = allVideos.filter((v) => v.kategori === activeFilter);

  const handleWatch = useCallback((v) => setSelectedVideo(v), []);
  const handleClose = useCallback(() => setSelectedVideo(null), []);

  return (
    <div className="pp-page">
      <div className="pp-inner">

        {/* Header */}
        <header className="pp-header">
          <div className="pp-header-row">
            <a href="/" className="pp-back">
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
              </svg>
              Dashboard
            </a>
            <img src={logoWebp} alt="Tanjak Emas" className="pp-logo" />
          </div>

          <div className="pp-hero">
            <p className="pp-eyebrow">Tanjak Emas 2026</p>
            <h1 className="pp-title">Penampilan Tim</h1>
            <p className="pp-subtitle">
              Saksikan aksi terbaik setiap peserta dari seluruh Indonesia.
            </p>
          </div>
        </header>

        {/* Filter */}
        <div className="pp-filter-wrap">
          <p className="pp-filter-heading">Kategori</p>
          <div className="pp-filter-tabs">
            {FILTER_TABS.map(({ id, label }) => (
              <button
                key={id}
                className={`pp-filter-btn${activeFilter === id ? ' active' : ''}`}
                onClick={() => setActiveFilter(id)}
              >
                <span className="pp-filter-label">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="pp-grid">
          {filtered.map((video, idx) => (
            <VideoCard
              key={`${video.kategori}-${video.videoId}`}
              video={video}
              index={idx}
              onWatch={handleWatch}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="pp-footer">
          <div className="pp-footer-divider" />
          <p>&copy; 2026 Badang Perkasa &middot; Tanjak Emas</p>
        </footer>
      </div>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={handleClose} />
      )}
    </div>
  );
}
