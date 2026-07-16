/**
 * Zod Validation Schemas Placeholder
 * Schema validasi lengkap akan diimplementasikan di Part 1 ke atas
 *
 * Modules:
 * - auth (login)
 * - users (manajemen user)
 * - informasi
 * - berita
 * - prestasi
 * - kemitraan
 * - dosen
 * - pimpinan_fakultas
 */

import { z } from "zod";

// Placeholder login schema (akan disempurnakan di Part 2)
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
