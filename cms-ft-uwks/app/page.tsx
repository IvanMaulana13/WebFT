import { redirect } from "next/navigation";

/**
 * Root route — redirect ke login.
 * Halaman publik (Beranda, Visi Misi, dll) dikerjakan oleh tim desain terpisah
 * dan belum diintegrasikan ke project ini.
 */
export default function RootPage() {
  redirect("/login");
}
