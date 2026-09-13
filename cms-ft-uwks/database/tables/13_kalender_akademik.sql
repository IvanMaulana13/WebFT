-- Table: kalender_akademik
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
