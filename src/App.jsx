import { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from './supabase.js';
import SaweriaModal from './SaweriaModal.jsx';

const categories = [
  {
    id: 'sdmi',
    title: 'SD/MI',
    schools: [
      'MI Miftahul Huda Pandantoyo, Nganjuk, Jawa Timur',
      'MI Negeri 1 Trenggalek, Jawa Timur',
      'MINU Al Hikmah Tajinan, Kab. Malang, Jawa Timur',
      'MI Sunan Pandanaran, Sleman, DI Yogyakarta',
      'SD Ibrahimy, Sumenep, Jawa Timur',
      'SD Islam Salafiyah, Kab. Malang, Jawa Timur',
      'SD Negeri 2 Pakisjajar, Kab. Malang, Jawa Timur',
      'SD Negeri 4 Reno Basuki, Lampung Tengah, Lampung',
      'SD Negeri Jurang Mangu Barat 01, Tangerang Selatan, Banten',
      'SDIT Nur El Qolam, Serang, Banten',
    ],
  },
  {
    id: 'smpmts',
    title: 'SMP/MTs',
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
  },
  {
    id: 'sma',
    title: 'SMA/MA/SMK',
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
  },
  {
    id: 'terpadu',
    title: 'Pangkalan Terpadu',
    schools: ['Pesantren Terpadu Darrutaqwa, Kab. Bogor, Jawa Barat'],
  },
];

const initialVotes = categories.reduce((map, category) => {
  category.schools.forEach((school, index) => {
    map[`${category.id}-${index}`] = 0;
  });
  return map;
}, {});

const schoolLookup = categories.reduce((map, category) => {
  category.schools.forEach((school, index) => {
    map[`${category.id}-${index}`] = {
      id: `${category.id}-${index}`,
      name: school,
      category: category.title,
    };
  });
  return map;
}, {});

function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedSchool,   setSelectedSchool]   = useState(`${categories[0].id}-0`);
  const [searchTerm,       setSearchTerm]       = useState('');
  const [votes,            setVotes]            = useState(initialVotes);
  const [isVotesLoading,   setIsVotesLoading]   = useState(true);
  const [showModal,        setShowModal]        = useState(false);
  const [lbFilter,         setLbFilter]         = useState('sdmi');

  const category = categories.find((c) => c.id === selectedCategory);

  const filteredSchools = category?.schools
    .map((school, index) => ({ school, index }))
    .filter(({ school }) =>
      searchTerm.trim().length > 0
        ? school.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    ) ?? [];

  // Reset pilihan sekolah saat ganti kategori atau search
  useEffect(() => {
    if (!category) return;
    if (!searchTerm) {
      setSelectedSchool(`${category.id}-0`);
      return;
    }
    const match = filteredSchools[0];
    if (match) setSelectedSchool(`${category.id}-${match.index}`);
  }, [selectedCategory, searchTerm]); // eslint-disable-line

  const selectedSchoolData = schoolLookup[selectedSchool];

  // ── Fetch votes dari Supabase ─────────────────────────────────────────────
  const fetchVotes = useCallback(async () => {
    const { data, error } = await supabase.from('votes').select('id, vote_count');
    if (error) { console.error(error); setIsVotesLoading(false); return; }
    const updated = { ...initialVotes };
    data.forEach((row) => {
      if (updated[row.id] !== undefined) updated[row.id] = row.vote_count;
    });
    setVotes(updated);
    setIsVotesLoading(false);
  }, []);

  useEffect(() => { fetchVotes(); }, [fetchVotes]);

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('votes-realtime')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'votes' },
        (payload) => {
          const { id, vote_count } = payload.new;
          setVotes((cur) => ({ ...cur, [id]: vote_count }));
        })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // ── Computed ──────────────────────────────────────────────────────────────
  const categoryVotes = useMemo(
    () => category?.schools.reduce(
      (sum, _s, i) => sum + (votes[`${category.id}-${i}`] ?? 0), 0
    ) ?? 0,
    [category, votes]
  );

  const leaderboard = useMemo(() => {
    const terpadu    = categories.find((c) => c.id === 'terpadu');
    const terpaduIds = terpadu?.schools.map((_, i) => `terpadu-${i}`) ?? [];
    const targetIds  = new Set();

    const primaryCat = categories.find((c) => c.id === lbFilter);
    primaryCat?.schools.forEach((_, i) => targetIds.add(`${lbFilter}-${i}`));

    if (lbFilter === 'smpmts' || lbFilter === 'sma') {
      terpaduIds.forEach((id) => targetIds.add(id));
    }

    return Object.values(schoolLookup)
      .filter((s) => targetIds.has(s.id))
      .map((s) => ({ ...s, votes: votes[s.id] ?? 0 }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10);
  }, [votes, lbFilter]);

  return (
    <>
      {/* Saweria Modal */}
      {showModal && (
        <SaweriaModal
          school={selectedSchoolData}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="page">
        <div className="container">
          <div className="frame">

            <header className="header">
              <div className="eyebrow">Pangkalan Terfavorit</div>
              <h1>Tanjak Emas 2026</h1>
              <div className="subtitle">Bersatu dalam Suara, Menang dalam Perjuangan</div>
              <div className="divider">
                <span className="line" />
                <span>★</span>
                <span className="line" />
              </div>
            </header>

            {/* Pilih Kategori */}
            <section className="panel category-panel">
              <h2>Pilih Kategori</h2>
              <p className="category-note" style={{ marginBottom: '18px' }}>
                Pilih kategori agar daftar pangkalan lebih terfokus.
              </p>
              <div className="category-tabs">
                {categories.map((item) => (
                  <button
                    key={item.id}
                    className={item.id === selectedCategory ? 'category-button active' : 'category-button'}
                    onClick={() => setSelectedCategory(item.id)}
                  >
                    <span>{item.title}</span>
                    <small>{item.schools.length} pangkalan</small>
                  </button>
                ))}
              </div>
            </section>

            {/* Daftar Pangkalan */}
            <section className="panel school-panel">
              <div className="school-panel-header">
                <div>
                  <h2>{category?.title} &mdash; {category?.schools.length} Pangkalan</h2>
                  <p>{categoryVotes} poin terkumpul di kategori ini.</p>
                </div>
              </div>

              {category?.schools.length > 20 && (
                <div className="school-search">
                  <label>Cari Pangkalan</label>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ketik nama sekolah atau lokasi..."
                  />
                </div>
              )}

              <div className="school-list-header">
                <p>Pilih pangkalan lalu klik tombol dukung untuk memberi poin.</p>
              </div>

              <div className="school-list">
                {isVotesLoading ? (
                  <div className="loading-list">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="skeleton skeleton-card" />
                    ))}
                  </div>
                ) : filteredSchools.length > 0 ? (
                  filteredSchools.map(({ school, index }) => {
                    const id = `${category.id}-${index}`;
                    return (
                      <article
                        key={id}
                        className={selectedSchool === id ? 'school-card active' : 'school-card'}
                        onClick={() => setSelectedSchool(id)}
                        style={{ animationDelay: `${index * 0.03}s` }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p>{school}</p>
                          <span>{votes[id] ?? 0} poin</span>
                        </div>
                        {selectedSchool === id && <span className="badge">Dipilih</span>}
                      </article>
                    );
                  })
                ) : (
                  <div className="no-results">Tidak ada hasil yang cocok.</div>
                )}
              </div>
            </section>

            {/* Tombol Dukung */}
            <section className="panel vote-panel">
              <h2>Beri Dukungan</h2>
              <p className="panel-desc">
                Setiap Rp 1.000 donasi di Saweria = 1 poin untuk pangkalan pilihanmu.
              </p>

              {selectedSchoolData && (
                <div className="vote-preview" style={{ marginTop: '20px' }}>
                  <span>Pangkalan dipilih</span>
                  {selectedSchoolData.name}
                </div>
              )}

              <button
                className="primary-button"
                style={{ marginTop: '20px' }}
                onClick={() => setShowModal(true)}
                disabled={!selectedSchoolData}
              >
                Dukung via Saweria
              </button>
            </section>

            {/* Leaderboard */}
            <section className="panel leaderboard-panel">
              <div className="leaderboard-header">
                <h2>Leaderboard Teratas</h2>
                <p>Diperbarui secara langsung dari semua kategori.</p>
              </div>

              <div className="lb-filter-tabs">
                {[
                  { id: 'sdmi',   label: 'SD/MI' },
                  { id: 'smpmts', label: 'SMP/MTs' },
                  { id: 'sma',    label: 'SMA/MA/SMK' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    className={lbFilter === id ? 'lb-filter-btn active' : 'lb-filter-btn'}
                    onClick={() => setLbFilter(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="leaderboard-grid">
                {leaderboard.length === 0 ? (
                  <div className="no-results">Belum ada data untuk filter ini.</div>
                ) : (
                  leaderboard.map((item, index) => (
                    <article
                      key={item.id}
                      className="leaderboard-card"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="lb-left">
                        <span className="rank">{index + 1}</span>
                        <p>{item.name}</p>
                      </div>
                      <div className="lb-right">
                        <span>{item.votes.toLocaleString('id-ID')}</span>
                        <small>pts</small>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <footer className="site-footer">
              <p className="footer-copy">&copy; 2026 Badang Perkasa. Seluruh hak cipta dilindungi.</p>
              <div className="footer-links">
                <a
                  href="https://www.instagram.com/pramukabadangperkasa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Pramuka Badang Perkasa
                </a>
                <span className="footer-sep">·</span>
                <a
                  href="https://www.instagram.com/kodeka2025/?utm_source=ig_web_button_share_sheet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Partner Kodeka 2025
                </a>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </>
  );
}

export default App;
