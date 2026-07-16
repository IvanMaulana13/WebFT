# Kumpulan Prompt untuk Google Antigravity
## Implementasi Dashboard CMS FT UWKS (berdasarkan PRD v1.0)

Cara pakai: jalankan prompt **secara berurutan** (Part 1 → Part 9), satu prompt = satu task/session di Antigravity. Disarankan pakai mode **"Agent-assisted"** atau **"Review-driven"** untuk task yang menyentuh auth/database, dan boleh **"Agent-driven"** untuk task UI murni.

---

## Part 0 — Setup Project & Struktur Dasar

```
Buatkan project full-stack baru dengan spesifikasi berikut:

Tech stack:
- Runtime: Bun
- Framework: Next.js (App Router, TypeScript)
- Styling: Tailwind CSS
- Component library: shadcn/ui (init dan siapkan komponen dasar: button, input, form, table, dialog, sheet, toast, badge, sidebar)
- Database: MySQL
- ORM: Drizzle ORM (pilih drizzle-orm + drizzle-kit, konfigurasikan untuk MySQL)
- Validasi: Zod
- Form: React Hook Form
- Data fetching client: TanStack Query
- Tabel data: TanStack Table

Struktur folder yang diinginkan:
- /app -> route Next.js (public routes dan /dashboard routes terpisah)
- /app/(public) -> halaman publik (beranda, visi-misi, sejarah, pimpinan-fakultas, struktur-organisasi)
- /app/(dashboard) -> semua halaman admin, dilindungi middleware auth
- /app/api -> API routes
- /lib/db -> koneksi database & schema Drizzle
- /lib/validations -> skema Zod
- /components/ui -> komponen shadcn/ui
- /components/dashboard -> komponen khusus dashboard (sidebar, topbar, data-table wrapper)

Buat file .env.example berisi variabel: DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL (atau setara jika pakai Lucia), UPLOAD_DIR.

Setelah project jalan, jalankan dev server dan verifikasi lewat browser bahwa halaman default Next.js tampil tanpa error. Laporkan struktur folder final dalam bentuk tree.
```

---

## Part 1 — Skema Database (Drizzle Schema)

```
Berdasarkan skema berikut, buatkan Drizzle ORM schema (MySQL) di /lib/db/schema.ts, lengkap dengan tipe kolom yang tepat, primary key, foreign key, dan timestamp default:

1. users: id (PK, auto increment), name, email (unique), password_hash, role (enum: 'super_admin', 'admin'), is_active (boolean default true), created_at, updated_at

2. informasi: id (PK), title, content (text), category (nullable), order_index (int default 0), status (enum: 'draft', 'published'), created_by (FK ke users.id), created_at, updated_at, deleted_at (nullable, untuk soft delete)

3. berita: id (PK), title, slug (unique), content (text), thumbnail_url (nullable), category (nullable), status (enum: 'draft', 'published', 'archived'), published_at (nullable datetime), created_by (FK ke users.id), created_at, updated_at, deleted_at (nullable)

4. prestasi: id (PK), title, achiever_name, level (enum: 'nasional', 'internasional'), year (int), image_url (nullable), description (text nullable), created_at, updated_at, deleted_at (nullable)

5. kemitraan: id (PK), partner_name, logo_url (nullable), partnership_type (nullable), mou_date (nullable date), description (text nullable), website_url (nullable), order_index (int default 0), created_at, updated_at, deleted_at (nullable)

6. dosen: id (PK), name, nidn (unique nullable), photo_url (nullable), jabatan_fungsional (nullable), gelar (nullable), bidang_keahlian (nullable), email (nullable), prodi (nullable), is_active (boolean default true), created_at, updated_at, deleted_at (nullable)

7. pimpinan_fakultas: id (PK), name, photo_url (nullable), jabatan, level_hierarki (int), parent_id (self-reference FK ke pimpinan_fakultas.id, nullable), periode_mulai (date nullable), periode_selesai (date nullable), sambutan (text nullable), created_at, updated_at, deleted_at (nullable)

8. activity_logs: id (PK), user_id (FK ke users.id), action (mis. 'create', 'update', 'delete'), module (mis. 'berita', 'dosen'), record_id (nullable), detail (text/json nullable), created_at

Setelah schema selesai, generate migration dengan drizzle-kit dan jalankan migrate ke database MySQL lokal (buatkan juga docker-compose.yml sederhana untuk MySQL agar mudah dites secara lokal). Verifikasi semua tabel berhasil terbentuk dengan menjalankan query SHOW TABLES.
```

