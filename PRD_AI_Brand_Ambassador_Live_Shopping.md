**PRD**

**AI Brand Ambassador + Live Shopping (Hackathon MVP)**

Tanggal: 2026-05-30

Ringkasan Produk

Aplikasi ini membantu UMKM/seller e-commerce membuat konten promosi
bergaya live shopping tanpa perlu host/brand ambassador manusia.
Pengguna mengisi informasi brand dan produk, lalu sistem otomatis
membuat skrip promosi dan video brand ambassador (≥30 detik) menggunakan
PixVerse. Hasil akhirnya adalah mini landing page "live shopping" berisi
video, ringkasan produk, dan tombol CTA (mis. "Beli Sekarang").

Latar Belakang & Masalah

-   Banyak UMKM di Indonesia tidak punya budget untuk brand ambassador,
    host live, atau tim produksi video.

-   Seller butuh konten video cepat untuk Tokopedia/Shopee/TikTok Shop,
    namun produksi manual memakan waktu dan biaya.

-   Konten live shopping yang konsisten (skrip + host + CTA)
    meningkatkan kepercayaan dan konversi, tetapi sulit dilakukan secara
    rutin.

Tujuan

-   Menghasilkan video promosi bergaya live shopping (≥30 detik) dalam
    beberapa menit.

-   Menyediakan output siap demo: landing page dengan video + CTA/link
    pembelian.

-   Scope realistis untuk dibangun dalam 8 jam hackathon (MVP).

Non-Tujuan (Out of Scope untuk MVP)

-   Live streaming real-time dan interaksi chat real-time.

-   Pembayaran dan checkout di dalam aplikasi.

-   Integrasi resmi ke API marketplace (Tokopedia/Shopee/TikTok Shop).

-   Katalog multi-produk lengkap, stok, variasi, dan manajemen pesanan.

Target Track Hackathon & Alasan

-   Video Generation Track (co-host PixVerse).

-   Kebutuhan video brand ambassador/host adalah inti solusi.

-   MVP menargetkan video ≥30 detik untuk memenuhi requirement.

Pengguna Sasaran & Persona

  --------------- ------------------------------------------------------------------
  Persona utama   Seller UMKM (Tokopedia/Shopee/TikTok Shop)
  Kebutuhan       Konten promosi cepat, terlihat profesional, dan konsisten
  Kendala         Tidak ada host/ambassador, waktu terbatas, budget produksi minim
  Keberhasilan    Video + landing page siap dibagikan, ada CTA yang jelas
  --------------- ------------------------------------------------------------------

Value Proposition

-   Input sederhana → output konten promosi lengkap (skrip + video +
    landing page).

-   Brand terasa "punya host" tanpa biaya brand ambassador.

-   Cocok untuk campaign cepat, flash sale, atau peluncuran produk.

User Journey (MVP)

-   User membuka web app dan membuat project baru.

-   User mengisi: nama brand, nama produk, deskripsi singkat, harga
    (opsional), link beli, dan upload foto produk.

-   Sistem generate skrip promosi (struktur live shopping: hook →
    manfaat → demo/fitur → penawaran → CTA).

-   Sistem generate video brand ambassador via PixVerse menggunakan
    skrip tersebut (durasi ≥30 detik).

-   Sistem membuat landing page dan memberikan link share/download
    video.

Ruang Lingkup MVP (Fitur Utama)

Input

-   Nama brand

-   Nama produk + deskripsi singkat

-   Foto produk (1 gambar)

-   Harga (opsional)

-   Link pembelian (CTA)

-   Gaya bahasa/tones (opsional: ramah, profesional, hype)

AI Output

-   Skrip promosi siap dibacakan (Bahasa Indonesia, 150--220 kata).

-   Video brand ambassador (≥30 detik) sesuai skrip, menampilkan visual
    host/ambassador.

-   Mini landing page: video + ringkasan produk + tombol CTA.

Kebutuhan & Aturan Konten

-   Durasi video minimal 30 detik.

-   Skrip harus menyertakan CTA yang jelas (mis. "Klik Beli Sekarang").

-   Konten aman: tidak boleh klaim medis/finansial berlebihan, ujaran
    kebencian, atau misleading.

-   Jika input tidak memadai, sistem memberi saran perbaikan (mis.
    deskripsi terlalu pendek).

