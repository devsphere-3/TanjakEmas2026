-- ═══════════════════════════════════════════════════════════════════════════
-- TANJAK EMAS 2026 — Import Poin Awal
-- Jalankan di Supabase → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════════════
-- Catatan: query ini MENAMBAHKAN poin ke nilai yang sudah ada (bukan replace).
-- Jika ingin SET langsung (replace), ganti vote_count + ... dengan nilai poin.
-- ═══════════════════════════════════════════════════════════════════════════

UPDATE public.votes SET vote_count = vote_count + 732  WHERE id = 'sdmi-0';    -- MI Miftahul Huda Pandantoyo
UPDATE public.votes SET vote_count = vote_count + 100  WHERE id = 'sdmi-6';    -- SD Islam Salafiyah
UPDATE public.votes SET vote_count = vote_count + 10   WHERE id = 'sdmi-4';    -- SD Al Araf Islamic School
UPDATE public.votes SET vote_count = vote_count + 25   WHERE id = 'sdmi-9';    -- SD Negeri Jurang Mangu Barat 01
UPDATE public.votes SET vote_count = vote_count + 35   WHERE id = 'sdmi-10';   -- SDIT Nur El Qolam

UPDATE public.votes SET vote_count = vote_count + 1    WHERE id = 'smpmts-0';  -- MTs Islamiyah Nguwok
UPDATE public.votes SET vote_count = vote_count + 240  WHERE id = 'smpmts-9';  -- SMP ABBS
UPDATE public.votes SET vote_count = vote_count + 100  WHERE id = 'smpmts-10'; -- SMP An Nur Al Anwar
UPDATE public.votes SET vote_count = vote_count + 138  WHERE id = 'smpmts-14'; -- SMP Islam Teluk Jambe
UPDATE public.votes SET vote_count = vote_count + 106  WHERE id = 'smpmts-15'; -- SMP IT Cordova
UPDATE public.votes SET vote_count = vote_count + 2    WHERE id = 'smpmts-18'; -- SMP Negeri 1 Batealit
UPDATE public.votes SET vote_count = vote_count + 18   WHERE id = 'smpmts-19'; -- SMP Negeri 1 Kertosono
UPDATE public.votes SET vote_count = vote_count + 117  WHERE id = 'smpmts-24'; -- SMP Negeri 2 Mojo
UPDATE public.votes SET vote_count = vote_count + 25   WHERE id = 'smpmts-27'; -- SMP Negeri 3 Purwodadi
UPDATE public.votes SET vote_count = vote_count + 1    WHERE id = 'smpmts-30'; -- SMP Negeri 7 Kota Madiun
UPDATE public.votes SET vote_count = vote_count + 1    WHERE id = 'smpmts-31'; -- SMP Negeri 7 Surakarta
UPDATE public.votes SET vote_count = vote_count + 4    WHERE id = 'smpmts-32'; -- SMP Negeri 9 Jambi
UPDATE public.votes SET vote_count = vote_count + 3    WHERE id = 'smpmts-33'; -- SMP Negeri 37 Batam

UPDATE public.votes SET vote_count = vote_count + 1    WHERE id = 'sma-2';     -- MA Negeri 1 Batam
UPDATE public.votes SET vote_count = vote_count + 11   WHERE id = 'sma-6';     -- MA Negeri Paser
UPDATE public.votes SET vote_count = vote_count + 28   WHERE id = 'sma-13';    -- SMA Negeri 1 Prambanan
UPDATE public.votes SET vote_count = vote_count + 212  WHERE id = 'sma-15';    -- SMA Negeri 6 Balikpapan
UPDATE public.votes SET vote_count = vote_count + 11   WHERE id = 'sma-18';    -- SMK Islam Sumedang
UPDATE public.votes SET vote_count = vote_count + 19   WHERE id = 'sma-21';    -- SMK Negeri 2 Madiun
UPDATE public.votes SET vote_count = vote_count + 15   WHERE id = 'sma-25';    -- SMK Yadika 2 Grogol Petamburan