---

## Part 2 — Sistem Autentikasi & Manajemen User

```
Implementasikan sistem autentikasi untuk dashboard admin dengan ketentuan:

1. Gunakan Auth.js (NextAuth v5) dengan Credentials Provider (email + password), terhubung ke tabel `users` lewat Drizzle ORM.
2. Password di-hash menggunakan bcrypt saat create user, dan dibandingkan dengan bcrypt.compare saat login.
3. Session disimpan sebagai JWT, sertakan field `role` di dalam session/token agar bisa dicek di middleware.
4. Buat middleware.ts yang melindungi semua route di bawah /app/(dashboard) — redirect ke /login jika belum login.
5. Buat pengecekan role di level route/API: endpoint tertentu (manajemen user) hanya bisa diakses role 'super_admin'.
6. Buat halaman:
   - /login -> form login (email, password) pakai shadcn/ui Form + Zod validation, tampilkan error jika login gagal, tampilkan toast sukses jika berhasil lalu redirect ke /dashboard
   - /dashboard/users -> khusus super_admin: list user (nama, email, role, status aktif) pakai TanStack Table, tombol tambah/edit/nonaktifkan user (bukan hapus permanen, cukup ubah is_active jadi false)
7. Tambahkan rate limiting sederhana pada endpoint login (maksimal 5 percobaan gagal per 15 menit per IP/email), tolak dengan pesan error yang jelas jika melebihi limit.
8. Setiap login berhasil, gagal, dan aksi CRUD user, catat ke tabel activity_logs (user_id, action, module='auth'/'users', detail).
9. Buat tombol logout di topbar dashboard yang menghapus session dan redirect ke /login.

Setelah selesai, buat 1 akun super_admin awal melalui seed script (email dan password dari .env, password di-hash saat seeding). Uji alur: login sukses, login gagal (password salah), akses /dashboard tanpa login (harus redirect), akses /dashboard/users sebagai role 'admin' biasa (harus ditolak/403).
```

---

## Part 3 — Modul Informasi

```
Buatkan modul CRUD "Informasi" lengkap (backend API + halaman dashboard), dengan detail:

Backend (app/api/informasi):
- GET /api/informasi -> list dengan query param page, limit, search, status (exclude yang deleted_at tidak null)
- POST /api/informasi -> create, validasi pakai Zod (title wajib, content wajib, status default 'draft'), simpan created_by dari session user, catat activity_logs
- PUT /api/informasi/:id -> update, validasi sama, catat activity_logs
- DELETE /api/informasi/:id -> soft delete (set deleted_at), catat activity_logs
- PATCH /api/informasi/reorder -> terima array {id, order_index} untuk update urutan sekaligus (untuk fitur drag-and-drop)
- Semua endpoint di atas wajib melalui middleware auth (harus login)

Frontend (/dashboard/informasi):
- Halaman list menggunakan TanStack Table + shadcn/ui: kolom title, category, status (pakai Badge, warna beda untuk draft/published), order_index, aksi (edit/hapus)
- Search box dan filter status di atas tabel
- Tombol "Tambah Informasi" membuka Dialog/Sheet berisi form (React Hook Form + Zod): title, content (textarea atau rich text sederhana), category, status (select draft/published)
- Tombol edit membuka Dialog yang sama dengan data ter-prefill
- Tombol hapus menampilkan konfirmasi (AlertDialog) sebelum submit DELETE
- Implementasikan drag-and-drop reorder pada list (gunakan library dnd-kit atau setara), setelah drag selesai panggil PATCH /reorder
- Gunakan TanStack Query untuk fetch/mutate data, invalidate query setelah create/update/delete/reorder agar tabel auto-refresh
- Tampilkan toast sukses/gagal pada setiap aksi

Setelah selesai, uji seluruh alur CRUD dan reorder langsung di browser (create data baru, edit, drag urutan, hapus), lalu laporkan hasilnya beserta screenshot masing-masing state.
```

---

## Part 4 — Modul Berita

