CREATE TABLE `visitor_logs` (`id` int AUTO_INCREMENT NOT NULL,`visitor_id` varchar(36) NOT NULL,`path` varchar(500) NOT NULL,`created_at` timestamp NOT NULL DEFAULT (now()),CONSTRAINT `visitor_logs_id` PRIMARY KEY(`id`));
--> statement-breakpoint
CREATE INDEX `visitor_logs_visitor_id_idx` ON `visitor_logs` (`visitor_id`);
--> statement-breakpoint
CREATE INDEX `visitor_logs_created_at_idx` ON `visitor_logs` (`created_at`);
