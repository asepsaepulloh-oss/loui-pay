# Louiv Pay · Railway

Paket deployment ini mengambil source oyi77/1ai-payment pada commit 8de3883bfadb6a034f212857109fef59bff1067b ketika Docker membangun image. Kontrak API dan dashboard multi-merchant mengikuti versi itu. Sumber: https://github.com/oyi77/1ai-payment . Metadata package upstream menandai lisensi UNLICENSED; periksa izin pemilik sebelum redistribusi komersial.

## Pemasangan

1. Upload isi ZIP ke repo tersendiri. Buat service baru dari repo itu di project Railway. Jangan gunakan service atau volume aplikasi lama untuk percobaan ini.
2. Tambahkan volume Railway dengan mount path /data; jalankan satu replica. Image menggunakan SQLite di /data/payment.db. Order, API key, dan riwayat Louiv Pay versi PostgreSQL tidak dimigrasikan.
3. Generate domain Railway untuk service baru. Isi PUBLIC_BASE_URL dan CORS_ORIGIN dengan origin HTTPS yang sama, misalnya https://nama-service.up.railway.app. Gunakan domain yang diberikan Railway pada service Anda.
4. Isi API_KEY, ADMIN_API_KEY, ENCRYPTION_KEY dengan tiga nilai rahasia berbeda. Jalankan perintah ini di komputer Anda untuk menghasilkan ketiganya:

    node -e "for(const k of ['API_KEY','ADMIN_API_KEY','ENCRYPTION_KEY']) console.log(k+'='+require('crypto').randomBytes(32).toString('hex'))"

Simpan ENCRYPTION_KEY selama database dipakai. Jangan bagikan API_KEY milik platform saat onboarding; setiap toko mendapat kuncinya sendiri dari registrasi.
5. Konfigurasikan gateway milik Anda. Contoh uji Midtrans: MIDTRANS_ENVIRONMENT=sandbox, MIDTRANS_SERVER_KEY dan MIDTRANS_CLIENT_KEY dari akun sandbox Anda. Verifikasi URL notifikasi pada dashboard provider mengarah ke https://DOMAIN-BARU/webhook/midtrans. Untuk daftar gateway dan variabel provider lain lihat .env.example di upstream. Login eksperimental Shopee dan GoPay dari dashboard memerlukan ADMIN_AUTH_EXPERIMENTAL=true. Shopee belum terverifikasi mengirim OTP untuk akun Anda.
6. Deploy. Cek /health, buka /dashboard dan daftarkan toko uji, simpan API key sekali tampil. Gunakan /reference untuk mencoba POST /api/payments dengan X-API-Key toko. Selesaikan pembayaran sandbox lalu periksa status dan riwayat webhook. Pindahkan domain pay.louiv.me hanya sesudah tes end-to-end berhasil; ganti juga PUBLIC_BASE_URL, CORS_ORIGIN, dan URL notifikasi provider ke domain final.

## Kompatibilitas

Integrasi lama Authorization: Bearer dan /api/v1/payments perlu diperbarui ke X-API-Key dan /api/payments. URL webhook toko adalah tujuan penerusan event dari Louiv Pay; URL notifikasi provider adalah endpoint masuk /webhook/<gateway>. Dokumentasi API tersedia di /reference dan /doc. Backend serta polling berjalan terus di Railway. Frontend toko yang dihosting di Vercel bisa mengakses API melalui backend toko dengan key merchant sebagai secret.

## Build lokal

Jalankan docker build -t louiv-pay . dari folder ini. Docker memerlukan internet untuk mengambil source GitHub dan dependency Bun.
