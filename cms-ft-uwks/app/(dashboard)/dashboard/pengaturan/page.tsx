"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Video,
  Image as ImageIcon,
  MessageCircle,
  Share2,
  Upload,
  Trash2,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface SiteSettingsData {
  id: number;
  heroVideoUrl: string | null;
  heroPosterUrl: string | null;
  waNumber: string | null;
  waDefaultMessage: string | null;
  socialInstagram: string | null;
  socialFacebook: string | null;
  socialYoutube: string | null;
  socialTwitter: string | null;
  socialLinkedin: string | null;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// Zod Schema (front-end validation)
// ─────────────────────────────────────────────
const formSchema = z.object({
  hero_video_url: z.string().nullable().optional(),
  hero_poster_url: z.string().nullable().optional(),
  wa_number: z
    .string()
    .regex(
      /^\d*$/,
      "Nomor WA hanya boleh berisi angka (contoh: 6281234567890)"
    )
    .max(20, "Nomor WA terlalu panjang")
    .optional(),
  wa_default_message: z.string().max(500).optional(),
  social_instagram: z
    .string()
    .refine(
      (v) => !v || /^https?:\/\/.+/.test(v),
      "Harus berupa URL valid (dimulai dengan https://)"
    )
    .optional(),
  social_facebook: z
    .string()
    .refine(
      (v) => !v || /^https?:\/\/.+/.test(v),
      "Harus berupa URL valid (dimulai dengan https://)"
    )
    .optional(),
  social_youtube: z
    .string()
    .refine(
      (v) => !v || /^https?:\/\/.+/.test(v),
      "Harus berupa URL valid (dimulai dengan https://)"
    )
    .optional(),
  social_twitter: z
    .string()
    .refine(
      (v) => !v || /^https?:\/\/.+/.test(v),
      "Harus berupa URL valid (dimulai dengan https://)"
    )
    .optional(),
  social_linkedin: z
    .string()
    .refine(
      (v) => !v || /^https?:\/\/.+/.test(v),
      "Harus berupa URL valid (dimulai dengan https://)"
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ─────────────────────────────────────────────
// Platform icon SVGs (inline, no extra deps)
// ─────────────────────────────────────────────
const PlatformIcon = ({ platform }: { platform: string }) => {
  const cls = "w-4 h-4 flex-shrink-0";
  switch (platform) {
    case "instagram":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "facebook":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
        </svg>
      );
    case "twitter":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 4l16 16" /><path d="m4 20 7.5-7.5M20 4l-7.5 7.5" /><path d="M4 4h4l12 16h-4z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
        </svg>
      );
    default:
      return null;
  }
};

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export default function PengaturanPage() {
  const queryClient = useQueryClient();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);

  // Fetch settings
  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Gagal mengambil pengaturan");
      return res.json() as Promise<{ data: SiteSettingsData }>;
    },
  });

  const settings = settingsResponse?.data;

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hero_video_url: "",
      hero_poster_url: "",
      wa_number: "",
      wa_default_message: "",
      social_instagram: "",
      social_facebook: "",
      social_youtube: "",
      social_twitter: "",
      social_linkedin: "",
    },
  });

  // Populate form with fetched data
  useEffect(() => {
    if (settings) {
      form.reset({
        hero_video_url: settings.heroVideoUrl ?? "",
        hero_poster_url: settings.heroPosterUrl ?? "",
        wa_number: settings.waNumber ?? "",
        wa_default_message: settings.waDefaultMessage ?? "",
        social_instagram: settings.socialInstagram ?? "",
        social_facebook: settings.socialFacebook ?? "",
        social_youtube: settings.socialYoutube ?? "",
        social_twitter: settings.socialTwitter ?? "",
        social_linkedin: settings.socialLinkedin ?? "",
      });
    }
  }, [settings, form]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        hero_video_url: values.hero_video_url || null,
        hero_poster_url: values.hero_poster_url || null,
        wa_number: values.wa_number || null,
        wa_default_message: values.wa_default_message || null,
        social_instagram: values.social_instagram || null,
        social_facebook: values.social_facebook || null,
        social_youtube: values.social_youtube || null,
        social_twitter: values.social_twitter || null,
        social_linkedin: values.social_linkedin || null,
      };
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Gagal menyimpan pengaturan");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Pengaturan berhasil disimpan!");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  // Upload video handler
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/settings/upload-video", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal upload video");
      form.setValue("hero_video_url", json.url);
      await queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Video hero berhasil diupload!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal upload video");
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  // Upload poster handler
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPoster(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/settings/upload-poster", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal upload poster");
      form.setValue("hero_poster_url", json.url);
      await queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Poster hero berhasil diupload!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal upload poster");
    } finally {
      setUploadingPoster(false);
      if (posterInputRef.current) posterInputRef.current.value = "";
    }
  };

  // Clear video/poster
  const clearVideo = () => {
    form.setValue("hero_video_url", "");
  };
  const clearPoster = () => {
    form.setValue("hero_poster_url", "");
  };

  // WA Test button
  const handleWaTest = () => {
    const number = form.getValues("wa_number");
    const message = form.getValues("wa_default_message");
    if (!number) {
      toast.error("Isi nomor WhatsApp terlebih dahulu");
      return;
    }
    const url = `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const onSubmit = (values: FormValues) => {
    saveMutation.mutate(values);
  };

  const videoUrl = form.watch("hero_video_url");
  const posterUrl = form.watch("hero_poster_url");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Situs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola video hero, kontak WhatsApp, dan media sosial Fakultas Teknik UWKS.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hero" id="tab-hero" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Hero Video
              </TabsTrigger>
              <TabsTrigger value="whatsapp" id="tab-whatsapp" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="sosmed" id="tab-sosmed" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Media Sosial
              </TabsTrigger>
            </TabsList>

            {/* ── TAB 1: HERO VIDEO ── */}
            <TabsContent value="hero" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-blue-600" />
                    Video Hero
                  </CardTitle>
                  <CardDescription>
                    Video latar belakang yang ditampilkan di halaman utama website.
                    Format MP4 atau WebM, maksimal 20MB.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Video Preview */}
                  {videoUrl ? (
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-black aspect-video relative">
                      <video
                        key={videoUrl}
                        src={videoUrl}
                        controls
                        className="w-full h-full object-contain"
                        aria-label="Preview video hero"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 aspect-video flex flex-col items-center justify-center gap-3 text-gray-400">
                      <Video className="w-12 h-12 opacity-30" />
                      <p className="text-sm">Belum ada video hero</p>
                    </div>
                  )}

                  {/* Video Actions */}
                  <div className="flex items-center gap-3">
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/webm"
                      className="hidden"
                      id="video-upload-input"
                      onChange={handleVideoUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      id="btn-upload-video"
                      disabled={uploadingVideo}
                      onClick={() => videoInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      {uploadingVideo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {videoUrl ? "Ganti Video" : "Upload Video"}
                    </Button>
                    {videoUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        id="btn-clear-video"
                        onClick={clearVideo}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus Video
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Poster Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-600" />
                    Poster / Gambar Fallback
                  </CardTitle>
                  <CardDescription>
                    Gambar yang ditampilkan saat video belum termuat atau tidak tersedia.
                    Format JPG, PNG, atau WebP, maksimal 5MB.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Poster Preview */}
                  {posterUrl ? (
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={posterUrl}
                        alt="Preview poster hero"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 aspect-video flex flex-col items-center justify-center gap-3 text-gray-400">
                      <ImageIcon className="w-12 h-12 opacity-30" />
                      <p className="text-sm">Belum ada gambar poster</p>
                    </div>
                  )}

                  {/* Poster Actions */}
                  <div className="flex items-center gap-3">
                    <input
                      ref={posterInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      id="poster-upload-input"
                      onChange={handlePosterUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      id="btn-upload-poster"
                      disabled={uploadingPoster}
                      onClick={() => posterInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      {uploadingPoster ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {posterUrl ? "Ganti Poster" : "Upload Poster"}
                    </Button>
                    {posterUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        id="btn-clear-poster"
                        onClick={clearPoster}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus Poster
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── TAB 2: WHATSAPP ── */}
            <TabsContent value="whatsapp" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    Konfigurasi WhatsApp
                  </CardTitle>
                  <CardDescription>
                    Nomor dan pesan default untuk tombol floating WhatsApp di halaman publik.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="wa_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor WhatsApp</FormLabel>
                        <FormControl>
                          <Input
                            id="input-wa-number"
                            placeholder="6281234567890"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Format internasional tanpa tanda &quot;+&quot; atau spasi.
                          Contoh: <span className="font-mono font-medium">6281234567890</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wa_default_message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pesan Default (Opsional)</FormLabel>
                        <FormControl>
                          <Textarea
                            id="input-wa-message"
                            placeholder="Halo, saya ingin bertanya tentang Fakultas Teknik UWKS."
                            rows={4}
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Pesan yang otomatis muncul saat pengguna membuka chat WhatsApp.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      id="btn-test-wa"
                      onClick={handleWaTest}
                      className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Test Link WhatsApp
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">
                      Membuka wa.me dengan nomor dan pesan yang sedang diisi di form (belum tentu tersimpan).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── TAB 3: MEDIA SOSIAL ── */}
            <TabsContent value="sosmed" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-purple-600" />
                    Link Media Sosial
                  </CardTitle>
                  <CardDescription>
                    URL akun media sosial Fakultas Teknik UWKS. Kosongkan jika tidak tersedia.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {(
                    [
                      { name: "social_instagram" as const, label: "Instagram", placeholder: "https://www.instagram.com/ft.uwks", platform: "instagram" },
                      { name: "social_facebook" as const, label: "Facebook", placeholder: "https://www.facebook.com/ft.uwks", platform: "facebook" },
                      { name: "social_youtube" as const, label: "YouTube", placeholder: "https://www.youtube.com/@ftuwks", platform: "youtube" },
                      { name: "social_twitter" as const, label: "X / Twitter", placeholder: "https://x.com/ft_uwks", platform: "twitter" },
                      { name: "social_linkedin" as const, label: "LinkedIn", placeholder: "https://www.linkedin.com/school/ft-uwks", platform: "linkedin" },
                    ]
                  ).map(({ name, label, placeholder, platform }) => (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-gray-400">
                                <PlatformIcon platform={platform} />
                              </span>
                              <Input
                                id={`input-${name}`}
                                placeholder={placeholder}
                                className="pl-9"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* ── Submit Button (always visible) ── */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-100">
            <Button
              type="submit"
              id="btn-simpan-pengaturan"
              disabled={saveMutation.isPending}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {saveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Simpan Pengaturan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
