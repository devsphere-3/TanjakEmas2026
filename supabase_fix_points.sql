-- ═══════════════════════════════════════════════════════════════════════════
-- TANJAK EMAS 2026 — Set Poin Final (absolut, bukan tambah)
-- Jalankan di Supabase → SQL Editor → New query → Run
-- Query ini SET langsung ke nilai yang benar, bukan menambahkan.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── SD/MI ───────────────────────────────────────────────────────────────────
UPDATE public.votes SET vote_count = 732  WHERE id = 'sdmi-0';   -- MI Miftahul Huda Pandantoyo
UPDATE public.votes SET vote_count = 0    WHERE id = 'sdmi-1';   -- MI Negeri 1 Trenggalek
UPDATE public.votes SET vote_count = 0    WHERE id = 'sdmi-2';   -- MINU Al Hikmah Tajinan
UPDATE public.votes SET vote_count = 0    WHERE id = 'sdmi-3';   -- MI Sunan Pandanaran
UPDATE public.votes SET vote_count = 10   WHERE id = 'sdmi-4';   -- SD AL ARAF ISLAMIC SCHOOL
UPDATE public.votes SET vote_count = 0    WHERE id = 'sdmi-5';   -- SD Ibrahimy
UPDATE public.votes SET vote_count = 100  WHERE id = 'sdmi-6';   -- SD Islam Salafiyah
UPDATE public.votes SET vote_count = 0    WHERE id = 'sdmi-7';   -- SD Negeri 2 Pakisjajar
UPDATE public.votes SET vote_count = 0    WHERE id = 'sdmi-8';   -- SD Negeri 4 Reno Basuki
UPDATE public.votes SET vote_count = 25   WHERE id = 'sdmi-9';   -- SD Negeri Jurang Mangu Barat 01
UPDATE public.votes SET vote_count = 35   WHERE id = 'sdmi-10';  -- SDIT Nur El Qolam

-- ─── SMP/MTs ─────────────────────────────────────────────────────────────────
UPDATE public.votes SET vote_count = 1    WHERE id = 'smpmts-0';  -- MTs Islamiyah Nguwok
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-1';  -- MTs Negeri 1 Jepara
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-2';  -- MTs Negeri 1 Kab. Madiun
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-3';  -- MTs Negeri 2 Madiun
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-4';  -- MTs Negeri 2 Nganjuk
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-5';  -- MTs Negeri 2 Pekanbaru
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-6';  -- MTs Negeri 6 Cirebon
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-7';  -- MTs Surya Buana
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-8';  -- MTs Wali Songo
UPDATE public.votes SET vote_count = 240  WHERE id = 'smpmts-9';  -- SMP ABBS
UPDATE public.votes SET vote_count = 100  WHERE id = 'smpmts-10'; -- SMP An Nur Al Anwar
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-11'; -- SMP Ibrahimy
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-12'; -- SMP Islam Plus Alfatih
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-13'; -- SMP Islam Roushon Fikr
UPDATE public.votes SET vote_count = 138  WHERE id = 'smpmts-14'; -- SMP Islam Teluk Jambe
UPDATE public.votes SET vote_count = 106  WHERE id = 'smpmts-15'; -- SMP IT Cordova
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-16'; -- SMP IT Tahfidzul Quran
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-17'; -- SMP Negeri 1 Banyuwangi
UPDATE public.votes SET vote_count = 2    WHERE id = 'smpmts-18'; -- SMP Negeri 1 Batealit
UPDATE public.votes SET vote_count = 18   WHERE id = 'smpmts-19'; -- SMP Negeri 1 Kertosono
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-20'; -- SMP Negeri 1 Ngetos
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-21'; -- SMP Negeri 1 Sawa
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-22'; -- SMP Negeri 11 Pasuruan
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-23'; -- SMP Negeri 2 Bangil
UPDATE public.votes SET vote_count = 117  WHERE id = 'smpmts-24'; -- SMP Negeri 2 Mojo
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-25'; -- SMP Negeri 2 Ngetos
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-26'; -- SMP Negeri 2 Taman
UPDATE public.votes SET vote_count = 25   WHERE id = 'smpmts-27'; -- SMP Negeri 3 Purwodadi
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-28'; -- SMP Negeri 4 Balikpapan
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-29'; -- SMP Negeri 5 Karawang
UPDATE public.votes SET vote_count = 1    WHERE id = 'smpmts-30'; -- SMP Negeri 7 Kota Madiun
UPDATE public.votes SET vote_count = 1    WHERE id = 'smpmts-31'; -- SMP Negeri 7 Surakarta
UPDATE public.votes SET vote_count = 4    WHERE id = 'smpmts-32'; -- SMP Negeri 9 Jambi
UPDATE public.votes SET vote_count = 3    WHERE id = 'smpmts-33'; -- SMP Negeri 37 Batam
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-34'; -- SMP Negeri 44 Batam
UPDATE public.votes SET vote_count = 0    WHERE id = 'smpmts-35'; -- SMP Negeri Giriyoso

-- ─── SMA/MA/SMK ──────────────────────────────────────────────────────────────
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-0';  -- MA Al I'Dadiyyah Bahrul Ulum
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-1';  -- MA Al Khidmah
UPDATE public.votes SET vote_count = 1    WHERE id = 'sma-2';  -- MA Negeri 1 Batam
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-3';  -- MA Negeri 1 Magetan
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-4';  -- MA Negeri 1 Surakarta
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-5';  -- MA Negeri 4 Jakarta Selatan
UPDATE public.votes SET vote_count = 11   WHERE id = 'sma-6';  -- MA Negeri Paser
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-7';  -- MA Nurul Hasan
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-8';  -- MAN 2 Tulungagung
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-9';  -- SAKA Wanabakti Sumba Timur
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-10'; -- SMA IT Assyifa Boarding School
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-11'; -- SMA IT Darul Quran
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-12'; -- SMA Negeri 1 Malinau
UPDATE public.votes SET vote_count = 28   WHERE id = 'sma-13'; -- SMA Negeri 1 Prambanan
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-14'; -- SMA Negeri 1 Tanjung Sari
UPDATE public.votes SET vote_count = 212  WHERE id = 'sma-15'; -- SMA Negeri 6 Balikpapan
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-16'; -- SMA S Perintis 1 Bandar Lampung
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-17'; -- SMA Wawonii Utara
UPDATE public.votes SET vote_count = 11   WHERE id = 'sma-18'; -- SMK Islam Sumedang
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-19'; -- SMK Negeri 1 Abang
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-20'; -- SMK Negeri 1 Kubutambahan
UPDATE public.votes SET vote_count = 19   WHERE id = 'sma-21'; -- SMK Negeri 2 Madiun
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-22'; -- SMK Negeri 19 Jakarta Pusat
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-23'; -- SMK Negeri 68 Jakarta
UPDATE public.votes SET vote_count = 0    WHERE id = 'sma-24'; -- SMK Syubbanul Wathon
UPDATE public.votes SET vote_count = 15   WHERE id = 'sma-25'; -- SMK Yadika 2 Grogol Petamburan

-- ─── Pangkalan Terpadu ───────────────────────────────────────────────────────
UPDATE public.votes SET vote_count = 0    WHERE id = 'terpadu-0'; -- Pesantren Terpadu Darrutaqwa