```
Buatkan modul CRUD "Berita" lengkap, dengan detail tambahan dibanding modul Informasi:

Backend (app/api/berita):
- Field: title, slug (auto-generate dari title tapi bisa diedit manual, wajib unique — validasi unique di server), content (rich text/HTML), thumbnail_url, category, status ('draft'/'published'/'archived'), published_at
- GET dengan filter kategori, status, dan rentang tanggal
- POST/PUT dengan validasi Zod, termasuk validasi slug unik (cek ke database, kembalikan error 409 jika bentrok)
- Endpoint upload gambar terpisah: POST /api/upload -> terima file (validasi tipe: jpg/png/webp, max 2MB), simpan ke folder /public/uploads (atau sesuai UPLOAD_DIR di .env), kembalikan URL file
- DELETE -> soft delete
- Jadwalkan publish: jika published_at di masa depan, status otomatis tetap 'draft' sampai waktunya (boleh disederhanakan dulu jadi manual publish jika scheduled publish terlalu kompleks, tapi field published_at tetap disimpan)

Frontend (/dashboard/berita):
- Integrasikan rich text editor Tiptap untuk field content
- Upload thumbnail dengan preview gambar sebelum submit
- Auto-generate slug dari title secara live di form, tapi tetap bisa diedit manual
- Filter by kategori dan status di atas tabel
- Tombol "Preview" yang membuka halaman publik berita dalam tab baru (mode draft preview jika status belum published)
- Badge warna berbeda untuk status draft/published/archived

Setelah selesai, uji alur lengkap: buat berita baru dengan gambar, cek slug ter-generate benar, coba buat 2 berita dengan title sama (pastikan slug kedua otomatis berbeda atau error jika manual sama), edit, hapus, dan preview.
```

---

## Part 5 — Modul Prestasi

```
Buatkan modul CRUD "Prestasi" dengan pola yang sama seperti modul Berita/Informasi sebelumnya, dengan field khusus:

- title, achiever_name (nama peraih), level (select: 'nasional'/'internasional'), year (number, validasi 4 digit dan tidak boleh lebih dari tahun berjalan), image_url (upload pakai endpoint /api/upload yang sudah dibuat sebelumnya), description

Requirement:
- CRUD penuh (create, read dengan pagination+search, update, soft delete) via app/api/prestasi
- Halaman dashboard /dashboard/prestasi dengan tabel (kolom: thumbnail kecil, title, achiever_name, level, year, aksi)
- Filter tabel berdasarkan level dan year
- Form tambah/edit menggunakan Dialog + React Hook Form + Zod, dengan upload gambar dan preview
- Urutkan default tabel berdasarkan year terbaru

Setelah selesai, uji CRUD lengkap dan pastikan validasi year menolak input seperti "abc" atau tahun di masa depan yang tidak masuk akal (misal lebih dari tahun berjalan + 1).
```

---

## Part 6 — Modul Kemitraan

```
Buatkan modul CRUD "Kemitraan" dengan pola yang sama, field khusus:

- partner_name, logo_url (upload logo), partnership_type, mou_date (date picker), description, website_url (validasi format URL), order_index

Requirement:
- CRUD penuh via app/api/kemitraan (list, create, update, soft delete)
- Halaman dashboard /dashboard/kemitraan menampilkan tabel dengan preview logo kecil di setiap baris
- Fitur reorder (drag-and-drop) sama seperti modul Informasi, karena logo mitra tampil berurutan di halaman publik
- Form dengan date picker (shadcn/ui Calendar + Popover) untuk mou_date
- Validasi website_url: harus format URL valid atau boleh dikosongkan

Setelah selesai, uji CRUD lengkap + reorder drag-and-drop, serta validasi URL (coba input "asal-asalan" harus ditolak, input kosong harus diterima).
```

---

## Part 7 — Modul Data Dosen

```
Buatkan modul CRUD "Data Dosen" dengan field:

- name, nidn (unique, boleh kosong tapi jika diisi wajib unik — validasi di server), photo_url (upload), jabatan_fungsional (select: Asisten Ahli/Lektor/Lektor Kepala/Guru Besar), gelar, bidang_keahlian, email (validasi format email), prodi (select/text sesuai program studi yang ada di FT UWKS), is_active

Requirement:
- CRUD penuh via app/api/dosen (list dengan search nama/NIDN, filter prodi dan bidang_keahlian, dan filter is_active)
- Halaman dashboard /dashboard/dosen: tabel dengan foto kecil, nama, NIDN, jabatan fungsional, prodi, status aktif (badge)
- Form tambah/edit dengan upload foto + preview
- Tombol nonaktifkan dosen (toggle is_active) terpisah dari tombol hapus, karena dosen resign biasanya dinonaktifkan bukan dihapus datanya

Setelah selesai, uji CRUD lengkap termasuk validasi NIDN unik (coba input NIDN yang sama dua kali, harus ditolak) dan toggle status aktif/nonaktif.
```

