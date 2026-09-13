-- ====================================================================
-- CMS FT UWKS — SCHEMA ONLY (STRUKTUR TABEL SAJA TANPA DATA)
-- Cocok untuk phpMyAdmin: sql_ft_uwks_ac_id
-- ====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+07:00";

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

CREATE TABLE IF NOT EXISTS `struktur_organisasi` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `struktur_organisasi_updated_by_idx` (`updated_by`),
  CONSTRAINT `fk_struktur_organisasi_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS `visitor_logs` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `visitor_id` VARCHAR(36) NOT NULL,
  `path` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `visitor_logs_visitor_id_idx` (`visitor_id`),
  KEY `visitor_logs_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `program_studi` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `kode` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `program_studi_kode_unique` (`kode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS `pedoman_akademik` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `file_url` VARCHAR(500) DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pedoman_akademik_updated_by_idx` (`updated_by`),
  CONSTRAINT `fk_pedoman_akademik_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
