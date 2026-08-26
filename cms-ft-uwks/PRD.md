# Product Requirements Document (PRD)
## Dashboard CMS — Website Fakultas Teknik Universitas Wijaya Kusuma Surabaya (FT UWKS)

| | |
|---|---|
| **Versi** | 1.0 |
| **Tanggal** | 16 Juli 2026 |
| **Status** | Draft |
| **Pemilik Produk** | Fakultas Teknik UWKS |

---

## 1. Ringkasan Eksekutif

Website FT UWKS saat ini berisi halaman publik (Beranda, Visi & Misi, Sejarah Fakultas, Pimpinan Fakultas, Struktur Organisasi) yang kontennya masih dikelola secara manual/hardcode. Dibutuhkan **dashboard admin (CMS)** agar staf fakultas dapat mengelola konten website secara mandiri tanpa bantuan developer, dengan sistem login yang aman dan hak akses yang jelas.

Dashboard ini akan menangani:
- **CRUD** untuk konten: **Informasi, Berita, Prestasi, Kemitraan**
- **CRUD** untuk **Data Dosen** dan **Data Tenaga Pendidikan**
- **CRUD** untuk **Data Pimpinan Fakultas**, serta pengelolaan gambar **Struktur Organisasi** (gambar statis)
- **Modul Akademik**: Kalender Akademik & Pedoman Akademik (upload file), Jadwal Perkuliahan & Akreditasi (relasi ke Program Studi), Prosedur Akademik
- **Pengaturan Situs**: hero video, nomor WhatsApp (floating bubble), dan link media sosial di footer
- **Sistem autentikasi (login)** untuk admin

---

## 2. Latar Belakang & Tujuan

### 2.1 Latar Belakang
Berdasarkan desain front-end yang sudah ada (masih tahap proses), halaman publik menampilkan section seperti Informasi, Berita, Prestasi, Kemitraan di Beranda, serta halaman Pimpinan Fakultas dan Struktur Organisasi yang menampilkan data personil. Saat ini konten-konten tersebut kemungkinan besar berupa data statis, sehingga sulit di-update secara berkala.

### 2.2 Tujuan
1. Memungkinkan admin fakultas mengelola konten (tambah/edit/hapus) tanpa perlu mengubah kode.
2. Menyediakan sistem login yang aman untuk membatasi akses hanya pada pihak berwenang.
3. Menyediakan pengelolaan data dosen dan pimpinan fakultas yang terstruktur dan dapat digunakan ulang di berbagai halaman (Pimpinan Fakultas, Struktur Organisasi, dsb).
4. Membangun fondasi teknis yang scalable menggunakan stack modern (Next.js, Bun, MySQL).

### 2.3 Target Pengguna Dashboard
- **Admin/Staf Tata Usaha Fakultas** — mengelola berita, informasi, prestasi, kemitraan sehari-hari.
- **Super Admin** — mengelola user lain, data dosen & pimpinan fakultas, serta pengaturan sistem.

---

## 3. Ruang Lingkup

### 3.1 In-Scope
- Sistem login (autentikasi) & manajemen sesi.
- Modul CRUD: Informasi, Berita, Prestasi, Kemitraan.
- Modul CRUD: Data Dosen, Data Pimpinan Fakultas.
- Upload & manajemen gambar/logo/foto (untuk berita, kemitraan, foto dosen/pimpinan).
- Halaman publik yang menarik data secara dinamis dari database (bukan lagi hardcode).
- Role-based access control (minimal 2 peran: Super Admin & Admin).

### 3.2 Out-of-Scope (Fase 1)
- Multi-bahasa (i18n) untuk konten.
- Sistem komentar/interaksi publik di berita.
- Integrasi akademik (SIAKAD, e-learning, dsb).
- Aplikasi mobile native.

> Bagian di atas bisa dipertimbangkan sebagai fase 2 apabila dibutuhkan.

---

## 4. Aktor & Hak Akses (Role)

| Role | Deskripsi | Hak Akses |
|---|---|---|
| **Super Admin** | Pengelola utama sistem (mis. Kepala TU/Wadek) | Semua akses: CRUD semua modul, kelola user/admin lain, lihat log aktivitas |
| **Admin/Editor** | Staf yang mengelola konten harian | CRUD Informasi, Berita, Prestasi, Kemitraan. **Tidak** bisa kelola user atau data pimpinan (opsional, tergantung kebijakan) |

