"use server";

import { signIn } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { AuthError } from "next-auth";

/**
 * Server Action untuk proses login.
 *
 * Alur:
 * 1. Cek rate limit berdasarkan email
 * 2. Panggil signIn → authorize akan verifikasi credentials + log + rate limit
 * 3. Jika AuthError → return error message
 * 4. Jika redirect (sukses) → re-throw agar Next.js handle redirect ke /dashboard
 */
export async function loginAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = (formData.get("email") as string) ?? "";
  const key = `login:${email}`;

  // Primary rate limit check — sebelum memanggil DB sama sekali
  const { limited } = checkRateLimit(key);
  if (limited) {
    return {
      error:
        "Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // AuthError = credentials salah / user tidak aktif
      return { error: "Email atau password salah." };
    }
    // Re-throw errors lain (termasuk NEXT_REDIRECT dari redirectTo)
    throw error;
  }

  return null;
}
