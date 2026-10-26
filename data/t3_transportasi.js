// Topik 3 — Transportasi: 20 soal pilihan ganda (T3-01..T3-20).
// Angka hitungan dicek ulang oleh cek_soal.js lewat cekNilai (solver.js). Biaya dalam ribu rupiah per unit.
(function () {
  var S = window.SOLVER;
  function src(nama, kode, n) { return { nama: nama, kode: kode, supply: n }; }
  function dst(nama, kode, n) { return { nama: nama, kode: kode, demand: n }; }
  // tabel data polos (tanpa dummy/M) supaya soal tidak membocorkan langkah
  function tabelData(p, label) {
    var head = ["Dari \\ Ke"].concat(p.tujuan.map(function (t) { return t.kode; }), ["Supply"]);
    var rows = p.sumber.map(function (s, i) {
      return [{ v: s.kode + " · " + s.nama, k: "lab" }].concat(p.biaya[i].map(function (c) { return c === "M" ? { v: "× (ditutup)", k: "pink" } : { v: String(c) }; }), [{ v: String(s.supply) }]);
    });
    rows.push([{ v: "Demand", k: "lab" }].concat(p.tujuan.map(function (t) { return { v: String(t.demand) }; }), [{ v: "" }]));
    return [{ t: "tabel", head: head, rows: rows, catatan: label + " · " + p.tujuan.map(function (t) { return t.kode + " = " + t.nama; }).join(", ") }];
  }
  function papanAwal(p) { return S.TP.selesaikan(p, { awal: "nwc", tanpaOptimasi: true }).steps[0].papan; }
  function papanSolusiAwal(p, metode) { var st = S.TP.selesaikan(p, { awal: metode, tanpaOptimasi: true }).steps; return [st[st.length - 1].papan[0]]; }
  function papanOptimal(p, opsi) { var st = S.TP.selesaikan(p, opsi).steps.filter(function (s) { return s.kunci === "optimal"; }); return [st[0].papan[0]]; }

  // Dataset A: 3 gudang → 3 toko (seimbang, 330 unit)
  var A = { sumber: [src("Gudang Bandung", "BD", 120), src("Gudang Cimahi", "CM", 110), src("Gudang Sumedang", "SM", 100)],
    tujuan: [dst("Toko Dago", "DG", 70), dst("Toko Buah Batu", "BB", 120), dst("Toko Lembang", "LB", 140)],
    biaya: [[7, 6, 4], [9, 3, 6], [7, 8, 5]], goal: "min", satuan: "" };
  // Dataset U: tidak seimbang (supply 290 > demand 250)
  var U = { sumber: [src("Gudang Gedebage", "GD", 120), src("Gudang Soreang", "SR", 90), src("Gudang Ujungberung", "UB", 80)],
    tujuan: [dst("Pasar Kosambi", "KS", 100), dst("Pasar Andir", "AN", 70), dst("Pasar Kiaracondong", "KC", 80)],
    biaya: [[5, 4, 6], [3, 7, 5], [6, 5, 2]], goal: "min", satuan: "" };
  // Dataset Lr: rute SM–DG ditutup
  var Lr = { sumber: [src("Gudang Bandung", "BD", 110), src("Gudang Cimahi", "CM", 90), src("Gudang Sumedang", "SM", 50)],
    tujuan: [dst("Toko Dago", "DG", 120), dst("Toko Buah Batu", "BB", 60), dst("Toko Lembang", "LB", 70)],
    biaya: [[6, 4, 7], [5, 8, 2], ["M", 6, 8]], goal: "min", satuan: "" };
  // Dataset MX: maksimasi profit sayur
  var MX = { sumber: [src("Kebun Lembang", "LB", 110), src("Kebun Ciwidey", "CW", 60), src("Kebun Pangalengan", "PG", 120)],
    tujuan: [dst("Pasar Caringin", "CR", 100), dst("Pasar Gedebage", "GB", 120), dst("Pasar Kosambi", "KS", 70)],
    biaya: [[9, 11, 8], [5, 3, 4], [4, 10, 11]], goal: "max", satuan: "" };
  // Dataset G: optimal ganda
  var G = { sumber: [src("Gudang Bandung", "BD", 100), src("Gudang Cimahi", "CM", 90), src("Gudang Sumedang", "SM", 50)],
    tujuan: [dst("Toko Dago", "DG", 70), dst("Toko Buah Batu", "BB", 50), dst("Toko Lembang", "LB", 120)],
    biaya: [[4, 2, 4], [6, 7, 6], [10, 7, 6]], goal: "min", satuan: "" };
  // Lokasi fasilitas: sistem dengan pabrik baru di Subang
  var FS = { sumber: [src("Pabrik Bandung", "BD", 150), src("Pabrik Cimahi", "CM", 100), src("Pabrik Subang", "SB", 100)],
    tujuan: [dst("Garut", "GR", 120), dst("Tasikmalaya", "TS", 100), dst("Cirebon", "CB", 130)],
    biaya: [[3, 6, 7], [5, 7, 9], [9, 8, 2]], goal: "min", satuan: "" };

  window.QUESTIONS.push(
{
  id: "T3-01", topic: 3, level: "aplikasi", src: "buku", lihat: "tp/model",
  q: "PT Sinar Priangan punya 3 pabrik dan 4 gudang. Kalau masalah pengirimannya ditulis sebagai linear programming, berapa banyak variabel keputusan dan kendala supply–demand-nya?",
  options: ["7 variabel dan 12 kendala", "12 variabel dan 12 kendala", "12 variabel dan 7 kendala", "4 variabel dan 3 kendala"],
  answer: 2,
  explain: "Setiap rute (pabrik i → gudang j) adalah satu variabel Xij, jadi ada 3 × 4 = 12 variabel. Kendalanya satu untuk setiap sumber (supply) dan satu untuk setiap tujuan (demand): 3 + 4 = 7. Karena strukturnya khusus, masalah transportasi bisa diselesaikan dengan tabel transportasi tanpa simplex.",
  why: ["Terbalik: variabel = m × n, kendala = m + n.", "Kendala tidak dibuat per rute, melainkan satu untuk setiap sumber dan setiap tujuan.", null, "Variabelnya per rute, bukan per gudang atau per pabrik."]
},
{
  id: "T3-02", topic: 3, level: "aplikasi", src: "latihan", lihat: "tp/khusus",
  papan: tabelData(U, "Biaya angkut (ribu rupiah per ton)"),
  q: "Tiga gudang beras punya stok 120, 90, dan 80 ton, sedangkan tiga pasar butuh 100, 70, dan 80 ton. Apa yang harus ditambahkan sebelum membuat solusi awal?",
  options: ["Kolom (tujuan) dummy dengan demand 40 ton dan biaya 0", "Baris (sumber) dummy dengan supply 40 ton dan biaya 0", "Kolom dummy dengan demand 290 ton dan biaya 0", "Tidak perlu apa-apa, cukup kurangi stok gudang terbesar"],
  answer: 0,
  explain: "Total supply 290 ton lebih besar dari total demand 250 ton. Kelebihan 40 ton ditampung oleh tujuan bayangan (kolom dummy) dengan biaya 0. Unit yang nanti masuk ke dummy berarti beras yang tidak dikirim dan tetap di gudang.",
  why: [null, "Baris dummy dipakai kalau demand lebih besar dari supply; di sini kebalikannya.", "Demand dummy = selisih supply dan demand (40), bukan total supply.", "Tabel harus seimbang dulu; dummy menyeimbangkan tanpa mengubah data asli."],
  cekNilai: { metode: "tp", data: U, opsi: { awal: "nwc", tanpaOptimasi: true }, path: "P.K.3.jumlah", format: "num", bolehSama: true }
},
{
  id: "T3-03", topic: 3, level: "kasus", src: "latihan", lihat: "tp/khusus",
  ctxTitle: "Solusi optimal",
  ctx: "Total demand empat toko lebih besar dari total supply dua pabrik, jadi ditambahkan baris dummy. Di solusi optimal tertulis: Dummy → Toko Lembang = 30 unit.",
  q: "Apa arti angka 30 itu?",
  options: ["Pabrik dummy benar-benar mengirim 30 unit ke Toko Lembang dengan biaya 0", "Permintaan Toko Lembang kurang 30 unit (tidak terpenuhi)", "Ada 30 unit kapasitas pabrik yang tidak terpakai", "Rute ke Toko Lembang terlarang sebanyak 30 unit"],
  answer: 1,
  explain: "Dummy hanya bayangan, jadi tidak ada barang yang benar-benar dikirim. Unit dari sumber dummy berarti permintaan tujuan itu tidak terpenuhi: Toko Lembang kekurangan 30 unit. Sebaliknya, unit yang masuk ke tujuan dummy berarti kapasitas sumber yang tidak terkirim.",
  why: ["Dummy tidak nyata; tidak ada pengiriman sungguhan.", null, "Itu arti unit di KOLOM dummy (tujuan dummy), bukan baris dummy.", "Rute terlarang ditandai M, tidak ada hubungannya dengan dummy."]
},
{
  id: "T3-04", topic: 3, level: "aplikasi", src: "slide", lihat: "tp/khusus",
  q: "Tabel transportasi berukuran 3 sumber × 4 tujuan (sudah termasuk dummy). Solusi awalnya hanya mengisi 5 sel. Apa kesimpulanmu?",
  options: ["Solusi sudah optimal karena sel terisi sedikit", "Tabel tidak seimbang, jadi perlu dummy lagi", "Normal, karena sel terisi seharusnya m × n − 1 = 11", "Degenerasi: seharusnya 3 + 4 − 1 = 6 sel, jadi tambahkan angka 0 di satu sel kosong"],
  answer: 3,
  explain: "Syarat stepping stone dan MODI: sel terisi = m + n − 1 = 3 + 4 − 1 = 6. Kalau kurang, terjadi degenerasi dan ada jalur tertutup yang tidak bisa dibuat. Atasi dengan menaruh angka 0 di sel kosong yang tidak membentuk jalur tertutup, lalu anggap sel itu terisi.",
  why: ["Jumlah sel terisi tidak menentukan optimal; optimal dicek dengan improvement index.", "Seimbang atau tidak dilihat dari total supply dan demand, bukan jumlah sel terisi.", "Rumusnya m + n − 1, bukan m × n − 1.", null]
},
{
  id: "T3-05", topic: 3, level: "konsep", src: "slide", lihat: "tp/nwc",
  q: "Mana yang benar tentang metode northwest corner (pokiapokaba)?",
  options: ["Mulai dari pojok kiri atas, isi sebanyak mungkin, lalu bergerak ke kanan atau ke bawah sampai pojok kanan bawah; biaya tidak diperhatikan", "Mulai dari sel dengan biaya termurah, lalu pindah ke sel termurah berikutnya", "Mulai dari baris atau kolom dengan pinalti terbesar", "Mulai dari pojok kanan bawah dan bergerak ke kiri atas"],
  answer: 0,
  explain: "Northwest corner berarti pojok kiri atas sampai pojok kanan bawah. Habiskan supply baris lalu turun, atau penuhi demand kolom lalu geser ke kanan. Karena biaya diabaikan, hasilnya cepat tapi biasanya belum optimal.",
  why: [null, "Itu ide metode least cost, bukan northwest corner.", "Pinalti adalah ciri metode VAM.", "Arahnya terbalik; pokiapokaba = pojok kiri atas ke pojok kanan bawah."]
},
{
  id: "T3-06", topic: 3, level: "aplikasi", src: "latihan", lihat: "tp/nwc",
  papan: papanAwal(A),
  q: "Tabel di atas berisi biaya kirim (ribu rupiah per unit), supply gudang, dan demand toko. Berapa total biaya solusi awal dengan metode northwest corner?",
  options: ["Rp1.470 ribu", "Rp1.480 ribu", "Rp1.740 ribu", "Rp1.660 ribu"],
  answer: 2,
  explain: "Northwest corner mengisi BD–DG 70, BD–BB 50, CM–BB 70, CM–LB 40, dan SM–LB 100. Biayanya 70×7 + 50×6 + 70×3 + 40×6 + 100×5 = 490 + 300 + 210 + 240 + 500 = 1.740. Ini biaya awal yang belum tentu optimal.",
  why: ["Itu biaya optimal setelah perbaikan, bukan solusi awal northwest corner.", "Itu biaya solusi awal VAM.", null, "Cek lagi alokasinya: isi dari pojok kiri atas tanpa melihat biaya, lalu kalikan unit dengan biaya tiap sel."],
  cekNilai: { metode: "tp", data: A, opsi: { awal: "nwc", tanpaOptimasi: true }, path: "biayaAwal.c", format: "val" }
},
{
  id: "T3-07", topic: 3, level: "konsep", src: "slide", lihat: "tp/stepping",
  q: "Saat membuat jalur tertutup stepping stone untuk sebuah sel kosong, aturan mana yang BENAR?",
  options: ["Jalur boleh berbelok di sel kosong mana saja asalkan kembali ke titik awal", "Mulai dengan tanda + di sel kosong, lalu − dan + bergantian; jalur hanya berbelok di sel terisi", "Tanda di semua sel jalur adalah +", "Jalur boleh bergerak diagonal supaya lebih pendek"],
  answer: 1,
  explain: "Sel kosong yang dievaluasi diberi tanda +, lalu tandanya bergantian −, +, − di setiap belokan. Belokan hanya boleh di sel terisi (jalur boleh melewati sel kosong tanpa berbelok), dan gerakannya horizontal atau vertikal. Jumlah sel di jalur selalu genap.",
  why: ["Belokan di sel kosong tidak sah; hanya sel terisi yang boleh jadi batu loncatan.", null, "Tanda harus bergantian supaya total supply dan demand tetap seimbang.", "Gerakan hanya boleh horizontal atau vertikal."]
},
{
  id: "T3-08", topic: 3, level: "aplikasi", src: "latihan", lihat: "tp/stepping",
  papan: papanSolusiAwal(A, "nwc"),
  q: "Di atas adalah solusi awal northwest corner (biaya ribu rupiah per unit di sudut sel). Berapa improvement index sel kosong BD–LB (Gudang Bandung → Toko Lembang)?",
  options: ["+5", "+19", "−3", "−5"],
  answer: 3,
  explain: "Jalurnya +BD–LB → −BD–BB → +CM–BB → −CM–LB. Index = +4 − 6 + 3 − 6 = −5. Karena negatif pada soal minimasi, mengirim lewat BD–LB menurunkan biaya Rp5 ribu per unit, jadi solusi belum optimal.",
  why: ["Tandanya terbalik: sel kosong yang dievaluasi selalu bertanda +.", "Semua biaya dijumlahkan tanpa tanda −; tandanya harus bergantian.", "Cek lagi jalurnya: belokan hanya di sel terisi BD–BB, CM–BB, dan CM–LB.", null],
  cekNilai: { metode: "tp", data: A, opsi: { awal: "nwc", evaluasi: "stepping" }, path: "iterasi.0.indeks.0,2", format: "raw" }
},
{
  id: "T3-09", topic: 3, level: "aplikasi", src: "latihan", lihat: "tp/stepping",
  papan: papanSolusiAwal(A, "nwc"),
  q: "Dari solusi awal di atas, sel BD–LB akan diisi lewat jalur +BD–LB, −BD–BB, +CM–BB, −CM–LB. Berapa unit yang dipindahkan?",
  options: ["40 unit", "50 unit", "70 unit", "100 unit"],
  answer: 0,
  explain: "Jumlah yang dipindah = nilai TERKECIL di sel bertanda −: min(BD–BB 50, CM–LB 40) = 40. Tambahkan 40 ke sel bertanda + dan kurangkan dari sel bertanda −, sehingga CM–LB menjadi kosong. Biaya turun 5 × 40 = Rp200 ribu.",
  why: [null, "50 memang di sel bertanda −, tapi bukan yang terkecil; memakai 50 membuat CM–LB negatif.", "70 ada di sel bertanda + (CM–BB); yang dilihat hanya sel bertanda −.", "Itu alokasi SM–LB yang tidak berada di jalur."],
  cekNilai: { metode: "tp", data: A, opsi: { awal: "nwc", evaluasi: "stepping" }, path: "iterasi.0.theta", format: "num" }
},
{
  id: "T3-10", topic: 3, level: "konsep", src: "slide", lihat: "tp/modi",
  q: "Mana urutan langkah metode MODI yang benar?",
  options: ["Tulis R + K = C untuk SEMUA sel, lalu tetapkan K1 = 0", "Tulis R + K = C untuk sel kosong saja, lalu hitung I = C + R + K", "Tetapkan R1 = 0, tulis R(i) + K(j) = C(ij) untuk sel TERISI, lalu hitung I(ij) = C(ij) − R(i) − K(j) untuk sel kosong", "Hitung improvement index dengan jalur tertutup untuk setiap sel, lalu rata-ratakan"],
  answer: 2,
  explain: "MODI memakai sel terisi untuk mencari R (baris) dan K (kolom), dimulai dari R1 = 0. Setelah semua R dan K diketahui, improvement index setiap sel kosong = C − R − K tanpa perlu menggambar jalur. Jalur tertutup baru dibuat untuk sel yang dipilih masuk.",
  why: ["Persamaan hanya untuk sel terisi, dan yang ditetapkan 0 adalah R1.", "Persamaan dibuat dari sel terisi, dan index = C − R − K (dikurangi, bukan ditambah).", null, "Itu cara stepping stone; MODI justru menghindari menggambar jalur untuk setiap sel."]
},
{
  id: "T3-11", topic: 3, level: "aplikasi", src: "latihan", lihat: "tp/modi",
  papan: papanSolusiAwal(A, "nwc"),
  q: "Gunakan MODI pada solusi awal di atas dengan R1 = 0. Berapa nilai K3 (kolom Toko Lembang)?",
  options: ["K3 = 6", "K3 = 9", "K3 = 3", "K3 = −4"],
  answer: 1,
  explain: "Dari sel terisi: R1 + K1 = 7 → K1 = 7; R1 + K2 = 6 → K2 = 6; R2 + K2 = 3 → R2 = −3; R2 + K3 = 6 → K3 = 6 − (−3) = 9. Lalu R3 + K3 = 5 → R3 = −4.",
  why: ["6 adalah biaya sel CM–LB; K3 = C − R2 = 6 − (−3).", null, "Tanda R2 tertukar: R2 = −3, jadi K3 = 6 + 3 = 9, bukan 6 − 3.", "−4 adalah nilai R3, bukan K3."],
  cekNilai: { metode: "tp", data: A, opsi: { awal: "nwc", evaluasi: "modi" }, path: "iterasi.0.K.2.c", format: "num" }
},
{
  id: "T3-12", topic: 3, level: "aplikasi", src: "latihan", lihat: "tp/modi",
  papan: papanSolusiAwal(A, "nwc"),
  q: "Pada solusi awal di atas, MODI menghasilkan R1 = 0, R2 = −3, R3 = −4, K1 = 7, K2 = 6, K3 = 9. Berapa improvement index sel SM–DG (biaya 7)?",
  options: ["−4", "+10", "+18", "+4"],
  answer: 3,
  explain: "I = C − R − K = 7 − (−4) − 7 = +4. Index positif berarti mengisi SM–DG justru menaikkan biaya Rp4 ribu per unit. Jadi sel ini tidak dipilih sebagai sel masuk.",
  why: ["Tanda R3 terlewat: 7 − (−4) = 11, bukan 3.", "Rumusnya C − R − K, bukan C + R + K.", "Semua angka dijumlahkan tanpa memperhatikan rumus dan tanda.", null],
  cekNilai: { metode: "tp", data: A, opsi: { awal: "nwc", evaluasi: "modi" }, path: "iterasi.0.indeks.2,0", format: "raw" }
},
{
  id: "T3-13", topic: 3, level: "aplikasi", src: "latihan", lihat: "tp/vam",
  papan: papanAwal(A),
  q: "Gunakan VAM (Vogel) pada tabel di atas. Sel mana yang diisi PERTAMA kali, dan berapa unitnya?",
  options: ["CM–BB sebanyak 110 unit", "BD–LB sebanyak 120 unit", "CM–BB sebanyak 120 unit", "BD–DG sebanyak 70 unit"],
  answer: 0,
  explain: "Pinalti = selisih dua biaya termurah: baris BD 2, CM 3, SM 2; kolom DG 0, BB 3, LB 1. Pinalti terbesar 3 ada di baris CM dan kolom BB, dan keduanya menunjuk sel termurah yang sama: CM–BB (biaya 3). Isi min(110, 120) = 110, lalu coret baris CM.",
  why: [null, "BD–LB memang murah (4), tapi baris BD hanya punya pinalti 2.", "Unitnya min(supply CM 110, demand BB 120) = 110, bukan 120.", "Itu langkah pertama northwest corner, bukan VAM."],
  cekNilai: { metode: "tp", data: A, opsi: { awal: "vam", tanpaOptimasi: true }, path: "awal.1.1", format: "num" }
},
{
  id: "T3-14", topic: 3, level: "aplikasi", src: "latihan", lihat: "tp/vam",
  papan: papanAwal(A),
  q: "Kalau solusi awal tabel di atas dibuat dengan VAM sampai selesai, berapa total biayanya?",
  options: ["Rp1.740 ribu", "Rp1.470 ribu", "Rp1.480 ribu", "Rp1.420 ribu"],
  answer: 2,
  explain: "VAM mengisi CM–BB 110, BD–LB 120, lalu sisa baris SM: SM–DG 70, SM–BB 10, SM–LB 20. Biayanya 110×3 + 120×4 + 70×7 + 10×8 + 20×5 = 1.480. Hasil ini jauh lebih dekat ke optimal (1.470) dibanding northwest corner (1.740), karena VAM memperhitungkan biaya.",
  why: ["Itu biaya awal northwest corner.", "Itu biaya optimal; solusi VAM di soal ini masih bisa diperbaiki sedikit (ada index −1).", null, "Cek lagi perkalian unit × biaya di setiap sel terisi."],
  cekNilai: { metode: "tp", data: A, opsi: { awal: "vam", tanpaOptimasi: true }, path: "biayaAwal.c", format: "val" }
},
{
  id: "T3-15", topic: 3, level: "konsep", src: "buku", lihat: "tp/khusus",
  q: "Saat iterasi stepping stone, dua sel bertanda − sama-sama punya nilai terkecil (misalnya keduanya 50). Setelah 50 unit dipindahkan, apa yang harus dilakukan?",
  options: ["Kosongkan kedua sel itu", "Kosongkan hanya satu sel; sel lainnya tetap diisi angka 0 dan dianggap terisi", "Batalkan iterasi dan pilih sel masuk yang lain", "Tambahkan baris dummy agar tabel seimbang"],
  answer: 1,
  explain: "Kalau dua sel sama-sama menjadi 0 lalu dikosongkan, sel terisi kurang dari m + n − 1 (degenerasi). Karena itu hanya satu yang dikosongkan, sedangkan yang lain diberi angka 0, biasanya sel dengan biaya terendah. Dengan begitu jalur tertutup tetap bisa dibuat di iterasi berikutnya.",
  why: ["Mengosongkan keduanya membuat sel terisi kurang dari m + n − 1 (degenerasi).", null, "Sel masuknya tetap benar; yang perlu diatur hanya sel yang keluar.", "Dummy dipakai saat supply ≠ demand, bukan untuk degenerasi."]
},
{
  id: "T3-16", topic: 3, level: "konsep", src: "slide", lihat: "tp/khusus",
  q: "Kapan solusi masalah transportasi MAKSIMASI profit dinyatakan optimal?",
  options: ["Saat semua improvement index ≥ 0", "Saat semua sel terisi", "Saat improvement index paling negatif sudah dipilih", "Saat semua improvement index ≤ 0 (tidak ada yang positif)"],
  answer: 3,
  explain: "Untuk maksimasi, index positif berarti profit masih bisa naik, jadi pilih index positif terbesar sebagai sel masuk. Solusinya optimal kalau semua index ≤ 0. Untuk minimasi kebalikannya: optimal kalau semua index ≥ 0, dan yang dipilih index paling negatif.",
  why: ["Itu syarat optimal untuk minimasi biaya.", "Jumlah sel terisi selalu m + n − 1 dan tidak menunjukkan optimal.", "Untuk maksimasi yang dipilih index positif terbesar, bukan paling negatif.", null]
},
{
  id: "T3-17", topic: 3, level: "kasus", src: "latihan", lihat: "tp/khusus",
  ctxTitle: "Rute ditutup",
  ctx: "Jalan dari Gudang Sumedang ke Toko Dago tertutup longsor, jadi rute SM–DG (biasanya biayanya 4) tidak boleh dipakai. Biaya rute lain (ribu rupiah per unit) ada di tabel.",
  papan: tabelData(Lr, "Biaya kirim (ribu rupiah per unit)"),
  q: "Berapa total biaya minimum setelah rute SM–DG ditutup?",
  options: ["Rp1.180 ribu", "Rp980 ribu", "Rp1.630 ribu", "Tidak bisa dihitung karena ada rute yang hilang"],
  answer: 0,
  explain: "Rute terlarang diberi biaya M (sangat besar) sehingga tidak akan dipakai, lalu soal dikerjakan seperti biasa. Hasil optimalnya BD–DG 100, BD–BB 10, CM–DG 20, CM–LB 70, SM–BB 50 dengan biaya 600 + 40 + 100 + 140 + 300 = 1.180. Penutupan jalan menaikkan biaya dari 980 menjadi 1.180.",
  why: [null, "Itu biaya optimal kalau rute SM–DG (biaya 4) masih boleh dipakai.", "Itu baru biaya solusi awal northwest corner; masih bisa diperbaiki.", "Rute terlarang tetap bisa dihitung dengan memberi biaya M."],
  cekNilai: { metode: "tp", data: Lr, opsi: { awal: "vam", evaluasi: "modi" }, path: "total.c", format: "val" }
},
{
  id: "T3-18", topic: 3, level: "aplikasi", src: "latihan", lihat: "tp/khusus",
  papan: tabelData(MX, "PROFIT (ribu rupiah per peti)"),
  q: "Tabel di atas berisi PROFIT (ribu rupiah per peti) mengirim sayur dari tiga kebun ke tiga pasar. Berapa total profit maksimum?",
  options: ["Rp2.460 ribu", "Rp1.780 ribu", "Rp2.700 ribu", "Rp2.940 ribu"],
  answer: 2,
  explain: "Untuk maksimasi, pilih sel dengan improvement index positif terbesar dan berhenti saat semua index ≤ 0. Solusi awal northwest corner (profit 2.460) diperbaiki satu kali lewat CW–CR (index +4, dipindah 60 peti). Hasilnya LB–CR 40, LB–GB 70, CW–CR 60, PG–GB 50, PG–KS 70 dengan profit 2.700.",
  why: ["Itu profit solusi awal northwest corner; masih ada index positif (+4).", "Itu hasil kalau soal keliru dikerjakan sebagai minimasi.", null, "Profit ini tidak bisa dicapai tanpa melanggar supply atau demand."],
  cekNilai: { metode: "tp", data: MX, opsi: { awal: "nwc", evaluasi: "stepping" }, path: "total.c", format: "val" }
},
{
  id: "T3-19", topic: 3, level: "kasus", src: "buku", lihat: "tp/khusus",
  ctxTitle: "Solusi optimal",
  ctx: "Solusi di bawah sudah optimal dengan biaya Rp1.140 ribu. Improvement index sel kosong: BD–LB = 0, CM–BB = +3, SM–DG = +4, SM–BB = +3.",
  papan: papanOptimal(G, { awal: "nwc", evaluasi: "stepping" }),
  q: "Apa arti improvement index 0 pada sel BD–LB?",
  options: ["Solusinya belum optimal, jadi BD–LB harus diisi", "Ada solusi optimal lain dengan biaya yang sama (Rp1.140 ribu) jika BD–LB diisi", "Rute BD–LB terlarang", "Terjadi degenerasi sehingga perlu angka 0"],
  answer: 1,
  explain: "Index 0 berarti mengisi BD–LB tidak menaikkan maupun menurunkan biaya. Jadi ada solusi optimal alternatif dengan total biaya yang sama. Ini memberi manajemen fleksibilitas memilih rute.",
  why: ["Untuk minimasi, solusi optimal kalau semua index ≥ 0; index 0 tidak membuatnya belum optimal.", null, "Rute terlarang ditandai M, bukan index 0.", "Degenerasi berkaitan dengan sel terisi yang kurang dari m + n − 1, bukan index 0."]
},
{
  id: "T3-20", topic: 3, level: "kasus", src: "buku", lihat: "tp/lainnya",
  ctxTitle: "Memilih lokasi pabrik baru",
  ctx: "PT Sinar Priangan punya Pabrik Bandung (150 unit) dan Pabrik Cimahi (100 unit). Permintaan Garut 120, Tasikmalaya 100, dan Cirebon 130 unit, jadi perlu pabrik baru berkapasitas 100 unit di Sumedang ATAU Subang.\nBiaya kirim (ribu rupiah per unit) ke Garut/Tasikmalaya/Cirebon: Bandung 3/6/7, Cimahi 5/7/9, Sumedang 6/5/4, Subang 9/8/2.",
  q: "Lokasi mana yang dipilih, dan berapa total biaya kirim seluruh sistem?",
  options: ["Sumedang, total Rp1.670 ribu", "Sumedang, karena rata-rata biaya kirimnya lebih kecil", "Subang, total Rp1.570 ribu", "Subang, total Rp1.470 ribu"],
  answer: 3,
  explain: "Buat dua tabel transportasi terpisah, satu dengan pabrik Sumedang dan satu dengan Subang, lalu selesaikan masing-masing sampai optimal. Sistem dengan Subang berbiaya 1.470, sedangkan dengan Sumedang 1.670, jadi pilih Subang. Rata-rata biaya per rute tidak cukup; yang menentukan adalah total biaya optimal seluruh sistem.",
  why: ["1.670 memang benar untuk sistem Sumedang, tapi lebih mahal dari sistem Subang.", "Rata-rata biaya per rute tidak memperhitungkan alokasi; bandingkan total biaya optimal tiap sistem.", "Cek lagi perhitungan sistem Subang: hasil optimalnya 1.470.", null],
  cekNilai: { metode: "tp", data: FS, opsi: { awal: "vam", evaluasi: "modi" }, path: "total.c", format: "val" }
}
  );
})();
