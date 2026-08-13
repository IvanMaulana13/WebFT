"use client";

/**
 * HeroVideo — Hero section dengan video background penuh.
 *
 * - Video: autoPlay, muted, loop, playsInline (diperlukan agar autoplay bekerja di browser modern)
 * - Poster: gambar fallback selagi video loading / gagal dimuat
 * - Overlay gelap semi-transparan agar teks tetap terbaca
 * - object-fit: cover → video menutupi penuh area tanpa distorsi
 */
export default function HeroVideo() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* ── Video Background ── */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.jpg"
        aria-hidden="true"
      >
        {/* WebM dulu untuk browser modern, MP4 sebagai fallback */}
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
        {/* Fallback teks untuk browser yang tidak mendukung video */}
        Browser Anda tidak mendukung pemutaran video.
      </video>

      {/* ── Overlay gelap semi-transparan ── */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {/* ── Gradient bawah untuk transisi halus ke section berikutnya ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent"
        aria-hidden="true"
      />

      {/* ── Konten / CTA di atas video ── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        {/* Badge akreditasi */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Terakreditasi Nasional
        </div>

        {/* Judul utama */}
        <h1 className="mb-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight drop-shadow-lg sm:text-5xl lg:text-6xl xl:text-7xl">
          Fakultas Teknik
          <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
            Universitas Wijaya Kusuma Surabaya
          </span>
        </h1>

        {/* Tagline */}
        <p className="mb-10 max-w-2xl text-base text-white/80 drop-shadow sm:text-lg lg:text-xl">
          Mencetak insinyur berkarakter, inovatif, dan berdaya saing global
          untuk kemajuan bangsa.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#informasi"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-600/50 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Jelajahi Fakultas
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Portal Admin
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/60"
            aria-label="Scroll ke bawah"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
