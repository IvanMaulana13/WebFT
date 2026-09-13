-- Table: visitor_logs
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `visitor_logs` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `visitor_id` VARCHAR(36) NOT NULL,
  `path` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `visitor_logs_visitor_id_idx` (`visitor_id`),
  KEY `visitor_logs_created_at_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
