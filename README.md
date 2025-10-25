# 💎 Amethyst Store - Katalog Aplikasi & Top Up Premium

Proyek ini adalah implementasi katalog produk digital (Aplikasi Premium dan Top Up Game) yang dirancang agar ringan, responsif, dan memiliki antarmuka pengguna yang modern dan menarik (Gen-Z Style).

## ✨ Fitur Utama

* **Tampilan Produk Ringkas:** Mengelompokkan semua varian produk (durasi/jumlah) ke dalam satu kartu utama.
* **Sistem Varian Interaktif:** Saat kartu utama diklik, muncul *modal* yang memungkinkan pengguna memilih varian spesifik (dengan animasi *fade* yang halus pada detail varian terpilih).
* **Navigasi & Filtering Cepat:** Pengelompokan produk berdasarkan kategori (`Aplikasi Premium`, `Media Sosial`, `Top Up Game`).
* **Animasi Transisi *Smooth*:** Menggunakan CSS3 dan JavaScript untuk *staggered animation* (muncul satu per satu) saat memuat dan memfilter produk, memberikan pengalaman yang sangat mulus.
* **Integrasi WhatsApp Order:** Tombol 'Order Sekarang' di modal secara otomatis menyiapkan pesan WhatsApp dengan detail produk dan varian yang dipilih oleh pengguna.

## 📦 Struktur Data & Produk

Data produk dipisahkan menjadi file JSON berdasarkan kategorinya:

* `produk.json`: Aplikasi Premium (Netflix, Spotify, Canva, dll.).
* `medsos.json`: Produk Media Sosial (Followers, Likes, Views TikTok/Instagram).
* `Topup.json`: Produk Top Up Game (MLBB Server Indonesia/Global, Roblox, Genshin Impact, Free Fire).

### 🎮 Contoh Produk yang Tersedia:
* **Aplikasi:** Netflix, Spotify, Canva, Alight Motion.
* **Medsos:** Followers & Likes Instagram/TikTok.
* **Top Up:** Diamond MLBB (ID/Global), Robux, Genesis Crystal (Genshin Impact), Diamond Free Fire.

## 🛠️ Teknologi yang Digunakan

* **HTML5 & CSS3:** Untuk struktur dan styling dasar.
* **JavaScript (Vanilla JS):** Untuk logika pemuatan data (Async/Fetch), *filtering*, *sorting*, dan semua interaksi dinamis/animasi pada DOM.
* **Font Awesome:** Untuk ikon-ikon media sosial dan status.
* **Desain:** Menggunakan skema warna ungu gelap dan efek *glow* untuk menciptakan estetika futuristik dan elegan.

## 🚀 Cara Menjalankan Proyek

Proyek ini adalah *Front-End* murni dan dapat dijalankan langsung di browser.

1.  **Clone Repository:**
    ```bash
    git clone [https://www.youtube.com/watch?v=CDhPQ6-yeCo](https://www.youtube.com/watch?v=CDhPQ6-yeCo)
    ```
2.  **Buka File:**
    Buka folder proyek dan klik ganda pada file `index.html` atau `produk.html` menggunakan browser modern (Chrome/Firefox/Edge).

---
