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
// 2. informasi
// ─────────────────────────────────────────────
export const informasi = mysqlTable("informasi", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  orderIndex: int("order_index").notNull().default(0),
  status: mysqlEnum("status", ["draft", "published"]).notNull().default("draft"),
  createdBy: int("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type Informasi = typeof informasi.$inferSelect;
export type NewInformasi = typeof informasi.$inferInsert;

// ─────────────────────────────────────────────
// 3. berita
// ─────────────────────────────────────────────
export const berita = mysqlTable("berita", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  category: varchar("category", { length: 100 }),
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
// 10. activity_logs
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