> **Saran:** gunakan role berbasis **RBAC (Role-Based Access Control)** sejak awal walau baru 2 role, agar mudah menambah role baru (mis. "Editor Dosen", "Editor Berita") di kemudian hari tanpa refactor besar.

---

## 5. Kebutuhan Fungsional (Functional Requirements)

### 5.1 Modul Autentikasi & Manajemen User

**Login**
- Login menggunakan email/username + password.
- Password di-hash (bcrypt/argon2), tidak pernah disimpan plain text.
- Session/JWT dengan waktu kedaluwarsa (mis. auto logout setelah tidak aktif).
- Halaman "Lupa Password" dengan reset via email.
- Rate limiting untuk mencegah brute-force login.
- (Opsional, disarankan) **2FA (OTP via email)** khusus untuk Super Admin.

**Manajemen User (khusus Super Admin)**
- Tambah/edit/hapus akun admin.
- Assign role ke masing-masing user.
- Nonaktifkan (bukan hapus permanen) akun yang resign.
- Log aktivitas login (waktu, IP, device) — untuk audit.

---

### 5.2 Modul Informasi
Section "Informasi" tampak di Beranda (kontak, akreditasi, dsb).

- **List**: tabel semua entri informasi dengan pencarian & pagination.
- **Create**: form tambah info baru (judul, deskripsi/isi, kategori, urutan tampil).
- **Update**: edit info yang ada.
- **Delete**: hapus dengan konfirmasi (soft delete disarankan, bukan hapus permanen).
- **Reorder**: kemampuan mengatur urutan tampilan (drag-and-drop) karena section ini biasanya berupa daftar poin (mis. jumlah mahasiswa, akreditasi, dsb pada gambar).
- Status: **Published / Draft** agar bisa disiapkan dulu sebelum tayang.

### 5.3 Modul Berita
- **List**: tabel berita dengan filter (kategori, status, tanggal).
- **Create/Edit**: form dengan:
  - Judul, slug (auto-generate, bisa diedit manual untuk SEO).
  - Rich text editor (WYSIWYG) untuk isi berita.
  - Upload gambar sampul (thumbnail).
  - Kategori/tag.
  - Tanggal publish (bisa dijadwalkan/scheduled publish).
  - Status: Draft / Published / Archived.
- **Delete**: soft delete + konfirmasi.
- **Preview**: tombol preview sebelum publish.

### 5.4 Modul Prestasi
- Struktur mirip Berita namun lebih ringkas: judul prestasi, nama peraih (mahasiswa/dosen/tim), tingkat (nasional/internasional), tahun, gambar/sertifikat, deskripsi singkat.
- CRUD penuh + upload gambar.
- Filter berdasarkan tahun/tingkat pada tampilan publik.

### 5.5 Modul Kemitraan
- Data mitra: nama instansi, logo, jenis kerja sama, tanggal MoU, deskripsi singkat, link/website mitra (opsional).
- CRUD penuh + upload logo mitra.
- Urutan tampil (reorder) untuk logo yang tampil di Beranda.

### 5.6 Modul Data Dosen
- Field: **Foto, NIK, Kode Dosen, NIDN, Nama, Program Studi, Email**.
- CRUD penuh (create, list dengan search & filter, update, hapus).
- Pencarian & filter berdasarkan Program Studi.
- Validasi: NIK, Kode Dosen, dan NIDN masing-masing unik (tidak boleh duplikat), Email harus format email valid.
- Data ini nantinya dapat ditampilkan di halaman "Dosen" (jika ada) maupun direferensikan di halaman lain.

### 5.7 Modul Data Tenaga Pendidikan *(baru)*
- Field: **Foto, NUPTK, Nama, Jabatan, Email**.
- CRUD penuh (create, list dengan search, update, hapus).
- Validasi: NUPTK unik (jika diisi), Email format valid.
- Modul ini terpisah dari Data Dosen karena Tenaga Pendidikan (tenaga kependidikan/staf non-dosen) memiliki struktur data yang berbeda.

### 5.8 Modul Data Pimpinan Fakultas
- Field: Nama, foto, jabatan (Dekan, Wakil Dekan I/II/III, Kaprodi, dst), periode jabatan, deskripsi singkat/sambutan (khusus Dekan sesuai contoh gambar).
- CRUD penuh + upload foto.
- **Tidak ada** relasi hierarki/atasan-bawahan yang disimpan di database — modul ini murni daftar profil pimpinan yang tampil di halaman "Pimpinan Fakultas".

