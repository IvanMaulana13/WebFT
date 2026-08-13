# Design System Documentation
## Website Profil Fakultas (UNRIYO — Universitas Respati Yogyakarta)

---

## 1. Overview

Website ini adalah portal profil fakultas dengan 5 halaman utama:
1. **Beranda** — landing page dengan statistik, info, berita, prestasi, kemitraan
2. **Visi, Misi dan Tujuan**
3. **Sejarah Fakultas Teknik**
4. **Pimpinan Fakultas**
5. **Struktur Organisasi**

Gaya desain: **institutional / formal / trustworthy**, khas website pendidikan tinggi. Layout konsisten di semua halaman dalam (header, sidebar, footer sama), hanya konten utama yang berubah.

---

## 2. Design Tone & Principles

- **Formal & terpercaya** — dark navy sebagai warna dominan memberi kesan resmi, stabil, dan profesional (khas institusi pendidikan/pemerintahan).
- **Konsistensi struktural** — setiap halaman dalam memakai kerangka yang identik (header + breadcrumb + sidebar kiri "Profil Fakultas" + konten kanan + footer), sehingga navigasi terasa predictable.
- **Hierarki informasi jelas** — breadcrumb di atas, judul besar, lalu konten terstruktur dalam card/box.
- **Aksen warna terbatas** — kuning/emas dipakai sangat selektif (logo, ikon aktif, judul section) supaya tetap elegan, tidak ramai.

---

## 3. Color Palette

| Warna | Hex (approx) | Penggunaan |
|---|---|---|
| Navy sangat gelap (background utama) | `#0B1F3A` – `#0E2647` | Background header, sidebar, footer, seluruh area non-konten |
| Navy medium (card/box) | `#132A4E` – `#16305A` | Background card informasi, box menu, box statistik |
| Putih | `#FFFFFF` | Teks utama di atas navy, background konten card (Visi Misi, Sejarah, dll) |
| Abu terang | `#E8EAF0` | Background alternatif konten card |
| Emas / Kuning (aksen) | `#E0A93E` – `#F2C14E` | Logo, border aktif sidebar, angka statistik, ikon "Profil Fakultas" |
| Hijau (status/tombol) | `#3CB371` – `#2FA36B` | Tombol floating "Aduan/Chat" pojok kanan bawah tiap halaman |
| Biru muda (link/tombol) | `#2E6FDB` | Tombol sosial media kecil (Facebook, Instagram, dll) |
| Abu teks sekunder | `#9AA5B5` | Teks deskripsi, caption, sub-info |

**Kontras dominan:** Navy gelap (90% area) vs Putih (konten card) vs Emas (aksen kecil) — pola 90/8/2.

---

## 4. Typography

- **Font family:** Sans-serif modern (mirip *Poppins* / *Inter* / *Montserrat*) — clean, mudah dibaca, kesan modern-institutional.
- **Hierarki ukuran:**
  - Judul halaman (H1): besar, bold, putih — contoh "Visi, Misi dan Tujuan", "Sejarah Fakultas Teknik"
  - Sub-judul/section (H2-H3): medium, bold, kadang warna gelap di atas card putih
  - Body text: regular, ukuran kecil-sedang, line-height longgar untuk paragraf panjang (sejarah, visi)
  - Caption/label: kecil, huruf kapital pada beberapa label sidebar dan footer
- **Alignment:** Umumnya *justify* untuk paragraf panjang (sejarah/visi), *left-align* untuk list dan navigasi.

---

## 5. Layout Structure (Halaman Dalam)

Struktur grid konsisten di 4 halaman dalam (bukan beranda):

```
┌─────────────────────────────────────────────┐
│ HEADER (logo + nama institusi + menu + CTA)  │
├─────────────────────────────────────────────┤
│ Breadcrumb (Beranda / Profil / [Halaman])    │
├───────────────┬───────────────────────────────┤
│  SIDEBAR       │   KONTEN UTAMA (card putih)   │
│  "Profil       │   - Judul                     │
│   Fakultas"    │   - Isi (teks/gambar/struktur)│
│  - menu list   │                                │
│  - item aktif  │                                │
│    ditandai    │                                │
│    warna emas  │                                │
├───────────────┴───────────────────────────────┤
│ FOOTER (alamat, kontak, jam layanan, sosmed)  │
└─────────────────────────────────────────────┘
     [Tombol chat/aduan hijau — floating bottom-right]
```

### Halaman Beranda (layout khusus, 1 kolom panjang / mobile-first card)
- Hero image (foto gedung kampus)
- Statistik ringkas (4 angka: mis. jumlah prodi, mahasiswa, dosen, akreditasi) dalam grid ikon
- Info kontak singkat (2 kolom)
- Section **Berita** (3 card berita, gambar + judul)
- Section **Prestasi** (3 card horizontal)
- Section **Kemitraan** (logo grid, dalam & luar negeri, tab switch)
- Footer

