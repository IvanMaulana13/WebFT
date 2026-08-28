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
// Dosen
// ─────────────────────────────────────────────
export const PRODI_LIST = [
  "Teknik Sipil",
  "Informatika",
  "Teknologi Industri Pertanian",
] as const;

export const dosenSchema = z.object({
  photoUrl: z.string().max(500).optional().or(z.literal("")),
  nik: z
    .string()
    .min(1, "NIK wajib diisi")
    .max(30, "NIK maksimal 30 karakter")
    .regex(/^\d+$/, "NIK hanya boleh berisi angka"),
  kodeDosen: z
    .string()
    .min(1, "Kode Dosen wajib diisi")
    .max(20, "Kode Dosen maksimal 20 karakter")
    .regex(/^[A-Za-z0-9]+$/, "Kode Dosen hanya boleh berisi huruf dan angka"),
  nidn: z
    .string()
    .min(1, "NIDN wajib diisi")
    .max(20, "NIDN maksimal 20 karakter")
    .regex(/^\d+$/, "NIDN hanya boleh berisi angka"),
  name: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter"),
  prodi: z.string().min(1, "Program Studi wajib diisi").max(255),
  email: z.string().email("Format email tidak valid").max(255),
});

export type DosenInput = z.infer<typeof dosenSchema>;

export const dosenUpdateSchema = dosenSchema;
export type DosenUpdateInput = z.infer<typeof dosenUpdateSchema>;

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
// Reorder (generic — dipakai oleh kemitraan/reorder)
// ─────────────────────────────────────────────
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
export const BERITA_KATEGORI = ["berita", "kegiatan", "beasiswa"] as const;
export type BeritaKategori = typeof BERITA_KATEGORI[number];
export const beritaSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(500, "Judul maksimal 500 karakter"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(500)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"),
  content: z.string().min(1, "Konten wajib diisi"),
  thumbnailUrl: z.string().url("URL thumbnail tidak valid").max(500).optional().or(z.literal("")),
  category: z.enum(["berita", "kegiatan", "beasiswa"], {
    error: "Kategori harus salah satu dari: berita, kegiatan, beasiswa",
  }),
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

// ─────────────────────────────────────────────
// Pimpinan Fakultas
// ─────────────────────────────────────────────
export const JABATAN_DEKAN = "Dekan";

export const pimpinanSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(255, "Nama maksimal 255 karakter"),
  photoUrl: z.string().max(500).optional().or(z.literal("")),
  jabatan: z.string().min(1, "Jabatan wajib diisi").max(255),
  periodeMulai: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)")
    .optional()
    .or(z.literal("")),
  periodeSelesai: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)")
    .optional()
    .or(z.literal("")),
  sambutan: z.string().optional().or(z.literal("")),
});

export type PimpinanInput = z.infer<typeof pimpinanSchema>;

export const pimpinanUpdateSchema = pimpinanSchema;
export type PimpinanUpdateInput = z.infer<typeof pimpinanUpdateSchema>;

// ─────────────────────────────────────────────
// Akademik — Program Studi
// ─────────────────────────────────────────────
export const programStudiSchema = z.object({
  nama: z.string().min(1, "Nama program studi wajib diisi").max(255, "Nama maksimal 255 karakter"),
  kode: z
    .string()
    .min(1, "Kode wajib diisi")
    .max(20, "Kode maksimal 20 karakter")
    .regex(/^[A-Za-z0-9]+$/, "Kode hanya boleh berisi huruf dan angka"),
});

export type ProgramStudiInput = z.infer<typeof programStudiSchema>;
export const programStudiUpdateSchema = programStudiSchema;
export type ProgramStudiUpdateInput = z.infer<typeof programStudiUpdateSchema>;

// ─────────────────────────────────────────────
// Akademik — Kalender Akademik (single-record)
// ─────────────────────────────────────────────
export const kalenderAkademikSchema = z.object({
  fileUrl: z.string().min(1, "File wajib diunggah terlebih dahulu").max(500),
  tahunAjaran: z
    .string()
    .min(1, "Tahun ajaran wajib diisi")
    .max(20, "Tahun ajaran maksimal 20 karakter"),
});

