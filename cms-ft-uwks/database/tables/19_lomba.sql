-- Table: lomba
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
