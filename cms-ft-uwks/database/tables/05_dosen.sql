-- Table: dosen
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
