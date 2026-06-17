# Performance To Do

Prioritas dibuat dari dampak terbesar ke pekerjaan lanjutan yang lebih halus.

- [x] Optimasi gambar upload: kompres, konversi WebP/AVIF, dan buat thumbnail ukuran card.
- [x] Lazy load media non-hero: gambar link, polaroid, member, modal, dan preview admin.
- [x] Pagination atau load more untuk data publik ketika archive mulai besar.
- [x] Cache `/api/archive` dengan TTL pendek dan invalidasi saat data berubah.
- [x] Split bundle public/admin supaya pengunjung publik tidak mengunduh dashboard admin.
- [x] Kurangi animasi mahal: hindari animasi `background-position` besar, pakai `transform`.
- [ ] Optimasi video/audio: thumbnail dulu, `preload="metadata"`, dan ukuran file lebih kecil.
- [ ] Browser/CDN cache untuk media Supabase dengan cache-control saat upload.
- [ ] Tambah index database untuk `sort_order`, `created_at`, `is_visible`, `slug`, dan `category_id`.
- [ ] Audit bundle berkala dan potong dependency yang berat.
