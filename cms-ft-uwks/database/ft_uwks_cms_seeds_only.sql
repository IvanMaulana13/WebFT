-- ====================================================================
-- CMS FT UWKS — SEED DATA ONLY (DATA AWAL / DUMMY DATA)
-- Jalankan setelah tabel-tabel berhasil dibuat di phpMyAdmin.
-- ====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Super Admin User (password: rontok123)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `is_active`)
VALUES (
  1,
  'Super Admin',
  'admin@ft.uwks.ac.id',
  '$2b$12$wf75.mYi7H7vGnWa/QwEjOYiUeZWFstHF3bQMtpllzxIpRu2G3eWu',
  'super_admin',
  1
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Single-record: struktur_organisasi
INSERT INTO `struktur_organisasi` (`id`, `image_url`, `updated_by`)
VALUES (1, NULL, NULL)
ON DUPLICATE KEY UPDATE `id` = 1;

-- 3. Single-record: site_settings
INSERT INTO `site_settings` (`id`, `hero_video_url`, `hero_poster_url`, `wa_number`, `wa_default_message`, `social_instagram`, `social_facebook`, `social_youtube`, `social_twitter`, `social_linkedin`, `updated_by`)
VALUES (1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE `id` = 1;

-- 4. Master Data: Program Studi FT UWKS
INSERT INTO `program_studi` (`id`, `nama`, `kode`)
VALUES 
  (1, 'Teknik Sipil', 'TS'),
  (2, 'Informatika', 'IF'),
  (3, 'Teknologi Industri Pertanian', 'TIP')
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);

-- 5. Single-record: kalender_akademik
INSERT INTO `kalender_akademik` (`id`, `file_url`, `tahun_ajaran`, `updated_by`)
VALUES (1, NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE `id` = 1;

-- 6. Single-record: pedoman_akademik
INSERT INTO `pedoman_akademik` (`id`, `file_url`, `updated_by`)
VALUES (1, NULL, NULL)
ON DUPLICATE KEY UPDATE `id` = 1;

-- 7. Single-record: konseling_layanan
INSERT INTO `konseling_layanan` (`id`, `narasi`, `offline_aktif`, `lokasi`, `jam_layanan_offline`, `online_aktif`, `kontak_penanggung_jawab`, `updated_by`)
VALUES (1, NULL, 0, NULL, NULL, 0, NULL, NULL)
ON DUPLICATE KEY UPDATE `id` = 1;

-- 8. Data Awal Kemitraan (6 Universitas Mitra & 6 Lembaga Mitra)
INSERT INTO `kemitraan` (`id`, `partner_name`, `kategori_mitra`, `logo_url`, `partnership_type`, `mou_date`, `description`, `website_url`, `order_index`)
VALUES 
  (1, 'Universitas Indonesia', 'universitas', 'https://placehold.co/200x100?text=Universitas+Indonesia', 'Pertukaran Mahasiswa & Riset', '2025-01-10', 'Kerjasama program pertukaran pelajar dan riset bersama', 'https://ui.ac.id', 0),
  (2, 'Institut Teknologi Bandung', 'universitas', 'https://placehold.co/200x100?text=ITB', 'Riset Bersama', '2025-02-15', 'Kolaborasi publikasi ilmiah dan penelitian rekayasa', 'https://itb.ac.id', 1),
  (3, 'Universitas Gadjah Mada', 'universitas', 'https://placehold.co/200x100?text=UGM', 'Program Dual Degree', '2025-03-20', 'Kerjasama kurikulum dan transfer kredit mahasiswa', 'https://ugm.ac.id', 2),
  (4, 'Universitas Airlangga', 'universitas', 'https://placehold.co/200x100?text=UNAIR', 'Joint Conference', '2025-04-05', 'Penyelenggaraan konferensi internasional tahunan', 'https://unair.ac.id', 3),
  (5, 'Institut Teknologi Sepuluh Nopember', 'universitas', 'https://placehold.co/200x100?text=ITS', 'Visiting Professor', '2025-05-12', 'Program dosen tamu dan penguji skripsi bersama', 'https://its.ac.id', 4),
  (6, 'Universitas Brawijaya', 'universitas', 'https://placehold.co/200x100?text=UB', 'Kerjasama Akademik', '2025-06-01', 'Kerjasama pengabdian masyarakat terpadu', 'https://ub.ac.id', 5),
  (7, 'PT Semen Indonesia', 'lembaga', 'https://placehold.co/200x100?text=PT+Semen+Indonesia', 'Magang Industri', '2025-01-15', 'Program magang bersertifikat dan penelitian lapangan', 'https://sig.id', 0),
  (8, 'PT Telkom Indonesia', 'lembaga', 'https://placehold.co/200x100?text=PT+Telkom+Indonesia', 'Sertifikasi Kompetensi', '2025-02-20', 'Pelatihan dan uji kompetensi jaringan & cloud', 'https://telkom.co.id', 1),
  (9, 'PT Astra International', 'lembaga', 'https://placehold.co/200x100?text=PT+Astra+International', 'Pengembangan Kurikulum', '2025-03-10', 'Penyelarasan kurikulum teknik dengan kebutuhan industri', 'https://astra.co.id', 2),
  (10, 'PT PLN (Persero)', 'lembaga', 'https://placehold.co/200x100?text=PT+PLN', 'Penyaluran Lulusan', '2025-04-18', 'Perekrutan langsung dan career fair berkala', 'https://pln.co.id', 3),
  (11, 'PT Wijaya Karya (WIKA)', 'lembaga', 'https://placehold.co/200x100?text=PT+WIKA', 'Praktik Kerja Lapangan', '2025-05-25', 'Praktek lapangan mahasiswa teknik sipil di proyek nasional', 'https://wika.co.id', 4),
  (12, 'Badan Riset dan Inovasi Nasional (BRIN)', 'lembaga', 'https://placehold.co/200x100?text=BRIN', 'Beasiswa & Riset Industri', '2025-06-15', 'Pendanaan skripsi dan penelitian rekayasa terapan', 'https://brin.go.id', 5)
ON DUPLICATE KEY UPDATE `partner_name` = VALUES(`partner_name`);

SET FOREIGN_KEY_CHECKS = 1;