export type KalenderAkademikInput = z.infer<typeof kalenderAkademikSchema>;

// ─────────────────────────────────────────────
// Akademik — Pedoman Akademik (single-record)
// ─────────────────────────────────────────────
export const pedomanAkademikSchema = z.object({
  fileUrl: z.string().min(1, "File wajib diunggah terlebih dahulu").max(500),
});

export type PedomanAkademikInput = z.infer<typeof pedomanAkademikSchema>;

// ─────────────────────────────────────────────
// Akademik — Jadwal Kuliah
// ─────────────────────────────────────────────
export const jadwalKuliahSchema = z.object({
  prodiId: z.number().int().positive("Program studi wajib dipilih"),
  fileUrl: z.string().min(1, "File jadwal wajib diunggah terlebih dahulu").max(500),
  semester: z.enum(["ganjil", "genap"], {
    error: "Semester harus 'ganjil' atau 'genap'",
  }),
  tahunAjaran: z
    .string()
    .min(1, "Tahun ajaran wajib diisi")
    .max(20, "Tahun ajaran maksimal 20 karakter"),
});

export type JadwalKuliahInput = z.infer<typeof jadwalKuliahSchema>;
export const jadwalKuliahUpdateSchema = jadwalKuliahSchema;
export type JadwalKuliahUpdateInput = z.infer<typeof jadwalKuliahUpdateSchema>;

// ─────────────────────────────────────────────
// Akademik — Akreditasi
// ─────────────────────────────────────────────
export const akreditasiSchema = z.object({
  prodiId: z.number().int().positive("Program studi wajib dipilih"),
  peringkat: z.string().min(1, "Peringkat wajib diisi").max(100, "Peringkat maksimal 100 karakter"),
  noSk: z.string().min(1, "Nomor SK wajib diisi").max(255, "Nomor SK maksimal 255 karakter"),
  tanggalBerlaku: z
    .string()
    .min(1, "Tanggal berlaku wajib diisi")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)"),
  fileSertifikat: z.string().min(1, "File sertifikat wajib diunggah terlebih dahulu").max(500),
});

export type AkreditasiInput = z.infer<typeof akreditasiSchema>;
export const akreditasiUpdateSchema = akreditasiSchema;
export type AkreditasiUpdateInput = z.infer<typeof akreditasiUpdateSchema>;

// ─────────────────────────────────────────────
// Akademik — Prosedur Akademik
// ─────────────────────────────────────────────
export const prosedurAkademikSchema = z
  .object({
    judulSop: z.string().min(1, "Judul SOP wajib diisi").max(500, "Judul maksimal 500 karakter"),
    narasi: z.string().min(1, "Narasi/deskripsi wajib diisi"),
    penanggungJawab: z.string().min(1, "Penanggung jawab wajib diisi").max(255, "Penanggung jawab maksimal 255 karakter"),
    fileUrl: z.string().max(500).optional().or(z.literal("")),
    linkUrl: z
      .string()
      .url("Format URL tidak valid (cth: https://example.com)")
      .max(500)
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      const hasFile = data.fileUrl && data.fileUrl.trim() !== "";
      const hasLink = data.linkUrl && data.linkUrl.trim() !== "";
      return hasFile || hasLink;
    },
    {
      message: "Minimal salah satu dari File atau Link URL harus diisi",
      path: ["fileUrl"],
    }
  );

export type ProsedurAkademikInput = z.infer<typeof prosedurAkademikSchema>;
export const prosedurAkademikUpdateSchema = prosedurAkademikSchema;
export type ProsedurAkademikUpdateInput = z.infer<typeof prosedurAkademikUpdateSchema>;

// ─────────────────────────────────────────────
// Ormawa (Organisasi Kemahasiswaan)
// ─────────────────────────────────────────────
const urlOrEmpty = z
  .string()
  .url("Format URL tidak valid (harus diawali https:// atau http://)")
  .optional()
  .or(z.literal(""));

