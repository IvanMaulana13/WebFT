-- ====================================================================
-- CMS FT UWKS — FULL SETUP SQL (ALL TABLES & SEEDS)
-- Dialect: MySQL 8.0+ / MariaDB 10.4+
-- ====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+07:00";

-- --------------------------------------------------------------------
-- 1. users
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. berita
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `berita` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `thumbnail_url` VARCHAR(500) DEFAULT NULL,
  `category` ENUM('berita', 'kegiatan', 'beasiswa') NOT NULL DEFAULT 'berita',
  `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  `published_at` DATETIME DEFAULT NULL,
  `created_by` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `berita_slug_unique` (`slug`),
  KEY `berita_created_by_idx` (`created_by`),
  CONSTRAINT `fk_berita_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. prestasi
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `prestasi` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `achiever_name` VARCHAR(255) NOT NULL,
  `level` ENUM('kabupaten', 'provinsi', 'nasional', 'internasional') NOT NULL,
  `year` INT NOT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. kemitraan
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `kemitraan` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `partner_name` VARCHAR(255) NOT NULL,
  `kategori_mitra` ENUM('universitas', 'lembaga') NOT NULL DEFAULT 'universitas',
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `partnership_type` VARCHAR(100) DEFAULT NULL,
  `mou_date` DATE DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `website_url` VARCHAR(500) DEFAULT NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. dosen
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dosen` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `photo_url` VARCHAR(500) DEFAULT NULL,
  `nik` VARCHAR(30) NOT NULL,
  `kode_dosen` VARCHAR(20) NOT NULL,
  `nidn` VARCHAR(20) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `prodi` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dosen_nik_unique` (`nik`),
  UNIQUE KEY `dosen_kode_dosen_unique` (`kode_dosen`),
  UNIQUE KEY `dosen_nidn_unique` (`nidn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. tenaga_pendidikan
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tenaga_pendidikan` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `photo_url` VARCHAR(500) DEFAULT NULL,
  `nuptk` VARCHAR(20) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `jabatan` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenaga_pendidikan_nuptk_unique` (`nuptk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. pimpinan_fakultas
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pimpinan_fakultas` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `photo_url` VARCHAR(500) DEFAULT NULL,
  `jabatan` VARCHAR(255) NOT NULL,
  `periode_mulai` DATE DEFAULT NULL,
  `periode_selesai` DATE DEFAULT NULL,
  `sambutan` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. struktur_organisasi
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `struktur_organisasi` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `struktur_organisasi_updated_by_idx` (`updated_by`),
  CONSTRAINT `fk_struktur_organisasi_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 9. site_settings
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `hero_video_url` VARCHAR(500) DEFAULT NULL,
  `hero_poster_url` VARCHAR(500) DEFAULT NULL,
  `wa_number` VARCHAR(20) DEFAULT NULL,
  `wa_default_message` TEXT DEFAULT NULL,
  `social_instagram` VARCHAR(500) DEFAULT NULL,
  `social_facebook` VARCHAR(500) DEFAULT NULL,
  `social_youtube` VARCHAR(500) DEFAULT NULL,
  `social_twitter` VARCHAR(500) DEFAULT NULL,
  `social_linkedin` VARCHAR(500) DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `site_settings_updated_by_idx` (`updated_by`),
  CONSTRAINT `fk_site_settings_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 10. activity_logs
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(50) NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `record_id` INT DEFAULT NULL,
  `detail` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `activity_logs_user_id_idx` (`user_id`),
  CONSTRAINT `fk_activity_logs_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 11. visitor_logs
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `visitor_logs` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `visitor_id` VARCHAR(36) NOT NULL,
  `path` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `visitor_logs_visitor_id_idx` (`visitor_id`),
  KEY `visitor_logs_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 12. program_studi
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `program_studi` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `kode` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `program_studi_kode_unique` (`kode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 13. kalender_akademik
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `kalender_akademik` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `file_url` VARCHAR(500) DEFAULT NULL,
  `tahun_ajaran` VARCHAR(20) DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `kalender_akademik_updated_by_idx` (`updated_by`),
  CONSTRAINT `fk_kalender_akademik_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 14. pedoman_akademik
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pedoman_akademik` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `file_url` VARCHAR(500) DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pedoman_akademik_updated_by_idx` (`updated_by`),
  CONSTRAINT `fk_pedoman_akademik_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 15. jadwal_kuliah
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jadwal_kuliah` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `prodi_id` INT NOT NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `semester` ENUM('ganjil', 'genap') NOT NULL,
  `tahun_ajaran` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `jadwal_kuliah_prodi_id_idx` (`prodi_id`),
  CONSTRAINT `fk_jadwal_kuliah_prodi_id` FOREIGN KEY (`prodi_id`) REFERENCES `program_studi` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 16. akreditasi
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `akreditasi` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `prodi_id` INT NOT NULL,
  `peringkat` VARCHAR(100) NOT NULL,
  `no_sk` VARCHAR(255) NOT NULL,
  `tanggal_berlaku` DATE NOT NULL,
  `file_sertifikat` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `akreditasi_prodi_id_idx` (`prodi_id`),
  CONSTRAINT `fk_akreditasi_prodi_id` FOREIGN KEY (`prodi_id`) REFERENCES `program_studi` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 17. prosedur_akademik
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `prosedur_akademik` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `judul_sop` VARCHAR(500) NOT NULL,
  `narasi` LONGTEXT NOT NULL,
  `file_url` VARCHAR(500) DEFAULT NULL,
  `link_url` VARCHAR(500) DEFAULT NULL,
  `penanggung_jawab` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 18. ormawa
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ormawa` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `deskripsi` TEXT NOT NULL,
  `website_url` VARCHAR(500) DEFAULT NULL,
  `instagram_url` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 19. lomba
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lomba` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `nama_lomba` VARCHAR(500) NOT NULL,
  `tingkat` ENUM('nasional', 'internasional') NOT NULL,
  `tanggal_mulai_pendaftaran` DATE NOT NULL,
  `tanggal_selesai_pendaftaran` DATE NOT NULL,
  `link_pendaftaran` VARCHAR(500) NOT NULL,
  `poster_url` TEXT DEFAULT NULL,
  `deskripsi` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 20. konseling_layanan
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `konseling_layanan` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `narasi` TEXT DEFAULT NULL,
  `offline_aktif` BOOLEAN NOT NULL DEFAULT FALSE,
  `lokasi` TEXT DEFAULT NULL,
  `jam_layanan_offline` VARCHAR(255) DEFAULT NULL,
  `online_aktif` BOOLEAN NOT NULL DEFAULT FALSE,
  `kontak_penanggung_jawab` VARCHAR(255) DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `konseling_layanan_updated_by_idx` (`updated_by`),
  CONSTRAINT `fk_konseling_layanan_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 21. jadwal_konseling
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jadwal_konseling` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `tanggal` DATE NOT NULL,
  `jam` VARCHAR(50) NOT NULL,
  `status` ENUM('tersedia', 'terisi') NOT NULL DEFAULT 'tersedia',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;


-- ====================================================================
-- SEED DATA AWAL
-- ====================================================================

-- 1. Super Admin User (password: rontok123)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `is_active`)
VALUES (
  1,
  'Super Admin',
  'admin@ft.uwks.ac.id',
  '$2b$12$wf75.mYi7H7vGnWa/QwEjOYiUeZWFstHF3bQMtpllzxIpRu2G3eWu',
  'super_admin',
  1
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Single-record: struktur_organisasi
INSERT INTO `struktur_organisasi` (`id`, `image_url`, `updated_by`)
VALUES (1, NULL, NULL)
ON DUPLICATE KEY UPDATE `id` = 1;

-- 3. Single-record: site_settings
INSERT INTO `site_settings` (`id`, `hero_video_url`, `hero_poster_url`, `wa_number`, `wa_default_message`, `social_instagram`, `social_facebook`, `social_youtube`, `social_twitter`, `social_linkedin`, `updated_by`)
VALUES (1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE `id` = 1;

-- 4. Master Data: Program Studi FT UWKS
INSERT INTO `program_studi` (`id`, `nama`, `kode`)
VALUES 
  (1, 'Teknik Sipil', 'TS'),
  (2, 'Informatika', 'IF'),
  (3, 'Teknologi Industri Pertanian', 'TIP')
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);

-- 5. Single-record: kalender_akademik
INSERT INTO `kalender_akademik` (`id`, `file_url`, `tahun_ajaran`, `updated_by`)
VALUES (1, NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE `id` = 1;

-- 6. Single-record: pedoman_akademik
INSERT INTO `pedoman_akademik` (`id`, `file_url`, `updated_by`)
VALUES (1, NULL, NULL)
ON DUPLICATE KEY UPDATE `id` = 1;

-- 7. Single-record: konseling_layanan
INSERT INTO `konseling_layanan` (`id`, `narasi`, `offline_aktif`, `lokasi`, `jam_layanan_offline`, `online_aktif`, `kontak_penanggung_jawab`, `updated_by`)
VALUES (1, NULL, 0, NULL, NULL, 0, NULL, NULL)
ON DUPLICATE KEY UPDATE `id` = 1;

-- 8. Data Awal Kemitraan
INSERT INTO `kemitraan` (`id`, `partner_name`, `kategori_mitra`, `logo_url`, `partnership_type`, `mou_date`, `description`, `website_url`, `order_index`)
VALUES 
  (1, 'Universitas Indonesia', 'universitas', 'https://placehold.co/200x100?text=Universitas+Indonesia', 'Pertukaran Mahasiswa & Riset', '2025-01-10', 'Kerjasama program pertukaran pelajar dan riset bersama', 'https://ui.ac.id', 0),
  (2, 'Institut Teknologi Bandung', 'universitas', 'https://placehold.co/200x100?text=ITB', 'Riset Bersama', '2025-02-15', 'Kolaborasi publikasi ilmiah dan penelitian rekayasa', 'https://itb.ac.id', 1),
  (3, 'Universitas Gadjah Mada', 'universitas', 'https://placehold.co/200x100?text=UGM', 'Program Dual Degree', '2025-03-20', 'Kerjasama kurikulum dan transfer kredit mahasiswa', 'https://ugm.ac.id', 2),
  (4, 'Universitas Airlangga', 'universitas', 'https://placehold.co/200x100?text=UNAIR', 'Joint Conference', '2025-04-05', 'Penyelenggaraan konferensi internasional tahunan', 'https://unair.ac.id', 3),
  (5, 'Institut Teknologi Sepuluh Nopember', 'universitas', 'https://placehold.co/200x100?text=ITS', 'Visiting Professor', '2025-05-12', 'Program dosen tamu dan penguji skripsi bersama', 'https://its.ac.id', 4),
  (6, 'Universitas Brawijaya', 'universitas', 'https://placehold.co/200x100?text=UB', 'Kerjasama Akademik', '2025-06-01', 'Kerjasama pengabdian masyarakat terpadu', 'https://ub.ac.id', 5),
  (7, 'PT Semen Indonesia', 'lembaga', 'https://placehold.co/200x100?text=PT+Semen+Indonesia', 'Magang Industri', '2025-01-15', 'Program magang bersertifikat dan penelitian lapangan', 'https://sig.id', 0),
  (8, 'PT Telkom Indonesia', 'lembaga', 'https://placehold.co/200x100?text=PT+Telkom+Indonesia', 'Sertifikasi Kompetensi', '2025-02-20', 'Pelatihan dan uji kompetensi jaringan & cloud', 'https://telkom.co.id', 1),
  (9, 'PT Astra International', 'lembaga', 'https://placehold.co/200x100?text=PT+Astra+International', 'Pengembangan Kurikulum', '2025-03-10', 'Penyelarasan kurikulum teknik dengan kebutuhan industri', 'https://astra.co.id', 2),
  (10, 'PT PLN (Persero)', 'lembaga', 'https://placehold.co/200x100?text=PT+PLN', 'Penyaluran Lulusan', '2025-04-18', 'Perekrutan langsung dan career fair berkala', 'https://pln.co.id', 3),
  (11, 'PT Wijaya Karya (WIKA)', 'lembaga', 'https://placehold.co/200x100?text=PT+WIKA', 'Praktik Kerja Lapangan', '2025-05-25', 'Praktek lapangan mahasiswa teknik sipil di proyek nasional', 'https://wika.co.id', 4),
  (12, 'Badan Riset dan Inovasi Nasional (BRIN)', 'lembaga', 'https://placehold.co/200x100?text=BRIN', 'Beasiswa & Riset Industri', '2025-06-15', 'Pendanaan skripsi dan penelitian rekayasa terapan', 'https://brin.go.id', 5)
ON DUPLICATE KEY UPDATE `partner_name` = VALUES(`partner_name`);
