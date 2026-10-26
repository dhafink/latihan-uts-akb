// Latihan hitung Topik 2 — AHP (H2-01 … H2-04). Kunci diverifikasi cek_soal.js lewat solver.js ("dari").
(function () {
  // tabel matriks dengan sel kosong ("") yang harus dilengkapi sendiri
  function mat(judul, items, rows) {
    return { t: "tabel", judul: judul, head: [""].concat(items), rows: items.map(function (it, i) {
      return [{ v: it, k: "lab" }].concat(rows[i].map(function (x) { return { v: x }; }));
    }) };
  }
  var KONS = { "true": "Konsisten", "false": "Tidak konsisten" };

  /* ---------- H2-01 ---------- */
  var LAPTOP = { judul: "Kriteria laptop", item: ["Harga", "Baterai", "Berat"], matriks: [[1, 2, 5], [null, 1, 3], [null, null, 1]] };
  window.HITUNG.push({
    id: "H2-01", topik: 2, modul: "ahp/konsistensi",
    judul: "Bobot kriteria laptop kuliah Nadia",
    ringkas: "Satu matriks 3×3: lengkapi, normalisasi, bobot, λmax, CI, CR.",
    cerita: "Nadia, mahasiswi Manajemen UNPAR, ingin membeli laptop untuk kuliah. Ia memakai AHP dengan tiga kriteria: Harga, Daya tahan baterai, dan Berat. Menurut Nadia, Harga 2 kali lebih penting daripada Baterai, Harga 5 kali lebih penting daripada Berat, dan Baterai 3 kali lebih penting daripada Berat.\n\nHitunglah bobot setiap kriteria dan periksa konsistensi penilaian Nadia (RI = 0,52; batas CR untuk matriks 3×3 = 0,05).",
    papan: [mat("Perbandingan kriteria", LAPTOP.item, [["1", "2", "5"], ["", "1", "3"], ["", "", "1"]])],
    tanya: [
      { id: "a", teks: "Bobot kriteria Harga (4 desimal)", tipe: "angka", kunci: 0.5813, kunciTeks: "0,5813", tol: 0.002, dari: { bagian: 0, path: "bobot.0" } },
      { id: "b", teks: "Bobot kriteria Berat (4 desimal)", tipe: "angka", kunci: 0.1096, kunciTeks: "0,1096", tol: 0.002, dari: { bagian: 0, path: "bobot.2" } },
      { id: "c", teks: "λmax", tipe: "angka", kunci: 3.0037, kunciTeks: "3,0037", tol: 0.003, dari: { bagian: 0, path: "lambda" } },
      { id: "d", teks: "Consistency ratio (RI = 0,52)", tipe: "angka", kunci: 0.0036, kunciTeks: "0,0036", tol: 0.0015, dari: { bagian: 0, path: "CR" } },
      { id: "e", teks: "Kesimpulan konsistensi", tipe: "pilih", opsi: ["Konsisten", "Tidak konsisten"], kunci: "Konsisten", kunciTeks: "Konsisten (CR 0,0036 ≤ 0,05)", dari: { bagian: 0, path: "konsisten", nama: KONS } }
    ],
    bagian: [{ judul: "Matriks perbandingan kriteria", metode: "ahp-matriks", data: LAPTOP }],
    poin: [
      "Melengkapi segitiga bawah dengan kebalikannya: 1/2, 1/5, 1/3",
      "Menjumlahkan setiap kolom (1,7; 3,3333; 9)",
      "Membagi setiap sel dengan jumlah kolomnya sehingga tiap kolom berjumlah 1",
      "Bobot = rata-rata setiap baris matriks normalisasi",
      "Weighted sum = matriks AWAL × bobot, lalu dibagi bobot masing-masing",
      "λmax = rata-rata consistency vector",
      "CI = (λmax − 3)/2, CR = CI/0,52, lalu dibandingkan dengan batas 0,05"
    ],
    jebakan: [
      "Weighted sum memakai matriks AWAL, bukan matriks yang sudah dinormalisasi.",
      "Bobot adalah rata-rata BARIS; rata-rata kolom normalisasi selalu 1/3.",
      "Tulis batas CR yang kamu pakai (0,05 untuk 3×3)."
    ]
  });

  /* ---------- H2-02 ---------- */
  var KAFE = { judul: "Kriteria lokasi", item: ["Sewa", "Keramaian", "Parkir", "Akses"], matriks: [[1, 2, 3, 3], [null, 1, null, 3], [null, 2, 1, 4], [null, null, null, 1]] };
  window.HITUNG.push({
    id: "H2-02", topik: 2, modul: "ahp/konsistensi",
    judul: "Lokasi cabang kafe di Dago: CR di perbatasan",
    ringkas: "Matriks 4×4 dengan entri di segitiga bawah; CR lolos batas 0,10 tapi tidak lolos batas 0,08.",
    cerita: "Pemilik kafe di Dago ingin membuka cabang dan menilai empat kriteria lokasi: Biaya sewa, Keramaian, Ketersediaan parkir, dan Akses angkutan umum. Hasil penilaiannya diisi di matriks perbandingan berpasangan (lihat papan). Perhatikan bahwa satu penilaian ditulis di segitiga bawah: Parkir 2 kali lebih penting daripada Keramaian.\n\nLengkapi matriksnya, hitung bobot setiap kriteria, lalu periksa konsistensinya dengan RI = 0,89 untuk n = 4 dan batas CR 0,08 untuk matriks 4×4.",
    papan: [mat("Perbandingan kriteria", KAFE.item, [["1", "2", "3", "3"], ["", "1", "", "3"], ["", "2", "1", "4"], ["", "", "", "1"]])],
    tanya: [
      { id: "a", teks: "Isi sel baris Keramaian – kolom Parkir", tipe: "angka", kunci: 0.5, kunciTeks: "1/2 = 0,5", tol: 0.001, dari: { bagian: 0, path: "A.1.2" } },
      { id: "b", teks: "Bobot kriteria Sewa (4 desimal)", tipe: "angka", kunci: 0.4352, kunciTeks: "0,4352", tol: 0.002, dari: { bagian: 0, path: "bobot.0" } },
      { id: "c", teks: "λmax", tipe: "angka", kunci: 4.2422, kunciTeks: "4,2422", tol: 0.004, dari: { bagian: 0, path: "lambda" } },
      { id: "d", teks: "Consistency ratio (RI = 0,89)", tipe: "angka", kunci: 0.0907, kunciTeks: "0,0907", tol: 0.002, dari: { bagian: 0, path: "CR" } },
      { id: "e", teks: "Kesimpulan dengan batas 0,08", tipe: "pilih", opsi: ["Konsisten", "Tidak konsisten"], kunci: "Tidak konsisten", kunciTeks: "Tidak konsisten (0,0907 > 0,08); dengan batas umum 0,10 dan RI 0,90, CR = 0,0897 dianggap konsisten", dari: { bagian: 0, path: "konsisten", nama: KONS } }
    ],
    bagian: [{ judul: "Matriks perbandingan kriteria lokasi", metode: "ahp-matriks", data: KAFE }],
    poin: [
      "Membaca entri segitiga bawah: Parkir vs Keramaian = 2, sehingga Keramaian vs Parkir = 1/2",
      "Melengkapi semua sel kosong lainnya dengan resiprokal",
      "Menjumlahkan kolom dan menormalisasi matriks",
      "Bobot = rata-rata baris (Sewa ≈ 0,4352 sebagai bobot terbesar)",
      "Weighted sum dari matriks awal × bobot, lalu λmax ≈ 4,2422",
      "CI = (λmax − 4)/3 ≈ 0,0807",
      "CR = CI/0,89 ≈ 0,0907 dibandingkan batas 0,08 dan diberi catatan versi lain"
    ],
    jebakan: [
      "Entri di segitiga bawah sering terlewat; sel Keramaian–Parkir adalah 1/2, bukan 2.",
      "Untuk n = 4, CI dibagi (n − 1) = 3 dan RI = 0,89.",
      "Kesimpulan bisa berbeda tergantung batasnya: dengan batas 0,08 tidak konsisten, dengan batas umum 0,10 konsisten. Tulis batas yang dipakai."
    ]
  });

  /* ---------- H2-03 ---------- */
  var KATERING = {
    kriteria: ["Harga", "Rasa", "Ketepatan waktu"],
    matKriteria: [[1, null, 3], [2, 1, 4], [null, null, 1]],
    alternatif: ["Sari Rasa", "Dapur Bu Imas", "Katering Ciumbuleuit"],
    matAlternatif: [
      [[1, 3, 2], [null, 1, 0.5], [null, null, 1]],
      [[1, null, null], [4, 1, 2], [3, null, 1]],
      [[1, 2, null], [null, 1, null], [3, 4, 1]]]
  };
  var ALT3 = KATERING.alternatif;
  window.HITUNG.push({
    id: "H2-03", topik: 2, modul: "ahp/sintesis",
    judul: "Vendor katering acara himpunan",
    ringkas: "AHP lengkap 3 kriteria × 3 alternatif sampai ranking.",
    cerita: "Himpunan mahasiswa akan mengadakan seminar dan perlu memilih vendor katering: Sari Rasa, Dapur Bu Imas, atau Katering Ciumbuleuit. Kriteria yang dipakai adalah Harga, Rasa, dan Ketepatan waktu. Panitia mengisi semua matriks perbandingan berpasangan seperti di papan (sebagian penilaian ditulis di segitiga bawah).\n\nTentukan bobot setiap kriteria, periksa konsistensi matriks kriteria (RI = 0,52; batas 0,05), lalu tentukan urutan prioritas vendor.",
    papan: [
      mat("Kriteria", KATERING.kriteria, [["1", "", "3"], ["2", "1", "4"], ["", "", "1"]]),
      mat("Harga", ALT3, [["1", "3", "2"], ["", "1", "1/2"], ["", "", "1"]]),
      mat("Rasa", ALT3, [["1", "", ""], ["4", "1", "2"], ["3", "", "1"]]),
      mat("Ketepatan waktu", ALT3, [["1", "2", ""], ["", "1", ""], ["3", "4", "1"]])
    ],
    tanya: [
      { id: "a", teks: "Bobot kriteria Rasa (4 desimal)", tipe: "angka", kunci: 0.5571, kunciTeks: "0,5571", tol: 0.002, dari: { bagian: 0, path: "kriteria.bobot.1" } },
      { id: "b", teks: "CR matriks kriteria (RI = 0,52)", tipe: "angka", kunci: 0.0176, kunciTeks: "0,0176 (konsisten)", tol: 0.002, dari: { bagian: 0, path: "kriteria.CR" } },
      { id: "c", teks: "Skor akhir Dapur Bu Imas (4 desimal)", tipe: "angka", kunci: 0.3797, kunciTeks: "0,3797", tol: 0.002, dari: { bagian: 0, path: "sintesis.total.1" } },
      { id: "d", teks: "Vendor prioritas pertama", tipe: "pilih", opsi: ALT3, kunci: "Dapur Bu Imas", kunciTeks: "Dapur Bu Imas", dari: { bagian: 0, path: "sintesis.urutan.0", nama: ALT3 } },
      { id: "e", teks: "Vendor prioritas terakhir", tipe: "pilih", opsi: ALT3, kunci: "Sari Rasa", kunciTeks: "Sari Rasa (0,2703)", dari: { bagian: 0, path: "sintesis.urutan.2", nama: ALT3 } }
    ],
    bagian: [{ judul: "AHP lengkap: kriteria, setiap alternatif, dan sintesis", metode: "ahp", data: KATERING }],
    poin: [
      "Melengkapi keempat matriks, termasuk entri yang diberikan di segitiga bawah",
      "Menghitung bobot kriteria (Rasa ≈ 0,5571 terbesar)",
      "Mengecek CR matriks kriteria (≈ 0,0176 ≤ 0,05)",
      "Menghitung bobot lokal setiap vendor pada Harga, Rasa, dan Ketepatan waktu",
      "Mengecek CR setiap matriks alternatif",
      "Skor akhir = Σ bobot kriteria × bobot lokal",
      "Urutan: Dapur Bu Imas (0,3797) > Katering Ciumbuleuit (0,3500) > Sari Rasa (0,2703)"
    ],
    jebakan: [
      "Pada matriks kriteria, Rasa vs Harga = 2 tertulis di baris Rasa; jadi Harga vs Rasa = 1/2.",
      "Sari Rasa unggul di Harga, tetapi bobot Harga hanya ≈ 0,32 sehingga tidak cukup untuk menang.",
      "Skor akhir memakai bobot kriteria hasil AHP, bukan rata-rata biasa."
    ]
  });

  /* ---------- H2-04 ---------- */
  var KOS = {
    kriteria: ["Jarak ke kampus", "Harga sewa", "Keamanan"],
    matKriteria: [[1, 3, null], [null, 1, null], [2, 4, 1]],
    alternatif: ["Ciumbuleuit", "Dago Pojok", "Sukajadi"],
    matAlternatif: [
      [[1, 5, 7], [null, 1, 2], [null, null, 1]],
      [[1, null, null], [3, 1, null], [5, 2, 1]],
      [[1, 4, null], [null, 1, 3], [2, null, 1]]]
  };
  var ALT4 = KOS.alternatif;
  window.HITUNG.push({
    id: "H2-04", topik: 2, modul: "ahp/sintesis",
    judul: "Memilih daerah kos dekat UNPAR (ada matriks tidak konsisten)",
    ringkas: "AHP lengkap dengan entri segitiga bawah dan satu matriks yang penilaiannya berputar.",
    cerita: "Raka, mahasiswa baru dari Medan, memilih daerah kos di sekitar UNPAR: Ciumbuleuit, Dago Pojok, atau Sukajadi. Kriterianya Jarak ke kampus, Harga sewa, dan Keamanan. Penilaian Raka ada di papan; banyak penilaian ditulis di segitiga bawah.\n\nUntuk Keamanan, Raka menilai Ciumbuleuit 4 kali lebih aman daripada Dago Pojok, Dago Pojok 3 kali lebih aman daripada Sukajadi, tetapi Sukajadi 2 kali lebih aman daripada Ciumbuleuit.\n\nHitung bobot kriteria, consistency ratio setiap matriks (RI = 0,52; batas 0,05), dan urutan prioritas daerah kos. Kalau ada matriks yang tidak konsisten, tetap selesaikan ranking tetapi beri catatan.",
    papan: [
      mat("Kriteria", KOS.kriteria, [["1", "3", ""], ["", "1", ""], ["2", "4", "1"]]),
      mat("Jarak ke kampus", ALT4, [["1", "5", "7"], ["", "1", "2"], ["", "", "1"]]),
      mat("Harga sewa", ALT4, [["1", "", ""], ["3", "1", ""], ["5", "2", "1"]]),
      mat("Keamanan", ALT4, [["1", "4", ""], ["", "1", "3"], ["2", "", "1"]])
    ],
    tanya: [
      { id: "a", teks: "Bobot kriteria Keamanan (4 desimal)", tipe: "angka", kunci: 0.5571, kunciTeks: "0,5571", tol: 0.002, dari: { bagian: 0, path: "kriteria.bobot.2" } },
      { id: "b", teks: "CR matriks Keamanan (RI = 0,52)", tipe: "angka", kunci: 1.1947, kunciTeks: "1,1947", tol: 0.01, dari: { bagian: 0, path: "alternatif.2.CR" } },
      { id: "c", teks: "Matriks mana yang TIDAK konsisten?", tipe: "pilih", opsi: ["Kriteria", "Jarak ke kampus", "Harga sewa", "Keamanan"], kunci: "Keamanan", kunciTeks: "Keamanan (penilaiannya berputar: Ciumbuleuit > Dago Pojok > Sukajadi > Ciumbuleuit)", dari: { bagian: 0, path: "alternatif.2.konsisten", nama: { "false": "Keamanan", "true": "Kriteria" } } },
      { id: "d", teks: "Skor akhir Ciumbuleuit (4 desimal)", tipe: "angka", kunci: 0.4668, kunciTeks: "0,4668", tol: 0.002, dari: { bagian: 0, path: "sintesis.total.0" } },
      { id: "e", teks: "Daerah kos prioritas kedua", tipe: "pilih", opsi: ALT4, kunci: "Sukajadi", kunciTeks: "Sukajadi (0,2687), tipis di atas Dago Pojok (0,2645)", dari: { bagian: 0, path: "sintesis.urutan.1", nama: ALT4 } }
    ],
    bagian: [{ judul: "AHP lengkap: kriteria, setiap alternatif, dan sintesis", metode: "ahp", data: KOS }],
    poin: [
      "Melengkapi matriks kriteria: Keamanan vs Jarak = 2 dan Keamanan vs Harga = 4 ditulis di segitiga bawah",
      "Bobot kriteria: Keamanan ≈ 0,5571 terbesar",
      "Melengkapi matriks Harga sewa yang seluruhnya diberikan di segitiga bawah",
      "Menemukan bahwa matriks Keamanan tidak konsisten (CR ≈ 1,19 > 0,05)",
      "Menghitung bobot lokal dan CR setiap matriks alternatif",
      "Skor akhir = Σ bobot kriteria × bobot lokal",
      "Urutan: Ciumbuleuit (0,4668) > Sukajadi (0,2687) > Dago Pojok (0,2645), dengan catatan matriks Keamanan perlu ditinjau ulang"
    ],
    jebakan: [
      "Penilaian yang berputar (A > B, B > C, tetapi C > A) membuat CR sangat besar; tanda bahwa perbandingannya perlu ditinjau ulang.",
      "Matriks Harga sewa hanya diisi di segitiga bawah; jangan tertukar arah resiprokalnya.",
      "Sukajadi dan Dago Pojok selisihnya sangat tipis; pembulatan terlalu kasar (2 desimal) bisa membalik urutannya."
    ]
  });
})();