### 5.9 Modul Struktur Organisasi *(gambar statis)*
- Berbeda dari rencana awal, **Struktur Organisasi dikelola sebagai satu gambar statis** (bukan bagan otomatis yang terhubung ke data Pimpinan Fakultas).
- Admin dapat **upload/ganti (replace) gambar** bagan struktur organisasi kapan saja saat ada perubahan, melalui satu halaman sederhana di dashboard (upload gambar baru akan menggantikan gambar sebelumnya).
- Tidak perlu form kompleks — cukup: preview gambar saat ini, tombol "Ganti Gambar" (upload baru), dan tombol hapus (opsional, mengembalikan ke kosong/placeholder).
- Validasi upload: tipe file gambar (jpg/png/webp), ukuran maksimal (mis. 5MB agar bagan tetap jelas terbaca).

### 5.10 Modul Pengaturan Situs *(baru)*
Modul ini mengelola elemen-elemen global yang tampil di halaman publik (Beranda & footer), agar admin bisa mengubahnya tanpa edit kode. Dirancang sebagai **single-record settings** (satu baris data, selalu di-update, bukan ditambah baru), sama seperti modul Struktur Organisasi.

Dibagi menjadi 3 bagian dalam satu halaman `/dashboard/pengaturan`:

**a. Hero Video**
- Upload/ganti video hero (untuk section hero di Beranda, menggantikan hero image statis).
- Upload/ganti poster image (fallback yang tampil sebelum video termuat/gagal dimuat).
- Preview video & poster yang sedang aktif, serta tombol hapus (kosongkan kembali).
- Validasi upload: tipe file mp4/webm, ukuran maksimal (mis. 20MB).

**b. WhatsApp (Floating Bubble)**
- Input nomor WhatsApp (format internasional, mis. `6281234567890`, tanpa tanda `+`).
- Input pesan default (opsional) yang otomatis terisi saat pengunjung klik bubble WhatsApp.
- Tombol "Test" untuk membuka pratinjau link `wa.me` sesuai isian form saat ini (sebelum disimpan).

**c. Media Sosial**
- Input URL untuk masing-masing platform: Instagram, Facebook, YouTube, X/Twitter, LinkedIn.
- Semua field opsional (boleh dikosongkan), namun jika diisi wajib format URL valid.
- Ditampilkan sebagai ikon-ikon link di footer halaman publik.

Semua perubahan pada modul ini dicatat ke `activity_logs` (module = `site_settings`).

### 5.11 Modul Akademik *(baru)*
Menu "Akademik" di sidebar dashboard berupa dropdown/submenu berisi 5 sub-modul berikut. Empat di antaranya membutuhkan tabel master **Program Studi** (nama, kode) sebagai referensi relasi, di-seed 3 data sesuai jumlah prodi di FT UWKS, dengan CRUD sederhana khusus Super Admin agar bisa disesuaikan.

**a. Kalender Akademik** *(single-record, upload file)*
- Admin upload/ganti 1 file (PDF) kalender akademik beserta label tahun ajaran, kapan saja ada perubahan (pola sama seperti modul Struktur Organisasi: file lama tergantikan, bukan menumpuk).

**b. Pedoman Akademik** *(single-record, upload file)*
- Sama seperti Kalender Akademik: admin upload/ganti 1 file (PDF) pedoman akademik yang berlaku.

**c. Jadwal Perkuliahan** *(CRUD, relasi ke Program Studi)*
- Setiap entri berisi: Program Studi (relasi), file jadwal (PDF), semester (Ganjil/Genap), tahun ajaran.
- Berbeda dari Kalender/Pedoman, modul ini CRUD penuh (banyak entri) karena satu prodi bisa punya beberapa jadwal di semester/tahun ajaran berbeda, dan riwayat jadwal tahun-tahun sebelumnya tetap tersimpan.
- Admin bisa filter berdasarkan Program Studi, Semester, dan Tahun Ajaran.

**d. Akreditasi** *(CRUD, relasi ke Program Studi)*
- Setiap entri berisi: Program Studi (relasi), peringkat akreditasi, nomor SK, tanggal berlaku, file sertifikat (upload).
- CRUD penuh per Program Studi.

**e. Prosedur Akademik** *(CRUD)*
- Setiap entri berisi: judul SOP, narasi/deskripsi, file SOP **atau** link eksternal (minimal salah satu wajib diisi), penanggung jawab.
- CRUD penuh dengan pencarian berdasarkan judul/penanggung jawab.

