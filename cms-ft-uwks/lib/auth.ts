/**
 * Auth.js (NextAuth v5) Configuration Placeholder
 * Implementasi penuh akan dilakukan di Part 2
 */
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to /login
      }

      return true;
    },
  },
});
