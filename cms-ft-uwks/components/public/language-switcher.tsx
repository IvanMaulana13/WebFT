"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  isMobile?: boolean;
}

export default function LanguageSwitcher({
  className = "",
  isMobile = false,
}: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (nextLocale: "id" | "en") => {
    if (nextLocale === currentLocale || isPending) return;

    // Save locale preference to NEXT_LOCALE cookie (1 year max-age)
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

    startTransition(() => {
      const search = searchParams.toString();
      const targetPath = search ? `${pathname}?${search}` : pathname;
      router.replace(targetPath, { locale: nextLocale });
    });
  };

  if (isMobile) {
    return (
      <div
        className={`flex items-center justify-between px-4 py-2.5 rounded-lg bg-white/10 text-xs font-semibold ${className}`}
      >
        <div className="flex items-center gap-2 text-white/80">
          <Globe className="w-4 h-4 text-[#E5B80B]" />
          <span>Bahasa / Language</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-md">
          <button
            type="button"
            onClick={() => switchLocale("id")}
            disabled={isPending}
            className={`px-2.5 py-1 rounded text-xs transition-all ${
              currentLocale === "id"
                ? "bg-[#E5B80B] text-[#002347] font-bold shadow-xs"
                : "text-white/70 hover:text-white"
            }`}
          >
            ID
          </button>
          <span className="text-white/30 text-xs">|</span>
          <button
            type="button"
            onClick={() => switchLocale("en")}
            disabled={isPending}
            className={`px-2.5 py-1 rounded text-xs transition-all ${
              currentLocale === "en"
                ? "bg-[#E5B80B] text-[#002347] font-bold shadow-xs"
                : "text-white/70 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 text-xs text-[#002347] ${className}`}
      title="Ganti Bahasa / Switch Language"
    >
      <Globe className="w-4 h-4 text-[#002347]" />
      <button
        type="button"
        onClick={() => switchLocale("id")}
        disabled={isPending}
        className={`transition-colors cursor-pointer px-1 py-0.5 rounded ${
          currentLocale === "id"
            ? "text-[#002347] font-extrabold"
            : "text-slate-400 font-medium hover:text-[#002347]"
        }`}
        aria-label="Pilih Bahasa Indonesia"
      >
        ID
      </button>
      <span className="text-slate-300 font-light select-none">|</span>
      <button
        type="button"
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`transition-colors cursor-pointer px-1 py-0.5 rounded ${
          currentLocale === "en"
            ? "text-[#002347] font-extrabold"
            : "text-slate-400 font-medium hover:text-[#002347]"
        }`}
        aria-label="Select English"
      >
        EN
      </button>
    </div>
  );
}