---

## 6. Components

### 6.1 Header / Navbar
- Logo institusi (kiri) + nama lengkap universitas & fakultas (2 baris teks kecil)
- Menu horizontal (kanan) — sedikit item, hemat ruang
- Tombol CTA kecil di ujung kanan (mis. search/login)

### 6.2 Sidebar "Profil Fakultas"
- Card navy dengan header ikon + label "Profil Fakultas"
- List menu vertikal: Visi Misi, Sejarah, Pimpinan, Struktur Organisasi, dll.
- Item aktif diberi **highlight background lebih terang / border emas** + ikon
- Konsisten muncul di semua halaman dalam → membantu orientasi user

### 6.3 Breadcrumb
- Format: `Beranda / Profil Fakultas / [Nama Halaman]`
- Warna teks abu-putih kecil, di atas judul halaman

### 6.4 Content Card
- Background putih atau abu sangat muda, sudut membulat (rounded corners)
- Diberi elevasi/shadow ringan agar "mengambang" di atas background navy
- Untuk halaman Pimpinan/Struktur: card foto profil (placeholder abu-abu) + nama + jabatan di bawahnya, grid 3-4 kolom

### 6.5 Statistik / Info Box (Beranda)
- Grid ikon + angka besar + label kecil di bawah (mis. jumlah prodi, mahasiswa)
- Ikon berwarna emas/putih di atas navy

### 6.6 Card Berita / Prestasi
- Gambar thumbnail di atas, judul teks 2 baris di bawah
- Card berukuran seragam, disusun grid 3 kolom

### 6.7 Tab / Filter (Kemitraan)
- Tab switch "Domestik" vs "Luar Negeri", pill-shaped button, salah satu aktif berwarna berbeda

### 6.8 Footer
- Background navy paling gelap
- 3 kolom: Alamat & kontak | Info tambahan | Ikon sosial media
- Baris bawah: copyright kecil

### 6.9 Floating Action Button
- Lingkaran hijau di pojok kanan bawah tiap halaman (kemungkinan tombol chat/aduan/WhatsApp)

---

## 7. Iconography
- Ikon line-style sederhana, monokrom (putih/emas) di atas background navy
- Dipakai konsisten di: sidebar menu, statistik beranda, info kontak, sosial media

---

## 8. Interaction & States
- **Active state** sidebar/tab: background lebih terang + border/aksen emas
- **Hover** (diasumsikan): sedikit highlight pada item menu dan card
- Card berita/prestasi kemungkinan clickable → menuju detail

---

## 9. Spacing & Shape
- Sudut membulat konsisten (rounded-lg, ~8-12px) pada semua card dan tombol
- Padding dalam card cukup lega, tidak sesak
- Jarak antar section beranda tegas (jelas berpindah blok)

---

## 10. Rekomendasi Token untuk Implementasi (CSS Variables)

```css
:root {
  /* Colors */
  --color-bg-primary: #0B1F3A;
  --color-bg-secondary: #16305A;
  --color-surface: #FFFFFF;
  --color-surface-alt: #E8EAF0;
  --color-accent-gold: #E0A93E;
  --color-accent-green: #2FA36B;
  --color-accent-blue: #2E6FDB;
  --color-text-primary: #FFFFFF;
  --color-text-muted: #9AA5B5;
  --color-text-dark: #1A1A2E;

  /* Typography */
  --font-family-base: 'Poppins', 'Inter', sans-serif;
  --font-size-h1: 28px;
  --font-size-h2: 20px;
  --font-size-body: 14px;
  --font-size-caption: 12px;

  /* Radius & Spacing */
  --radius-card: 10px;
  --radius-pill: 999px;
  --spacing-section: 32px;
  --spacing-card-padding: 20px;

  /* Shadow */
  --shadow-card: 0 4px 12px rgba(0,0,0,0.25);
}
```

---

## 11. Catatan untuk Pengembangan Lanjutan
- Perlu dicek versi mobile/responsive (gambar terlihat seperti tampilan mobile-width per halaman)
- Sidebar "Profil Fakultas" bisa direplikasi jadi komponen reusable (misalnya `<SidebarMenu activeItem="visi-misi" />`)
- Struktur card konten (breadcrumb + judul + body + footer + FAB hijau) bisa dijadikan 1 layout template (`PageLayout.jsx`) agar 4 halaman dalam tinggal isi konten saja
- Struktur Organisasi memakai diagram/flowchart — perlu komponen khusus (org-chart) terpisah dari card teks biasa