export const ormawaSchema = z
  .object({
    nama: z.string().min(1, "Nama ormawa wajib diisi").max(255),
    logoUrl: z.string().max(500).optional().or(z.literal("")),
    deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
    websiteUrl: urlOrEmpty,
    instagramUrl: urlOrEmpty,
  })
  .refine(
    (data) => {
      const hasWeb = data.websiteUrl && data.websiteUrl.trim() !== "";
      const hasIg = data.instagramUrl && data.instagramUrl.trim() !== "";
      return hasWeb || hasIg;
    },
    {
      message: "Minimal salah satu dari Website URL atau Instagram URL wajib diisi",
      path: ["websiteUrl"],
    }
  );

export type OrmawaInput = z.infer<typeof ormawaSchema>;

// ─────────────────────────────────────────────
// Lomba (Informasi Lomba Mahasiswa)
// ─────────────────────────────────────────────
export const lombaSchema = z
  .object({
    namaLomba: z.string().min(1, "Nama lomba wajib diisi").max(500),
    tingkat: z.enum(["nasional", "internasional"], {
      error: "Tingkat harus 'nasional' atau 'internasional'",
    }),
    tanggalMulaiPendaftaran: z
      .string()
      .min(1, "Tanggal mulai pendaftaran wajib diisi")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)"),
    tanggalSelesaiPendaftaran: z
      .string()
      .min(1, "Tanggal selesai pendaftaran wajib diisi")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)"),
    linkPendaftaran: z
      .string()
      .url("Format URL tidak valid")
      .max(500, "URL terlalu panjang"),
    deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  })
  .refine(
    (data) => {
      if (!data.tanggalMulaiPendaftaran || !data.tanggalSelesaiPendaftaran) return true;
      return data.tanggalSelesaiPendaftaran >= data.tanggalMulaiPendaftaran;
    },
    {
      message: "Tanggal selesai pendaftaran harus sama atau setelah tanggal mulai",
      path: ["tanggalSelesaiPendaftaran"],
    }
  );

export type LombaInput = z.infer<typeof lombaSchema>;

// ─────────────────────────────────────────────
// Konseling Layanan (single-record)
// ─────────────────────────────────────────────
export const konselingLayananSchema = z
  .object({
    narasi: z.string().optional().or(z.literal("")),
    offlineAktif: z.boolean(),
    lokasi: z.string().optional().or(z.literal("")),
    jamLayananOffline: z.string().optional().or(z.literal("")),
    onlineAktif: z.boolean(),
    kontakPenanggungJawab: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.offlineAktif || data.onlineAktif, {
    message: "Minimal salah satu layanan (offline atau online) harus diaktifkan",
    path: ["offlineAktif"],
  })
  .refine(
    (data) => {
      if (!data.offlineAktif) return true;
      return (
        data.lokasi && data.lokasi.trim() !== "" &&
        data.jamLayananOffline && data.jamLayananOffline.trim() !== ""
      );
    },
    {
      message: "Lokasi dan jam layanan wajib diisi jika layanan offline diaktifkan",
      path: ["lokasi"],
    }
  )
  .refine(
    (data) => {
      if (!data.onlineAktif) return true;
      return data.kontakPenanggungJawab && data.kontakPenanggungJawab.trim() !== "";
    },
    {
      message: "Kontak penanggung jawab wajib diisi jika layanan online diaktifkan",
      path: ["kontakPenanggungJawab"],
    }
  );

export type KonselingLayananInput = z.infer<typeof konselingLayananSchema>;

// ─────────────────────────────────────────────
// Jadwal Konseling
// ─────────────────────────────────────────────
export const jadwalKonselingSchema = z.object({
  tanggal: z
    .string()
    .min(1, "Tanggal wajib diisi")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)"),
  jam: z.string().min(1, "Jam wajib diisi").max(50, "Format jam terlalu panjang"),
  status: z.enum(["tersedia", "terisi"]).default("tersedia"),
});

export type JadwalKonselingInput = z.infer<typeof jadwalKonselingSchema>;
