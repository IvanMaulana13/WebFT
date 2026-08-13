import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { sql } from "drizzle-orm";
import { z } from "zod";

// ─────────────────────────────────────────────
// Validasi schema Zod untuk PUT /api/settings
// ─────────────────────────────────────────────
const settingsSchema = z.object({
  wa_number: z
    .string()
    .regex(/^\d+$/, "Nomor WA hanya boleh berisi angka (contoh: 6281234567890)")
    .max(20, "Nomor WA terlalu panjang")
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),

  wa_default_message: z
    .string()
    .max(500, "Pesan terlalu panjang")
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),

  social_instagram: z
    .union([z.string().url("URL Instagram tidak valid"), z.literal("")])
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),

  social_facebook: z
    .union([z.string().url("URL Facebook tidak valid"), z.literal("")])
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),

  social_youtube: z
    .union([z.string().url("URL YouTube tidak valid"), z.literal("")])
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),

  social_twitter: z
    .union([z.string().url("URL X/Twitter tidak valid"), z.literal("")])
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),

  social_linkedin: z
    .union([z.string().url("URL LinkedIn tidak valid"), z.literal("")])
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),

  // hero URLs diisi dari hasil upload, bukan input manual
  hero_video_url: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),

  hero_poster_url: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),
});

// Pastikan selalu ada setidaknya 1 baris (seed guard)
async function ensureRow() {
  const [existing] = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .limit(1);

  if (!existing) {
    await db.insert(siteSettings).values({
      heroVideoUrl: null,
      heroPosterUrl: null,
      waNumber: null,
      waDefaultMessage: null,
      socialInstagram: null,
      socialFacebook: null,
      socialYoutube: null,
      socialTwitter: null,
      socialLinkedin: null,
      updatedBy: null,
    });
  }
}

// ─────────────────────────────────────────────
// GET /api/settings — kembalikan baris settings aktif
// ─────────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureRow();
    const [row] = await db.select().from(siteSettings).limit(1);
    return NextResponse.json({ data: row ?? null });
  } catch (error) {
    console.error("[GET /api/settings]", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pengaturan situs" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// PUT /api/settings — update baris yang ada (bukan insert baru)
// ─────────────────────────────────────────────
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const userId = session.user.id ? parseInt(session.user.id) : null;

    await ensureRow();

    await db
      .update(siteSettings)
      .set({
        heroVideoUrl: data.hero_video_url,
        heroPosterUrl: data.hero_poster_url,
        waNumber: data.wa_number,
        waDefaultMessage: data.wa_default_message,
        socialInstagram: data.social_instagram,
        socialFacebook: data.social_facebook,
        socialYoutube: data.social_youtube,
        socialTwitter: data.social_twitter,
        socialLinkedin: data.social_linkedin,
        updatedBy: userId,
      })
      .where(sql`1 = 1`);

    await logActivity({
      userId,
      action: "update",
      module: "site_settings",
      recordId: 1,
      detail: JSON.stringify({
        updated_by: session.user.email,
      }),
    });

    const [updated] = await db.select().from(siteSettings).limit(1);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/settings]", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan situs" },
      { status: 500 }
    );
  }
}