### 5.12 Dashboard Overview (Beranda Admin)
- Ringkasan jumlah data (jumlah berita, prestasi, mitra, dosen) dalam bentuk card statistik.
- Aktivitas terbaru (log siapa mengubah apa, kapan).
- Shortcut ke modul yang sering diakses.

---

## 6. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **Keamanan** | Hash password, validasi input di server (bukan hanya client), proteksi CSRF, sanitasi upload file (cek tipe & ukuran), rate limiting |
| **Performa** | Halaman publik idealnya menggunakan SSG/ISR (Next.js) agar cepat diakses meski data berubah dari CMS |
| **Skalabilitas** | Struktur database dan API dirancang modular agar mudah menambah modul baru |
| **Responsif** | Dashboard tetap dapat diakses dari tablet (staf TU kadang pakai tablet), namun prioritas utama desktop |
| **Aksesibilitas** | Kontras warna cukup, label form jelas (mengikuti komponen shadcn/ui yang sudah accessible by default) |
| **Backup** | Backup database berkala (harian/mingguan) |
| **Audit Trail** | Semua aksi create/update/delete tercatat log (siapa, kapan, apa yang diubah) |

---

## 7. Arsitektur & Tech Stack

### 7.1 Stack yang Sudah Ditentukan
| Layer | Teknologi |
|---|---|
| Frontend Framework | **Next.js** (App Router) |
| UI Library | **React** |
| Styling | **Tailwind CSS** |
| Component Library | **shadcn/ui** |
| Database | **MySQL** |
| Runtime | **Bun** |

### 7.2 Saran Tambahan (Rekomendasi)

Beberapa hal berikut **belum disebutkan** namun sangat berpengaruh terhadap kelancaran pengembangan — saya sarankan untuk didiskusikan:

1. **ORM: Drizzle ORM atau Prisma**
   - **Drizzle ORM** sangat direkomendasikan karena ringan, type-safe, dan kompatibel penuh dengan Bun serta MySQL — cocok dengan filosofi stack yang sudah dipilih.
   - Prisma juga bisa dipakai (lebih populer, tooling migrasi lebih matang), namun sedikit lebih berat dan dukungan Bun-nya belum se-native Drizzle.

2. **Autentikasi: Auth.js (NextAuth v5) atau Lucia Auth**
   - Auth.js v5 support App Router Next.js dengan baik dan bisa dikombinasikan dengan credentials login (email/password) untuk kasus internal seperti ini.
   - Lucia Auth juga populer untuk kontrol penuh atas session tanpa "black box", cocok jika ingin autentikasi custom yang ringan.

3. **Validasi Data: Zod**
   - Untuk validasi form (baik di client maupun server) — bekerja sangat baik dengan React Hook Form + shadcn/ui.

4. **Form Handling: React Hook Form**
   - Standar de-facto dipasangkan dengan shadcn/ui untuk form yang kompleks (banyak field seperti modul Dosen/Pimpinan).

5. **Data Fetching/Caching (client-side): TanStack Query (React Query)**
   - Memudahkan sinkronisasi data dashboard (list, refresh setelah create/update/delete) tanpa reload manual.

6. **Tabel Data: TanStack Table**
   - Untuk tabel di dashboard (list berita, dosen, dsb) dengan sorting, filtering, pagination bawaan — terintegrasi baik dengan shadcn/ui `<DataTable>`.

7. **Rich Text Editor**: Tiptap atau Lexical — untuk isi Berita/Informasi agar admin bisa format teks (bold, list, gambar inline) tanpa menulis HTML manual.

8. **Penyimpanan Gambar/File**
   - Untuk MVP/skala kecil: simpan di server (folder `/public/uploads` atau disk terpisah).
   - Untuk jangka panjang/produksi: disarankan **object storage** seperti **Cloudflare R2** atau **S3-compatible storage** agar tidak membebani server aplikasi dan lebih mudah di-backup/CDN-kan.

9. **Deployment**
   - Frontend/Next.js: Vercel, atau VPS dengan Bun sebagai runtime (mis. menggunakan PM2/systemd + Nginx reverse proxy) jika ingin full-stack dalam satu server kampus.
   - Database MySQL: managed service (mis. PlanetScale-compatible, atau MySQL di VPS kampus) tergantung kebijakan IT fakultas.

10. **Testing**: minimal unit test untuk fungsi kritikal (validasi, auth) menggunakan `bun test` (built-in Bun test runner).

11. **Environment Config**: `.env` terpisah untuk development/production, jangan commit kredensial database ke repo.

