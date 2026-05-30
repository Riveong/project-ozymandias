# PRD — Ozymandias AI (AI Brand Ambassador Live Shopping)

Versi: 1.0 (MVP)  
Tanggal: 2026-05-30  
Status: Draft (berdasarkan implementasi repo saat ini)

---

## 1) Ringkasan Produk

**Ozymandias AI** adalah web app yang membantu UMKM/seller e-commerce membuat konten promosi bergaya *live shopping* tanpa perlu host manusia. Pengguna mengisi detail brand dan produk, memilih persona (template atau foto custom), lalu sistem:

1) membuat skrip promosi singkat berbahasa Indonesia,  
2) menghasilkan video “AI brand ambassador” via **PixVerse** (pipeline image→video),  
3) menampilkan hasil dalam tampilan seperti “TikTok/live shopping” dengan CTA ke link pembelian.

Output utama MVP: **video promosi** + **halaman hasil/preview** yang bisa dibagikan/diunduh.

---

## 2) Latar Belakang & Masalah

### Masalah yang Dihadapi Seller
- Konten video promosi yang terlihat meyakinkan butuh biaya host/ambassador + produksi.
- Seller butuh konten cepat untuk campaign (flash sale, launching, iklan TikTok Shop/IG Reels), tapi produksi manual memakan waktu.
- Konsistensi brand dan gaya bicara sulit dijaga jika mengandalkan host yang berbeda.

### Peluang
Dengan AI video generation, seller bisa membuat konten promosi “seolah ada host” dengan input minimal dan waktu pembuatan singkat.

---

## 3) Tujuan Produk (Goals)

1. Menghasilkan konten promosi end-to-end (skrip + video) dari input sederhana.
2. Mempercepat *time-to-content* untuk seller (menit, bukan hari).
3. Menyediakan output yang “siap pakai untuk demo/marketing”: video vertikal 9:16 + CTA.

---

## 4) Non-Tujuan / Out of Scope (MVP)

- Live streaming real-time dan chat interaktif.
- Checkout/pembayaran di dalam aplikasi.
- Integrasi resmi API marketplace (Tokopedia/Shopee/TikTok Shop).
- Manajemen katalog multi-produk (stok/variasi/pesanan).
- Moderasi konten tingkat lanjut (MVP cukup rule dasar + disclaimer).

---

## 5) Target Pengguna & Persona

### Persona Utama: Seller UMKM
- Platform: Tokopedia/Shopee/TikTok Shop/Instagram.
- Kebutuhan: konten promosi cepat, terlihat profesional, ada CTA yang jelas.
- Kendala: waktu terbatas, budget produksi minim, belum punya host/ambassador.
- Keberhasilan: dapat video siap posting + link pembelian dapat diklik.

### Persona Sekunder: Tim Marketing UKM
- Butuh variasi konten untuk A/B test tone (ramah/profesional/hype).
- Ingin dapat iterasi cepat tanpa koordinasi talent.

---

## 6) Value Proposition

- **Input sederhana → output lengkap** (skrip + video + halaman hasil).
- **Persona bisa template atau foto diri** (custom persona).
- **Format vertikal 9:16** cocok untuk TikTok/Reels/Shorts.
- CTA langsung ke link pembelian.

---

## 7) User Journey (MVP)

1. User membuka web app.
2. User memilih **persona**:
   - Template: *Paijo* (pria) / *Mbaijo* (wanita), atau
   - **Custom**: upload foto diri/persona.
3. User memilih **pakaian** (casual/formal/custom) dan **tone bicara** (ramah/profesional/hype).
4. User mengisi detail brand + produk + deskripsi + link CTA, lalu upload foto produk.
5. Sistem memproses:
   - generate skrip (MVP saat ini: template sederhana),
   - generate video via PixVerse CLI,
   - update status sampai selesai.
6. User melihat hasil (preview video) + tombol download + CTA “Beli {produk}”.

---

