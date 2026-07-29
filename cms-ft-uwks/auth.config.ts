/**
 * auth.config.ts — Edge-compatible NextAuth configuration
 *
 * File ini TIDAK boleh import modul Node.js (bcrypt, mysql2, drizzle, dsb)
 * karena dipakai oleh proxy.ts yang berjalan di Edge Runtime.
 *
 * lib/auth.ts akan meng-spread config ini dan menambahkan CredentialsProvider
 * (yang boleh menggunakan Node.js modules karena berjalan di server runtime).
 */

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as { role: "super_admin" | "admin" }).role;
      }
      return token;
    },

    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "super_admin" | "admin";
      }
      return session;
    },
  },

  // Provider dikosongkan di sini — hanya untuk edge runtime.
  // CredentialsProvider yang sebenarnya ada di lib/auth.ts.
  providers: [],
} satisfies NextAuthConfig;
