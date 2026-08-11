-- ═══════════════════════════════════════════════════════════════════════════
-- TANJAK EMAS 2026 — Supabase Setup Lengkap
-- Jalankan seluruh file ini di Supabase → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. EXTENSION ────────────────────────────────────────────────────────────
-- pgcrypto dipakai untuk hash password admin
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ─── 2. TABEL: votes ─────────────────────────────────────────────────────────
-- Menyimpan jumlah poin per pangkalan
CREATE TABLE IF NOT EXISTS public.votes (
  id           TEXT PRIMARY KEY,          -- format: "sdmi-0", "smpmts-3", dst
  school_name  TEXT NOT NULL,
  category     TEXT NOT NULL,             -- "SD/MI", "SMP/MTs", "SMA/MA/SMK", "Pangkalan Terpadu"
  vote_count   INTEGER NOT NULL DEFAULT 0
);

-- Index untuk query cepat berdasarkan kategori
CREATE INDEX IF NOT EXISTS votes_category_idx ON public.votes (category);


-- ─── 3. TABEL: transactions ──────────────────────────────────────────────────
-- Menyimpan riwayat transaksi Midtrans
CREATE TABLE IF NOT EXISTS public.transactions (
  id               BIGSERIAL PRIMARY KEY,
  order_id         TEXT UNIQUE NOT NULL,
  school_id        TEXT,
  school_name      TEXT,
  vote_quantity    INTEGER DEFAULT 1,
  gross_amount     NUMERIC,
  status           TEXT DEFAULT 'pending', -- 'pending' | 'success' | 'failed'
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS transactions_order_id_idx ON public.transactions (order_id);
CREATE INDEX IF NOT EXISTS transactions_status_idx   ON public.transactions (status);


-- ─── 4. TABEL: admins ────────────────────────────────────────────────────────
-- Menyimpan akun admin (password di-hash dengan bcrypt via pgcrypto)
CREATE TABLE IF NOT EXISTS public.admins (
  id           BIGSERIAL PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'admin', -- 'admin' | 'master'
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ─── 5. TABEL: admin_logs ────────────────────────────────────────────────────
-- Menyimpan log setiap perubahan poin oleh admin
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id               BIGSERIAL PRIMARY KEY,
  admin_username   TEXT NOT NULL,
  school_id        TEXT,
  school_name      TEXT,
  action           TEXT NOT NULL,          -- 'add' | 'subtract' | 'reset'
  points_changed   INTEGER DEFAULT 0,
  note             TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_logs_created_idx ON public.admin_logs (created_at DESC);


-- ─── 6. RPC: increment_vote ──────────────────────────────────────────────────
-- Dipanggil oleh webhook Midtrans setelah pembayaran sukses
CREATE OR REPLACE FUNCTION public.increment_vote(
  p_school_id TEXT,
  p_amount    INTEGER DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.votes
  SET    vote_count = vote_count + p_amount
  WHERE  id = p_school_id;
END;
$$;


-- ─── 7. RPC: verify_admin_login ──────────────────────────────────────────────
-- Dipanggil oleh AdminLogin.jsx untuk memverifikasi username + password
-- Mengembalikan data admin jika cocok, array kosong jika salah
CREATE OR REPLACE FUNCTION public.verify_admin_login(
  p_username TEXT,
  p_password TEXT
)
RETURNS TABLE (id BIGINT, username TEXT, role TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.username, a.role
  FROM   public.admins a
  WHERE  a.username = p_username
    AND  a.password_hash = crypt(p_password, a.password_hash);
END;
$$;


-- ─── 8. RPC: create_admin ────────────────────────────────────────────────────
-- Dipanggil oleh AdminPanel.jsx (tab Kelola Admin) untuk membuat admin baru
CREATE OR REPLACE FUNCTION public.create_admin(
  p_username TEXT,
  p_password TEXT,
  p_role     TEXT DEFAULT 'admin'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admins (username, password_hash, role)
  VALUES (
    p_username,
    crypt(p_password, gen_salt('bf')),  -- bcrypt hash
    p_role
  );
END;
$$;


-- ─── 9. ROW LEVEL SECURITY (RLS) ─────────────────────────────────────────────
-- votes: bisa dibaca siapa saja (publik), hanya bisa diubah oleh service_role
ALTER TABLE public.votes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs     ENABLE ROW LEVEL SECURITY;

-- votes: SELECT publik (untuk dashboard), UPDATE hanya service_role
DROP POLICY IF EXISTS "votes_select_public" ON public.votes;
CREATE POLICY "votes_select_public"
  ON public.votes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "votes_update_service" ON public.votes;
CREATE POLICY "votes_update_service"
  ON public.votes FOR UPDATE
  USING (auth.role() = 'service_role');

-- transactions: hanya service_role
DROP POLICY IF EXISTS "transactions_service_only" ON public.transactions;
CREATE POLICY "transactions_service_only"
  ON public.transactions FOR ALL
  USING (auth.role() = 'service_role');

-- admins: SELECT & DELETE pakai anon (RPC sudah SECURITY DEFINER jadi aman)
DROP POLICY IF EXISTS "admins_select_anon" ON public.admins;
CREATE POLICY "admins_select_anon"
  ON public.admins FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "admins_delete_service" ON public.admins;
CREATE POLICY "admins_delete_service"
  ON public.admins FOR DELETE
  USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- admin_logs: SELECT & INSERT untuk anon (admin panel pakai anon key)
DROP POLICY IF EXISTS "admin_logs_select_anon" ON public.admin_logs;
CREATE POLICY "admin_logs_select_anon"
  ON public.admin_logs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "admin_logs_insert_anon" ON public.admin_logs;
CREATE POLICY "admin_logs_insert_anon"
  ON public.admin_logs FOR INSERT
  WITH CHECK (true);


-- ─── 10. REALTIME ─────────────────────────────────────────────────────────────
-- Aktifkan realtime untuk tabel votes dan admin_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_logs;


-- ─── 11. SEED DATA: votes (semua pangkalan) ───────────────────────────────────
-- Masukkan semua pangkalan dengan vote_count awal 0
-- Jalankan sekali saja. Jika sudah ada data, gunakan INSERT ... ON CONFLICT DO NOTHING

INSERT INTO public.votes (id, school_name, category, vote_count) VALUES
  -- SD/MI
  ('sdmi-0',  'MI Miftahul Huda Pandantoyo, Nganjuk, Jawa Timur',          'SD/MI', 0),
  ('sdmi-1',  'MI Negeri 1 Trenggalek, Jawa Timur',                        'SD/MI', 0),
  ('sdmi-2',  'MINU Al Hikmah Tajinan, Kab. Malang, Jawa Timur',           'SD/MI', 0),
  ('sdmi-3',  'MI Sunan Pandanaran, Sleman, DI Yogyakarta',                'SD/MI', 0),
  ('sdmi-4',  'SD AL ARAF ISLAMIC SCHOOL',                                 'SD/MI', 0),
  ('sdmi-5',  'SD Ibrahimy, Sumenep, Jawa Timur',                          'SD/MI', 0),
  ('sdmi-6',  'SD Islam Salafiyah, Kab. Malang, Jawa Timur',               'SD/MI', 0),
  ('sdmi-7',  'SD Negeri 2 Pakisjajar, Kab. Malang, Jawa Timur',           'SD/MI', 0),
  ('sdmi-8',  'SD Negeri 4 Reno Basuki, Lampung Tengah, Lampung',          'SD/MI', 0),
  ('sdmi-9',  'SD Negeri Jurang Mangu Barat 01, Tangerang Selatan, Banten','SD/MI', 0),
  ('sdmi-10', 'SDIT Nur El Qolam, Serang, Banten',                         'SD/MI', 0),

  -- SMP/MTs
  ('smpmts-0',  'MTs Islamiyah Nguwok, Lamongan, Jawa Timur',              'SMP/MTs', 0),
  ('smpmts-1',  'MTs Negeri 1 Jepara, Jawa Tengah',                        'SMP/MTs', 0),
  ('smpmts-2',  'MTs Negeri 1 Kab. Madiun, Jawa Timur',                    'SMP/MTs', 0),
  ('smpmts-3',  'MTs Negeri 2 Madiun, Jawa Timur',                         'SMP/MTs', 0),
  ('smpmts-4',  'MTs Negeri 2 Nganjuk, Jawa Timur',                        'SMP/MTs', 0),
  ('smpmts-5',  'MTs Negeri 2 Pekanbaru, Riau',                            'SMP/MTs', 0),
  ('smpmts-6',  'MTs Negeri 6 Cirebon, Jawa Barat',                        'SMP/MTs', 0),
  ('smpmts-7',  'MTs Surya Buana, Malang, Jawa Timur',                     'SMP/MTs', 0),
  ('smpmts-8',  'MTs Wali Songo, Melaya, Jembrana, Bali',                  'SMP/MTs', 0),
  ('smpmts-9',  'SMP ABBS, Surakarta, Jawa Tengah',                        'SMP/MTs', 0),
  ('smpmts-10', 'SMP An Nur Al Anwar, Malang, Jawa Timur',                 'SMP/MTs', 0),
  ('smpmts-11', 'SMP Ibrahimy, Sumenep, Jawa Timur',                       'SMP/MTs', 0),
  ('smpmts-12', 'SMP Islam Plus Alfatih, Medan, Sumatera Utara',           'SMP/MTs', 0),
  ('smpmts-13', 'SMP Islam Roushon Fikr, Jombang, Jawa Timur',             'SMP/MTs', 0),
  ('smpmts-14', 'SMP Islam Teluk Jambe, Karawang, Jawa Barat',             'SMP/MTs', 0),
  ('smpmts-15', 'SMP IT Cordova, Samarinda, Kalimantan Timur',             'SMP/MTs', 0),
  ('smpmts-16', 'SMP IT Tahfidzul Quran Ulil Albab, Karanganyar, Jawa Tengah', 'SMP/MTs', 0),
  ('smpmts-17', 'SMP Negeri 1 Banyuwangi, Jawa Timur',                    'SMP/MTs', 0),
  ('smpmts-18', 'SMP Negeri 1 Batealit, Jepara, Jawa Tengah',             'SMP/MTs', 0),
  ('smpmts-19', 'SMP Negeri 1 Kertosono, Nganjuk, Jawa Timur',            'SMP/MTs', 0),
  ('smpmts-20', 'SMP Negeri 1 Ngetos, Nganjuk, Jawa Timur',               'SMP/MTs', 0),
  ('smpmts-21', 'SMP Negeri 1 Sawa, Konawe Utara, Sulawesi Tenggara',     'SMP/MTs', 0),
  ('smpmts-22', 'SMP Negeri 11 Pasuruan, Jawa Timur',                     'SMP/MTs', 0),
  ('smpmts-23', 'SMP Negeri 2 Bangil, Pasuruan, Jawa Timur',              'SMP/MTs', 0),
  ('smpmts-24', 'SMP Negeri 2 Mojo, Kediri, Jawa Timur',                  'SMP/MTs', 0),
  ('smpmts-25', 'SMP Negeri 2 Ngetos, Nganjuk, Jawa Timur',               'SMP/MTs', 0),
  ('smpmts-26', 'SMP Negeri 2 Taman, Sidoarjo, Jawa Timur',               'SMP/MTs', 0),
  ('smpmts-27', 'SMP Negeri 3 Purwodadi, Jawa Tengah',                    'SMP/MTs', 0),
  ('smpmts-28', 'SMP Negeri 4 Balikpapan, Kalimantan Timur',              'SMP/MTs', 0),
  ('smpmts-29', 'SMP Negeri 5 Karawang, Jawa Barat',                      'SMP/MTs', 0),
  ('smpmts-30', 'SMP Negeri 7 Kota Madiun, Jawa Timur',                   'SMP/MTs', 0),
  ('smpmts-31', 'SMP Negeri 7 Surakarta, Jawa Tengah',                    'SMP/MTs', 0),
  ('smpmts-32', 'SMP Negeri 9 Jambi',                                     'SMP/MTs', 0),
  ('smpmts-33', 'SMP Negeri 37 Batam, Kepulauan Riau',                    'SMP/MTs', 0),
  ('smpmts-34', 'SMP Negeri 44 Batam, Kepulauan Riau',                    'SMP/MTs', 0),
  ('smpmts-35', 'SMP Negeri Giriyoso, Musi Rawas, Sumatera Selatan',      'SMP/MTs', 0),

  -- SMA/MA/SMK
  ('sma-0',  'MA Al I''Dadiyyah Bahrul Ulum, Jombang, Jawa Timur',        'SMA/MA/SMK', 0),
  ('sma-1',  'MA Al Khidmah, Ngronggot, Nganjuk, Jawa Timur',             'SMA/MA/SMK', 0),
  ('sma-2',  'MA Negeri 1 Batam, Kepulauan Riau',                         'SMA/MA/SMK', 0),
  ('sma-3',  'MA Negeri 1 Magetan, Jawa Timur',                           'SMA/MA/SMK', 0),
  ('sma-4',  'MA Negeri 1 Surakarta, Jawa Tengah',                        'SMA/MA/SMK', 0),
  ('sma-5',  'MA Negeri 4 Jakarta Selatan, DKI Jakarta',                  'SMA/MA/SMK', 0),
  ('sma-6',  'MA Negeri Paser, Kalimantan Timur',                         'SMA/MA/SMK', 0),
  ('sma-7',  'MA Nurul Hasan, Melaya, Jembrana, Bali',                    'SMA/MA/SMK', 0),
  ('sma-8',  'MAN 2 Tulungagung, Jawa Timur',                             'SMA/MA/SMK', 0),
  ('sma-9',  'SAKA Wanabakti Sumba Timur (Penegak), Nusa Tenggara Timur', 'SMA/MA/SMK', 0),
  ('sma-10', 'SMA IT Assyifa Boarding School, Subang, Jawa Barat',        'SMA/MA/SMK', 0),
  ('sma-11', 'SMA IT Darul Quran, Kab. Bogor, Jawa Barat',                'SMA/MA/SMK', 0),
  ('sma-12', 'SMA Negeri 1 Malinau, Kalimantan Utara',                    'SMA/MA/SMK', 0),
  ('sma-13', 'SMA Negeri 1 Prambanan, Klaten, Jawa Tengah',               'SMA/MA/SMK', 0),
  ('sma-14', 'SMA Negeri 1 Tanjung Sari, Lampung Selatan, Lampung',       'SMA/MA/SMK', 0),
  ('sma-15', 'SMA Negeri 6 Balikpapan, Kalimantan Timur',                 'SMA/MA/SMK', 0),
  ('sma-16', 'SMA S Perintis 1 Bandar Lampung, Lampung',                  'SMA/MA/SMK', 0),
  ('sma-17', 'SMA Wawonii Utara, Konawe Kepulauan, Sulawesi Tenggara',    'SMA/MA/SMK', 0),
  ('sma-18', 'SMK Islam Sumedang, Jawa Barat',                            'SMA/MA/SMK', 0),
  ('sma-19', 'SMK Negeri 1 Abang, Karangasem, Bali',                      'SMA/MA/SMK', 0),
  ('sma-20', 'SMK Negeri 1 Kubutambahan, Buleleng, Bali',                 'SMA/MA/SMK', 0),
  ('sma-21', 'SMK Negeri 2 Madiun, Jawa Timur',                           'SMA/MA/SMK', 0),
  ('sma-22', 'SMK Negeri 19 Jakarta Pusat, DKI Jakarta',                  'SMA/MA/SMK', 0),
  ('sma-23', 'SMK Negeri 68 Jakarta',                                     'SMA/MA/SMK', 0),
  ('sma-24', 'SMK Syubbanul Wathon, Secang, Magelang, Jawa Tengah',       'SMA/MA/SMK', 0),
  ('sma-25', 'SMK Yadika 2 Grogol Petamburan, Jakarta Barat, DKI Jakarta','SMA/MA/SMK', 0),

  -- Pangkalan Terpadu
  ('terpadu-0', 'Pesantren Terpadu Darrutaqwa, Kab. Bogor, Jawa Barat',   'Pangkalan Terpadu', 0)

ON CONFLICT (id) DO NOTHING;


-- ─── 12. SEED DATA: master admin ──────────────────────────────────────────────
-- Buat akun master admin pertama.
-- GANTI 'MASTER' dan 'password_rahasia_kamu' sebelum dijalankan!
-- Setelah berhasil login, bisa tambah admin lain lewat panel.

SELECT public.create_admin(
  'MASTER',               -- username (akan otomatis uppercase di form login)
  'password_rahasia_kamu', -- ganti dengan password yang kuat
  'master'
);


-- ─── 13. RPC: delete_admin ───────────────────────────────────────────────────
-- Dipanggil AdminPanel untuk hapus admin (tidak bisa hapus role master)
CREATE OR REPLACE FUNCTION public.delete_admin(p_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.admins
  WHERE id = p_id AND role <> 'master';
END;
$$;


-- ─── SELESAI ──────────────────────────────────────────────────────────────────
-- Setelah script ini berhasil, lakukan:
-- 1. Buka Supabase → Authentication → Policies — pastikan semua policy terbuat
-- 2. Buka Supabase → Database → Replication — pastikan votes & admin_logs aktif
-- 3. Deploy ke Vercel dengan environment variables:
--    VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
--    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
--    MIDTRANS_SERVER_KEY, MIDTRANS_IS_PRODUCTION
