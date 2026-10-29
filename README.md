# 🎯 Website Simulasi Latihan Uji Kompetensi (CBT) dengan Bank Soal Dinamis

Website aplikasi latihan soal Uji Kompetensi interaktif berbasis web dengan **fitur tambah & kelola soal sendiri secara dinamis**, koreksi otomatis langsung (real-time feedback), dan pembahasan lengkap.

---

## 🌟 Fitur Utama & Pembaruan Dinamis:

### 1. ✏️ Tambah & Kelola Soal Sendiri Secara Dinamis (Tanpa Perlu Coding!)
Anda kini dapat mengelola bank soal langsung dari antarmuka web melalui tombol **"✏️ Kelola & Tambah Soal"** di halaman awal atau pojok kanan atas:

- **Formulir Tambah/Edit Soal Satuan:**
  - Ketikkan pertanyaan soal / studi kasus.
  - Masukkan opsi jawaban (A, B, C, D, dan E opsional).
  - Pilih bulatan radio di samping opsi untuk menandai **kunci jawaban yang benar**.
  - Tuliskan pembahasan/rasionalisasinya.
  - Klik **"➕ Tambah Soal ke Bank Soal"**.
- **⚡ Fitur Tempel (Paste) Teks Cepat dari Word / PDF:**
  - Jika Anda sudah memiliki naskah soal di dokumen Word, WhatsApp, atau PDF, cukup *copy-paste* teksnya sekaligus!
  - Sistem memiliki parser cerdas yang otomatis mengenali format:
    ```text
    1. Pertanyaan studi kasus...
    A. Pilihan A
    B. Pilihan B
    C. Pilihan C
    D. Pilihan D
    Kunci: B
    Pembahasan: Alasan mengapa B adalah jawaban yang tepat...

    2. Pertanyaan nomor dua...
    A. Opsi A
    B. Opsi B
    Kunci: A
    Pembahasan: Penjelasan nomor dua...
    ```
  - Klik tombol **"⚡ Ganti Semua Soal dengan Hasil Ini"** atau **"➕ Tambahkan ke Soal yang Ada"**.
- **📋 Manajemen & Review Daftar Soal:**
  - Menampilkan seluruh soal aktif.
  - Tombol **"✏️ Edit"** untuk mengubah isi soal sewaktu-waktu.
  - Tombol **"🗑️ Hapus"** per butir soal.
  - Tombol **"🗑️ Kosongkan Semua"** jika ingin memulai bank soal baru dari nol.
  - Tombol **"🔄 Reset 20 Bawaan"** untuk mengembalikan 20 contoh soal default.
  - Tombol **"💾 Download Backup (.json)"** & **"📂 Upload File (.json)"** untuk menyimpan cadangan soal Anda ke komputer.
- **Penyimpanan Otomatis (Auto-Save):**
  - Semua soal yang Anda tambahkan/edit otomatis tersimpan di peramban web (*localStorage*), sehingga tidak akan hilang saat halaman di-refresh.

---

### 2. 👤 Alur Masuk & Input Nama Peserta
- Saat pertama kali masuk, peserta diminta mengisikan nama lengkap.
- Tombol **"Mulai Latihan Sekarang"** aktif setelah nama diisi.
- Di bawah kolom nama, terdapat lencana status jumlah soal yang tersedia (misal: *20 Soal Tersedia*).

---

### 3. 🎯 Pengerjaan Kuis CBT & Koreksi Instan (Real-Time Feedback)
- Navigasi Grid nomor 1 s/d N yang otomatis menyesuaikan jumlah soal yang ada.
- Saat memilih salah satu jawaban dan menekan tombol **"Kirim Jawaban"**:
  - ✅ **Jika Benar:** Opsi terpilih berwarna hijau cerah, muncul lencana *"Luar Biasa! Jawaban Anda BENAR"*, skor bertambah, dan efek suara apresiatif.
  - ❌ **Jika Salah:** Opsi terpilih berwarna merah, dan sistem **secara otomatis menyorot pilihan mana yang merupakan kunci jawaban yang benar** dengan batas hijau terang dan lencana khusus *"✓ Kunci Jawaban Benar"*.
  - 💡 **Pembahasan & Rasionalisasi:** Di bawah setiap soal langsung muncul kotak penjelasan mengapa jawaban tersebut adalah pilihan yang benar.

---

### 4. 🏆 Rekapitulasi & Lembar Evaluasi Akhir
- Skor otomatis dihitung dalam skala 100 dengan indikator kelulusan.
- Rangkuman detail nomor 1 s/d selesai: menampilkan perbandingan jawaban peserta, kunci jawaban benar, dan pembahasan.
- Tombol **"Cetak / Simpan Hasil (PDF)"** untuk mencetak kartu nilai.
- Tombol **"Ulangi Latihan Soal"** dan **"Ganti Nama / Peserta Baru"**.

---

## 📁 Struktur File:

```
ujikom-quiz/
├── index.html        # Antarmuka web utama + Modal Kelola Soal Dinamis
├── style.css         # Styling modern, animasi kartu, dan print style
├── questions.js      # Data default 20 contoh soal bawaan
├── app.js            # Logika dinamis bank soal, kuis, parser bulk text, & audio
└── README.md         # Panduan penggunaan
```

---

## 🚀 Cara Membuka Website:

Cukup **klik dua kali (double click)** file:
👉 [**`index.html`**](file:///C:/Users/Pongo/.gemini/antigravity/scratch/ujikom-quiz/index.html)
di File Explorer Anda (dapat dibuka di Google Chrome, Microsoft Edge, Firefox, dll. tanpa instalasi apapun).
