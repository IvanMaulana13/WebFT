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
