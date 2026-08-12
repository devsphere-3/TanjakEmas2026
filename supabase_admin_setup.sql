-- ═══════════════════════════════════════════════════════════════════════════
-- TANJAK EMAS 2026 — Admin Setup
-- ═══════════════════════════════════════════════════════════════════════════


-- ─── EXTENSIONS ──────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ─── TABLES ──────────────────────────────────────────────────────────────────

CREATE TABLE admins (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT        UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'admin',  -- 'admin' | 'master'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_logs (
  id             SERIAL      PRIMARY KEY,
  admin_username TEXT        NOT NULL,
  school_id      TEXT        NOT NULL,
  school_name    TEXT        NOT NULL,
  action         TEXT        NOT NULL,   -- 'add' | 'subtract' | 'reset'
  points_changed INTEGER     NOT NULL,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─── SEED: master admin ───────────────────────────────────────────────────────
-- Ganti 'BADANG123' dengan password yang lebih kuat sebelum dijalankan.

INSERT INTO admins (username, password_hash, role)
VALUES (
  'MASTER',
  crypt('BADANG123', gen_salt('bf', 10)),
  'master'
);


-- ─── FUNCTIONS ───────────────────────────────────────────────────────────────

-- Verifikasi login admin (dipanggil oleh AdminLogin.jsx)
CREATE OR REPLACE FUNCTION verify_admin_login(
  p_username TEXT,
  p_password TEXT
)
RETURNS TABLE (id UUID, username TEXT, role TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.username, a.role
  FROM   admins a
  WHERE  a.username      = p_username
    AND  a.password_hash = crypt(p_password, a.password_hash);
END;
$$;

-- Buat admin baru (dipanggil oleh AdminPanel.jsx — tab Kelola Admin)
CREATE OR REPLACE FUNCTION create_admin(
  p_username TEXT,
  p_password TEXT,
  p_role     TEXT DEFAULT 'admin'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admins (username, password_hash, role)
  VALUES (
    p_username,
    crypt(p_password, gen_salt('bf', 10)),
    p_role
  );
END;
$$;

-- Hapus admin (tidak bisa hapus role master)
CREATE OR REPLACE FUNCTION delete_admin(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM admins
  WHERE id   = p_id
    AND role <> 'master';
END;
$$;


-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

-- votes: publik bisa baca, hanya service_role yang bisa update
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS allow_public_read_votes   ON votes;
DROP POLICY IF EXISTS allow_service_update_votes ON votes;

CREATE POLICY allow_public_read_votes
  ON votes FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY allow_service_update_votes
  ON votes FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- admin_logs: siapa saja bisa baca & insert (admin panel pakai anon key)
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS allow_public_read_logs ON admin_logs;
DROP POLICY IF EXISTS allow_anon_insert_logs ON admin_logs;

CREATE POLICY allow_public_read_logs
  ON admin_logs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY allow_anon_insert_logs
  ON admin_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- admins: siapa saja bisa baca (password_hash tidak di-select di frontend)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS allow_read_admins ON admins;

CREATE POLICY allow_read_admins
  ON admins FOR SELECT
  TO anon, authenticated
  USING (true);


-- ─── CLEANUP ──────────────────────────────────────────────────────────────────

DELETE FROM admins WHERE username = 'TESTADMIN';
