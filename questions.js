/**
 * DAFTAR SOAL LATIHAN UJI KOMPETENSI
 * 
 * Anda dapat dengan mudah mengubah atau mengganti 20 soal di bawah ini
 * dengan soal ujian Anda sendiri!
 * 
 * Format setiap soal:
 * - id: nomor urut soal (1-20)
 * - question: teks pertanyaan atau studi kasus
 * - options: daftar pilihan ganda (array string)
 * - correctIndex: indeks jawaban yang benar (0 untuk pilihan pertama, 1 untuk kedua, dst.)
 * - explanation: penjelasan/pembahasan mengapa jawaban tersebut benar
 */

const questionsData = [
  {
    id: 1,
    question: "Dalam pelaksanaan tugas pelayanan, seorang tenaga profesional wajib memprioritaskan keselamatan pasien (patient safety). Manakah dari prinsip berikut yang merupakan sasaran utama keselamatan pasien?",
    options: [
      "Ketepatan identifikasi pasien dan peningkatan komunikasi yang efektif",
      "Pemberian tindakan secepat mungkin tanpa verifikasi identitas",
      "Mengurangi biaya operasional dengan membatasi pemeriksaan berkala",
      "Mendelegasikan seluruh keputusan medis kepada keluarga pasien",
      "Menghindari pencatatan rekam medis agar efisien waktu"
    ],
    correctIndex: 0,
    explanation: "Ketepatan identifikasi pasien dan peningkatan komunikasi yang efektif (SBAR/TBAK) adalah sasaran utama dalam Standar Keselamatan Pasien (Patient Safety Goals)."
  },
  {
    id: 2,
    question: "Seorang pasien datang ke fasilitas kesehatan dengan keluhan nyeri akut skala 7/10. Tindakan awal prioritas yang harus dilakukan tenaga kesehatan sebelum intervensi invasif adalah...",
    options: [
      "Langsung memberikan obat penenang dosis tinggi",
      "Melakukan pengkajian komprehensif terhadap karakteristik, lokasi, dan intensitas nyeri",
      "Menyuruh pasien beristirahat tanpa tindakan apapun",
      "Menjadwalkan pemeriksaan laboratorium untuk minggu berikutnya",
      "Meminta pasien menandatangani surat penolakan tindakan"
    ],
    correctIndex: 1,
    explanation: "Pengkajian nyeri (PQRST: Provokes, Quality, Radiates, Severity, Time) merupakan langkah prioritas untuk menentukan intervensi terapeutik yang tepat dan aman."
  },
  {
    id: 3,
    question: "Prinsip etika profesi yang menekankan kewajiban untuk tidak mencelakakan atau membahayakan pasien dikenal dengan istilah...",
    options: [
      "Autonomy (Otonomi)",
      "Beneficence (Berbuat baik)",
      "Non-maleficence (Tidak merugikan)",
      "Justice (Keadilan)",
      "Veracity (Kejujuran)"
    ],
    correctIndex: 2,
    explanation: "Non-maleficence (primum non nocere) adalah prinsip etik yang mengharuskan tenaga kesehatan untuk tidak menimbulkan bahaya atau kerugian bagi pasien."
  },
  {
    id: 4,
    question: "Ketika terjadi perbedaan pendapat antara tim kerja dalam menangani kasus darurat, pendekatan komunikasi yang paling tepat digunakan adalah...",
    options: [
      "Mengabaikan saran anggota tim lain dan bekerja sendiri",
      "Menerapkan komunikasi asertif berfokus pada keselamatan pasien",
      "Menunggu atasan tiba sebelum mengambil tindakan pertolongan pertama",
      "Menyalahkan anggota tim yang mengusulkan pendapat berbeda",
      "Menyerahkan seluruh keputusan kepada asisten magang"
    ],
    correctIndex: 1,
    explanation: "Komunikasi asertif yang berfokus pada keselamatan pasien (patient advocacy) menjamin koordinasi tim berjalan efektif tanpa mengorbankan waktu tanggap darurat."
  },
  {
    id: 5,
    question: "Pencatatan dan dokumentasi hasil pemeriksaan pasien yang sah secara hukum harus memenuhi kriteria...",
    options: [
      "Ditulis dengan pensil agar mudah dihapus jika ada revisi",
      "Hanya dicatat jika kondisi pasien memburuk",
      "Akurat, tepat waktu, sistematis, dan mencantumkan tanda tangan/identitas pemeriksa",
      "Boleh dirahasiakan dari catatan rekam medis resmi",
      "Cukup diingat secara lisan dan disampaikan saat pergantian shift"
    ],
    correctIndex: 2,
    explanation: "Dokumentasi rekam medis yang legal harus akurat, segera dicatat setelah tindakan (timely), sistematis, serta memiliki legalitas tanda tangan dan nama jelas pemeriksa."
  },
  {
    id: 6,
    question: "Teknik cuci tangan 6 langkah berbasis standar WHO dengan sabun dan air mengalir idealnya dilakukan selama...",
    options: [
      "5 - 10 detik",
      "10 - 15 detik",
      "40 - 60 detik",
      "3 - 5 menit",
      "30 detik - 1 menit tanpa air"
    ],
    correctIndex: 2,
    explanation: "Berdasarkan standar WHO, cuci tangan menggunakan sabun dan air mengalir membutuhkan waktu 40-60 detik, sedangkan dengan handrub berbasis alkohol 20-30 detik."
  },
  {
    id: 7,
    question: "Metode triase darurat yang menggunakan kode warna merah menandakan bahwa korban...",
    options: [
      "Meninggal dunia atau harapan hidup sangat kecil",
      "Mengalami kondisi kritis yang mengancam nyawa dan butuh penanganan segera",
      "Mengalami cedera ringan dan dapat berjalan sendiri",
      "Stabil dan penanganan dapat ditunda hingga beberapa jam",
      "Tidak memerlukan pemeriksaan medis lanjutan"
    ],
    correctIndex: 1,
    explanation: "Kategori Merah (Immediate) menandakan kondisi kritis yang mengancam jalan napas, pernapasan, atau sirkulasi dan membutuhkan tindakan penanganan segera."
  },
  {
    id: 8,
    question: "Hak pasien untuk mendapatkan informasi lengkap sebelum menyetujui atau menolak suatu tindakan medis dituangkan dalam bentuk...",
    options: [
      "Surat Keterangan Sehat",
      "Informed Consent (Persetujuan Tindakan Medis)",
      "Resep dokter",
      "Surat rujukan puskesmas",
      "Bukti pembayaran administrasi"
    ],
    correctIndex: 1,
    explanation: "Informed Consent adalah persetujuan yang diberikan oleh pasien atau keluarga terdekat setelah mendapat penjelasan lengkap mengenai tindakan medis yang akan dilakukan."
  },
  {
    id: 9,
    question: "Pemberian cairan rehidrasi oral pada kasus dehidrasi ringan hingga sedang bertujuan utama untuk...",
    options: [
      "Menghentikan buang air besar secara instan",
      "Menggantikan cairan tubuh dan elektrolit yang hilang",
      "Meningkatkan nafsu makan dalam waktu 5 menit",
      "Membunuh bakteri patogen di usus halus",
      "Menginduksi rasa kantuk agar pasien istirahat"
    ],
    correctIndex: 1,
    explanation: "Oralit atau cairan rehidrasi oral dirancang dengan osmolaritas optimal untuk menggantikan air dan elektrolit (natrium, kalium) yang hilang akibat dehidrasi."
  },
  {
    id: 10,
    question: "Kerahasiaan data medis pasien dijamin oleh undang-undang. Informasi medis pasien hanya boleh dibuka kepada pihak lain jika...",
    options: [
      "Diminta oleh tetangga pasien yang penasaran",
      "Untuk keperluan konten media sosial tenaga kesehatan",
      "Atas persetujuan pasien atau perintah pengadilan demi kepentingan hukum",
      "Diminta oleh teman sejawat yang tidak merawat pasien",
      "Pasien tidak melunasi biaya pengobatan"
    ],
    correctIndex: 2,
    explanation: "Kerahasiaan medis dilindungi oleh hukum dan hanya dapat dibuka atas persetujuan tertulis pasien, perintah undang-undang/pengadilan, atau ancaman keselamatan publik."
  },
  {
    id: 11,
    question: "Alat Pelindung Diri (APD) standar yang wajib digunakan saat menangani pasien dengan risiko paparan droplet atau percikan cairan tubuh adalah...",
    options: [
      "Masker bedah, sarung tangan, dan pelindung mata (goggles/face shield)",
      "Jas hujan dan sandal jepit",
      "Hanya memakai sarung tangan kain",
      "Masker kain tipis tanpa sarung tangan",
      "Topi biasa tanpa penutup wajah"
    ],
    correctIndex: 0,
    explanation: "Untuk mencegah transmisi droplet dan percikan cairan tubuh, APD wajib meliputi masker bedah/respiratorik, sarung tangan steril/bersih, serta pelindung mata atau wajah."
  },
  {
    id: 12,
    question: "Dalam siklus manajemen mutu pelayanan kesehatan (PDCA), singkatan dari huruf 'C' adalah...",
    options: [
      "Control",
      "Check (Evaluasi / Pemeriksaan hasil)",
      "Cancel",
      "Communication",
      "Coordination"
    ],
    correctIndex: 1,
    explanation: "PDCA merupakan singkatan dari Plan (Rencanakan), Do (Lakukan), Check (Periksa/Evaluasi), dan Act (Tindaklanjuti perbaikan)."
  },
  {
    id: 13,
    question: "Tanda-tanda vital dasar yang rutin diukur dalam pengkajian klinis awal meliputi...",
    options: [
      "Tekanan darah, denyut nadi, laju pernapasan, dan suhu tubuh",
      "Golongan darah, tinggi badan, warna rambut, dan berat tas",
      "Kadar kolesterol, asam urat, dan gula darah sewaktu",
      "Status perkawinan dan penghasilan bulanan",
      "Tingkat pendidikan dan nomor kartu keluarga"
    ],
    correctIndex: 0,
    explanation: "Empat komponen utama tanda-tanda vital (vital signs) standar adalah Tekanan Darah (TD), Nadi (Pulse Rate), Frekuensi Pernapasan (RR), dan Suhu Tubuh (Temperature)."
  },
  {
    id: 14,
    question: "Pemberian obat dengan prinsip '6 Benar' bertujuan untuk mencegah medication error. Komponen '6 Benar' tersebut adalah...",
    options: [
      "Benar Pasien, Obat, Dosis, Rute, Waktu, dan Dokumentasi",
      "Benar Harga, Merek, Apotek, Kemasan, Tanggal Beli, dan Nota",
      "Benar Pasien, Dokter, Rumah Sakit, Ruangan, Kasir, dan Satpam",
      "Benar Rasa, Warna, Aroma, Ukuran, Wadah, dan Suplier",
      "Benar Diagnosis, Gejala, Keluhan, Hasil Lab, Riwayat, dan Asuransi"
    ],
    correctIndex: 0,
    explanation: "Prinsip 6 Benar pemberian obat: Benar Pasien, Benar Obat, Benar Dosis, Benar Rute/Cara, Benar Waktu, dan Benar Dokumentasi."
  },
  {
    id: 15,
    question: "Manakah tindakan pencegahan infeksi nosokomial yang paling sederhana namun memiliki efektivitas paling tinggi?",
    options: [
      "Pemberian antibiotik profilaksis pada seluruh pasien baru",
      "Kebersihan tangan (hand hygiene) secara konsisten di setiap momen perawatan",
      "Pemasangan filter udara di setiap sudut ruangan tanpa cuci tangan",
      "Menyemprot disinfektan ke tubuh pasien setiap jam",
      "Mengurangi kontak komunikasi dengan pasien dan keluarga"
    ],
    correctIndex: 1,
    explanation: "Kebersihan tangan (hand hygiene) terbukti secara ilmiah sebagai intervensi tunggal yang paling efektif dan terjangkau dalam menurunkan transmisi infeksi terkait pelayanan kesehatan (HAIs)."
  },
  {
    id: 16,
    question: "Jika seorang pasien tiba-tiba tidak sadarkan diri di area umum rumah sakit, langkah pertama yang harus dilakukan adalah...",
    options: [
      "Memastikan keamanan lingkungan, penolong, dan korban (3A: Aman Diri, Aman Pasien, Aman Lingkungan)",
      "Langsung memberikan napas buatan tanpa memeriksa respon",
      "Mencari barang berharga korban untuk diamankan",
      "Menyiram wajah korban dengan air dingin",
      "Mengangkat korban ke tempat tidur tanpa koordinasi"
    ],
    correctIndex: 0,
    explanation: "Langkah pertama dalam bantuan hidup dasar (BHD) adalah memastikan prinsip 3A: Aman Penolong, Aman Korban, dan Aman Lingkungan sebelum mendekati korban dan mengecek respon."
  },
  {
    id: 17,
    question: "Tujuan utama dari komunikasi terapeutik dalam hubungan antara tenaga profesional dan pasien adalah...",
    options: [
      "Membangun hubungan saling percaya dan membantu proses pemulihan pasien",
      "Mempercepat waktu konsultasi agar pasien lain segera masuk",
      "Membujuk pasien agar membeli obat-obatan termahal",
      "Menunjukkan keunggulan status sosial tenaga kesehatan",
      "Mengalihkan perhatian pasien dari kondisi penyakit yang sebenarnya"
    ],
    correctIndex: 0,
    explanation: "Komunikasi terapeutik dirancang secara terencana untuk membina hubungan interpersonal yang saling percaya, menurunkan kecemasan, dan mendukung proses penyembuhan pasien."
  },
  {
    id: 18,
    question: "Pengelolaan limbah medis benda tajam (jarum suntik, bisturi) yang tepat adalah dengan cara...",
    options: [
      "Membuangnya ke dalam kantong plastik hitam bersama sampah umum",
      "Menutup kembali jarum suntik (recapping) dengan dua tangan lalu dibuang ke tong sampah biasa",
      "Memasukkannya langsung ke dalam Safety Box tanpa melakukan penutupan jarum kembali (no recapping)",
      "Mencucinya dengan air sabun untuk digunakan kembali pada pasien lain",
      "Menguburnya langsung di pekarangan fasilitas kesehatan"
    ],
    correctIndex: 2,
    explanation: "Limbah benda tajam harus segera dibuang ke dalam wadah khusus (Safety Box) anti bocor dan tahan tusukan tanpa recapping untuk mencegah insiden tertusuk jarum suntik (needle stick injury)."
  },
  {
    id: 19,
    question: "Ketika menyampaikan berita buruk (breaking bad news) kepada keluarga pasien, langkah awal yang bijak adalah...",
    options: [
      "Menyampaikannya di lorong rumah sakit yang ramai agar cepat selesai",
      "Mengatur tempat yang tenang dan privat, serta menggali sejauh mana pemahaman keluarga saat ini",
      "Mengirimkan pesan singkat melalui SMS tanpa tatap muka",
      "Menyerahkan penyampaian kepada petugas kebersihan",
      "Langsung menyebutkan vonis terburuk tanpa kata pengantar"
    ],
    correctIndex: 1,
    explanation: "Protokol penyampaian berita buruk (seperti SPIKES) mewajibkan tempat yang privat, nyaman, bebas gangguan, serta mengeksplorasi persepsi dan kesiapan emosional keluarga terlebih dahulu."
  },
  {
    id: 20,
    question: "Seorang profesional kesehatan yang menjunjung tinggi integritas akan bersikap...",
    options: [
      "Mengakui kesalahan tindakan dan segera melapor sesuai SPO keselamatan untuk perbaikan",
      "Menyembunyikan kesalahan agar reputasi pribadi tidak tercoreng",
      "Menyalahkan alat medis atau rekan kerja junior atas kesalahan yang terjadi",
      "Mengubah data rekam medis setelah terjadi komplikasi",
      "Menghindari pasien yang mengalami keluhan pasca tindakan"
    ],
    correctIndex: 0,
    explanation: "Integritas profesi tercermin dari kejujuran, akuntabilitas, dan transparansi dalam mengakui insiden serta berorientasi pada perbaikan sistem dan keselamatan pasien (just culture)."
  }
];