## 8) Ruang Lingkup & Modul Utama (MVP)

### 8.1 Modul: Wizard Input (3 langkah)
**Langkah 1 — Persona**
- Pilih: `paijo` / `mbaijo` / `custom`.
- Jika `custom`, wajib upload foto persona.

**Langkah 2 — Pakaian & Tone**
- Pakaian: `casual` / `formal` / `custom`.
- Jika `custom`, input teks deskripsi pakaian.
- Tone: `ramah` / `profesional` / `hype`.

**Langkah 3 — Detail Produk**
- Nama brand (wajib)
- Nama produk (wajib)
- Deskripsi singkat (wajib)
- Link pembelian/CTA (wajib, URL)
- Foto produk (wajib)

### 8.2 Modul: Processing Status
Status minimal (berdasarkan implementasi):
- `idle`
- `script_generating`
- `video_generating`
- `completed`

UI menampilkan loader dan men-*poll* status berkala sampai `completed`.

### 8.3 Modul: Result / Preview Live Shopping
Output yang ditampilkan:
- Video player (autoplay/loop/muted).
- Avatar/brand identity (menggunakan `personaImageUrl` jika ada).
- Kutipan skrip (preview).
- Tombol CTA ke `ctaLink`.
- Tombol download video.

---

## 9) Kebutuhan Fungsional (Functional Requirements)

Prioritas: **P0 (Must)**, **P1 (Should)**, **P2 (Nice)**

| Kode | Fitur | Prioritas | Deskripsi | Acceptance Criteria (AC) |
|---|---|---:|---|---|
| FR-01 | Wizard input 3 langkah | P0 | Form bertahap untuk persona → pakaian/tone → detail produk | User dapat berpindah langkah (next/back); validasi untuk input yang wajib |
| FR-02 | Upload foto produk | P0 | Upload 1 foto produk untuk referensi konten | File terunggah; preview tampil; request submit menolak jika belum ada foto |
| FR-03 | Persona template | P0 | Pilihan persona template pria/wanita | Pilihan tersimpan dan memengaruhi pipeline (prompt persona) |
| FR-04 | Persona custom (upload foto) | P1 | User bisa upload foto persona sendiri | Jika persona=custom, upload persona wajib sebelum lanjut |
| FR-05 | Generate skrip promosi | P0 | Sistem menghasilkan skrip Bahasa Indonesia sesuai input | Skrip tersimpan di project dan tampil di hasil |
| FR-06 | Generate video via PixVerse | P0 | Sistem membuat video vertikal 9:16 dari persona+produk+skrip | Hasil memiliki URL video yang dapat diputar |
| FR-07 | Status/progress & polling | P0 | UI menampilkan status dan melakukan polling backend | Status berubah sesuai proses; saat `completed`, hasil ditampilkan |
| FR-08 | Halaman hasil dengan CTA | P0 | Tampilkan video, skrip, CTA “Beli …” | CTA membuka link baru; video bisa diunduh |
| FR-09 | Reset / Buat proyek baru | P1 | User bisa memulai ulang untuk iterasi | Form kembali kosong/default dan status kembali `idle` |

---

## 10) Kebutuhan Non-Fungsional (Non-Functional Requirements)

### Performa & Reliabilitas
- UI harus responsif saat proses berjalan (polling interval wajar).
- Sistem menangani kegagalan PixVerse dengan fallback yang jelas (MVP saat ini menggunakan fallback URL video contoh).