> Ringkasnya, saran stack tambahan: **Drizzle ORM + Auth.js/Lucia + Zod + React Hook Form + TanStack Query/Table + Tiptap**, semua kompatibel dengan Bun, Next.js, dan shadcn/ui yang sudah dipilih.

---

## 8. Skema Database (High-Level)

```
users
  id, name, email, password_hash, role (super_admin/admin), is_active, created_at, updated_at

informasi
  id, title, content, category, order_index, status (draft/published), created_by, created_at, updated_at

berita
  id, title, slug, content, thumbnail_url, category, status, published_at, created_by, created_at, updated_at

prestasi
  id, title, achiever_name, level (nasional/internasional), year, image_url, description, created_at, updated_at

kemitraan
  id, partner_name, logo_url, partnership_type, mou_date, description, website_url, order_index, created_at, updated_at

dosen
  id, photo_url, nik, kode_dosen, nidn, name, prodi, email, created_at, updated_at, deleted_at
  (unique: nik, kode_dosen, nidn)

tenaga_pendidikan
  id, photo_url, nuptk, name, jabatan, email, created_at, updated_at, deleted_at
  (unique: nuptk)

pimpinan_fakultas
  id, name, photo_url, jabatan, periode_mulai, periode_selesai, sambutan (khusus dekan),
  created_at, updated_at, deleted_at

struktur_organisasi
  id, image_url, updated_by (FK ke users.id), updated_at
  (tabel ini hanya berisi 1 baris aktif — setiap upload baru meng-update baris yang sama, bukan menambah baris baru)

site_settings
  id, hero_video_url, hero_poster_url, wa_number, wa_default_message,
  social_instagram, social_facebook, social_youtube, social_twitter, social_linkedin,
  updated_by (FK ke users.id), updated_at
  (tabel ini juga hanya berisi 1 baris aktif — sama seperti struktur_organisasi, setiap perubahan meng-update baris yang sama)

program_studi
  id, nama, kode (unique)
  (tabel master, di-seed 3 data, direferensikan oleh jadwal_kuliah dan akreditasi)

kalender_akademik
  id, file_url, tahun_ajaran, updated_by (FK ke users.id), updated_at
  (single-record, sama pola dengan struktur_organisasi)

pedoman_akademik
  id, file_url, updated_by (FK ke users.id), updated_at
  (single-record)

jadwal_kuliah
  id, prodi_id (FK ke program_studi.id), file_url, semester (enum: 'ganjil','genap'), tahun_ajaran, created_at, updated_at, deleted_at

akreditasi
  id, prodi_id (FK ke program_studi.id), peringkat, no_sk, tanggal_berlaku, file_sertifikat, created_at, updated_at, deleted_at

prosedur_akademik
  id, judul_sop, narasi, file_url (nullable), link_url (nullable), penanggung_jawab, created_at, updated_at, deleted_at
  (minimal salah satu dari file_url/link_url wajib diisi — divalidasi di aplikasi)

activity_logs
  id, user_id, action, module, record_id, detail, created_at

media (opsional, untuk manajemen file terpusat)
  id, file_url, file_type, uploaded_by, created_at
```

> Struktur Organisasi sengaja dibuat sebagai tabel sederhana berisi satu gambar (bukan relasi hierarki), karena dikelola sebagai gambar statis yang diunggah ulang oleh admin saat ada perubahan.

---

## 9. Alur Utama (High-Level API Endpoints)

