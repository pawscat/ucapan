# 🎂 Website Ucapan Ulang Tahun — Panduan Penggunaan

## Cara Menjalankan
1. **Buka file `index.html`** langsung di browser (Chrome/Firefox/Edge)
2. Tidak perlu server, build process, atau instalasi apapun
3. Pastikan koneksi internet aktif (untuk memuat font Google & library animasi dari CDN)

## Cara Mengedit Konten Personal

### 📝 Teks & Nama
Cari komentar `<!-- EDIT DI SINI -->` di file `index.html`. Bagian yang perlu diedit:

| Bagian | Lokasi di index.html |
|--------|---------------------|
| Nama pasangan (judul) | Section Hero → `<span class="word highlight">` |
| Tanggal ulang tahun | Section Hero → `<p class="hero-date">` |
| Pesan singkat | Section Hero → `<p class="hero-message">` |
| Caption foto galeri | Section Gallery → setiap `<p class="gallery-caption">` dan `data-caption` |
| Timeline milestone | Section Timeline → setiap `<div class="timeline-card">` |
| Alasan sayang (flip card) | Section Reasons → setiap `<div class="flip-card-back"><p>` |
| Pesan di balon | File `script.js` → array `MESSAGES` di bagian Balloon Pop |
| Surat cinta | Section Love Letter → `<div class="letter-body">` |
| Nama pengirim | Section Love Letter → `<span class="signature-name">` |

### 📸 Foto
1. Letakkan 6 foto Anda di folder `assets/photos/`
2. Beri nama: `photo-1.jpg`, `photo-2.jpg`, ..., `photo-6.jpg`
3. Format yang didukung: `.jpg`, `.jpeg`, `.png`, `.webp`
4. Ukuran disarankan: minimal 800×600px

### 🎵 Musik
1. Letakkan file musik di folder `assets/music/`
2. Beri nama: `background.mp3`
3. Atau ubah path di `index.html` pada tag `<source src="...">`
4. Tips: Gunakan lagu instrumental romantis agar tidak mengganggu membaca

## Struktur File
```
ucapan/
├── index.html        ← Halaman utama
├── style.css         ← Semua styling
├── script.js         ← Logika & animasi
├── README.md         ← File ini
└── assets/
    ├── photos/       ← Letakkan foto di sini
    │   └── photo-1.jpg ... photo-6.jpg
    └── music/        ← Letakkan musik di sini
        └── background.mp3
```

## Fitur yang Tersedia
- ✅ Landing page dengan animasi amplop 3D
- ✅ Musik latar dengan toggle play/pause
- ✅ Hero section dengan animasi teks bertahap
- ✅ Floating hearts di background (Canvas)
- ✅ Galeri foto dengan lightbox zoom
- ✅ Timeline interaktif dengan progress line
- ✅ Flip cards (6 kartu alasan sayang)
- ✅ Balloon pop game (8 balon dengan pesan tersembunyi)
- ✅ Surat cinta dengan animasi scroll-reveal
- ✅ Confetti/kembang api di momen spesial
- ✅ Tombol "Simpan Kenangan" (print-friendly)
- ✅ Fully responsive (mobile, tablet, desktop)

## Hosting Online (Opsional)
Untuk membagikan link ke pasangan:
1. **GitHub Pages** (gratis): Upload ke repo GitHub → Settings → Pages → Deploy
2. **Netlify** (gratis): Drag & drop folder ke netlify.com/drop
3. **Vercel** (gratis): Import repo → auto deploy

## Credits
- Fonts: [Google Fonts](https://fonts.google.com/) (Playfair Display, Poppins)
- Animasi: [GSAP](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)
- Confetti: [canvas-confetti](https://github.com/catdad/canvas-confetti)
