/**
 * Konfigurasi terpusat untuk link media sosial dan kontak WhatsApp FT UWKS.
 * Ubah URL/nomor di sini untuk update semua komponen yang menggunakannya.
 */

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  {
    platform: "instagram",
    label: "Instagram FT UWKS",
    url: "#", // Ganti dengan: https://www.instagram.com/ft.uwks
    icon: "Instagram",
  },
  {
    platform: "facebook",
    label: "Facebook FT UWKS",
    url: "#", // Ganti dengan: https://www.facebook.com/ft.uwks
    icon: "Facebook",
  },
  {
    platform: "youtube",
    label: "YouTube FT UWKS",
    url: "#", // Ganti dengan: https://www.youtube.com/@ftuwks
    icon: "Youtube",
  },
  {
    platform: "twitter",
    label: "X / Twitter FT UWKS",
    url: "#", // Ganti dengan: https://x.com/ft_uwks
    icon: "Twitter",
  },
  {
    platform: "linkedin",
    label: "LinkedIn FT UWKS",
    url: "#", // Ganti dengan: https://www.linkedin.com/school/ft-uwks
    icon: "Linkedin",
  },
];

/**
 * Konfigurasi WhatsApp floating bubble.
 * number: nomor internasional tanpa "+" (format: 62XXXXXXXXXX)
 * message: pesan default yang muncul otomatis saat buka chat
 */
export const whatsappConfig = {
  number: "6281234567890", // Ganti dengan nomor resmi WA FT UWKS (format: 62XXXXXXXXXX)
  message: "Halo, saya ingin bertanya tentang Fakultas Teknik UWKS.",
};