```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password

GET    /api/informasi          POST /api/informasi
PUT    /api/informasi/:id      DELETE /api/informasi/:id

GET    /api/berita             POST /api/berita
PUT    /api/berita/:id         DELETE /api/berita/:id

GET    /api/prestasi           POST /api/prestasi
PUT    /api/prestasi/:id       DELETE /api/prestasi/:id

GET    /api/kemitraan          POST /api/kemitraan
PUT    /api/kemitraan/:id      DELETE /api/kemitraan/:id

GET    /api/dosen              POST /api/dosen
PUT    /api/dosen/:id          DELETE /api/dosen/:id

GET    /api/tenaga-pendidikan          POST /api/tenaga-pendidikan
PUT    /api/tenaga-pendidikan/:id      DELETE /api/tenaga-pendidikan/:id

GET    /api/pimpinan           POST /api/pimpinan
PUT    /api/pimpinan/:id       DELETE /api/pimpinan/:id

GET    /api/struktur-organisasi        (ambil gambar aktif saat ini)
POST   /api/struktur-organisasi        (upload/ganti gambar, replace baris yang ada)
DELETE /api/struktur-organisasi        (opsional, kosongkan/hapus gambar)

GET    /api/settings           (ambil pengaturan situs aktif: hero video, WA, media sosial)
PUT    /api/settings           (update pengaturan situs, replace baris yang ada)

GET    /api/akademik/program-studi     POST /api/akademik/program-studi (super admin only)
PUT    /api/akademik/program-studi/:id DELETE /api/akademik/program-studi/:id (super admin only)

GET    /api/akademik/kalender          POST /api/akademik/kalender (upload/ganti, replace)
DELETE /api/akademik/kalender

GET    /api/akademik/pedoman           POST /api/akademik/pedoman (upload/ganti, replace)
DELETE /api/akademik/pedoman

GET    /api/akademik/jadwal            POST /api/akademik/jadwal
PUT    /api/akademik/jadwal/:id        DELETE /api/akademik/jadwal/:id

GET    /api/akademik/akreditasi        POST /api/akademik/akreditasi
PUT    /api/akademik/akreditasi/:id    DELETE /api/akademik/akreditasi/:id

GET    /api/akademik/prosedur          POST /api/akademik/prosedur
PUT    /api/akademik/prosedur/:id      DELETE /api/akademik/prosedur/:id

GET    /api/users (super admin only)  POST /api/users
PUT    /api/users/:id                 DELETE /api/users/:id
```

Semua endpoint modifikasi (POST/PUT/DELETE) wajib melalui middleware autentikasi + pengecekan role.

---

## 10. Referensi Desain UI/UX

Desain front-end publik yang dilampirkan (masih proses) menjadi acuan tampilan **sisi publik** (Beranda, Visi Misi, Sejarah, Pimpinan Fakultas, Struktur Organisasi). Untuk **dashboard admin**, disarankan:

- Layout standar admin panel: sidebar navigasi kiri (menu per modul) + topbar (profil user, logout) + area konten utama.
- Gunakan komponen shadcn/ui: `Sidebar`, `DataTable`, `Dialog` (untuk form tambah/edit sebagai modal), `Sheet`, `Toast` (notifikasi sukses/gagal), `Badge` (status draft/published).
- Konsistensi warna dengan identitas FT UWKS (biru navy seperti pada mockup) agar dashboard dan halaman publik terasa satu ekosistem.

---

## 11. Kriteria Sukses (Success Metrics)

- Admin dapat menambah/mengedit/menghapus konten tanpa bantuan developer.
- Waktu update konten (mis. berita baru tayang) < 5 menit dari login hingga publish.
- Tidak ada insiden keamanan (login jebol, data bocor) selama masa evaluasi.
- Admin dapat mengganti gambar Struktur Organisasi dengan mudah (upload & replace) tanpa bantuan developer.

---

## 12. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Admin tidak familiar dengan CMS | Buat panduan penggunaan (user manual) singkat + UI yang intuitif |
| Upload file besar membebani server | Batasi ukuran & tipe file, kompresi gambar otomatis saat upload |
| Kehilangan data akibat kesalahan hapus | Terapkan soft delete + fitur "restore" |
| Kebocoran kredensial admin | Wajibkan password kuat, opsional 2FA untuk Super Admin |

---

## 13. Roadmap Pengembangan (Disarankan)

| Fase | Cakupan |
|---|---|
| **Fase 1** | Setup project (Next.js + Bun + Tailwind + shadcn/ui), skema database, sistem login & role |
| **Fase 2** | CRUD Informasi, Berita, Prestasi, Kemitraan + upload gambar |
| **Fase 3** | CRUD Data Dosen, Tenaga Pendidikan, Pimpinan Fakultas + fitur upload/ganti gambar Struktur Organisasi + Modul Pengaturan Situs (hero video, WhatsApp, media sosial) |
| **Fase 3b** | Modul Akademik: Program Studi (master data), Kalender Akademik, Pedoman Akademik, Jadwal Perkuliahan, Akreditasi, Prosedur Akademik |
| **Fase 4** | Integrasi ke halaman publik (dynamic rendering), testing, hardening keamanan |
| **Fase 5** | UAT (User Acceptance Test) bersama staf fakultas, deployment produksi |

---

## 14. Lampiran

- Referensi desain: mockup front-end (Beranda, Visi & Misi, Sejarah Fakultas, Pimpinan Fakultas, Struktur Organisasi) — masih dalam proses desain final.
- Dokumen ini akan diperbarui seiring finalisasi desain UI dan hasil diskusi kebutuhan lebih lanjut.
