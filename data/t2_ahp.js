// Bank soal Topik 2 — AHP (16 soal). Angka hitungan dicek ulang oleh cek_soal.js lewat solver.js (cekNilai).
(function () {
  // papan matriks kecil: rows = array baris berisi teks sel ("" = kosong)
  function mat(judul, items, rows) {
    return { t: "tabel", head: [judul].concat(items), rows: items.map(function (it, i) {
      return [{ v: it, k: "lab" }].concat(rows[i].map(function (x) { return { v: x }; }));
    }) };
  }
  var KATERING = { item: ["Vendor A", "Vendor B", "Vendor C"], matriks: [[1, 3, 5], [null, 1, 3], [null, null, 1]] };
  var LAPTOP = { item: ["Laptop A", "Laptop B", "Laptop C"], matriks: [[1, 2, 6], [null, 1, 4], [null, null, 1]] };
  var M3C = { item: ["A", "B", "C"], matriks: [[1, 4, 7], [null, 1, 3], [null, null, 1]] };
  var PEMASOK = { item: ["Pemasok A", "Pemasok B", "Pemasok C"], matriks: [[1, 3, 4], [null, 1, 3], [null, null, 1]] };
  var HP = { item: ["Kamera", "Storage", "Body"], matriks: [[1, 0.125, 7], [8, 1, 8], [null, null, 1]] };
  var third = 1 / 3;
  var MOBIL = {
    kriteria: ["Harga", "MPG", "Kenyamanan", "Gaya"],
    matKriteria: [[1, 3, 2, 2], [null, 1, 0.25, 0.25], [null, 4, 1, 0.5], [null, 4, 2, 1]],
    alternatif: ["Mobil A", "Mobil B", "Mobil C"],
    matAlternatif: [
      [[1, third, 0.25], [3, 1, 0.5], [4, 2, 1]],
      [[1, 0.25, 1 / 6], [4, 1, third], [6, 3, 1]],
      [[1, 2, 8], [0.5, 1, 6], [0.125, 1 / 6, 1]],
      [[1, third, 4], [3, 1, 7], [0.25, 1 / 7, 1]]]
  };

  window.QUESTIONS.push(
  {
    id: "T2-01", topic: 2, level: "konsep", src: "slide", lihat: "ahp/matriks",
    q: "Dalam skala perbandingan berpasangan 1–9, apa arti angka 7?",
    options: [
      "Satu elemen sangat kuat lebih penting daripada elemen lainnya (very strongly preferred)",
      "Kedua elemen sama penting (equally preferred)",
      "Satu elemen sedikit lebih penting daripada elemen lainnya (moderately preferred)",
      "Satu elemen mutlak paling penting dengan bukti tertinggi (extremely preferred)"
    ],
    answer: 0,
    explain: "Skala 1–9: 1 = sama penting, 3 = sedikit lebih penting, 5 = kuat lebih penting, 7 = sangat kuat lebih penting, 9 = mutlak lebih penting. Angka 2, 4, 6, 8 adalah nilai antara. Kalau arahnya terbalik, ditulis sebagai kebalikannya, misalnya 1/7.",
    why: [null,
      "Sama penting bernilai 1, bukan 7.",
      "Sedikit lebih penting (moderately) bernilai 3.",
      "Mutlak lebih penting (extremely) bernilai 9."]
  },
  {
    id: "T2-02", topic: 2, level: "aplikasi", src: "slide", lihat: "ahp/matriks",
    q: "Ada 5 kriteria dalam satu level hierarki. Berapa banyak perbandingan berpasangan yang benar-benar harus dinilai?",
    options: ["25 perbandingan", "10 perbandingan", "20 perbandingan", "5 perbandingan"],
    answer: 1,
    explain: "Banyaknya perbandingan = n(n − 1)/2 = 5 × 4 / 2 = 10. Diagonal selalu bernilai 1, dan segitiga bawah tinggal diisi kebalikan (resiprokal) dari segitiga atas. Jadi yang perlu dinilai hanya 10 pasangan.",
    why: [
      "25 adalah jumlah semua sel matriks 5×5, termasuk diagonal dan sel resiprokal.",
      null,
      "20 = n(n − 1), lupa dibagi 2; separuhnya hanya kebalikan dari separuh yang lain.",
      "5 hanya jumlah kriterianya, bukan jumlah pasangan yang dibandingkan."]
  },
  {
    id: "T2-03", topic: 2, level: "aplikasi", src: "soal-dosen", lihat: "ahp/matriks",
    papan: [mat("Jarak dari kampus", ["Bukit Jarian", "Cisitu", "Hegarmanah"], [["1", "8", "4"], ["", "1", ""], ["", "3", "1"]])],
    q: "Pada matriks di papan, sel baris Hegarmanah – kolom Cisitu bernilai 3, sedangkan sel baris Cisitu – kolom Hegarmanah masih kosong. Berapa isinya?",
    options: ["3", "1/4", "1/3", "−3"],
    answer: 2,
    explain: "Baris Hegarmanah vs kolom Cisitu = 3 artinya Hegarmanah 3 kali lebih disukai daripada Cisitu. Sel kebalikannya (Cisitu vs Hegarmanah) berisi 1/3 ≈ 0,333. Penilaian boleh diberikan di segitiga atas maupun bawah; sel yang kosong selalu diisi kebalikannya.",
    why: [
      "Angka yang sama berarti Cisitu juga 3 kali lebih disukai, bertentangan dengan penilaian semula.",
      "1/4 adalah kebalikan dari 4, bukan dari 3.",
      null,
      "Skala AHP tidak memakai angka negatif; arah yang terbalik ditulis sebagai pecahan."]
  },
  {
    id: "T2-04", topic: 2, level: "aplikasi", src: "latihan", lihat: "ahp/matriks",
    papan: [mat("Katering", KATERING.item, [["1", "3", "5"], ["1/3", "1", "3"], ["1/5", "1/3", "1"]])],
    q: "Panitia acara membandingkan tiga vendor katering dengan matriks di papan. Berapa bobot (priority vector) Vendor A?",
    options: ["0,6522", "0,6054", "0,3333", "0,6333"],
    answer: 3,
    explain: "Jumlah kolom: 1,5333; 4,3333; 9. Normalisasi baris Vendor A: 1/1,5333 = 0,6522; 3/4,3333 = 0,6923; 5/9 = 0,5556. Bobot = rata-rata baris = (0,6522 + 0,6923 + 0,5556)/3 ≈ 0,6333.",
    why: [
      "0,6522 hanya sel pertama hasil normalisasi; bobot adalah rata-rata seluruh baris.",
      "0,6054 didapat dari jumlah baris matriks awal dibagi jumlah semua sel; matriks harus dinormalisasi per kolom dulu.",
      "0,3333 adalah rata-rata kolom normalisasi (selalu 1/n); bobot memakai rata-rata BARIS.",
      null],
    cekNilai: { metode: "ahp-matriks", data: KATERING, path: "bobot.0", format: "fix", dp: 4 }
  },
  {
    id: "T2-05", topic: 2, level: "aplikasi", src: "latihan", lihat: "ahp/matriks",
    papan: [mat("Laptop", LAPTOP.item, [["1", "2", "6"], ["1/2", "1", "4"], ["1/6", "1/4", "1"]])],
    q: "Matriks perbandingan tiga laptop ada di papan. Berapa nilai sel Laptop A – Laptop A setelah matriks dinormalisasi?",
    options: ["0,6000", "0,1111", "0,5869", "1,6667"],
    answer: 0,
    explain: "Jumlah kolom pertama = 1 + 1/2 + 1/6 = 1,6667. Normalisasi = nilai sel ÷ jumlah KOLOM-nya, jadi 1 ÷ 1,6667 = 0,6000. Setelah semua sel dinormalisasi, setiap kolom berjumlah 1.",
    why: [null,
      "0,1111 = 1 ÷ 9 berarti membagi dengan jumlah BARIS (1 + 2 + 6); normalisasi memakai jumlah kolom.",
      "0,5869 adalah bobot akhir Laptop A (rata-rata baris), bukan satu sel normalisasi.",
      "1,6667 adalah jumlah kolomnya sendiri, belum dipakai untuk membagi."],
    cekNilai: { metode: "ahp-matriks", data: LAPTOP, path: "N.0.0", format: "fix", dp: 4 }
  },
  {
    id: "T2-06", topic: 2, level: "aplikasi", src: "latihan", lihat: "ahp/konsistensi",
    papan: [{ t: "tabel", head: ["Elemen", "Bobot", "Weighted sum", "Weighted sum ÷ bobot"], rows: [
      [{ v: "A", k: "lab" }, { v: "0,7014" }, { v: "2,1517" }, { v: "3,0675" }],
      [{ v: "B", k: "lab" }, { v: "0,2132" }, { v: "0,6446" }, { v: "3,0228" }],
      [{ v: "C", k: "lab" }, { v: "0,0853" }, { v: "0,2566" }, { v: "3,0075" }]] }],
    q: "Dari sebuah matriks 3×3 diperoleh bobot, weighted sum, dan consistency vector seperti di papan. Berapa λmax?",
    options: ["1,0176", "3,0326", "3,0675", "0,0163"],
    answer: 1,
    explain: "λmax adalah rata-rata consistency vector (weighted sum ÷ bobot): (3,0675 + 3,0228 + 3,0075)/3 ≈ 3,0326. λmax selalu sedikit di atas n kalau penilaiannya hampir konsisten. Dari sini baru dihitung CI dan CR.",
    why: [
      "1,0176 adalah rata-rata weighted sum; λmax memakai rata-rata weighted sum ÷ bobot.",
      null,
      "3,0675 hanya consistency vector baris pertama; λmax adalah rata-rata ketiganya.",
      "0,0163 adalah CI, langkah sesudah λmax."],
    cekNilai: { metode: "ahp-matriks", data: M3C, path: "lambda", format: "fix", dp: 4 }
  },
  {
    id: "T2-07", topic: 2, level: "aplikasi", src: "latihan", lihat: "ahp/konsistensi",
    q: "Matriks perbandingan berukuran 3×3 menghasilkan λmax = 3,0326. Berapa consistency index (CI)-nya?",
    options: ["0,0326", "0,0109", "0,0163", "0,0313"],
    answer: 2,
    explain: "CI = (λmax − n)/(n − 1) = (3,0326 − 3)/(3 − 1) = 0,0326/2 = 0,0163. Makin kecil CI, makin konsisten penilaiannya. CI lalu dibagi RI untuk mendapat CR.",
    why: [
      "0,0326 = λmax − n saja, lupa dibagi (n − 1).",
      "0,0109 berarti dibagi n = 3, padahal pembaginya n − 1 = 2.",
      null,
      "0,0313 adalah CR (CI ÷ RI), langkah sesudah CI."],
    cekNilai: { metode: "ahp-matriks", data: M3C, path: "CI", format: "fix", dp: 4 }
  },
  {
    id: "T2-08", topic: 2, level: "aplikasi", src: "latihan", lihat: "ahp/konsistensi",
    q: "Untuk matriks vendor katering berukuran 3×3, CI = 0,0194. Dengan RI = 0,52 dan batas CR 0,05 untuk matriks 3×3, berapa CR dan apa kesimpulannya?",
    options: ["0,0101 → konsisten", "0,0745 → tidak konsisten", "0,0194 → konsisten", "0,0372 → konsisten"],
    answer: 3,
    explain: "CR = CI ÷ RI = 0,0194 ÷ 0,52 ≈ 0,0372. Nilai ini di bawah batas 0,05 untuk matriks 3×3, jadi penilaiannya konsisten dan bobotnya boleh dipakai. RI 0,52 adalah random index untuk n = 3.",
    why: [
      "0,0101 = CI × RI; seharusnya CI dibagi RI.",
      "0,0745 muncul kalau λmax − n tidak dibagi (n − 1) sebelum dibagi RI.",
      "0,0194 masih CI, belum dibagi RI.",
      null],
    cekNilai: { metode: "ahp-matriks", data: KATERING, path: "CR", format: "fix", dp: 4 }
  },
  {
    id: "T2-09", topic: 2, level: "kasus", src: "soal-dosen", lihat: "ahp/konsistensi",
    ctxTitle: "Kasus memilih handphone",
    ctx: "Kriteria Kamera, Storage, dan Body dibandingkan berpasangan:\n• Storage 8 kali lebih penting daripada Kamera\n• Kamera 7 kali lebih penting daripada Body\n• Storage 8 kali lebih penting daripada Body\nPerhitungan menghasilkan λmax ≈ 3,48 dan CI ≈ 0,24 (RI = 0,52).",
    q: "Apa kesimpulan yang tepat tentang matriks kriteria ini?",
    options: [
      "CR ≈ 0,46, jauh di atas batas 0,05; penilaiannya tidak konsisten dan perbandingan berpasangan sebaiknya ditinjau ulang",
      "Matriksnya konsisten karena semua angka berada di skala 1–9",
      "CI masih di bawah 1, jadi penilaiannya pasti konsisten",
      "Matriks 3×3 selalu konsisten, jadi CR tidak perlu dihitung"
    ],
    answer: 0,
    explain: "CR = CI ÷ RI = 0,2379 ÷ 0,52 ≈ 0,46. Kalau Storage 8 kali Kamera dan Kamera 7 kali Body, seharusnya Storage jauh di atas Body (sekitar 56 kali), tapi hanya dinilai 8, sehingga penilaiannya saling bertentangan. Kalau soal tetap meminta ranking, lanjutkan perhitungannya tetapi tulis catatan bahwa CR melewati batas.",
    why: [null,
      "Skala 1–9 hanya memastikan angkanya sah, bukan bahwa penilaian satu dengan lainnya selaras.",
      "Konsistensi dinilai dari CR = CI ÷ RI, dan 0,24 ÷ 0,52 jauh melewati 0,05.",
      "Hanya matriks 2×2 yang selalu konsisten; matriks 3×3 tetap harus dicek."],
    cekNilai: { metode: "ahp-matriks", data: HP, path: "CR", format: "fix", dp: 2 }
  },
  {
    id: "T2-10", topic: 2, level: "kasus", src: "latihan", lihat: "ahp/konsistensi",
    ctxTitle: "UMKM keripik di Cibaduyut",
    ctx: "Pemilik usaha membandingkan tiga pemasok singkong:\n• Pemasok A vs B = 3\n• Pemasok A vs C = 4\n• Pemasok B vs C = 3\nHasil hitungnya: λmax ≈ 3,0741 dan CI ≈ 0,0371.",
    q: "Dengan RI = 0,52 dan batas CR 0,05 untuk matriks 3×3, apa kesimpulannya?",
    options: [
      "CR = 0,0371, konsisten",
      "CR ≈ 0,0713, tidak konsisten karena melewati 0,05 (walaupun masih di bawah 0,10)",
      "CR ≈ 0,0193, konsisten",
      "CR ≈ 0,0639, konsisten"
    ],
    answer: 1,
    explain: "CR = 0,0371 ÷ 0,52 ≈ 0,0713. Untuk matriks 3×3 batas yang dipakai adalah 0,05, jadi penilaiannya tidak konsisten. Kalau memakai aturan umum CR ≤ 0,10 hasilnya dianggap konsisten, jadi selalu tulis batas yang kamu pakai di lembar jawaban.",
    why: [
      "0,0371 masih CI; CR = CI ÷ RI.",
      null,
      "0,0193 = CI × RI; seharusnya CI dibagi RI.",
      "0,0639 memakai RI 0,58; dengan RI 0,52 hasilnya 0,0713."],
    cekNilai: { metode: "ahp-matriks", data: PEMASOK, path: "CR", format: "fix", dp: 4 }
  },
  {
    id: "T2-11", topic: 2, level: "aplikasi", src: "buku", lihat: "ahp/konsistensi",
    q: "Matriks pemasok berukuran 3×3 punya CI ≈ 0,0371. Kalau memakai tabel RI versi buku (RI = 0,58 untuk n = 3), berapa CR-nya?",
    options: ["0,0713", "0,0215", "0,0639", "0,0371"],
    answer: 2,
    explain: "CR = CI ÷ RI = 0,0371 ÷ 0,58 ≈ 0,0639. Dengan batas umum 0,10, matriks ini dianggap konsisten, padahal dengan RI 0,52 dan batas 0,05 hasilnya tidak konsisten. Perbedaan tabel RI bisa mengubah kesimpulan, jadi sebutkan versi yang dipakai.",
    why: [
      "0,0713 memakai RI 0,52, bukan 0,58.",
      "0,0215 = CI × RI; seharusnya CI dibagi RI.",
      null,
      "0,0371 adalah CI, belum dibagi RI."],
    cekNilai: { metode: "ahp-matriks", data: PEMASOK, path: "CRbuku", format: "fix", dp: 4 }
  },
  {
    id: "T2-12", topic: 2, level: "aplikasi", src: "latihan", lihat: "ahp/sintesis",
    papan: [{ t: "tabel", head: ["Alternatif", "Harga (bobot 0,5)", "Lokasi (bobot 0,3)", "Fasilitas (bobot 0,2)"], rows: [
      [{ v: "Kos A", k: "lab" }, { v: "0,20" }, { v: "0,50" }, { v: "0,30" }],
      [{ v: "Kos B", k: "lab" }, { v: "0,50" }, { v: "0,20" }, { v: "0,40" }],
      [{ v: "Kos C", k: "lab" }, { v: "0,30" }, { v: "0,30" }, { v: "0,30" }]] }],
    q: "Bobot kriteria dan bobot setiap kos per kriteria sudah dihitung seperti di papan. Berapa skor akhir Kos B?",
    options: ["0,37", "0,31", "1,10", "0,39"],
    answer: 3,
    explain: "Skor akhir = Σ bobot kriteria × bobot alternatif. Kos B = 0,5 × 0,50 + 0,3 × 0,20 + 0,2 × 0,40 = 0,25 + 0,06 + 0,08 = 0,39. Ini skor tertinggi, jadi Kos B menjadi prioritas pertama.",
    why: [
      "0,37 adalah rata-rata skor Kos B tanpa memakai bobot kriteria.",
      "0,31 adalah skor akhir Kos A.",
      "1,10 adalah jumlah skor Kos B tanpa dikalikan bobot.",
      null],
    cekNilai: { metode: "ahp-sintesis", data: { kriteria: ["Harga", "Lokasi", "Fasilitas"], bobot: [0.5, 0.3, 0.2], alternatif: ["Kos A", "Kos B", "Kos C"],
      skor: [[0.2, 0.5, 0.3], [0.5, 0.2, 0.4], [0.3, 0.3, 0.3]] }, path: "total.1", format: "fix", dp: 2 }
  },
  {
    id: "T2-13", topic: 2, level: "kasus", src: "slide", lihat: "ahp/sintesis",
    ctxTitle: "Memilih mobil",
    ctx: "Bobot kriteria: Harga 0,398 · MPG 0,085 · Kenyamanan 0,218 · Gaya 0,299.\nBobot lokal tiap mobil (Harga, MPG, Kenyamanan, Gaya):\n• Mobil A: 0,123 · 0,087 · 0,593 · 0,265\n• Mobil B: 0,320 · 0,274 · 0,341 · 0,655\n• Mobil C: 0,557 · 0,639 · 0,065 · 0,080",
    q: "Mobil mana yang menjadi prioritas pertama?",
    options: [
      "Mobil B, dengan skor akhir 0,421",
      "Mobil C, karena paling unggul di kriteria Harga yang bobotnya terbesar",
      "Mobil A, karena paling unggul di kriteria Kenyamanan",
      "Mobil C, dengan skor akhir 0,265"
    ],
    answer: 0,
    explain: "Skor akhir = Σ bobot kriteria × bobot lokal: A ≈ 0,265; B ≈ 0,421; C ≈ 0,314, jadi urutannya B – C – A. Mobil B sangat unggul di Gaya dan cukup baik di semua kriteria, sehingga total tertimbangnya paling besar. Unggul di satu kriteria saja belum tentu menang.",
    why: [null,
      "Harga memang berbobot terbesar, tetapi Mobil C lemah di Kenyamanan dan Gaya sehingga totalnya hanya 0,314.",
      "Kenyamanan hanya berbobot 0,218; total Mobil A cuma 0,265.",
      "0,265 adalah skor Mobil A; skor Mobil C sebenarnya 0,314."],
    cekNilai: { metode: "ahp", data: MOBIL, path: "sintesis.total.1", format: "fix", dp: 3 }
  },
  {
    id: "T2-14", topic: 2, level: "aplikasi", src: "buku", lihat: "ahp/mfep",
    q: "Gina menilai tiga universitas (skala 1–10) dengan bobot Biaya 0,6, Reputasi 0,2, dan Kualitas hidup 0,2. Nilai Universitas A: 4, 9, 7; B: 8, 5, 7; C: 7, 6, 3. Berapa total tertimbang universitas terbaik?",
    options: ["5,6 (Universitas A)", "7,2 (Universitas B)", "6 (Universitas C)", "6,7 (rata-rata Universitas B)"],
    answer: 1,
    explain: "MFEP: total = Σ bobot × nilai. A = 0,6×4 + 0,2×9 + 0,2×7 = 5,6; B = 0,6×8 + 0,2×5 + 0,2×7 = 7,2; C = 0,6×7 + 0,2×6 + 0,2×3 = 6,0. Pilih total terbesar, yaitu Universitas B.",
    why: [
      "5,6 adalah total Universitas A; nilai biayanya rendah padahal bobot biaya terbesar.",
      null,
      "6 adalah total Universitas C, masih di bawah B.",
      "6,7 adalah rata-rata nilai B tanpa bobot; MFEP mengalikan setiap nilai dengan bobotnya."],
    cekNilai: { metode: "ahp-mfep", data: { faktor: ["Biaya", "Reputasi", "Kualitas hidup"], bobot: [0.6, 0.2, 0.2], alternatif: ["A", "B", "C"],
      evaluasi: [[4, 9, 7], [8, 5, 7], [7, 6, 3]] }, path: "total.1", format: "num" }
  },
  {
    id: "T2-15", topic: 2, level: "konsep", src: "buku", lihat: "ahp/mfep",
    q: "Kapan AHP lebih tepat dipakai daripada multifactor evaluation process (MFEP)?",
    options: [
      "Saat bobot setiap faktor sudah diketahui pasti dan berjumlah 1",
      "Saat semua alternatif hanya dinilai pada satu kriteria",
      "Saat pengambil keputusan sulit memberi bobot langsung, sehingga bobot dan nilai diturunkan dari perbandingan berpasangan",
      "Saat payoff dan probabilitas setiap keadaan sudah tersedia"
    ],
    answer: 2,
    explain: "MFEP cocok kalau bobot faktor dan nilai evaluasi bisa ditentukan langsung dengan yakin. Kalau sulit, AHP membantu dengan perbandingan berpasangan untuk menurunkan bobot sekaligus mengecek konsistensinya (CR). Keduanya sama-sama berakhir dengan total tertimbang.",
    why: [
      "Kalau bobot sudah pasti, MFEP sudah cukup.",
      "Dengan satu kriteria tidak perlu pembobotan multikriteria sama sekali.",
      null,
      "Payoff dan probabilitas adalah ciri decision analysis dengan EMV."]
  },
  {
    id: "T2-16", topic: 2, level: "konsep", src: "slide", lihat: "ahp/konsistensi",
    q: "Urutan yang benar untuk mendapatkan bobot dan mengecek konsistensi sebuah matriks perbandingan adalah…",
    options: [
      "Jumlahkan baris → bagi tiap sel dengan jumlah baris → rata-rata kolom → CR = λmax ÷ RI",
      "Rata-rata baris matriks awal → normalisasi → CI = λmax − n",
      "Normalisasi bobot → kalikan dengan matriks normalisasi → CR = RI ÷ CI",
      "Jumlahkan kolom → bagi tiap sel dengan jumlah kolomnya → rata-rata baris = bobot → matriks awal × bobot → λmax → CI → CR"
    ],
    answer: 3,
    explain: "Normalisasi memakai jumlah KOLOM, lalu bobot = rata-rata setiap BARIS. Weighted sum = matriks AWAL × bobot; dibagi bobot dan dirata-rata menjadi λmax. Terakhir CI = (λmax − n)/(n − 1) dan CR = CI ÷ RI.",
    why: [
      "Normalisasi memakai jumlah kolom, bobot adalah rata-rata baris, dan CR = CI ÷ RI.",
      "Bobot diambil dari matriks yang sudah dinormalisasi, dan CI = (λmax − n)/(n − 1).",
      "Weighted sum memakai matriks AWAL, dan CR = CI ÷ RI, bukan kebalikannya.",
      null]
  }
  );
})();
