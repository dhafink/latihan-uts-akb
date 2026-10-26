// Latihan hitung Topik 3 — Transportasi (H3-01..H3-04). Semua kunci dicek ulang oleh cek_soal.js lewat "dari".
(function () {
  function src(nama, kode, n) { return { nama: nama, kode: kode, supply: n }; }
  function dst(nama, kode, n) { return { nama: nama, kode: kode, demand: n }; }
  // tabel data soal (tanpa dummy; rute terlarang ditandai ×)
  function tabelData(p, label) {
    var head = ["Dari \\ Ke"].concat(p.tujuan.map(function (t) { return t.kode; }), ["Supply"]);
    var rows = p.sumber.map(function (s, i) {
      return [{ v: s.kode + " · " + s.nama, k: "lab" }].concat(p.biaya[i].map(function (c) { return c === "M" ? { v: "× (ditutup)", k: "pink" } : { v: String(c) }; }), [{ v: String(s.supply) }]);
    });
    rows.push([{ v: "Demand", k: "lab" }].concat(p.tujuan.map(function (t) { return { v: String(t.demand) }; }), [{ v: "" }]));
    return [{ t: "tabel", head: head, rows: rows, catatan: label + " · " + p.tujuan.map(function (t) { return t.kode + " = " + t.nama; }).join(", ") }];
  }

  var KOPI = { sumber: [src("Roastery Dago", "DG", 100), src("Roastery Antapani", "AP", 150), src("Roastery Cimahi", "CM", 90)],
    tujuan: [dst("Kafe Riau", "RI", 70), dst("Kafe Braga", "BR", 140), dst("Kafe Setiabudi", "SB", 130)],
    biaya: [[2, 4, 5], [4, 8, 3], [5, 4, 7]], goal: "min", satuan: "" };
  var KAIN = { sumber: [src("Pabrik Rancaekek", "RE", 120), src("Pabrik Majalaya", "MJ", 130), src("Pabrik Padalarang", "PD", 90)],
    tujuan: [dst("Garut", "GR", 100), dst("Tasikmalaya", "TS", 70), dst("Cirebon", "CB", 80), dst("Sukabumi", "SK", 90)],
    biaya: [[8, 2, 5, 10], [2, 8, 12, 9], [3, 6, 3, 12]], goal: "min", satuan: "" };
  var BERAS = { sumber: [src("Gudang Gedebage", "GD", 60), src("Gudang Soreang", "SR", 70), src("Gudang Ujungberung", "UB", 110)],
    tujuan: [dst("Pasar Kosambi", "KS", 60), dst("Pasar Andir", "AN", 70), dst("Pasar Kiaracondong", "KC", 80)],
    biaya: [[5, 3, 6], [4, 8, 12], [10, 11, 2]], goal: "min", satuan: "" };
  var SUSU = { sumber: [src("Peternakan Lembang", "LB", 110), src("Peternakan Pangalengan", "PG", 90), src("Peternakan Ciwidey", "CW", 60)],
    tujuan: [dst("Bandung", "BD", 120), dst("Cimahi", "CM", 50), dst("Sumedang", "SM", 50), dst("Garut", "GR", 90)],
    biaya: [[13, 8, 13, 7], [12, 13, 5, 7], [4, 14, 11, "M"]], goal: "max", satuan: "" };

  window.HITUNG.push(
{
  id: "H3-01", topik: 3, modul: "tp/stepping",
  judul: "Kopi Seduh Priangan: northwest corner + stepping stone",
  ringkas: "Tabel seimbang 3 × 3. Solusi awal pojok kiri atas, lalu perbaiki sampai optimal.",
  cerita: "Kedai kopi \"Seduh Priangan\" mengirim biji kopi sangrai dari tiga roastery ke tiga kafe setiap minggu. Roastery Dago punya 100 karung, Antapani 150 karung, dan Cimahi 90 karung. Kafe Riau butuh 70 karung, Kafe Braga 140 karung, dan Kafe Setiabudi 130 karung.\nBiaya kirim (ribu rupiah per karung) ada di tabel. Buat solusi awal dengan metode northwest corner, lalu perbaiki dengan metode stepping stone sampai optimal.",
  papan: tabelData(KOPI, "Biaya kirim (ribu rupiah per karung)"),
  tanya: [
    { id: "a", teks: "Berapa total biaya solusi awal northwest corner? (ribu rupiah)", tipe: "angka", satuan: "ribu rupiah", kunci: 1890, kunciTeks: "Rp1.890 ribu", dari: { bagian: 0, path: "biayaAwal.c" } },
    { id: "b", teks: "Pada evaluasi pertama, berapa improvement index sel CM–BR (Cimahi → Kafe Braga)?", tipe: "pilih", opsi: ["−8", "−5", "+8", "−2"], kunci: "−8", kunciTeks: "−8 (jalur +CM–BR −CM–SB +AP–SB −AP–BR = 4 − 7 + 3 − 8)", dari: { bagian: 0, path: "iterasi.0.indeks.2,1" } },
    { id: "c", teks: "Berapa karung yang dipindahkan ke sel masuk pada iterasi pertama?", tipe: "angka", satuan: "karung", kunci: 90, kunciTeks: "90 karung (min dari sel bertanda −: CM–SB 90, AP–BR 110)", dari: { bagian: 0, path: "iterasi.0.theta" } },
    { id: "d", teks: "Berapa total biaya optimal? (ribu rupiah)", tipe: "angka", satuan: "ribu rupiah", kunci: 1130, kunciTeks: "Rp1.130 ribu", dari: { bagian: 0, path: "total.c" } },
    { id: "e", teks: "Pada solusi optimal, berapa karung dikirim dari Roastery Antapani ke Kafe Riau?", tipe: "angka", satuan: "karung", kunci: 20, kunciTeks: "20 karung", dari: { bagian: 0, path: "A.1.0" } }
  ],
  bagian: [{ judul: "Northwest corner lalu stepping stone", metode: "tp", data: KOPI, opsi: { awal: "nwc", evaluasi: "stepping" } }],
  poin: [
    "Mengecek total supply = total demand = 340 karung (seimbang, tidak perlu dummy).",
    "Northwest corner: DG–RI 70, DG–BR 30, AP–BR 110, AP–SB 40, CM–SB 90 dengan biaya 1.890.",
    "Mengecek sel terisi = m + n − 1 = 5.",
    "Menghitung improvement index keempat sel kosong dengan jalur tertutup yang hanya berbelok di sel terisi.",
    "Memilih index paling negatif (CM–BR, −8) dan memindahkan θ = 90.",
    "Menghitung ulang semua index setelah setiap pivot sampai semuanya ≥ 0.",
    "Menulis tabel alokasi akhir dan total biaya 1.130."
  ],
  jebakan: [
    "Sel masuk adalah index PALING negatif (−8), bukan index negatif pertama yang ditemukan.",
    "θ diambil dari sel bertanda − saja; nilai di sel bertanda + tidak dipakai.",
    "Setelah pivot, semua index harus dihitung ulang karena tabelnya sudah berubah."
  ]
},
{
  id: "H3-02", topik: 3, modul: "tp/modi",
  judul: "Distribusi kain: VAM + MODI",
  ringkas: "Tabel 3 × 4. Solusi awal Vogel, lalu uji dan perbaiki dengan MODI.",
  cerita: "Tiga pabrik kain di Kabupaten Bandung memasok toko grosir di empat kota. Kapasitas mingguan: Rancaekek 120 rol, Majalaya 130 rol, Padalarang 90 rol. Kebutuhan: Garut 100 rol, Tasikmalaya 70 rol, Cirebon 80 rol, Sukabumi 90 rol.\nBiaya kirim (ribu rupiah per rol) ada di tabel. Buat solusi awal dengan VAM (Vogel), lalu uji keoptimalannya dengan metode MODI.",
  papan: tabelData(KAIN, "Biaya kirim (ribu rupiah per rol)"),
  tanya: [
    { id: "a", teks: "Langkah pertama VAM mengisi satu sel. Berapa rol yang diisikan pada langkah itu?", tipe: "angka", satuan: "rol", kunci: 100, kunciTeks: "100 rol di MJ–GR (pinalti terbesar 6 di baris Majalaya; sel termurahnya MJ–GR)", dari: { bagian: 0, path: "awal.1.0" } },
    { id: "b", teks: "Berapa total biaya solusi awal VAM? (ribu rupiah)", tipe: "angka", satuan: "ribu rupiah", kunci: 1470, kunciTeks: "Rp1.470 ribu", dari: { bagian: 0, path: "biayaAwal.c" } },
    { id: "c", teks: "Dengan R1 = 0, berapa nilai R3 (baris Padalarang) pada evaluasi MODI pertama?", tipe: "angka", kunci: 2, kunciTeks: "R3 = 2 (dari PD–SK: R3 + K4 = 12, K4 = 10)", dari: { bagian: 0, path: "iterasi.0.R.2.c" } },
    { id: "d", teks: "Berapa improvement index sel PD–GR pada evaluasi MODI pertama?", tipe: "pilih", opsi: ["−2", "+2", "+5", "−5"], kunci: "−2", kunciTeks: "−2 (I = C − R − K = 3 − 2 − 3)", dari: { bagian: 0, path: "iterasi.0.indeks.2,0" } },
    { id: "e", teks: "Berapa total biaya optimal? (ribu rupiah)", tipe: "angka", satuan: "ribu rupiah", kunci: 1450, kunciTeks: "Rp1.450 ribu", dari: { bagian: 0, path: "total.c" } }
  ],
  bagian: [{ judul: "VAM lalu MODI", metode: "tp", data: KAIN, opsi: { awal: "vam", evaluasi: "modi" } }],
  poin: [
    "Mengecek total supply 340 = total demand 340 (seimbang).",
    "Menghitung pinalti setiap baris dan kolom (selisih dua biaya termurah) dan mengulanginya setelah setiap coretan.",
    "Mengisi sel termurah pada garis berpinalti terbesar, lalu mencoret baris/kolom yang habis.",
    "Solusi awal VAM berbiaya 1.470 dengan 6 sel terisi (m + n − 1).",
    "MODI: R1 = 0, lalu R + K = C hanya untuk sel terisi.",
    "Index sel kosong = C − R − K; PD–GR bernilai −2 sehingga masuk.",
    "Pivot θ = 10, biaya optimal 1.450, dan semua index akhir ≥ 0."
  ],
  jebakan: [
    "Pinalti dihitung ulang setiap kali ada baris atau kolom yang dicoret.",
    "Persamaan R + K = C hanya ditulis untuk sel TERISI, bukan semua sel.",
    "Perhatikan tanda R yang negatif: R2 = −1, sehingga K1 = 2 − (−1) = 3."
  ]
},
{
  id: "H3-03", topik: 3, modul: "tp/khusus",
  judul: "Beras Bulog: dummy dan degenerasi",
  ringkas: "Supply lebih besar dari demand, dan northwest corner mengalami degenerasi dua kali.",
  cerita: "Gudang beras di Gedebage menyimpan 60 ton, Soreang 70 ton, dan Ujungberung 110 ton. Minggu ini Pasar Kosambi butuh 60 ton, Pasar Andir 70 ton, dan Pasar Kiaracondong 80 ton.\nBiaya angkut per ton (ribu rupiah) ada di tabel. Selesaikan dengan northwest corner dan stepping stone. Perhatikan kalau supply dan demand habis bersamaan.",
  papan: tabelData(BERAS, "Biaya angkut (ribu rupiah per ton)"),
  tanya: [
    { id: "a", teks: "Total supply lebih besar dari total demand. Berapa ton kebutuhan tujuan (kolom) dummy yang perlu ditambahkan?", tipe: "angka", satuan: "ton", kunci: 30, kunciTeks: "30 ton (240 − 210), kolom dummy dengan biaya 0", dari: { bagian: 0, path: "P.K.3.jumlah" } },
    { id: "b", teks: "Berapa total biaya solusi awal northwest corner? (ribu rupiah)", tipe: "angka", satuan: "ribu rupiah", kunci: 1020, kunciTeks: "Rp1.020 ribu (60×5 + 70×8 + 80×2 + 30×0, dengan dua sel bernilai 0)", dari: { bagian: 0, path: "biayaAwal.c" } },
    { id: "c", teks: "Pada iterasi pertama, berapa ton yang dipindahkan ke sel masuk?", tipe: "angka", satuan: "ton", kunci: 0, kunciTeks: "0 ton — θ diambil dari sel SR–KC yang bernilai 0 (degenerasi), jadi tabel berubah tapi biaya tetap", dari: { bagian: 0, path: "iterasi.0.theta" } },
    { id: "d", teks: "Berapa total biaya optimal? (ribu rupiah)", tipe: "angka", satuan: "ribu rupiah", kunci: 660, kunciTeks: "Rp660 ribu", dari: { bagian: 0, path: "total.c" } },
    { id: "e", teks: "Berapa ton beras di Gudang Ujungberung yang tidak terkirim?", tipe: "angka", satuan: "ton", kunci: 30, kunciTeks: "30 ton (UB → dummy)", dari: { bagian: 0, path: "A.2.3" } }
  ],
  bagian: [{ judul: "Northwest corner (dengan dummy) lalu stepping stone", metode: "tp", data: BERAS, opsi: { awal: "nwc", evaluasi: "stepping" } }],
  poin: [
    "Total supply 240 > demand 210 → tambah kolom dummy 30 ton dengan biaya 0.",
    "NWC: GD–KS 60 menghabiskan supply GD dan demand KS sekaligus → taruh angka 0 di GD–AN.",
    "SR–AN 70 juga habis bersamaan → taruh angka 0 di SR–KC.",
    "Sel terisi (termasuk angka 0) = 3 + 4 − 1 = 6; biaya awal 1.020.",
    "Evaluasi pertama: SR–Dummy paling negatif (−10) dengan θ = 0 (pindahan dari sel bernilai 0).",
    "Evaluasi berikutnya: SR–KS (−6), θ = 60, biaya turun menjadi 660.",
    "Menjelaskan arti dummy: 30 ton beras di Ujungberung tidak dikirim."
  ],
  jebakan: [
    "Lupa menaruh angka 0 saat supply dan demand habis bersamaan, sehingga sel terisi kurang dari m + n − 1.",
    "θ boleh bernilai 0: tabel tetap berubah (angka 0 berpindah) walaupun biayanya sama.",
    "Unit di kolom dummy berarti kapasitas yang tidak terpakai, bukan pengiriman sungguhan."
  ]
},
{
  id: "H3-04", topik: 3, modul: "tp/khusus",
  judul: "Koperasi susu: maksimasi profit, rute ditutup, dan dummy",
  ringkas: "Soal gaya UTS: profit (maksimasi), satu rute terlarang, dan permintaan lebih besar dari pasokan.",
  cerita: "Koperasi susu mengirim susu segar dari Peternakan Lembang (110 drum), Pangalengan (90 drum), dan Ciwidey (60 drum) ke Bandung (120 drum), Cimahi (50 drum), Sumedang (50 drum), dan Garut (90 drum).\nTabel berisi PROFIT (ribu rupiah per drum). Jalan Ciwidey–Garut sedang diperbaiki, jadi rute itu tidak boleh dipakai. Koperasi ingin total profit sebesar mungkin. Buat solusi awal dengan VAM, lalu uji keoptimalannya dengan MODI.",
  papan: tabelData(SUSU, "PROFIT (ribu rupiah per drum)"),
  tanya: [
    { id: "a", teks: "Total demand lebih besar dari total supply. Berapa drum supply sumber (baris) dummy yang ditambahkan?", tipe: "angka", satuan: "drum", kunci: 50, kunciTeks: "50 drum (310 − 260), baris dummy dengan profit 0", dari: { bagian: 0, path: "P.R.3.jumlah" } },
    { id: "b", teks: "Berapa total profit solusi awal VAM? (ribu rupiah)", tipe: "angka", satuan: "ribu rupiah", kunci: 3120, kunciTeks: "Rp3.120 ribu", dari: { bagian: 0, path: "biayaAwal.c" } },
    { id: "c", teks: "Pada evaluasi MODI, berapa improvement index sel LB–GR (Lembang → Garut)?", tipe: "pilih", opsi: ["−1", "+1", "−7", "+7"], kunci: "−1", kunciTeks: "−1 (I = 7 − R1 − K4 = 7 − 0 − 8). Semua index ≤ 0, jadi solusi VAM sudah optimal untuk maksimasi.", dari: { bagian: 0, path: "iterasi.0.indeks.0,3" } },
    { id: "d", teks: "Pada solusi optimal, berapa drum dikirim dari Pangalengan ke Garut?", tipe: "angka", satuan: "drum", kunci: 40, kunciTeks: "40 drum", dari: { bagian: 0, path: "A.1.3" } },
    { id: "e", teks: "Berapa drum permintaan Garut yang tidak terpenuhi?", tipe: "angka", satuan: "drum", kunci: 50, kunciTeks: "50 drum (dari baris dummy ke Garut)", dari: { bagian: 0, path: "A.3.3" } }
  ],
  bagian: [{ judul: "VAM (maksimasi) lalu MODI", metode: "tp", data: SUSU, opsi: { awal: "vam", evaluasi: "modi" } }],
  poin: [
    "Supply 260 < demand 310 → tambah baris dummy 50 drum dengan profit 0.",
    "Rute Ciwidey–Garut ditulis −M (profit sangat buruk) karena ini soal maksimasi.",
    "VAM versi maksimasi: pinalti = selisih profit terbesar dan kedua terbesar; isi sel dengan profit terbesar.",
    "Solusi awal VAM: LB–BD 70, LB–SM 40, PG–BD 50, PG–GR 40, CW–CM 50, CW–SM 10, Dummy–GR 50; profit 3.120.",
    "Sel terisi = 4 + 4 − 1 = 7.",
    "MODI: R1 = 0, R + K = C pada sel terisi, lalu I = C − R − K untuk sel kosong.",
    "Semua index ≤ 0 → sudah optimal (aturan maksimasi), profit maksimum 3.120.",
    "Interpretasi: Garut kekurangan 50 drum."
  ],
  jebakan: [
    "Untuk maksimasi, rute terlarang diberi −M, bukan M.",
    "Syarat optimal maksimasi kebalikan minimasi: semua index harus ≤ 0.",
    "Unit dari baris dummy berarti permintaan yang tidak terpenuhi, bukan pengiriman sungguhan."
  ]
}
  );
})();
