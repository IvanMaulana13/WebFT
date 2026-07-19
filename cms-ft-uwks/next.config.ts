import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Izinkan gambar dari public/uploads (lokal) dan domain eksternal jika perlu
    remotePatterns: [],
    // Untuk gambar /uploads/* yang disimpan lokal, tidak perlu remote pattern
    // Next.js akan serve langsung dari public/
    unoptimized: false,
  },
};

export default nextConfig;
