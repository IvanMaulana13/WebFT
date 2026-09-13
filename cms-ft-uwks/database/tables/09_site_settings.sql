-- Table: site_settings
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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

SET FOREIGN_KEY_CHECKS = 1;
