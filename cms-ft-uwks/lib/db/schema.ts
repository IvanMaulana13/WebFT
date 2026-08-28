import {
  mysqlTable,
  mysqlEnum,
  varchar,
  text,
  int,
  boolean,
  timestamp,
  datetime,
  date,
} from "drizzle-orm/mysql-core";

// ─────────────────────────────────────────────
// 1. users
// ─────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["super_admin", "admin"]).notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ─────────────────────────────────────────────
// 2. berita
// ─────────────────────────────────────────────
export const berita = mysqlTable("berita", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  category: mysqlEnum("category", ["berita", "kegiatan", "beasiswa"])
    .notNull()
    .default("berita"),
  status: mysqlEnum("status", ["draft", "published", "archived"])
    .notNull()
    .default("draft"),
  publishedAt: datetime("published_at"),
  createdBy: int("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type Berita = typeof berita.$inferSelect;
export type NewBerita = typeof berita.$inferInsert;

// ─────────────────────────────────────────────
// 4. prestasi
// ─────────────────────────────────────────────
export const prestasi = mysqlTable("prestasi", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 500 }).notNull(),
  achieverName: varchar("achiever_name", { length: 255 }).notNull(),
  level: mysqlEnum("level", ["nasional", "internasional"]).notNull(),
  year: int("year").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type Prestasi = typeof prestasi.$inferSelect;
export type NewPrestasi = typeof prestasi.$inferInsert;

// ─────────────────────────────────────────────
// 5. kemitraan
// ─────────────────────────────────────────────
export const kemitraan = mysqlTable("kemitraan", {
  id: int("id").primaryKey().autoincrement(),
  partnerName: varchar("partner_name", { length: 255 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  partnershipType: varchar("partnership_type", { length: 100 }),
  mouDate: date("mou_date"),
  description: text("description"),
  websiteUrl: varchar("website_url", { length: 500 }),
  orderIndex: int("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type Kemitraan = typeof kemitraan.$inferSelect;
export type NewKemitraan = typeof kemitraan.$inferInsert;

// ─────────────────────────────────────────────
// 6. dosen
// ─────────────────────────────────────────────
export const dosen = mysqlTable("dosen", {
  id: int("id").primaryKey().autoincrement(),
  photoUrl: varchar("photo_url", { length: 500 }),
  nik: varchar("nik", { length: 30 }).notNull().unique(),
  kodeDosen: varchar("kode_dosen", { length: 20 }).notNull().unique(),
  nidn: varchar("nidn", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  prodi: varchar("prodi", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type Dosen = typeof dosen.$inferSelect;
export type NewDosen = typeof dosen.$inferInsert;

// ─────────────────────────────────────────────
// 7. tenaga_pendidikan
// ─────────────────────────────────────────────
export const tenagaPendidikan = mysqlTable("tenaga_pendidikan", {
  id: int("id").primaryKey().autoincrement(),
  photoUrl: varchar("photo_url", { length: 500 }),
  nuptk: varchar("nuptk", { length: 20 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  jabatan: varchar("jabatan", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type TenagaPendidikan = typeof tenagaPendidikan.$inferSelect;
export type NewTenagaPendidikan = typeof tenagaPendidikan.$inferInsert;

// ─────────────────────────────────────────────
// 8. pimpinan_fakultas
// ─────────────────────────────────────────────
export const pimpinanFakultas = mysqlTable("pimpinan_fakultas", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  photoUrl: varchar("photo_url", { length: 500 }),
  jabatan: varchar("jabatan", { length: 255 }).notNull(),
  periodeMulai: date("periode_mulai"),
  periodeSelesai: date("periode_selesai"),
  /** Sambutan khusus untuk jabatan Dekan */
  sambutan: text("sambutan"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type PimpinanFakultas = typeof pimpinanFakultas.$inferSelect;
export type NewPimpinanFakultas = typeof pimpinanFakultas.$inferInsert;

// ─────────────────────────────────────────────
// 9. struktur_organisasi
// Single-record table: selalu UPDATE baris yang sama, bukan INSERT baru.
// Seed awal: 1 baris dengan id = 1 (image_url boleh null/placeholder).
// ─────────────────────────────────────────────
export const strukturOrganisasi = mysqlTable("struktur_organisasi", {
  id: int("id").primaryKey().autoincrement(),
  imageUrl: varchar("image_url", { length: 500 }),
  updatedBy: int("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type StrukturOrganisasi = typeof strukturOrganisasi.$inferSelect;
export type NewStrukturOrganisasi = typeof strukturOrganisasi.$inferInsert;

// ─────────────────────────────────────────────
// 10. site_settings
// Single-record table: selalu UPDATE baris yang sama, bukan INSERT baru.
// Seed awal: 1 baris dengan id = 1 (semua value null/kosong).
// ─────────────────────────────────────────────
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").primaryKey().autoincrement(),
  /** URL file video hero (mp4/webm), diisi otomatis dari upload */
  heroVideoUrl: varchar("hero_video_url", { length: 500 }),
  /** URL gambar fallback/poster saat video belum termuat */
  heroPosterUrl: varchar("hero_poster_url", { length: 500 }),
  /** Nomor WhatsApp format internasional tanpa "+", contoh: 6281234567890 */
  waNumber: varchar("wa_number", { length: 20 }),
  /** Pesan default saat tombol WA diklik */
  waDefaultMessage: text("wa_default_message"),
  socialInstagram: varchar("social_instagram", { length: 500 }),
  socialFacebook: varchar("social_facebook", { length: 500 }),
  socialYoutube: varchar("social_youtube", { length: 500 }),
  socialTwitter: varchar("social_twitter", { length: 500 }),
  socialLinkedin: varchar("social_linkedin", { length: 500 }),
  updatedBy: int("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;

// ─────────────────────────────────────────────
// 11. activity_logs
// ─────────────────────────────────────────────
export const activityLogs = mysqlTable("activity_logs", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 50 }).notNull(), // 'create' | 'update' | 'delete'
  module: varchar("module", { length: 100 }).notNull(), // 'berita' | 'dosen' | ...
  recordId: int("record_id"),
  detail: text("detail"), // JSON string atau deskripsi bebas
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

// ─────────────────────────────────────────────
// 12. visitor_logs
// Anonymous visitor tracking — tidak menyimpan data pribadi.
// visitor_id = UUID dari cookie 'visitor_id' yang di-set client-side.
// ─────────────────────────────────────────────
export const visitorLogs = mysqlTable("visitor_logs", {
  id: int("id").primaryKey().autoincrement(),
  /** UUID v4 dari cookie 'visitor_id' — tidak ada data pribadi */
  visitorId: varchar("visitor_id", { length: 36 }).notNull(),
  /** Path halaman yang dikunjungi, contoh: "/" atau "/berita/judul-berita" */
  path: varchar("path", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type VisitorLog = typeof visitorLogs.$inferSelect;
export type NewVisitorLog = typeof visitorLogs.$inferInsert;

// ─────────────────────────────────────────────
// 13. program_studi
// Master data program studi — direferensikan oleh jadwal_kuliah & akreditasi.
// ─────────────────────────────────────────────
export const programStudi = mysqlTable("program_studi", {
  id: int("id").primaryKey().autoincrement(),
  nama: varchar("nama", { length: 255 }).notNull(),
  kode: varchar("kode", { length: 20 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ProgramStudi = typeof programStudi.$inferSelect;
export type NewProgramStudi = typeof programStudi.$inferInsert;

// ─────────────────────────────────────────────
// 14. kalender_akademik
// Single-record: selalu UPDATE baris yang sama (id = 1).
// Seed awal: 1 baris dengan file_url = null.
// ─────────────────────────────────────────────
export const kalenderAkademik = mysqlTable("kalender_akademik", {
  id: int("id").primaryKey().autoincrement(),
  fileUrl: varchar("file_url", { length: 500 }),
  tahunAjaran: varchar("tahun_ajaran", { length: 20 }),
  updatedBy: int("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type KalenderAkademik = typeof kalenderAkademik.$inferSelect;
export type NewKalenderAkademik = typeof kalenderAkademik.$inferInsert;

// ─────────────────────────────────────────────
// 15. pedoman_akademik
// Single-record: selalu UPDATE baris yang sama (id = 1).
// Seed awal: 1 baris dengan file_url = null.
// ─────────────────────────────────────────────
export const pedomanAkademik = mysqlTable("pedoman_akademik", {
  id: int("id").primaryKey().autoincrement(),
  fileUrl: varchar("file_url", { length: 500 }),
  updatedBy: int("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PedomanAkademik = typeof pedomanAkademik.$inferSelect;
export type NewPedomanAkademik = typeof pedomanAkademik.$inferInsert;

// ─────────────────────────────────────────────
// 16. jadwal_kuliah
// CRUD biasa: satu prodi bisa punya banyak jadwal (beda semester/tahun).
// Soft delete dengan deleted_at.
// ─────────────────────────────────────────────
export const jadwalKuliah = mysqlTable("jadwal_kuliah", {
  id: int("id").primaryKey().autoincrement(),
  prodiId: int("prodi_id")
    .notNull()
    .references(() => programStudi.id, { onDelete: "restrict" }),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  semester: mysqlEnum("semester", ["ganjil", "genap"]).notNull(),
  tahunAjaran: varchar("tahun_ajaran", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type JadwalKuliah = typeof jadwalKuliah.$inferSelect;
export type NewJadwalKuliah = typeof jadwalKuliah.$inferInsert;

// ─────────────────────────────────────────────
// 17. akreditasi
// CRUD: satu prodi bisa punya 1 atau lebih data akreditasi.
// Soft delete dengan deleted_at.
// ─────────────────────────────────────────────
export const akreditasi = mysqlTable("akreditasi", {
  id: int("id").primaryKey().autoincrement(),
  prodiId: int("prodi_id")
    .notNull()
    .references(() => programStudi.id, { onDelete: "restrict" }),
  /** Peringkat fleksibel (text) agar tidak perlu ubah enum saat BAN-PT ubah istilah */
  peringkat: varchar("peringkat", { length: 100 }).notNull(),
  noSk: varchar("no_sk", { length: 255 }).notNull(),
  tanggalBerlaku: date("tanggal_berlaku").notNull(),
  fileSertifikat: varchar("file_sertifikat", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type Akreditasi = typeof akreditasi.$inferSelect;
export type NewAkreditasi = typeof akreditasi.$inferInsert;

// ─────────────────────────────────────────────
// 18. prosedur_akademik
// CRUD SOP/prosedur akademik: bisa berupa file upload atau link eksternal.
// Soft delete dengan deleted_at.
// ─────────────────────────────────────────────
export const prosedurAkademik = mysqlTable("prosedur_akademik", {
  id: int("id").primaryKey().autoincrement(),
  judulSop: varchar("judul_sop", { length: 500 }).notNull(),
  narasi: text("narasi").notNull(),
  fileUrl: varchar("file_url", { length: 500 }),
  linkUrl: varchar("link_url", { length: 500 }),
  penanggungJawab: varchar("penanggung_jawab", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type ProsedurAkademik = typeof prosedurAkademik.$inferSelect;
export type NewProsedurAkademik = typeof prosedurAkademik.$inferInsert;
