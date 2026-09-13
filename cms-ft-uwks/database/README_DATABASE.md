# Panduan Import Database phpMyAdmin — CMS FT UWKS

Dokumen ini berisi panduan untuk mengimpor skema dan data database proyek **Web FT UWKS** ke dalam **phpMyAdmin** (khususnya untuk database `sql_ft_uwks_ac_id` pada server hosting kampus `https://ft.uwks.ac.id:887`).

---

## 📁 File SQL yang Tersedia

Kami telah menyiapkan file SQL yang sudah disesuaikan agar **langsung kompatibel tanpa error hak akses** di phpMyAdmin:

| File | Lokasi | Keterangan |
|---|---|---|
| **`database_import_phpmyadmin.sql`** *(Direkomendasikan)* | Di root folder proyek & di dalam folder `cms-ft-uwks/` | **All-in-One**: Berisi 21 struktur tabel lengkap + data awal (Super Admin, Master Prodi, Pengaturan, & Dummy Mitra). |
| **`ft_uwks_cms_schema_only.sql`** | `cms-ft-uwks/database/` | Hanya struktur 21 tabel (tanpa baris data awal). |
| **`ft_uwks_cms_seeds_only.sql`** | `cms-ft-uwks/database/` | Hanya data awal / dummy data (dijalankan jika tabel sudah ada). |

---

## 🚀 Langkah-langkah Import ke phpMyAdmin

Berdasarkan halaman phpMyAdmin Anda (`Database: sql_ft_uwks_ac_id`):

1. **Buka phpMyAdmin** di browser Anda:
   `https://ft.uwks.ac.id:887/phpmyadmin_...`
2. **Pilih Database**:
   Di panel sebelah kiri, pastikan Anda sudah mengklik nama database **`sql_ft_uwks_ac_id`** (seperti yang ada di screenshot Anda).
3. **Buka Tab Import**:
   Klik tab menu **Import** pada bar navigasi atas.
4. **Pilih File SQL**:
   Pada bagian *File to import*, klik tombol **Choose File** / **Browse**, lalu pilih file:
   ```
   database_import_phpmyadmin.sql
   ```
5. **Konfigurasi Tambahan**:
   - Format: biarkan **SQL**.
   - Pengaturan lainnya biarkan default.
6. **Eksekusi**:
   Scroll ke bagian paling bawah, lalu klik tombol **Import** (atau **Go** / **Kirim**).
7. **Selesai**:
   Tunggu beberapa detik hingga muncul pesan notifikasi berwarna hijau:
   > *"Import has been successfully finished, xx queries executed."*

---

## 📋 Daftar 21 Tabel yang Dibuat

Setelah import berhasil, database `sql_ft_uwks_ac_id` akan memiliki 21 tabel berikut:

### A. Autentikasi & Pengaturan Sistem
1. **`users`** — Akun Super Admin & Admin CMS.
2. **`site_settings`** — Pengaturan umum website (Hero video/poster, nomor WhatsApp floating bubble, link sosial media).
3. **`activity_logs`** — Riwayat audit aktivitas (siapa yang menambah/mengubah data apa).
4. **`visitor_logs`** — Statistik pengunjung anonim website FT.

### B. Konten Publik & Profil Fakultas
5. **`berita`** — Berita, Kegiatan, dan Informasi Beasiswa (lengkap dengan slug SEO, status draft/published, dan kategori enum).
6. **`prestasi`** — Prestasi mahasiswa dan dosen (Tingkat kabupaten, provinsi, nasional, internasional).
7. **`kemitraan`** — Kerjasama mitra universitas dan industri/lembaga (telah terisi 12 mitra awal untuk slider logo).
8. **`dosen`** — Data Dosen Pengajar FT (NIDN, NIK, Kode Dosen, Prodi, Email, Foto).
9. **`tenaga_pendidikan`** — Data Staf & Tenaga Kependidikan (NUPTK, Jabatan, Email, Foto).
10. **`pimpinan_fakultas`** — Dekan, Wakil Dekan, Kaprodi, dan sambutan Dekan.
11. **`struktur_organisasi`** — Bagan gambar struktur organisasi fakultas.

### C. Modul Akademik
12. **`program_studi`** — Master Data Prodi (Teknik Sipil [TS], Informatika [IF], Teknologi Industri Pertanian [TIP]).
13. **`kalender_akademik`** — File PDF Kalender Akademik aktif per tahun ajaran.
14. **`pedoman_akademik`** — File PDF Panduan Buku Pedoman Akademik.
15. **`jadwal_kuliah`** — File PDF Jadwal Perkuliahan per semester & per program studi.
16. **`akreditasi`** — Sertifikat & Peringkat Akreditasi BAN-PT / LAM per prodi.
17. **`prosedur_akademik`** — Standar Operasional Prosedur (SOP) & Layanan Akademik FT.

### D. Modul Kemahasiswaan
18. **`ormawa`** — Data Himpunan & Organisasi Mahasiswa FT.
19. **`lomba`** — Informasi Lomba & Kompetisi Mahasiswa (Nasional / Internasional).
20. **`konseling_layanan`** — Informasi jam dan lokasi layanan bimbingan konseling mahasiswa.
21. **`jadwal_konseling`** — Slot jadwal temu konseling online bagi mahasiswa.

---

## 🔑 Akun Default CMS Setelah Import

File import sudah langsung membuatkan 1 akun **Super Admin** siap pakai:

- **URL Login**: `http://localhost:3000/login` (atau domain produksi Anda `/login`)
- **Email**: `admin@ft.uwks.ac.id`
- **Password**: `rontok123`
- **Role**: `super_admin`