---

## Part 8 — Modul Pimpinan Fakultas & Struktur Organisasi Otomatis

```
Buatkan modul CRUD "Pimpinan Fakultas" sekaligus fitur bagan Struktur Organisasi otomatis, dengan detail:

Backend (app/api/pimpinan):
- Field: name, photo_url (upload), jabatan, level_hierarki (int, semakin kecil semakin tinggi jabatannya, misal 1=Dekan), parent_id (nullable, FK ke pimpinan_fakultas.id sendiri — merepresentasikan siapa atasan langsungnya), periode_mulai, periode_selesai, sambutan (khusus ditampilkan jika jabatan = 'Dekan')
- GET /api/pimpinan -> list biasa untuk tabel dashboard (flat list, ada info nama parent-nya untuk ditampilkan di tabel)
- GET /api/pimpinan/tree -> kembalikan data dalam bentuk nested tree (berdasarkan parent_id) siap dipakai untuk render bagan organisasi
- POST/PUT/DELETE dengan validasi: parent_id tidak boleh mengarah ke dirinya sendiri atau menciptakan circular reference (validasi ini penting, cek di server sebelum simpan)

Frontend:
- /dashboard/pimpinan -> tabel CRUD standar (nama, jabatan, level_hierarki, nama atasan/parent, periode), form tambah/edit termasuk dropdown untuk memilih parent (pilih dari pimpinan yang sudah ada, exclude dirinya sendiri saat edit)
- Buat komponen bagan Struktur Organisasi otomatis (gunakan library seperti react-flow atau buat tree diagram sederhana dengan CSS/SVG) yang menggambar hierarki berdasarkan data dari GET /api/pimpinan/tree — komponen ini dipakai baik di halaman publik /struktur-organisasi maupun sebagai preview di dashboard
- Halaman publik /pimpinan-fakultas menampilkan card pimpinan beserta foto dan sambutan (khusus Dekan), diambil dari data yang sama secara dinamis (bukan hardcode lagi)

Setelah selesai, uji dengan membuat struktur contoh: 1 Dekan (level 1, parent null), 3 Wakil Dekan (level 2, parent = Dekan), beberapa Kaprodi (level 3, parent = Wakil Dekan terkait). Verifikasi bagan struktur organisasi tergambar otomatis dan benar sesuai hierarki, serta uji validasi circular reference (coba set parent Dekan ke salah satu Kaprodi-nya sendiri, harus ditolak).
```

---

## Part 9 — Dashboard Overview & Integrasi Halaman Publik

```
Lengkapi dua hal berikut:

1. Dashboard Overview (/dashboard):
   - Tampilkan card statistik: total berita (published/draft), total prestasi, total mitra, total dosen aktif, total pimpinan fakultas
   - Tampilkan daftar aktivitas terbaru dari tabel activity_logs (10 terakhir), format: "[nama user] melakukan [aksi] pada [modul] - [waktu relatif, misal '5 menit lalu']"
   - Gunakan card shadcn/ui dan grid layout responsif

2. Integrasi Halaman Publik:
   - Pastikan halaman publik (Beranda, Visi Misi, Sejarah Fakultas, Pimpinan Fakultas, Struktur Organisasi) yang sebelumnya statis, sekarang mengambil data secara dinamis dari database (Informasi, Berita, Prestasi, Kemitraan, Pimpinan Fakultas) sesuai desain yang sudah ada
   - Gunakan Next.js ISR (Incremental Static Regeneration) dengan revalidate time yang wajar (misal 60 detik) untuk halaman publik, agar tetap cepat tapi konten baru dari CMS tetap muncul tanpa perlu rebuild manual
   - Section Berita di Beranda hanya menampilkan berita dengan status 'published', diurutkan dari published_at terbaru
   - Section Informasi hanya menampilkan yang status 'published', diurutkan berdasarkan order_index
   - Section Kemitraan menampilkan logo diurutkan berdasarkan order_index

Setelah selesai, uji end-to-end: tambahkan berita baru lewat dashboard dengan status published, buka halaman Beranda publik, pastikan berita baru muncul (tunggu revalidate time atau trigger manual revalidate jika tersedia).
```

---

## Part 10 — Prompt Testing & Debugging (setelah dashboard selesai dibangun)

