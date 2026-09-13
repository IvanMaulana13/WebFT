-- Table: jadwal_kuliah
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
