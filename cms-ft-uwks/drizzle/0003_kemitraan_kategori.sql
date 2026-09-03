ALTER TABLE `kemitraan` ADD `kategori_mitra` enum('universitas','lembaga') NOT NULL DEFAULT 'universitas';
--> statement-breakpoint
UPDATE `kemitraan` SET `kategori_mitra` = 'universitas' WHERE `kategori_mitra` IS NULL;
