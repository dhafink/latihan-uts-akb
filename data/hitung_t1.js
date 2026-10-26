// Latihan hitung Topik 1 — Decision Analysis (H1-01..H1-04). Setiap kunci dicek ulang cek_soal.js lewat "dari".
(function () {
  var F = window.SOLVER.fmt;
  function tabelPayoff(alt, state, payoff, u, prob) {
    var rows = payoff.map(function (r, i) {
      return [{ v: alt[i], k: "lab" }].concat(r.map(function (x) { return { v: F.val(x, u) }; }));
    });
    if (prob) rows.push([{ v: "Probabilitas", k: "lab" }].concat(prob.map(function (p) { return { v: F.num(p), k: "biru" }; })));
    return { t: "tabel", head: ["Alternatif"].concat(state), rows: rows };
  }

  var SABLON = { alt: ["Mesin besar", "Mesin sedang", "Tidak membeli"], state: ["Pesanan tinggi", "Pesanan sedang", "Pesanan rendah"],
    payoff: [[120000000, 40000000, -55000000], [70000000, 38000000, -12000000], [0, 0, 0]], goal: "max", alpha: 0.7, satuan: "Rp" };
  var INTERNET = { alt: ["Paket Flat", "Paket Kuota", "Paket Kombinasi"], state: ["Pemakaian rendah", "Pemakaian sedang", "Pemakaian tinggi"],
    payoff: [[3000000, 3000000, 3000000], [1800000, 2900000, 4600000], [2200000, 2700000, 3900000]], prob: [0.3, 0.5, 0.2], goal: "min", satuan: "Rp", ukuran: "biaya internet" };
  var COWORK = { alt: ["Coworking besar", "Coworking kecil", "Tidak membuka"], state: ["Pasar baik", "Pasar buruk"],
    payoff: [[150000000, -90000000], [60000000, -20000000], [0, 0]], prior: [0.4, 0.6], goal: "max", satuan: "Rp",
    survei: { label: "Riset pasar", biaya: 8000000, hasil: ["Riset positif", "Riset negatif"], likelihood: [[0.8, 0.2], [0.1, 0.9]], bulat: 2 },
    labelSurvei: "Pakai riset pasar", labelTanpa: "Tanpa riset" };
  var TENDER = { alt: ["Tender besar", "Tender kecil", "Tidak ikut"], state: ["Menang tender", "Kalah tender"],
    payoff: [[80000000, -30000000], [35000000, -8000000], [0, 0]], prob: [0.35, 0.65], goal: "max", satuan: "Rp" };
  var TENDER_U = { goal: "max", utilitas: true, pohon: { jenis: "keputusan", cabang: [
    { label: "Tender besar", ke: { jenis: "peluang", cabang: [{ label: "Menang", p: 0.35, ke: { jenis: "akhir", nilai: 1 } }, { label: "Kalah", p: 0.65, ke: { jenis: "akhir", nilai: 0 } }] } },
    { label: "Tender kecil", ke: { jenis: "peluang", cabang: [{ label: "Menang", p: 0.35, ke: { jenis: "akhir", nilai: 0.8 } }, { label: "Kalah", p: 0.65, ke: { jenis: "akhir", nilai: 0.45 } }] } },
    { label: "Tidak ikut", ke: { jenis: "akhir", nilai: 0.55 } }] } };

  window.HITUNG.push(
  {
    id: "H1-01", topik: 1, judul: "Mesin sablon Pak Hendra", modul: "da/ketidakpastian",
    ringkas: "Lima kriteria ketidakpastian dengan tiga keadaan dan alternatif tidak membeli.",
    cerita: "Pak Hendra memiliki usaha sablon kaos di Cibaduyut, Bandung. Menjelang musim wisuda dan acara kampus, ia mempertimbangkan membeli mesin sablon baru. Pilihannya: membeli mesin besar, membeli mesin sedang, atau tidak membeli mesin sama sekali (tidak ada untung atau rugi tambahan).\n\n" +
      "Keuntungan tambahan setahun bergantung pada jumlah pesanan. Jika membeli mesin besar, keuntungannya Rp120.000.000 saat pesanan tinggi dan Rp40.000.000 saat pesanan sedang, tetapi ia rugi Rp55.000.000 saat pesanan rendah. Jika membeli mesin sedang, keuntungannya Rp70.000.000 saat pesanan tinggi dan Rp38.000.000 saat pesanan sedang, tetapi rugi Rp12.000.000 saat pesanan rendah.\n\n" +
      "Pak Hendra tidak tahu peluang setiap kondisi pesanan. Bantulah ia mengambil keputusan dengan metode maximax, maximin, realisme (α = 0,7), Laplace, dan minimax regret.",
    papan: [tabelPayoff(SABLON.alt, SABLON.state, SABLON.payoff, "Rp")],
    tanya: [
      { id: "a", teks: "Apa keputusan menurut kriteria maximax?", tipe: "pilih", opsi: SABLON.alt, kunci: "Mesin besar", kunciTeks: "Mesin besar (keuntungan maksimum Rp120.000.000)",
        dari: { bagian: 0, path: "keputusan.optimis.idx", nama: SABLON.alt } },
      { id: "b", teks: "Apa keputusan menurut kriteria maximin?", tipe: "pilih", opsi: SABLON.alt, kunci: "Tidak membeli", kunciTeks: "Tidak membeli (nilai terburuknya Rp0, terbaik di antara nilai-nilai terburuk)",
        dari: { bagian: 0, path: "keputusan.pesimis.idx", nama: SABLON.alt } },
      { id: "c", teks: "Berapa nilai kriteria realisme (α = 0,7) untuk alternatif yang terpilih? (Rp)", tipe: "angka", satuan: "Rp", kunci: 67500000, kunciTeks: "Rp67.500.000 (Mesin besar)",
        dari: { bagian: 0, path: "keputusan.realisme.nilai" } },
      { id: "d", teks: "Berapa rata-rata Laplace terbesar? (Rp)", tipe: "angka", satuan: "Rp", kunci: 35000000, kunciTeks: "Rp35.000.000 (Mesin besar)",
        dari: { bagian: 0, path: "keputusan.laplace.nilai" } },
      { id: "e", teks: "Apa keputusan menurut kriteria minimax regret?", tipe: "pilih", opsi: SABLON.alt, kunci: "Mesin sedang", kunciTeks: "Mesin sedang (regret maksimum Rp50.000.000)",
        dari: { bagian: 0, path: "keputusan.regret.idx", nama: SABLON.alt } }
    ],
    bagian: [{ judul: "Penyelesaian lima kriteria", metode: "da-ketidakpastian", data: SABLON }],
    poin: [
      "Menyusun tabel payoff dengan rugi ditulis negatif (−Rp55.000.000 dan −Rp12.000.000) dan baris tidak membeli bernilai 0.",
      "Maximax: maksimum tiap baris 120 juta / 70 juta / 0 → pilih mesin besar.",
      "Maximin: minimum tiap baris −55 juta / −12 juta / 0 → pilih tidak membeli.",
      "Realisme hanya memakai nilai terbaik dan terburuk: 0,7 × 120 juta + 0,3 × (−55 juta) = 67,5 juta untuk mesin besar.",
      "Laplace dibagi 3 keadaan: (120 + 40 − 55) / 3 = 35 juta untuk mesin besar.",
      "Regret dihitung per kolom dari nilai terbaik kolom (120 juta, 40 juta, 0).",
      "Regret maksimum 55 juta / 50 juta / 120 juta → pilih mesin sedang.",
      "Menuliskan tabel ringkasan keputusan untuk kelima metode."
    ],
    jebakan: [
      "Kriteria realisme dengan tiga keadaan hanya memakai nilai <b>terbaik dan terburuk</b>; nilai pesanan sedang diabaikan.",
      "Laplace dibagi <b>3</b>, bukan 2.",
      "Regret dihitung per <b>kolom</b>. Di kolom pesanan rendah, nilai terbaiknya 0 (tidak membeli), jadi regret mesin besar di kolom itu 55 juta."
    ]
  },
  {
    id: "H1-02", topik: 1, judul: "Paket internet koperasi mahasiswa", modul: "da/risiko",
    ringkas: "EMV, EVwPI, EVPI, dan EOL untuk masalah biaya (minimasi) dengan tiga keadaan.",
    cerita: "Koperasi Mahasiswa UNPAR akan berlangganan internet untuk ruang belajar bersama. Ada tiga pilihan paket dengan biaya per bulan yang bergantung pada tingkat pemakaian mahasiswa.\n\n" +
      "Paket Flat selalu berbiaya Rp3.000.000 per bulan, berapa pun pemakaiannya. Paket Kuota berbiaya Rp1.800.000 saat pemakaian rendah, Rp2.900.000 saat sedang, dan Rp4.600.000 saat tinggi. Paket Kombinasi berbiaya Rp2.200.000 saat pemakaian rendah, Rp2.700.000 saat sedang, dan Rp3.900.000 saat tinggi.\n\n" +
      "Dari data semester lalu, peluang pemakaian rendah 0,3, sedang 0,5, dan tinggi 0,2. Koperasi ingin biaya bulanan sekecil mungkin. Sebuah konsultan menawarkan prediksi pemakaian yang sangat akurat; koperasi ingin tahu berapa nilai maksimal informasi seperti itu.",
    papan: [tabelPayoff(INTERNET.alt, INTERNET.state, INTERNET.payoff, "Rp", INTERNET.prob)],
    tanya: [
      { id: "a", teks: "Berapa EMV biaya Paket Kuota? (Rp)", tipe: "angka", satuan: "Rp", kunci: 2910000, kunciTeks: "Rp2.910.000",
        dari: { bagian: 0, path: "emv.1" } },
      { id: "b", teks: "Paket mana yang sebaiknya dipilih berdasarkan EMV?", tipe: "pilih", opsi: INTERNET.alt, kunci: "Paket Kombinasi", kunciTeks: "Paket Kombinasi (EMV biaya Rp2.790.000)",
        dari: { bagian: 0, path: "terbaik.idx", nama: INTERNET.alt } },
      { id: "c", teks: "Berapa EVwPI (biaya harapan dengan informasi sempurna)? (Rp)", tipe: "angka", satuan: "Rp", kunci: 2490000, kunciTeks: "Rp2.490.000",
        dari: { bagian: 0, path: "evwpi" } },
      { id: "d", teks: "Berapa EVPI? (Rp)", tipe: "angka", satuan: "Rp", kunci: 300000, kunciTeks: "Rp300.000 (= EMV terbaik − EVwPI = 2.790.000 − 2.490.000)",
        dari: { bagian: 0, path: "evpi" } },
      { id: "e", teks: "Berapa EOL (expected opportunity loss) Paket Flat? (Rp)", tipe: "angka", satuan: "Rp", kunci: 510000, kunciTeks: "Rp510.000",
        dari: { bagian: 0, path: "eol.0" } }
    ],
    bagian: [{ judul: "EMV, EVPI, dan EOL untuk biaya", metode: "da-risiko", data: INTERNET }],
    poin: [
      "Menyadari ini soal biaya, jadi yang dipilih EMV terkecil.",
      "EMV Paket Flat 3.000.000, Paket Kuota 0,3 × 1,8 juta + 0,5 × 2,9 juta + 0,2 × 4,6 juta = 2.910.000, Paket Kombinasi 2.790.000.",
      "Memilih Paket Kombinasi karena EMV biayanya paling kecil.",
      "EVwPI memakai biaya TERKECIL di tiap kolom: 1,8 juta / 2,7 juta / 3 juta → 2.490.000.",
      "EVPI untuk biaya = EMV terbaik − EVwPI = 300.000.",
      "Tabel regret biaya = biaya sel − biaya terkecil di kolom; EOL Flat = 0,3 × 1,2 juta + 0,5 × 0,3 juta = 510.000.",
      "Mengecek bahwa EOL minimum (Paket Kombinasi) = 300.000 = EVPI."
    ],
    jebakan: [
      "Untuk biaya, EVPI = <b>EMV terbaik − EVwPI</b> (dibalik), supaya hasilnya positif.",
      "Paket Flat bernilai sama di semua keadaan, jadi EMV-nya langsung Rp3.000.000.",
      "Regret biaya memakai biaya <b>terkecil</b> di setiap kolom, bukan terbesar."
    ]
  },
  {
    id: "H1-03", topik: 1, judul: "Coworking space di Dago", modul: "da/bayes",
    ringkas: "Revisi peluang dengan Bayes, pohon keputusan dua tahap, dan EVSI.",
    cerita: "Ibu Ratna ingin membuka coworking space di kawasan Dago, Bandung. Ia bisa membuka coworking besar, coworking kecil, atau tidak membuka sama sekali. Jika pasar baik, coworking besar memberi keuntungan Rp150.000.000 dan coworking kecil Rp60.000.000. Jika pasar buruk, coworking besar rugi Rp90.000.000 dan coworking kecil rugi Rp20.000.000.\n\n" +
      "Tanpa informasi tambahan, Ibu Ratna memperkirakan peluang pasar baik 0,4. Sebuah konsultan menawarkan riset pasar seharga Rp8.000.000. Dari pengalaman konsultan, jika pasar memang baik, riset memberi hasil positif 80% dari waktu. Jika pasar buruk, riset memberi hasil negatif 90% dari waktu.\n\n" +
      "Hitunglah peluang yang direvisi dengan teori Bayes (bulatkan posterior ke 2 desimal), buat pohon keputusannya, hitung EVSI, lalu berikan saran untuk Ibu Ratna.",
    papan: [tabelPayoff(COWORK.alt, COWORK.state, COWORK.payoff, "Rp", COWORK.prior)],
    tanya: [
      { id: "a", teks: "Berapa peluang hasil riset positif?", tipe: "angka", kunci: 0.38, tol: 0.005, kunciTeks: "0,38 (= 0,8 × 0,4 + 0,1 × 0,6)",
        dari: { bagian: 0, path: "pHasil.0" } },
      { id: "b", teks: "Jika hasil riset positif, berapa peluang pasar baik? (2 desimal)", tipe: "angka", kunci: 0.84, tol: 0.005, kunciTeks: "0,84 (= 0,32 / 0,38)",
        dari: { bagian: 0, path: "posterior.0.0" } },
      { id: "c", teks: "Berapa EMV terbaik jika TANPA riset? (Rp)", tipe: "angka", satuan: "Rp", kunci: 12000000, kunciTeks: "Rp12.000.000 (coworking kecil)",
        dari: { bagian: 0, path: "evTanpaSI" } },
      { id: "d", teks: "Berapa EVSI riset pasar ini? (Rp)", tipe: "angka", satuan: "Rp", kunci: 30408000, kunciTeks: "Rp30.408.000 (= (34.408.000 + 8.000.000) − 12.000.000)",
        dari: { bagian: 0, path: "evsi" } },
      { id: "e", teks: "Apa keputusan pertama yang sebaiknya diambil Ibu Ratna?", tipe: "pilih", opsi: ["Pakai riset pasar", "Tanpa riset"], kunci: "Pakai riset pasar",
        kunciTeks: "Pakai riset pasar (EV Rp34.408.000 > Rp12.000.000); jika positif buka coworking besar, jika negatif tidak membuka",
        dari: { bagian: 0, path: "pohon.pilih", nama: ["Pakai riset pasar", "Tanpa riset"] } }
    ],
    bagian: [{ judul: "Bayes, pohon keputusan, dan EVSI", metode: "da-survei", data: COWORK }],
    poin: [
      "Melengkapi komplemen keandalan: P(negatif | baik) = 0,2 dan P(positif | buruk) = 0,1.",
      "Tabel Bayes hasil positif: joint 0,32 dan 0,06 → P(positif) = 0,38 → posterior 0,84 / 0,16.",
      "Tabel Bayes hasil negatif: joint 0,08 dan 0,54 → P(negatif) = 0,62 → posterior 0,13 / 0,87.",
      "Mengurangkan biaya riset Rp8.000.000 dari semua payoff di cabang riset (termasuk tidak membuka = −8 juta).",
      "Rollback cabang riset: positif → coworking besar (103,6 juta); negatif → tidak membuka (−8 juta); EV = 34.408.000.",
      "Cabang tanpa riset memakai prior 0,4/0,6 → coworking kecil 12 juta.",
      "EVSI = (34.408.000 + 8.000.000) − 12.000.000 = 30.408.000, lebih besar dari biaya riset.",
      "Menulis strategi lengkap: pakai riset; positif → coworking besar; negatif → tidak membuka."
    ],
    jebakan: [
      "Data konsultan adalah P(hasil riset | pasar). Pohon membutuhkan kebalikannya, P(pasar | hasil riset), jadi wajib dihitung dengan Bayes.",
      "Probabilitas cabang hasil riset adalah P(positif) = 0,38 dan P(negatif) = 0,62, bukan prior 0,4/0,6.",
      "Saat menghitung EVSI, biaya riset ditambahkan kembali dulu sebelum dikurangi EV tanpa riset."
    ]
  },
  {
    id: "H1-04", topik: 1, judul: "Tender katering wisuda Pak Yosef", modul: "da/sensitivitas",
    ringkas: "Gabungan EMV, EVPI, analisis sensitivitas, dan teori utilitas pada satu kasus.",
    cerita: "Pak Yosef, pengusaha katering di Bandung, akan mengikuti tender katering acara wisuda sebuah kampus. Ia bisa mengajukan penawaran tender besar (semua sesi wisuda), tender kecil (satu sesi saja), atau tidak ikut tender.\n\n" +
      "Jika menang tender besar, ia untung Rp80.000.000; jika kalah, ia rugi Rp30.000.000 untuk biaya persiapan dan contoh menu. Jika menang tender kecil, ia untung Rp35.000.000; jika kalah, ia rugi Rp8.000.000. Jika tidak ikut, tidak ada untung atau rugi. Pak Yosef memperkirakan peluang menang tender 0,35.\n\n" +
      "Karena kerugian Rp30.000.000 cukup berat bagi usahanya, Pak Yosef juga menilai utilitasnya: U(Rp80 juta) = 1; U(Rp35 juta) = 0,8; U(Rp0) = 0,55; U(−Rp8 juta) = 0,45; U(−Rp30 juta) = 0.\n\n" +
      "Tentukan keputusan berdasarkan EMV, hitung EVPI, cari batas peluang menang agar keputusan EMV tidak berubah, lalu bandingkan dengan keputusan berdasarkan utilitas.",
    papan: [tabelPayoff(TENDER.alt, TENDER.state, TENDER.payoff, "Rp", TENDER.prob)],
    tanya: [
      { id: "a", teks: "Berapa EMV tender besar? (Rp)", tipe: "angka", satuan: "Rp", kunci: 8500000, kunciTeks: "Rp8.500.000 (tender kecil Rp7.050.000, jadi tender besar terbaik menurut EMV)",
        dari: { bagian: 0, path: "emv.0" } },
      { id: "b", teks: "Berapa EVPI? (Rp)", tipe: "angka", satuan: "Rp", kunci: 19500000, kunciTeks: "Rp19.500.000 (= 28.000.000 − 8.500.000)",
        dari: { bagian: 0, path: "evpi" } },
      { id: "c", teks: "P = peluang menang. Tender besar tetap terbaik selama P lebih besar dari berapa? (3 desimal)", tipe: "angka", kunci: 0.328, tol: 0.001, kunciTeks: "0,328 (= 22 / 67)",
        dari: { bagian: 1, path: "titik.1.P" } },
      { id: "d", teks: "Berapa expected utility tender kecil?", tipe: "angka", kunci: 0.5725, tol: 0.0005, kunciTeks: "0,5725 (= 0,35 × 0,8 + 0,65 × 0,45)",
        dari: { bagian: 2, path: "pohon.cabang.1.ke.nilai" } },
      { id: "e", teks: "Apa keputusan Pak Yosef jika ia memaksimalkan utilitas?", tipe: "pilih", opsi: TENDER.alt, kunci: "Tender kecil", kunciTeks: "Tender kecil (EU 0,5725 > tidak ikut 0,55 > tender besar 0,35)",
        dari: { bagian: 2, path: "pohon.pilih", nama: TENDER.alt } }
    ],
    bagian: [
      { judul: "EMV dan EVPI", metode: "da-risiko", data: TENDER },
      { judul: "Analisis sensitivitas terhadap peluang menang", metode: "da-sensitivitas", data: { alt: TENDER.alt, state: TENDER.state, payoff: TENDER.payoff, goal: "max", satuan: "Rp" } },
      { judul: "Expected utility", metode: "da-pohon", data: TENDER_U }
    ],
    poin: [
      "EMV tender besar 0,35 × 80 juta + 0,65 × (−30 juta) = 8,5 juta; tender kecil 7,05 juta; tidak ikut 0.",
      "EVwPI = 0,35 × 80 juta + 0,65 × 0 = 28 juta, sehingga EVPI = 19,5 juta.",
      "Menulis EMV sebagai garis: tender besar 110P − 30 juta, tender kecil 43P − 8 juta, tidak ikut 0.",
      "Menyamakan tender besar dan tender kecil: 110P − 30 = 43P − 8 → P = 22/67 ≈ 0,328.",
      "Menyimpulkan bahwa P = 0,35 hanya sedikit di atas batas 0,328, jadi keputusan EMV sensitif.",
      "Mengganti payoff dengan utilitas: EU tender besar 0,35, tender kecil 0,5725, tidak ikut 0,55.",
      "Menyimpulkan keputusan utilitas berbeda dari EMV (tender kecil), karena Pak Yosef penghindar risiko."
    ],
    jebakan: [
      "Pada sensitivitas, kerugian ikut dikalikan (1 − P): −30 juta × (1 − P) = −30 juta + 30 juta·P.",
      "Titik potong pertama (P ≈ 0,186) adalah batas antara tidak ikut dan tender kecil, bukan batas tender besar.",
      "Expected utility memakai nilai utilitas, bukan rupiah. Jangan mencampur keduanya dalam satu perhitungan."
    ]
  }
  );
})();
