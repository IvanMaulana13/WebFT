-- Table: akreditasi
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
