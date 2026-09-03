-- ============================================================
-- CMS FT UWKS — Full Setup SQL
-- Jalankan file ini setelah MySQL database `ft_uwks_cms` dibuat:
--   mysql -u root -p ft_uwks_cms < drizzle/setup_full.sql
-- ============================================================

-- Tabel users (harus dibuat pertama karena direferensi FK lain)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('super_admin','admin') NOT NULL DEFAULT 'admin',
  `is_active` boolean NOT NULL DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `users_id` PRIMARY KEY(`id`),
  CONSTRAINT `users_email_unique` UNIQUE(`email`)
);

CREATE TABLE IF NOT EXISTS `informasi` (
  `id` int AUTO_INCREMENT NOT NULL,
  `title` varchar(500) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(100),
  `order_index` int NOT NULL DEFAULT 0,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_by` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime,
  CONSTRAINT `informasi_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `berita` (
  `id` int AUTO_INCREMENT NOT NULL,
  `title` varchar(500) NOT NULL,
  `slug` varchar(500) NOT NULL,
  `content` text NOT NULL,
  `thumbnail_url` varchar(500),
  `category` varchar(100),
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `published_at` datetime,
  `created_by` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime,
  CONSTRAINT `berita_id` PRIMARY KEY(`id`),
  CONSTRAINT `berita_slug_unique` UNIQUE(`slug`)
);

CREATE TABLE IF NOT EXISTS `prestasi` (
  `id` int AUTO_INCREMENT NOT NULL,
  `title` varchar(500) NOT NULL,
  `achiever_name` varchar(255) NOT NULL,
  `level` enum('nasional','internasional') NOT NULL,
  `year` int NOT NULL,
  `image_url` varchar(500),
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime,
  CONSTRAINT `prestasi_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `kemitraan` (
  `id` int AUTO_INCREMENT NOT NULL,
  `partner_name` varchar(255) NOT NULL,
  `kategori_mitra` enum('universitas','lembaga') NOT NULL DEFAULT 'universitas',
  `logo_url` varchar(500),
  `partnership_type` varchar(100),
  `mou_date` date,
  `description` text,
  `website_url` varchar(500),
  `order_index` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime,
  CONSTRAINT `kemitraan_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `dosen` (
  `id` int AUTO_INCREMENT NOT NULL,
  `photo_url` varchar(500),
  `nik` varchar(30) NOT NULL,
  `kode_dosen` varchar(20) NOT NULL,
  `nidn` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `prodi` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime,
  CONSTRAINT `dosen_id` PRIMARY KEY(`id`),
  CONSTRAINT `dosen_nik_unique` UNIQUE(`nik`),
  CONSTRAINT `dosen_kode_dosen_unique` UNIQUE(`kode_dosen`),
  CONSTRAINT `dosen_nidn_unique` UNIQUE(`nidn`)
);

CREATE TABLE IF NOT EXISTS `tenaga_pendidikan` (
  `id` int AUTO_INCREMENT NOT NULL,
  `photo_url` varchar(500),
  `nuptk` varchar(20),
  `name` varchar(255) NOT NULL,
  `jabatan` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime,
  CONSTRAINT `tenaga_pendidikan_id` PRIMARY KEY(`id`),
  CONSTRAINT `tenaga_pendidikan_nuptk_unique` UNIQUE(`nuptk`)
);

CREATE TABLE IF NOT EXISTS `pimpinan_fakultas` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `photo_url` varchar(500),
  `jabatan` varchar(255) NOT NULL,
  `periode_mulai` date,
  `periode_selesai` date,
  `sambutan` text,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime,
  CONSTRAINT `pimpinan_fakultas_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `struktur_organisasi` (
  `id` int AUTO_INCREMENT NOT NULL,
  `image_url` varchar(500),
  `updated_by` int,
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `struktur_organisasi_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` int AUTO_INCREMENT NOT NULL,
  `user_id` int,
  `action` varchar(50) NOT NULL,
  `module` varchar(100) NOT NULL,
  `record_id` int,
  `detail` text,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);

-- Foreign Keys
ALTER TABLE `activity_logs`
  ADD CONSTRAINT IF NOT EXISTS `activity_logs_user_id_users_id_fk`
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL;

ALTER TABLE `berita`
  ADD CONSTRAINT IF NOT EXISTS `berita_created_by_users_id_fk`
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT;

ALTER TABLE `informasi`
  ADD CONSTRAINT IF NOT EXISTS `informasi_created_by_users_id_fk`
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT;

ALTER TABLE `struktur_organisasi`
  ADD CONSTRAINT IF NOT EXISTS `struktur_organisasi_updated_by_users_id_fk`
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL;

-- ============================================================
-- SEED: struktur_organisasi — 1 baris awal (single-record table)
-- image_url = NULL (placeholder sampai admin upload via dashboard)
-- ============================================================
INSERT IGNORE INTO `struktur_organisasi` (`id`, `image_url`, `updated_by`)
  VALUES (1, NULL, NULL);

-- Verifikasi
SHOW TABLES;
SELECT 'struktur_organisasi rows:' AS info, COUNT(*) AS total FROM struktur_organisasi;
