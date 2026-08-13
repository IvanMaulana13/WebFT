CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hero_video_url` varchar(500),
	`hero_poster_url` varchar(500),
	`wa_number` varchar(20),
	`wa_default_message` text,
	`social_instagram` varchar(500),
	`social_facebook` varchar(500),
	`social_youtube` varchar(500),
	`social_twitter` varchar(500),
	`social_linkedin` varchar(500),
	`updated_by` int,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `site_settings` ADD CONSTRAINT `site_settings_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;