Spesifikasi Fungsional (MVP Requirements)

  ------------------- -------------------------------------------------------------------------- --- -----------------------------------------------------------
  Fitur               Deskripsi                                                                  P   Acceptance Criteria
  Form input produk   Form web untuk mengisi data brand & produk serta upload 1 foto.            M   Validasi wajib: brand, produk, deskripsi, foto, link CTA.
  Generate skrip      Membuat skrip promosi live shopping Bahasa Indonesia.                      M   Output 150--220 kata, ada hook + CTA.
  Generate video      Menggunakan PixVerse untuk menghasilkan video host/ambassador ≥30 detik.   M   Durasi memenuhi; video dapat diputar/diunduh.
  Landing page        Halaman hasil berisi video, ringkasan produk, dan tombol CTA.              M   Link dapat dibagikan; CTA membuka link beli.
  Status/progress     Progress step-by-step (skrip → video → page).                              S   User tahu proses berjalan/estimasi sederhana.
  Template gaya       Pilihan tone: ramah/profesional/hype.                                      S   Perubahan tone terlihat pada skrip.
  ------------------- -------------------------------------------------------------------------- --- -----------------------------------------------------------

Keterangan prioritas: M = Must-have, S = Should-have.

Alur & UX (Wireflow Teks)

Halaman 1: Input

-   Komponen: form + upload foto + pilihan tone + tombol "Generate"

-   Validasi: tampilkan error jika field wajib kosong

Halaman 2: Generating

-   Step indicator: (1) Skrip (2) Video (3) Landing page

-   Tampilkan preview skrip saat selesai

Halaman 3: Output

-   Video player + tombol download

-   Ringkasan produk + harga (opsional)

-   Tombol CTA: "Beli Sekarang" menuju link yang diinput

-   Tombol "Generate lagi" untuk iterasi cepat

Kebutuhan Teknis (Usulan Implementasi Hackathon)

-   Frontend: 1 halaman form + 1 halaman output (atau single-page).

-   Backend: endpoint untuk (a) generate skrip (b) trigger PixVerse
    video (c) simpan aset & metadata.

-   Storage: simpan foto produk, video output, dan JSON metadata
    project.

-   LLM untuk skrip: bisa pakai model apa pun yang tersedia; fallback
    template rule-based jika limit.

-   PixVerse: gunakan text-to-video / avatar/video generation sesuai API
    yang tersedia.

Asumsi & Dependensi

-   Akses API PixVerse tersedia selama hackathon.

-   Waktu render video bisa beberapa menit; UI harus tahan
    async/polling.

-   Hosting landing page bisa berupa static HTML yang di-generate dan
    diserve.

Kriteria Sukses Demo

-   User mengisi form → mendapat video ≥30 detik + landing page dalam
    satu sesi demo.

-   Landing page terlihat meyakinkan untuk konteks live shopping dan
    memiliki CTA.

-   Kualitas skrip cukup natural dan relevan dengan deskripsi produk.

Metode Evaluasi (Metrics yang Bisa Ditunjukkan)

-   Time-to-first-output (skrip) dan time-to-video.

-   Jumlah project berhasil dibuat selama demo.

-   CTR tombol CTA (jika ada tracking sederhana).

Risiko & Mitigasi

-   Render video lama/gagal → sediakan fallback: contoh video template +
    overlay skrip.

-   Skrip tidak sesuai → sediakan tombol "Regenerate" dengan prompt
    tweak (tone/panjang).

-   Konten sensitif → filter kata kunci + disclaimer penggunaan.

-   Hak cipta/brand → gunakan avatar generik dan hindari meniru figur
    publik.

Rencana Eksekusi 8 Jam (Suggested Timeline)

-   Jam 0--1: Setup repo, UI form, schema data project

-   Jam 1--2: Integrasi generate skrip + preview

-   Jam 2--5: Integrasi PixVerse generate video + polling status

-   Jam 5--6: Landing page generator + hosting

-   Jam 6--7: Polishing UI, error handling, caching

-   Jam 7--8: Dry run demo, siapkan sample input, pitch flow

Open Questions (Untuk Diputuskan Sebelum Build)

-   Tipe ambassador: avatar 2D/3D talking head, atau video host generik?

-   Apakah video menampilkan foto produk sebagai overlay/scene?

-   Bahasa: hanya Indonesia atau multi-bahasa?

-   Durasi target ideal: 30--45 detik atau 45--60 detik?
