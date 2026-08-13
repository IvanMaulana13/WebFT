"use client";

import { whatsappConfig } from "@/lib/config/social-links";

/**
 * WhatsApp Floating Bubble
 *
 * - Position: fixed, pojok kanan bawah (tidak bergeser saat scroll)
 * - Link format: https://wa.me/{number}?text={encoded message}
 * - Animasi pulse pada ring untuk menarik perhatian
 * - Tooltip label muncul saat hover
 * - Responsif: ukuran sedikit mengecil di layar kecil agar tidak menutupi konten
 */
export default function WhatsappBubble() {
  const { number, message } = whatsappConfig;

  const whatsappUrl = `https://wa.me/${number}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 sm:bottom-8 sm:right-8">
      {/* Tooltip label */}
      <div className="group-hover:opacity-100 pointer-events-none select-none rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-md backdrop-blur-sm opacity-0 translate-x-2 transition-all duration-200 [.wa-bubble:hover~&]:opacity-100 [.wa-bubble:hover~&]:translate-x-0">
        Chat WhatsApp
      </div>

      {/* Bubble button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi kami via WhatsApp"
        title="Hubungi kami via WhatsApp"
        className="wa-bubble group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-green-900/40 transition-all duration-300 hover:scale-110 hover:shadow-green-500/40 sm:h-16 sm:w-16"
      >
        {/* Pulse ring animasi */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping"
          aria-hidden="true"
        />
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping [animation-delay:0.5s]"
          aria-hidden="true"
        />

        {/* WhatsApp icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="relative h-7 w-7 text-white sm:h-8 sm:w-8 drop-shadow"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>

        {/* Tooltip on hover (visible on desktop) */}
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-md backdrop-blur-sm opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 hidden sm:block">
          Chat WhatsApp
        </span>
      </a>
    </div>
  );
}