```
Dashboard CMS FT UWKS sudah selesai dibangun (modul: Auth, Informasi, Berita, Prestasi, Kemitraan, Dosen, Pimpinan Fakultas, Struktur Organisasi, Dashboard Overview, dan halaman publik). Lakukan pengujian menyeluruh dan debugging dengan langkah berikut:

1. Jalankan aplikasi secara lokal (bun run dev), buka di browser terintegrasi, dan lakukan smoke test ke setiap halaman dashboard maupun publik — laporkan jika ada halaman yang error/blank/500.

2. Uji alur autentikasi:
   - Login dengan kredensial benar -> harus berhasil masuk dashboard
   - Login dengan password salah -> harus muncul pesan error yang jelas
   - Akses langsung URL /dashboard/* tanpa login -> harus redirect ke /login
   - Login sebagai role 'admin' lalu coba akses /dashboard/users -> harus ditolak (403 atau redirect)
   - Coba login gagal berkali-kali (>5x) -> pastikan rate limit aktif

3. Uji CRUD di setiap modul (Informasi, Berita, Prestasi, Kemitraan, Dosen, Pimpinan Fakultas):
   - Create dengan data valid -> harus tersimpan dan langsung muncul di tabel tanpa perlu refresh manual
   - Create dengan data tidak valid (field wajib kosong, format salah) -> harus muncul pesan error validasi yang jelas, tidak boleh silent fail atau crash
   - Update data -> perubahan harus konsisten muncul di tabel dan di halaman publik (setelah revalidate)
   - Delete (soft delete) -> data hilang dari tampilan tapi pastikan tidak benar-benar terhapus dari database (cek langsung ke tabel, kolom deleted_at harus terisi)
   - Upload gambar dengan file tidak valid (misal .exe atau ukuran >2MB) -> harus ditolak dengan pesan jelas

4. Uji fitur khusus:
   - Reorder drag-and-drop pada modul Informasi dan Kemitraan -> urutan baru harus tersimpan setelah refresh halaman
   - Struktur Organisasi -> ubah data pimpinan (ganti nama/jabatan/parent), pastikan bagan struktur organisasi otomatis ter-update sesuai perubahan
   - Coba buat circular reference pada parent_id pimpinan -> harus ditolak sistem

5. Uji keamanan dasar:
   - Coba akses endpoint API dashboard (misal POST /api/berita) tanpa header/session auth langsung lewat curl atau Postman -> harus ditolak 401
   - Coba SQL injection sederhana pada form search (misal input `' OR 1=1 --`) -> pastikan tidak ada efek samping aneh dan Drizzle ORM menangani parameterized query dengan benar
   - Cek apakah password di database sudah ter-hash (bukan plain text)

6. Untuk setiap bug yang ditemukan pada langkah 1-5:
   - Tunjukkan pesan error/log lengkap (dari terminal, console browser, dan network tab)
   - Identifikasi root cause (misal: validasi tidak lengkap, query salah, race condition, state tidak ter-invalidate)
   - Perbaiki langsung di kode
   - Setelah fix, ulangi pengujian pada kasus yang sama untuk konfirmasi bug sudah tidak muncul lagi

7. Setelah semua langkah di atas lulus, buatkan ringkasan hasil pengujian dalam bentuk checklist (lulus/gagal) beserta screenshot untuk setiap modul utama, sebagai bahan laporan sebelum deployment ke production.
```

---

## Catatan Tambahan

- Setiap prompt di atas sebaiknya dijalankan sebagai **task terpisah** di Antigravity (jangan digabung semua dalam satu task) agar agent bisa fokus, plan/implementation plan-nya lebih terarah, dan lebih mudah di-review lewat Artifacts (Task List, Implementation Plan, Diff, Walkthrough) sebelum lanjut ke bagian berikutnya.
- Sebelum menjalankan **Part 2 (Auth)** dan seterusnya, disarankan pakai mode **Review-driven** (agent minta approval dulu) karena menyentuh keamanan & struktur data inti.
- Part 3–8 (modul CRUD) relatif aman dijalankan dengan mode **Agent-driven/Autopilot** karena pola-nya repetitif dan berisiko rendah, tapi tetap cek hasil Walkthrough/Screenshot yang dihasilkan Antigravity sebelum lanjut ke part berikutnya.
- Jika ada bagian PRD yang berubah (misal field tambahan), cukup edit prompt terkait sebelum dijalankan ulang — tidak perlu mengulang semua part dari awal.
