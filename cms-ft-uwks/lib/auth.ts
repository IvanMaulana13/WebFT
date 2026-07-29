import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";
import { checkRateLimit, recordFailure, resetLimit } from "@/lib/rate-limit";
import { logActivity } from "@/lib/activity-log";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Spread shared config (pages, session strategy, JWT + session callbacks)
  ...authConfig,

  // Override providers dengan implementasi penuh (boleh pakai Node.js modules)
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validasi format input
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const key = `login:${email}`;

        // Secondary rate limit check (primary ada di Server Action)
        const { limited } = checkRateLimit(key);
        if (limited) return null;

        // Cari user di DB
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user || !user.isActive) {
          recordFailure(key);
          await logActivity({
            userId: null,
            action: "login_failed",
            module: "auth",
            detail: JSON.stringify({
              email,
              reason: user ? "account_inactive" : "user_not_found",
            }),
          });
          return null;
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(
          password,
          user.passwordHash
        );
        if (!isPasswordValid) {
          recordFailure(key);
          await logActivity({
            userId: user.id,
            action: "login_failed",
            module: "auth",
            detail: JSON.stringify({ email, reason: "invalid_password" }),
          });
          return null;
        }

        // Login berhasil
        resetLimit(key);
        await logActivity({
          userId: user.id,
          action: "login_success",
          module: "auth",
          detail: JSON.stringify({ email }),
        });

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