### Keamanan & Privasi
- Upload file dibatasi tipe gambar (image/*) dan ukuran wajar (disarankan ditambahkan limit).
- Hindari menyimpan data sensitif/PII selain gambar yang memang diunggah user.
- Sanitasi input dasar untuk mencegah injeksi ke prompt/CLI (minimal: escape karakter kutip; batasi panjang skrip yang dipass ke CLI).

### Kepatuhan Konten (MVP)
- Konten promosi tidak boleh mengandung klaim medis/finansial berlebihan, ujaran kebencian, atau menipu.
- (Catatan) Implementasi moderasi bisa bertahap: rule-based filter + disclaimer.

---

## 11) Asumsi, Dependensi, dan Batasan

### Dependensi
- **PixVerse CLI** tersedia dan user sudah login/auth (OAuth) di environment yang menjalankan server.
- Node.js dan dependency `npx pixverse ...` dapat dieksekusi dari backend.

### Batasan Teknis (MVP saat ini)
- Generasi dilakukan “inline” di proses server (tanpa job queue). Untuk produksi, disarankan job queue/worker.
- Skrip promosi saat ini masih mock/template (bukan LLM).

---

## 12) Model Data (Persistensi)

Backend menggunakan SQLite dengan tabel `projects` (ringkas):
- `id` (string)
- `persona`, `personaImageUrl`
- `clothing`, `tone`
- `brandName`, `productName`, `description`, `productImageUrl`, `ctaLink`
- `script`, `resultMediaUrl`
- `status`

---

## 13) API (MVP)

Base URL (dev): `http://localhost:5001`

### POST `/api/projects`
Membuat project baru dan memulai pipeline generasi.

**Request:** `multipart/form-data`
- `brandName`, `productName`, `description`, `ctaLink` (wajib)
- `tone`, `persona`, `clothing`, `customClothing` (opsional sesuai kondisi)
- `productImage` (wajib)
- `personaImage` (wajib jika persona=custom)

**Response (contoh):**
```json
{ "id": "173...", "status": "script_generating" }
```

### GET `/api/projects/:id`
Mengambil detail project & status.

**Response (contoh):**
```json
{
  "id": "173...",
  "brandName": "Toko Maju",
  "productName": "Sepatu Lari",
  "script": "Halo! ...",
  "resultMediaUrl": "https://...",
  "status": "completed"
}
```

---

## 14) Metrik Keberhasilan (Success Metrics)

**Untuk demo/MVP:**
- *Project completion rate*: % proyek yang mencapai `completed`.
- *Time-to-script* dan *time-to-video* (estimasi/monitoring sederhana).
- Jumlah proyek berhasil dibuat dalam satu sesi demo.

**Untuk tahap lanjut (opsional):**
- CTR tombol CTA (tracking sederhana).
- Retensi penggunaan (berapa banyak regenerasi/iterasi per user).

---

## 15) Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Render PixVerse lama/gagal | User menunggu lama / tidak ada output | Tampilkan status jelas; fallback video; retry/regenerate |
| Prompt menghasilkan persona “salah gender/fitur” | Output tidak sesuai | Prompt identity preservation yang ketat; opsi custom persona (foto) |
| Input user minim/kurang jelas | Skrip/video tidak relevan | Validasi minimal; placeholder contoh; saran perbaikan (tahap lanjut) |
| Penyalahgunaan konten (misleading/hate) | Reputasi/komplain | Filter kata kunci + disclaimer; blok kategori berisiko (tahap lanjut) |

---

## 16) Rencana Rilis (MVP → Next)

### MVP (Repo saat ini)
- Form 3 langkah + upload
- Polling status
- Generate skrip sederhana
- Generate video PixVerse (image→video)
- Preview + CTA + download

### Next (Iterasi)
- Job queue + worker untuk generasi (stabil & skalabel)
- Script generator via LLM + template berdasarkan tone dan struktur live shopping
- Halaman landing shareable dengan URL publik
- Multi-variation / regenerate (script & video) + penyimpanan versi

---

## 17) Open Questions

1. Durasi target video: 30–45 detik atau 45–60 detik?
2. Apakah foto produk harus “muncul di frame” (overlay) atau cukup sebagai referensi?
3. Perlu dukungan multi-bahasa (ID/EN) atau fokus Indonesia dulu?
4. Apakah butuh sistem akun/login untuk menyimpan proyek per user?

