-- =====================================================
-- MIGRATION: Buat tabel visitor_logs
-- Jalankan script ini via MySQL Workbench / phpMyAdmin
-- atau saat dev server tidak running (stop dulu)
-- =====================================================

USE ft_uwks_cms;

CREATE TABLE IF NOT EXISTS isitor_logs (
  id int AUTO_INCREMENT NOT NULL,
  isitor_id varchar(36) NOT NULL,
  path varchar(500) NOT NULL,
  created_at timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT isitor_logs_id PRIMARY KEY(id)
);

-- Index untuk query COUNT(DISTINCT visitor_id) yang efisien
CREATE INDEX IF NOT EXISTS isitor_logs_visitor_id_idx 
  ON isitor_logs (isitor_id);

-- Index untuk filter berdasarkan tanggal (hari ini, 7 hari, 30 hari)
CREATE INDEX IF NOT EXISTS isitor_logs_created_at_idx 
  ON isitor_logs (created_at);

-- Verifikasi
SELECT 'Table visitor_logs created successfully' AS status;
SHOW CREATE TABLE visitor_logs;
