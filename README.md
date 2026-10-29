# 🎯 Website Simulasi Latihan Uji Kompetensi (CBT) dengan 2 Peran Pengguna

Website aplikasi latihan soal Uji Kompetensi interaktif berbasis web dengan **2 peran pengguna terpisah (Pengunjung & Admin)**, koreksi otomatis langsung (*real-time feedback*), pembahasan lengkap, dan bank soal dinamis.

---

## 👥 Dua Peran Pengguna (User Roles):

### 1. 👤 Pengunjung / Peserta Ujian (Regular Visitor)
- **Fokus Utama:** Mengerjakan simulasi latihan soal uji kompetensi.
- **Tampilan Bersih & Aman:** Seluruh tombol dan menu *"Kelola / Edit Soal"* disembunyikan sehingga peserta tidak dapat merusak atau mengubah bank soal.
- **Alur Pengerjaan:**
  1. Memasukkan nama lengkap peserta.
  2. Klik **"Mulai Latihan Sekarang"**.
  3. Mengerjakan soal pilihan ganda dengan navigasi grid nomor soal.
  4. Setiap submit, sistem langsung memberikan evaluasi instan (Benar/Salah).
  5. Menampilkan jawaban yang benar dan pembahasan lengkap.
  6. Melihat skor akhir (skala 100), statistik kelulusan, dan rekapitulasi nilai.

---

### 2. 👑 Admin / Instruktur (Pengunjung + Admin)
- **Kemampuan:** Memiliki seluruh kemampuan Pengunjung (bisa ikut latihan simulasi) **PLUS** akses penuh untuk mengelola bank soal.
- **Cara Masuk Admin:**
  1. Klik tombol **"🔒 Masuk Admin"** di pojok kanan atas.
  2. Masukkan password admin (Bawaan: `admin123`).
  3. Klik **"Masuk Sebagai Admin 👑"**.
- **Fitur Khusus Admin:**
  - Muncul lencana **"👑 Mode Admin"** di bilah atas dan kotak kelola soal di halaman awal.
  - **Formulir Tambah/Edit Soal:** Input pertanyaan, opsi A–E, radio penentu kunci jawaban benar, dan pembahasan.
  - **⚡ Paste Teks Cepat dari Word/PDF:** Tempel naskah soal banyak sekaligus dengan parser otomatis.
  - **Manajemen Daftar Soal:** Edit butir soal per nomor, hapus soal, kosongkan bank soal, atau reset ke 20 soal bawaan.
  - **Backup & Restore:** Unduh cadangan soal dalam format `.json` atau unggah file soal baru.
  - **Tombol Logout (🚪):** Keluar dari mode Admin untuk kembali ke tampilan Pengunjung biasa.

---

## 🌐 Tautan Publik (Live Online):
Website ini sudah dihosting secara publik dan dapat diakses dari perangkat apa saja (laptop, PC, ponsel/HP):
👉 **[https://keysiaaa.github.io/ujikom-quiz/](https://keysiaaa.github.io/ujikom-quiz/)**

---

## 📁 Struktur File Proyek:

```
ujikom-quiz/
├── index.html        # Antarmuka web utama (Pengunjung, Admin, Kuis CBT, dan Hasil)
├── style.css         # Styling modern, animasi kartu, dan print style
├── questions.js      # Data default 20 contoh soal bawaan
├── app.js            # Logika kuis, sistem 2 peran pengguna, parser teks, & audio
└── README.md         # Panduan penggunaan
```
