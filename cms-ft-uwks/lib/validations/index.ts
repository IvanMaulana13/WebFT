import { z } from "zod";

// ─────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────
// Tenaga Pendidikan
// ─────────────────────────────────────────────
export const tenagaPendidikanSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(255),
  jabatan: z.string().min(1, "Jabatan wajib diisi").max(255),
  email: z.string().email("Format email tidak valid").max(255),
  nuptk: z
    .string()
    .max(20, "NUPTK maksimal 20 karakter")
    .regex(/^\d*$/, "NUPTK hanya boleh berisi angka")
    .optional()
    .or(z.literal("")),
  photoUrl: z.string().url("URL foto tidak valid").max(500).optional().or(z.literal("")),
});

export type TenagaPendidikanInput = z.infer<typeof tenagaPendidikanSchema>;

export const tenagaPendidikanUpdateSchema = tenagaPendidikanSchema.partial().extend({
  name: z.string().min(1, "Nama wajib diisi").max(255),
  jabatan: z.string().min(1, "Jabatan wajib diisi").max(255),
  email: z.string().email("Format email tidak valid").max(255),
});

export type TenagaPendidikanUpdateInput = z.infer<typeof tenagaPendidikanUpdateSchema>;

// ─────────────────────────────────────────────
// User Management
// ─────────────────────────────────────────────
export const createUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter"),
  email: z.string().email("Format email tidak valid").max(255, "Email maksimal 255 karakter"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(100, "Password maksimal 100 karakter"),
  role: z.enum(["super_admin", "admin"]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(255).optional(),
  email: z.string().email("Format email tidak valid").max(255).optional(),
  role: z.enum(["super_admin", "admin"]).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ─────────────────────────────────────────────
// Informasi
// ─────────────────────────────────────────────
export const informasiSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(500, "Judul maksimal 500 karakter"),
  content: z.string().min(1, "Konten wajib diisi"),
  category: z.string().max(100, "Kategori maksimal 100 karakter").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

export type InformasiInput = z.infer<typeof informasiSchema>;

export const informasiUpdateSchema = informasiSchema.partial().extend({
  title: z.string().min(1, "Judul wajib diisi").max(500),
  content: z.string().min(1, "Konten wajib diisi"),
});

export type InformasiUpdateInput = z.infer<typeof informasiUpdateSchema>;

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.number().int().positive(),
      orderIndex: z.number().int().min(0),
    })
  ).min(1, "Minimal satu item diperlukan"),
});

export type ReorderInput = z.infer<typeof reorderSchema>;

// ─────────────────────────────────────────────
// Berita
// ─────────────────────────────────────────────
export const beritaSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(500, "Judul maksimal 500 karakter"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(500)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"),
  content: z.string().min(1, "Konten wajib diisi"),
  thumbnailUrl: z.string().url("URL thumbnail tidak valid").max(500).optional().or(z.literal("")),
  category: z.string().max(100).optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
  publishedAt: z.string().optional().or(z.literal("")),
});

export type BeritaInput = z.infer<typeof beritaSchema>;

export const beritaUpdateSchema = beritaSchema;
export type BeritaUpdateInput = z.infer<typeof beritaUpdateSchema>;

// ─────────────────────────────────────────────
// Prestasi
// ─────────────────────────────────────────────
const CURRENT_YEAR = new Date().getFullYear();

export const prestasiSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(500, "Judul maksimal 500 karakter"),
  achieverName: z.string().min(1, "Nama peraih wajib diisi").max(255, "Nama peraih maksimal 255 karakter"),
  level: z.enum(["nasional", "internasional"] as const, {
    error: "Level harus nasional atau internasional",
  }),
  year: z
    .number()
    .int("Tahun harus berupa bilangan bulat")
    .min(1000, "Tahun harus 4 digit")
    .max(9999, "Tahun harus 4 digit")
    .refine((y) => y <= CURRENT_YEAR, {
      message: `Tahun tidak boleh melebihi tahun berjalan (${CURRENT_YEAR})`,
    }),
  imageUrl: z.string().url("URL gambar tidak valid").max(500).optional().or(z.literal("")),
  description: z.string().max(5000, "Deskripsi maksimal 5000 karakter").optional().or(z.literal("")),
});

export type PrestasiInput = z.infer<typeof prestasiSchema>;

export const prestasiUpdateSchema = prestasiSchema;
export type PrestasiUpdateInput = z.infer<typeof prestasiUpdateSchema>;

// ─────────────────────────────────────────────
// Kemitraan
// ─────────────────────────────────────────────
export const kemitraanSchema = z.object({
  partnerName: z.string().min(1, "Nama mitra wajib diisi").max(255, "Nama mitra maksimal 255 karakter"),
  logoUrl: z.string().url("URL logo tidak valid").max(500).optional().or(z.literal("")),
  partnershipType: z.string().max(100, "Tipe kemitraan maksimal 100 karakter").optional().or(z.literal("")),
  mouDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)")
    .optional()
    .or(z.literal("")),
  description: z.string().max(5000, "Deskripsi maksimal 5000 karakter").optional().or(z.literal("")),
  websiteUrl: z
    .string()
    .url("Format URL tidak valid (cth: https://example.com)")
    .max(500)
    .optional()
    .or(z.literal("")),
  orderIndex: z.number().int().min(0).optional(),
});

export type KemitraanInput = z.infer<typeof kemitraanSchema>;

export const kemitraanUpdateSchema = kemitraanSchema;
export type KemitraanUpdateInput = z.infer<typeof kemitraanUpdateSchema>;
