# Video Placeholder

Letakkan file video hero di folder ini:

- hero.mp4 — Video utama (format MP4, H.264)
- hero.webm — Versi WebM untuk browser modern (opsional tapi direkomendasikan)

## Spesifikasi yang Disarankan
- Resolusi: 1920×1080 (1080p) atau 1280×720 (720p untuk file lebih kecil)
- Durasi: 15–30 detik (loop)
- Ukuran: < 10MB setelah kompresi (gunakan HandBrake atau ffmpeg)
- Codec: H.264 (MP4), VP9 (WebM)

## Kompresi dengan ffmpeg
```
# Buat versi MP4 terkompresi
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow -movflags faststart hero.mp4

# Buat versi WebM dari MP4
ffmpeg -i hero.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 hero.webm
```

> **Penting**: Atribut muted pada elemen <video> sudah dipasang agar autoplay
> bekerja di semua browser modern (Chrome, Firefox, Safari, Edge).
