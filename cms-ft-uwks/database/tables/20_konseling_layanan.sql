-- Table: konseling_layanan
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
