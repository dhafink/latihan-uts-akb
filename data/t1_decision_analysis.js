// Kuis Topik 1 — Decision Analysis (24 soal). Kunci soal hitungan dicek ulang oleh cek_soal.js lewat solver.js (cekNilai).
(function () {
  var F = window.SOLVER.fmt;
  function tabelPayoff(alt, state, payoff, u, prob) {
    var rows = payoff.map(function (r, i) {
      return [{ v: alt[i], k: "lab" }].concat(r.map(function (x) { return { v: F.val(x, u) }; }));
    });
    if (prob) rows.push([{ v: "Probabilitas", k: "lab" }].concat(prob.map(function (p) { return { v: F.num(p), k: "biru" }; })));
    return [{ t: "tabel", head: ["Alternatif"].concat(state), rows: rows }];
  }

  // Data bersama
  var KEDAI = { alt: ["Cabang besar", "Cabang kecil", "Tidak membuka"], state: ["Ramai", "Sedang", "Sepi"],
    payoff: [[90000000, 30000000, -60000000], [50000000, 25000000, -12000000], [0, 0, 0]], goal: "max", alpha: 0.6, satuan: "Rp" };
  var SOUND = { alt: ["Vendor Arunika", "Vendor Bumi Sora", "Vendor Citra"], state: ["Peserta sedikit", "Peserta sedang", "Peserta banyak"],
    payoff: [[4000000, 5500000, 7000000], [3000000, 6000000, 8500000], [5000000, 5500000, 6000000]], goal: "min", satuan: "Rp" };
  var MERCH = { alt: ["Stok besar", "Stok kecil", "Tidak menjual"], state: ["Permintaan tinggi", "Permintaan rendah"],
    payoff: [[12000000, -4000000], [7000000, 1000000], [0, 0]], prob: [0.6, 0.4], goal: "max", satuan: "Rp" };
  var KURIR = { alt: ["Kurir Andalan", "Kurir Bintang", "Kurir Cepat"], state: ["Musim ramai", "Musim sepi"],
    payoff: [[2400000, 1200000], [2000000, 1500000], [2700000, 900000]], prob: [0.7, 0.3], goal: "min", satuan: "Rp" };
  var TRUK = { alt: ["Truk besar", "Truk kecil", "Tidak berinvestasi"], state: ["Pasar baik", "Pasar buruk"],
    payoff: [[80000000, -40000000], [30000000, -10000000], [0, 0]], goal: "max", satuan: "Rp" };
  var KAFE = { state: ["Kafe sukses", "Kafe gagal"], prior: [0.4, 0.6], hasil: ["Survei positif", "Survei negatif"], likelihood: [[0.75, 0.25], [0.2, 0.8]] };
  var KAFE_CTX = "Rina ingin membuka kafe di Jalan Ciumbuleuit. Peluang kafe sukses diperkirakan 0,4.\nIa memesan survei pasar. Jika kafe memang akan sukses, survei memberi hasil positif 75% dari waktu. Jika kafe akan gagal, survei memberi hasil negatif 80% dari waktu.";

  window.QUESTIONS.push(
  /* ---------- dasar ---------- */
  {
    id: "T1-01", topic: 1, level: "konsep", src: "slide", lihat: "da/dasar",
    q: "Kamu tahu peluang permintaan tinggi 0,7 dan peluang permintaan rendah 0,3. Kamu sedang mengambil keputusan dalam lingkungan apa?",
    options: ["Decision making under certainty", "Decision making under uncertainty", "Decision making under risk", "Keputusan berurutan (sequential decision)"],
    answer: 2,
    explain: "Kalau ada beberapa kemungkinan keadaan DAN probabilitasnya diketahui, itu decision making under risk. Alat yang dipakai adalah EMV, EOL, EVPI, atau pohon keputusan. Kalau probabilitasnya tidak diketahui, barulah disebut uncertainty.",
    why: ["Under certainty berarti hasilnya pasti, padahal di sini permintaan masih bisa tinggi atau rendah.",
      "Under uncertainty berarti probabilitas TIDAK diketahui, sedangkan di sini peluangnya sudah diberikan.",
      null,
      "Keputusan berurutan membahas keputusan bertahap, bukan soal diketahui atau tidaknya probabilitas."]
  },
  {
    id: "T1-02", topic: 1, level: "konsep", src: "buku", lihat: "da/dasar",
    q: "Raka sudah menghitung semua alternatif dengan benar dan memilih EMV terbaik. Ternyata pasarnya buruk dan ia rugi. Bagaimana menilai keputusannya?",
    options: ["Tetap keputusan yang baik, karena dibuat dengan logis dan memakai semua informasi yang ada",
      "Keputusan yang buruk, karena hasilnya rugi",
      "Keputusan yang baik hanya kalau ruginya kecil",
      "Belum bisa dinilai sampai keputusan yang sama diulang dan hasilnya untung"],
    answer: 0,
    explain: "Keputusan yang baik dinilai dari prosesnya: logis, memakai semua data, mempertimbangkan semua alternatif, dan memakai metode kuantitatif. Hasil yang buruk bisa saja terjadi karena keadaan yang tidak bisa dikendalikan. Dalam jangka panjang, proses yang benar memberi hasil yang lebih baik.",
    why: [null,
      "Hasil buruk tidak otomatis berarti keputusannya buruk, karena state of nature di luar kendali Raka.",
      "Besar kecilnya rugi tidak menentukan baik buruknya proses pengambilan keputusan.",
      "Keputusan dinilai dari prosesnya saat itu, tidak perlu menunggu diulang."]
  },
  {
    id: "T1-03", topic: 1, level: "konsep", src: "slide", lihat: "da/dasar",
    q: "Pak Dedi bisa membuka toko besar, toko kecil, atau tidak membuka toko. Kondisi ekonomi tahun depan bisa membaik atau memburuk. Mana yang termasuk state of nature?",
    options: ["Membuka toko besar", "Ekonomi membaik atau memburuk", "Tidak membuka toko", "Keuntungan Rp50 juta jika membuka toko besar"],
    answer: 1,
    explain: "State of nature adalah keadaan yang tidak bisa dikendalikan pengambil keputusan, di sini kondisi ekonomi. Pilihan toko besar, kecil, atau tidak membuka adalah alternatif. Angka keuntungan untuk setiap kombinasi disebut payoff.",
    why: ["Membuka toko besar adalah alternatif yang bisa dipilih Pak Dedi.",
      null,
      "Tidak membuka toko juga alternatif (do nothing) yang bisa dipilih.",
      "Keuntungan untuk satu kombinasi alternatif dan keadaan disebut payoff."]
  },

  /* ---------- lima kriteria ketidakpastian ---------- */
  {
    id: "T1-04", topic: 1, level: "aplikasi", src: "soal-dosen", lihat: "da/ketidakpastian",
    ctxTitle: "Kedai kopi", ctx: "Pemilik kedai kopi di Dago menimbang membuka cabang. Keuntungan setahun bergantung pada ramainya pengunjung (lihat tabel).",
    papan: tabelPayoff(KEDAI.alt, KEDAI.state, KEDAI.payoff, "Rp"),
    q: "Dengan kriteria realisme (α = 0,6), alternatif mana yang dipilih dan berapa nilainya?",
    options: ["Cabang besar, Rp78.000.000", "Cabang besar, Rp66.000.000", "Cabang kecil, Rp25.200.000", "Cabang besar, Rp30.000.000"],
    answer: 3,
    explain: "Realisme hanya memakai nilai terbaik dan terburuk setiap baris: cabang besar 0,6 × 90 juta + 0,4 × (−60 juta) = 30 juta, cabang kecil 0,6 × 50 juta + 0,4 × (−12 juta) = 25,2 juta, tidak membuka 0. Pilih yang terbesar, yaitu cabang besar Rp30.000.000. Nilai tengah (sedang) diabaikan.",
    why: ["Ini hasil kalau rugi 60 juta dihitung positif; kerugian harus tetap bertanda minus.",
      "Ini hasil kalau nilai tengah (30 juta) dipakai sebagai nilai terburuk, padahal terburuknya −60 juta.",
      "Rp25.200.000 memang nilai realisme cabang kecil, tapi masih kalah dari cabang besar.",
      null],
    cekNilai: { metode: "da-ketidakpastian", data: KEDAI, path: "keputusan.realisme.nilai", satuan: "Rp" }
  },
  {
    id: "T1-05", topic: 1, level: "aplikasi", src: "latihan", lihat: "da/ketidakpastian",
    ctxTitle: "Kedai kopi", ctx: "Tabel keuntungan pembukaan cabang kedai kopi (dalam rupiah) ada di papan.",
    papan: tabelPayoff(KEDAI.alt, KEDAI.state, KEDAI.payoff, "Rp"),
    q: "Dengan kriteria equally likely (Laplace), alternatif mana yang dipilih?",
    options: ["Cabang besar, Rp30.000.000", "Cabang kecil, Rp31.500.000", "Cabang kecil, Rp21.000.000", "Cabang besar, Rp20.000.000"],
    answer: 2,
    explain: "Laplace menganggap ketiga keadaan sama mungkin, jadi jumlah setiap baris dibagi 3. Cabang besar (90 + 30 − 60) / 3 = 20 juta, cabang kecil (50 + 25 − 12) / 3 = 21 juta, tidak membuka 0. Pilih rata-rata terbesar: cabang kecil Rp21.000.000.",
    why: ["Angka ini muncul kalau jumlah baris dibagi 2, padahal ada 3 keadaan.",
      "Angka ini juga hasil dibagi 2; Laplace membagi dengan banyaknya keadaan, yaitu 3.",
      null,
      "Rp20.000.000 memang rata-rata cabang besar, tapi masih kalah dari cabang kecil."],
    cekNilai: { metode: "da-ketidakpastian", data: KEDAI, path: "keputusan.laplace.nilai", satuan: "Rp" }
  },
  {
    id: "T1-06", topic: 1, level: "aplikasi", src: "latihan", lihat: "da/ketidakpastian",
    ctxTitle: "Kedai kopi", ctx: "Tabel keuntungan pembukaan cabang kedai kopi (dalam rupiah) ada di papan.",
    papan: tabelPayoff(KEDAI.alt, KEDAI.state, KEDAI.payoff, "Rp"),
    q: "Dengan kriteria minimax regret, alternatif mana yang dipilih?",
    options: ["Tidak membuka, regret maksimum Rp0", "Cabang kecil, regret maksimum Rp40.000.000", "Cabang besar, regret maksimum Rp60.000.000", "Cabang kecil, regret maksimum Rp62.000.000"],
    answer: 1,
    explain: "Nilai terbaik setiap KOLOM: ramai 90 juta, sedang 30 juta, sepi 0. Regret cabang besar = 0 / 0 / 60 juta (maks 60 juta), cabang kecil = 40 / 5 / 12 juta (maks 40 juta), tidak membuka = 90 / 30 / 0 juta (maks 90 juta). Pilih regret maksimum yang terkecil: cabang kecil, Rp40.000.000.",
    why: ["Ini hasil kalau regret dihitung per baris; regret harus dihitung per kolom (per keadaan).",
      null,
      "Rp60.000.000 adalah regret maksimum cabang besar, dan masih lebih besar dari cabang kecil.",
      "Angka ini muncul kalau regret cabang kecil dihitung dari nilai terbesar barisnya sendiri."],
    cekNilai: { metode: "da-ketidakpastian", data: KEDAI, path: "keputusan.regret.nilai", satuan: "Rp" }
  },
  {
    id: "T1-07", topic: 1, level: "aplikasi", src: "latihan", lihat: "da/ketidakpastian",
    ctxTitle: "Sewa sound system", ctx: "Himpunan mahasiswa menyewa sound system untuk acara kampus. Biaya sewa bergantung pada jumlah peserta yang datang (lihat tabel). Tujuannya meminimalkan biaya.",
    papan: tabelPayoff(SOUND.alt, SOUND.state, SOUND.payoff, "Rp"),
    q: "Panitia sangat pesimis. Vendor mana yang dipilih dengan kriteria pesimis?",
    options: ["Vendor Citra, Rp5.000.000", "Vendor Bumi Sora, Rp3.000.000", "Vendor Bumi Sora, Rp8.500.000", "Vendor Citra, Rp6.000.000"],
    answer: 3,
    explain: "Untuk biaya, hasil terburuk adalah biaya TERBESAR di setiap baris: Arunika 7 juta, Bumi Sora 8,5 juta, Citra 6 juta. Orang pesimis memilih yang terbaik dari yang terburuk, yaitu biaya terkecil di antaranya. Jadi pilih Vendor Citra dengan biaya maksimal Rp6.000.000.",
    why: ["Ini cara maximin untuk profit (terbesar dari nilai terkecil), padahal untuk biaya nilai terburuk adalah biaya terbesar.",
      "Ini jawaban kriteria optimis (biaya terkecil dari biaya terkecil).",
      "Ini memilih biaya terbesar, kebalikan dari tujuan meminimalkan biaya.",
      null],
    cekNilai: { metode: "da-ketidakpastian", data: SOUND, path: "keputusan.pesimis.nilai", satuan: "Rp" }
  },
  {
    id: "T1-08", topic: 1, level: "aplikasi", src: "latihan", lihat: "da/ketidakpastian",
    ctxTitle: "Sewa sound system", ctx: "Tabel biaya sewa sound system dari setiap vendor ada di papan. Tujuannya meminimalkan biaya.",
    papan: tabelPayoff(SOUND.alt, SOUND.state, SOUND.payoff, "Rp"),
    q: "Dengan kriteria minimax regret, vendor mana yang dipilih?",
    options: ["Vendor Arunika, regret maksimum Rp1.000.000", "Vendor Arunika, regret maksimum Rp1.500.000", "Vendor Citra, regret maksimum Rp2.000.000", "Vendor Bumi Sora, regret maksimum Rp2.500.000"],
    answer: 0,
    explain: "Untuk biaya, regret = biaya sel − biaya TERKECIL di kolom itu (3 juta, 5,5 juta, 6 juta). Regret maksimum: Arunika 1 juta, Bumi Sora 2,5 juta, Citra 2 juta. Pilih yang terkecil, yaitu Vendor Arunika dengan Rp1.000.000.",
    why: [null,
      "Angka ini muncul kalau regret biaya dihitung dari biaya terbesar di kolom, seperti soal profit.",
      "Rp2.000.000 adalah regret maksimum Vendor Citra, lebih besar dari Arunika.",
      "Rp2.500.000 adalah regret maksimum Vendor Bumi Sora, yang paling besar."],
    cekNilai: { metode: "da-ketidakpastian", data: SOUND, path: "keputusan.regret.nilai", satuan: "Rp" }
  },
  {
    id: "T1-09", topic: 1, level: "kasus", src: "soal-dosen", lihat: "da/ketidakpastian",
    ctxTitle: "Pilihan mata kuliah Susi",
    ctx: "Susi boleh mengambil AKB saja, Statin saja, atau tidak mengambil keduanya semester ini. Perkiraan nilai maksimumnya (semangat belajar tinggi / biasa / rendah):\nAKB: 98 / 78 / 25\nStatin: 100 / 65 / 30\nTidak mengambil: 0 / 0 / 0",
    q: "Dengan kriteria maximin, apa saran untuk Susi?",
    options: ["Ambil Statin (nilai terbaiknya 100)", "Ambil AKB (rata-ratanya 67)", "Ambil Statin (nilai terburuknya 30)", "Tidak mengambil keduanya, karena nilainya pasti 0"],
    answer: 2,
    explain: "Maximin melihat nilai TERKECIL setiap baris: AKB 25, Statin 30, tidak mengambil 0. Lalu pilih yang terbesar dari nilai-nilai terburuk itu. Jadi saran untuk Susi adalah mengambil Statin, dengan jaminan nilai minimal 30.",
    why: ["Itu alasan kriteria maximax (optimis), bukan maximin.",
      "Rata-rata 67 adalah perhitungan Laplace, bukan maximin.",
      null,
      "Nilai 0 adalah nilai terburuk paling kecil, jadi justru tidak dipilih oleh maximin."],
    cekNilai: { metode: "da-ketidakpastian", data: { alt: ["Ambil AKB", "Ambil Statin", "Tidak mengambil"], state: ["Semangat tinggi", "Biasa", "Rendah"], payoff: [[98, 78, 25], [100, 65, 30], [0, 0, 0]], goal: "max" }, path: "keputusan.pesimis.nilai" }
  },

  /* ---------- risiko: EMV, EVPI, EOL ---------- */
  {
    id: "T1-10", topic: 1, level: "aplikasi", src: "latihan", lihat: "da/risiko",
    ctxTitle: "Merchandise wisuda", ctx: "Raka berjualan merchandise wisuda UNPAR. Peluang permintaan tinggi 0,6 dan rendah 0,4. Keuntungannya seperti di tabel.",
    papan: tabelPayoff(MERCH.alt, MERCH.state, MERCH.payoff, "Rp", MERCH.prob),
    q: "Alternatif mana yang punya EMV terbaik?",
    options: ["Stok kecil, EMV Rp4.600.000", "Stok besar, EMV Rp8.800.000", "Stok besar, EMV Rp5.600.000", "Stok besar, EMV Rp4.000.000"],
    answer: 2,
    explain: "EMV = jumlah (payoff × probabilitas). Stok besar: 0,6 × 12 juta + 0,4 × (−4 juta) = 5,6 juta; stok kecil: 0,6 × 7 juta + 0,4 × 1 juta = 4,6 juta; tidak menjual: 0. EMV terbaik adalah stok besar, Rp5.600.000.",
    why: ["Rp4.600.000 memang EMV stok kecil, tapi masih kalah dari stok besar.",
      "Angka ini muncul kalau kerugian 4 juta dihitung positif.",
      null,
      "Angka ini rata-rata biasa tanpa memakai probabilitas 0,6 dan 0,4."],
    cekNilai: { metode: "da-risiko", data: MERCH, path: "terbaik.nilai", satuan: "Rp" }
  },
  {
    id: "T1-11", topic: 1, level: "aplikasi", src: "latihan", lihat: "da/risiko",
    ctxTitle: "Merchandise wisuda", ctx: "Masih kasus merchandise wisuda Raka (peluang permintaan tinggi 0,6).",
    papan: tabelPayoff(MERCH.alt, MERCH.state, MERCH.payoff, "Rp", MERCH.prob),
    q: "Berapa EVPI (expected value of perfect information)?",
    options: ["Rp7.600.000", "Rp2.000.000", "Rp3.000.000", "Rp5.600.000"],
    answer: 1,
    explain: "Dengan informasi sempurna, Raka selalu memilih yang terbaik di setiap kolom: 12 juta saat tinggi dan 1 juta saat rendah, sehingga EVwPI = 0,6 × 12 juta + 0,4 × 1 juta = 7,6 juta. EVPI = EVwPI − EMV terbaik = 7,6 juta − 5,6 juta. Hasilnya Rp2.000.000.",
    why: ["Rp7.600.000 adalah EVwPI, belum dikurangi EMV terbaik.",
      null,
      "Angka ini muncul kalau EVwPI dikurangi EMV stok kecil, padahal yang dipakai EMV terbaik.",
      "Rp5.600.000 adalah EMV terbaik, bukan nilai informasi sempurna."],
    cekNilai: { metode: "da-risiko", data: MERCH, path: "evpi", satuan: "Rp" }
  },
  {
    id: "T1-12", topic: 1, level: "aplikasi", src: "latihan", lihat: "da/risiko",
    ctxTitle: "Biaya kurir toko daring", ctx: "Bu Sari memilih jasa kurir untuk toko daringnya. Biaya bulanan bergantung pada musim; peluang musim ramai 0,7. Tujuannya meminimalkan biaya.",
    papan: tabelPayoff(KURIR.alt, KURIR.state, KURIR.payoff, "Rp", KURIR.prob),
    q: "Berapa EVPI untuk masalah biaya ini?",
    options: ["Rp180.000", "Rp1.670.000", "Rp370.000", "Rp1.850.000"],
    answer: 0,
    explain: "EMV biaya: Andalan 2,04 juta, Bintang 1,85 juta, Cepat 2,16 juta; yang terbaik (terkecil) Kurir Bintang 1,85 juta. EVwPI memakai biaya terkecil tiap kolom: 0,7 × 2 juta + 0,3 × 0,9 juta = 1,67 juta. Untuk biaya, EVPI = EMV terbaik − EVwPI = Rp180.000.",
    why: [null,
      "Rp1.670.000 adalah EVwPI, belum dibandingkan dengan EMV terbaik.",
      "Angka ini memakai EMV Kurir Andalan, padahal yang dipakai EMV terbaik (terkecil).",
      "Rp1.850.000 adalah EMV terbaik, bukan nilai informasi sempurna."],
    cekNilai: { metode: "da-risiko", data: KURIR, path: "evpi", satuan: "Rp" }
  },
  {
    id: "T1-13", topic: 1, level: "konsep", src: "slide", lihat: "da/risiko",
    q: "Apa arti EVPI (expected value of perfect information)?",
    options: ["Rata-rata hasil kalau kita selalu tahu keadaan yang akan terjadi",
      "Kerugian karena memilih alternatif yang paling buruk",
      "EMV terbesar dikurangi EMV terkecil",
      "Batas atas harga yang pantas dibayar untuk informasi tambahan"],
    answer: 3,
    explain: "EVPI adalah tambahan nilai karena punya informasi sempurna, yaitu EVwPI dikurangi EMV terbaik. Karena informasi sempurna adalah informasi terbaik yang mungkin, EVPI menjadi batas atas harga informasi apa pun. Informasi yang lebih mahal dari EVPI tidak layak dibeli.",
    why: ["Itu pengertian EVwPI (expected value WITH perfect information), bukan EVPI.",
      "EVPI tidak membandingkan dengan alternatif terburuk.",
      "Selisih EMV terbesar dan terkecil tidak punya arti khusus dalam decision analysis.",
      null]
  },
  {
    id: "T1-14", topic: 1, level: "konsep", src: "buku", lihat: "da/risiko",
    q: "Apa hubungan EOL (expected opportunity loss) minimum dengan EMV dan EVPI?",
    options: ["Keputusannya selalu sama dengan kriteria maximin",
      "Nilainya sama dengan EVwPI",
      "Keputusannya sama dengan EMV terbaik, dan nilainya sama dengan EVPI",
      "Keputusannya bisa berbeda dari EMV terbaik karena memakai regret"],
    answer: 2,
    explain: "EOL adalah rata-rata regret, dan meminimalkan regret harapan sama artinya dengan memaksimalkan EMV. Karena itu, alternatif dengan EOL terkecil selalu sama dengan alternatif EMV terbaik. Nilai EOL minimum juga selalu sama dengan EVPI.",
    why: ["Maximin adalah kriteria ketidakpastian tanpa probabilitas, sedangkan EOL memakai probabilitas.",
      "EOL minimum sama dengan EVPI, bukan EVwPI.",
      null,
      "EOL minimum dan EMV maksimum selalu memberi keputusan yang sama."]
  },
  {
    id: "T1-15", topic: 1, level: "kasus", src: "buku", lihat: "da/risiko",
    ctxTitle: "Tawaran informasi pasar",
    ctx: "Thompson Lumber: pabrik besar $200.000 / −$180.000, pabrik kecil $100.000 / −$20.000, tidak membangun $0 / $0 (pasar baik / pasar buruk), masing-masing berpeluang 0,5. EMV terbaik adalah pabrik kecil, $40.000.\nSebuah perusahaan riset menawarkan informasi pasar yang 100% akurat seharga $65.000.",
    q: "Apa saran yang tepat untuk Thompson?",
    options: ["Terima, karena $65.000 masih di bawah $100.000", "Tolak, karena EVPI hanya $60.000", "Terima, karena informasi sempurna selalu layak dibeli", "Tolak, karena EVPI hanya $40.000"],
    answer: 1,
    explain: "EVwPI = 0,5 × $200.000 + 0,5 × $0 = $100.000, sehingga EVPI = $100.000 − $40.000. Jadi informasi sempurna paling tinggi bernilai $60.000 bagi Thompson. Tawaran $65.000 terlalu mahal, jadi sebaiknya ditolak.",
    why: ["$100.000 adalah EVwPI; yang dibandingkan dengan harga informasi adalah EVPI.",
      null,
      "Informasi sempurna hanya layak kalau harganya tidak melebihi EVPI.",
      "$40.000 adalah EMV terbaik tanpa informasi, bukan EVPI."],
    cekNilai: { metode: "da-risiko", data: { alt: ["Pabrik besar", "Pabrik kecil", "Tidak membangun"], state: ["Pasar baik", "Pasar buruk"], payoff: [[200000, -180000], [100000, -20000], [0, 0]], prob: [0.5, 0.5], goal: "max", satuan: "$" }, path: "evpi", satuan: "$" }
  },
  {
    id: "T1-16", topic: 1, level: "kasus", src: "soal-dosen", lihat: "da/risiko",
    ctxTitle: "Laptop Javar",
    ctx: "Javar berjualan di marketplace dan menimbang biaya perawatan per periode:\nLaptop baru: Rp18.000 (setelah high season) / Rp10.000 (low season)\nLaptop bekas: Rp25.000 / Rp9.000\nTidak membeli laptop (perawatan 2 smartphone): Rp20.000 / Rp7.000\nPeluang high season 0,8.",
    q: "Berapa EMV biaya terbaik, dan apa keputusan Javar?",
    options: ["Membeli laptop bekas, Rp21.800", "Tidak membeli laptop, Rp17.400", "Membeli laptop baru, Rp14.000", "Membeli laptop baru, Rp16.400"],
    answer: 3,
    explain: "Ini soal biaya, jadi pilih EMV terkecil. Laptop baru 0,8 × 18.000 + 0,2 × 10.000 = 16.400; laptop bekas 21.800; tidak membeli 0,8 × 20.000 + 0,2 × 7.000 = 17.400. Keputusan terbaik adalah membeli laptop baru dengan EMV Rp16.400.",
    why: ["Ini memilih EMV terbesar, padahal yang dicari biaya terkecil.",
      "Rp17.400 memang EMV tidak membeli laptop, tapi masih lebih mahal dari laptop baru.",
      "Angka ini rata-rata biasa (18.000 + 10.000) / 2 tanpa memakai peluang 0,8.",
      null],
    cekNilai: { metode: "da-risiko", data: { alt: ["Laptop baru", "Laptop bekas", "Tidak membeli"], state: ["High season", "Low season"], payoff: [[18000, 10000], [25000, 9000], [20000, 7000]], prob: [0.8, 0.2], goal: "min", satuan: "Rp" }, path: "terbaik.nilai", satuan: "Rp" }
  },

  /* ---------- sensitivitas ---------- */
  {
    id: "T1-17", topic: 1, level: "aplikasi", src: "latihan", lihat: "da/sensitivitas",
    ctxTitle: "Food truck di Dago", ctx: "Fajar menimbang berinvestasi food truck. P = peluang pasar baik, sehingga peluang pasar buruk = 1 − P.",
    papan: tabelPayoff(TRUK.alt, TRUK.state, TRUK.payoff, "Rp"),
    q: "Untuk nilai P berapa truk besar menjadi pilihan terbaik?",
    options: ["P > 0,375", "P > 0,25", "P > 0,5", "P > 0,333"],
    answer: 0,
    explain: "EMV(truk besar) = 80P − 40(1 − P) = 120P − 40 dan EMV(truk kecil) = 30P − 10(1 − P) = 40P − 10 (dalam juta). Samakan keduanya: 120P − 40 = 40P − 10, sehingga 80P = 30 dan P = 0,375. Di atas 0,375 garis truk besar berada paling atas.",
    why: [null,
      "P = 0,25 adalah titik ketika truk kecil mulai lebih baik dari tidak berinvestasi.",
      "0,5 hanya tebakan tengah, bukan hasil menyamakan dua persamaan EMV.",
      "0,333 adalah titik ketika truk besar baru menyamai tidak berinvestasi; di sekitar titik itu truk kecil masih lebih baik."],
    cekNilai: { metode: "da-sensitivitas", data: TRUK, path: "titik.1.P", format: "num", dp: 3 }
  },

  /* ---------- pohon keputusan ---------- */
  {
    id: "T1-18", topic: 1, level: "konsep", src: "slide", lihat: "da/pohon",
    q: "Di pohon keputusan, apa arti simbol kotak (□) dan lingkaran (○)?",
    options: ["□ = simpul peluang, ○ = simpul keputusan",
      "□ = simpul keputusan, ○ = simpul peluang (state of nature)",
      "□ = payoff akhir, ○ = probabilitas",
      "Keduanya simpul peluang, hanya berbeda ukuran cabang"],
    answer: 1,
    explain: "Kotak adalah simpul keputusan, tempat kita memilih salah satu alternatif. Lingkaran adalah simpul peluang, tempat salah satu state of nature terjadi dengan probabilitas tertentu. Payoff ditulis di ujung kanan setiap cabang.",
    why: ["Simbolnya tertukar: kotak justru untuk keputusan.",
      null,
      "Payoff ditulis di ujung cabang, dan probabilitas ditulis di cabang yang keluar dari lingkaran.",
      "Kotak dan lingkaran punya arti berbeda: memilih vs peluang."]
  },
  {
    id: "T1-19", topic: 1, level: "konsep", src: "slide", lihat: "da/pohon",
    q: "Bagaimana urutan menghitung pohon keputusan?",
    options: ["Dari kiri ke kanan: pilih cabang terbaik di simpul pertama, lalu hitung EMV-nya",
      "Hitung EMV di simpul keputusan, lalu pilih cabang dengan probabilitas terbesar di simpul peluang",
      "Dari kanan ke kiri: hitung EMV di setiap simpul peluang, lalu pilih cabang terbaik di setiap simpul keputusan",
      "Jumlahkan semua payoff di ujung kanan, lalu bagi dengan banyaknya cabang"],
    answer: 2,
    explain: "Pohon dihitung mundur (rollback) dari kanan ke kiri. Di simpul peluang, hitung EMV dari probabilitas dan nilai cabang. Di simpul keputusan, pilih cabang dengan nilai terbaik dan coret cabang lainnya.",
    why: ["Simpul paling kiri baru bisa dinilai setelah semua simpul di kanannya dihitung.",
      "Perannya tertukar: EMV dihitung di simpul peluang, dan memilih dilakukan di simpul keputusan.",
      null,
      "Rata-rata biasa mengabaikan probabilitas dan pilihan di simpul keputusan."]
  },
  {
    id: "T1-20", topic: 1, level: "aplikasi", src: "latihan", lihat: "da/bayes",
    ctxTitle: "Warung bakso Dimas",
    ctx: "Tanpa survei, keputusan terbaik Dimas adalah warung besar dengan EMV Rp15.000.000.\nSurvei pasar berbiaya Rp4.000.000. Setelah pohon dihitung (biaya survei sudah dikurangkan dari semua payoff di cabang survei), EV dengan survei = Rp19.100.000.",
    q: "Berapa EVSI (expected value of sample information) survei itu?",
    options: ["Rp4.100.000", "Rp19.100.000", "Rp23.100.000", "Rp8.100.000"],
    answer: 3,
    explain: "Biaya survei sudah dikurangkan dari payoff, jadi tambahkan kembali dulu: 19,1 juta + 4 juta = 23,1 juta. EVSI = 23,1 juta − EV tanpa survei 15 juta = Rp8.100.000. Karena EVSI lebih besar dari biaya survei 4 juta, survei layak dilakukan.",
    why: ["Angka ini lupa menambahkan kembali biaya survei sebelum dikurangi EV tanpa survei.",
      "Rp19.100.000 adalah EV dengan survei, bukan nilai informasinya.",
      "Rp23.100.000 belum dikurangi EV tanpa survei.",
      null],
    cekNilai: { metode: "da-survei", data: { alt: ["Warung besar", "Warung kecil", "Tidak membuka"], state: ["Pasar baik", "Pasar buruk"], payoff: [[60000000, -30000000], [25000000, -5000000], [0, 0]], prior: [0.5, 0.5], goal: "max", satuan: "Rp",
      survei: { label: "Survei", biaya: 4000000, hasil: ["Survei baik", "Survei buruk"], pHasil: [0.55, 0.45], posterior: [[0.8, 0.2], [0.15, 0.85]] } }, path: "evsi", satuan: "Rp" }
  },

  /* ---------- Bayes ---------- */
  {
    id: "T1-21", topic: 1, level: "aplikasi", src: "soal-dosen", lihat: "da/bayes",
    ctxTitle: "Kafe Rina", ctx: KAFE_CTX,
    q: "Berapa peluang survei memberi hasil positif?",
    options: ["0,42", "0,78", "0,3", "0,75"],
    answer: 0,
    explain: "P(positif) = P(positif | sukses) × P(sukses) + P(positif | gagal) × P(gagal). P(positif | gagal) = 1 − 0,8 = 0,2, jadi P(positif) = 0,75 × 0,4 + 0,2 × 0,6 = 0,3 + 0,12. Hasilnya 0,42.",
    why: [null,
      "Angka ini memakai 0,8 untuk kafe gagal, padahal yang dibutuhkan P(positif | gagal) = 0,2.",
      "0,3 hanya joint untuk kafe sukses; joint untuk kafe gagal belum ditambahkan.",
      "0,75 adalah P(positif | sukses), bukan peluang total survei positif."],
    cekNilai: { metode: "da-bayes", data: KAFE, path: "pHasil.0", format: "num", dp: 2 }
  },
  {
    id: "T1-22", topic: 1, level: "aplikasi", src: "latihan", lihat: "da/bayes",
    ctxTitle: "Kafe Rina", ctx: KAFE_CTX,
    q: "Jika hasil survei positif, berapa peluang kafe sukses?",
    options: ["0,75", "0,7143", "0,3", "0,7895"],
    answer: 1,
    explain: "Yang dicari adalah posterior P(sukses | positif) = joint sukses ÷ P(positif). Joint sukses = 0,75 × 0,4 = 0,3 dan P(positif) = 0,42. Jadi posteriornya 0,3 / 0,42 = 0,7143.",
    why: ["0,75 adalah P(positif | sukses); arahnya terbalik dengan yang ditanyakan.",
      null,
      "0,3 adalah joint (kondisional × prior), belum dibagi P(positif).",
      "Angka ini muncul kalau prior tidak dipakai: 0,75 / (0,75 + 0,2)."],
    cekNilai: { metode: "da-bayes", data: KAFE, path: "posterior.0.0", format: "num", dp: 4 }
  },
  {
    id: "T1-23", topic: 1, level: "konsep", src: "slide", lihat: "da/bayes",
    q: "Apa yang dimaksud probabilitas posterior?",
    options: ["Peluang suatu keadaan setelah direvisi dengan informasi baru, misalnya P(pasar baik | survei positif)",
      "Peluang awal suatu keadaan sebelum ada informasi tambahan",
      "Peluang hasil survei jika keadaan sebenarnya sudah diketahui, misalnya P(survei positif | pasar baik)",
      "Peluang survei salah memprediksi keadaan pasar"],
    answer: 0,
    explain: "Posterior adalah peluang keadaan yang sudah diperbarui setelah melihat hasil informasi, dihitung dengan teorema Bayes. Peluang awal sebelum informasi disebut prior. Posterior inilah yang dipakai di cabang pohon keputusan setelah simpul hasil survei.",
    why: [null,
      "Itu pengertian probabilitas prior.",
      "Itu probabilitas kondisional (keandalan survei), arahnya kebalikan posterior.",
      "Peluang survei salah hanyalah bagian dari data keandalan survei."]
  },

  /* ---------- utilitas ---------- */
  {
    id: "T1-24", topic: 1, level: "kasus", src: "buku", lihat: "da/utility",
    ctxTitle: "Investasi Nadia",
    ctx: "Nadia memilih antara:\nSaham: naik (peluang 0,4) untung Rp20 juta, turun (peluang 0,6) rugi Rp10 juta.\nDeposito: untung pasti Rp2 juta.\nUtilitas Nadia: U(Rp20 juta) = 1, U(−Rp10 juta) = 0, U(Rp2 juta) = 0,7.",
    q: "Berapa expected utility saham, dan apa keputusan Nadia jika ia memaksimalkan utilitas?",
    options: ["0,4 → pilih saham", "0,7 → pilih saham", "Rp2 juta → keduanya sama saja", "0,4 → pilih deposito"],
    answer: 3,
    explain: "Expected utility saham = 0,4 × 1 + 0,6 × 0 = 0,4, sedangkan utilitas deposito 0,7. Karena 0,7 > 0,4, Nadia memilih deposito. Padahal EMV saham juga Rp2 juta (0,4 × 20 − 0,6 × 10), sama dengan deposito, jadi Nadia termasuk penghindar risiko.",
    why: ["Expected utility saham 0,4 lebih kecil dari utilitas deposito 0,7, jadi saham tidak dipilih.",
      "0,7 adalah utilitas deposito, bukan expected utility saham.",
      "EMV keduanya memang Rp2 juta, tapi keputusan berdasarkan utilitas memilih deposito.",
      null],
    cekNilai: { metode: "da-pohon", data: { goal: "max", utilitas: true, pohon: { jenis: "keputusan", cabang: [
      { label: "Saham", ke: { jenis: "peluang", cabang: [{ label: "Naik", p: 0.4, ke: { jenis: "akhir", nilai: 1 } }, { label: "Turun", p: 0.6, ke: { jenis: "akhir", nilai: 0 } }] } },
      { label: "Deposito", ke: { jenis: "akhir", nilai: 0.7 } }] } }, path: "pohon.cabang.0.ke.nilai", format: "num", bolehSama: true }
  }
  );
})();
