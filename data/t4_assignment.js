// Kuis Topik 4 — Assignment (metode Hungarian). 20 soal, ID T4-01..T4-20.
// Semua angka hitungan berasal dari solver.js; soal bertanda cekNilai dihitung ulang oleh cek_soal.js.
(function () {
  var S = window.SOLVER;
  function tab(sudut, kolom, baris, nilai) {
    return { t: "tabel", head: [sudut].concat(kolom), rows: baris.map(function (b, i) {
      return [{ v: b, k: "lab" }].concat(nilai[i].map(function (x) { return { v: String(x) }; }));
    }) };
  }
  // ambil blok tabel penugasan dari langkah solver (kunci langkah ke-n), buang properti tertentu
  function blok(data, kunci, n, buang) {
    var st = S.ASG.selesaikan(data).steps.filter(function (s) { return s.kunci === kunci; })[n || 0];
    var b = JSON.parse(JSON.stringify(st.papan[0]));
    (buang || []).forEach(function (k) { delete b[k]; });
    return b;
  }

  var DESAIN = { baris: ["Raka", "Sinta", "Bima"], kolom: ["Poster", "Video", "Caption"], nilai: [[14, 9, 12], [11, 10, 15], [13, 8, 9]],
    goal: "min", satuan: "menit", labelBaris: "Mahasiswa", labelKolom: "Tugas" };
  var KURIR = { baris: ["Nadia", "Fajar", "Gilang", "Hana"], kolom: ["Dago", "Cihampelas", "Setiabudi", "Buah Batu"],
    nilai: [[13, 10, 18, 11], [10, 13, 18, 12], [8, 13, 9, 20], [11, 15, 15, 19]], goal: "min", satuan: "menit", labelBaris: "Kurir", labelKolom: "Area" };
  var KOREKSI = { baris: ["Ayu", "Bagas", "Citra", "Dimas"], kolom: ["Kelas A", "Kelas B", "Kelas C", "Kelas D"],
    nilai: [[13, 9, 18, 10], [9, 19, 15, 16], [20, 11, 14, 13], [16, 16, 11, 10]], goal: "min", satuan: "jam", labelBaris: "Asisten", labelKolom: "Kelas" };
  var BOOTH = { baris: ["Eka", "Feri", "Gita", "Hadi"], kolom: ["Booth 1", "Booth 2", "Booth 3", "Booth 4"],
    nilai: [[26, 50, 29, 26], [41, 22, 44, 27], [30, 33, 47, 42], [33, 45, 32, 37]], goal: "max", satuan: "unit", labelBaris: "SPG", labelKolom: "Booth" };
  var RUTE = { baris: ["Indra", "Joko", "Kiki", "Lala"], kolom: ["Rute 1", "Rute 2", "Rute 3", "Rute 4"],
    nilai: [[28, 22, 26, 30], [27, 25, 29, 21], [24, 28, "M", 27], [19, 30, 25, 26]], goal: "min", satuan: "menit", labelBaris: "Kurir", labelKolom: "Rute" };
  var TOKO = { baris: ["Maya", "Niko", "Oki"], kolom: ["Kasir", "Gudang", "Display"], nilai: [[5, 5, 7], [5, 5, 8], [6, 7, 4]],
    goal: "min", satuan: "jam", labelBaris: "Karyawan", labelKolom: "Posisi" };
  var MESIN = [[24, 20, 22, 18], [19, 25, 23, 21], [22, 18, 20, 26], [23, 21, 17, 20]];
  var MESIN5 = { baris: ["Teknisi 1", "Teknisi 2", "Teknisi 3", "Teknisi 4"], kolom: ["Mesin A", "Mesin B", "Mesin C", "Mesin D"],
    nilai: MESIN.map(function (r) { return r.map(function (x) { return x + 5; }); }), goal: "min", satuan: "jam" };
  var SALES = { baris: ["Rani", "Sandi", "Tio"], kolom: ["Pasteur", "Antapani", "Ujungberung", "Cimahi"],
    nilai: [[30, 45, 52, 38], [42, 35, 40, 47], [48, 40, 33, 55]], goal: "min", satuan: "menit", labelBaris: "Sales", labelKolom: "Toko" };
  var RELAWAN = { baris: ["Rizky", "Salsa", "Tegar", "Ulfa", "Vino"], kolom: ["Alun-alun", "Taman Lansia", "Babakan Siliwangi", "CFD Dago"],
    nilai: [[46, 38, 41, 50], [44, 49, 36, 42], [39, 45, 47, 40], ["M", 43, 44, 48], [42, 37, 45, 46]], goal: "max", satuan: "kg", labelBaris: "Relawan", labelKolom: "Titik" };

  window.QUESTIONS.push(
  {
    id: "T4-01", topic: 4, level: "konsep", src: "buku", lihat: "asg/konsep",
    q: "Masalah assignment bisa dianggap sebagai masalah transportasi yang istimewa. Apa yang membuatnya istimewa?",
    options: [
      "Biaya di setiap rute harus sama",
      "Supply setiap sumber dan demand setiap tujuan sama-sama bernilai 1",
      "Hanya ada batasan supply, tanpa batasan demand",
      "Jumlah baris dan kolom boleh berbeda tanpa perlu dummy"],
    answer: 1,
    explain: "Satu orang hanya mengerjakan satu tugas dan satu tugas hanya butuh satu orang, jadi setiap supply dan demand bernilai 1. Karena itu assignment bisa ditulis sebagai transportasi atau LP dengan variabel 0/1. Dalam praktik lebih mudah diselesaikan dengan metode Hungarian, karena stepping stone akan sangat degenerasi.",
    why: [
      "Biayanya boleh berbeda-beda; justru total biaya itulah yang ingin diminimalkan.",
      null,
      "Assignment punya batasan di dua sisi: setiap orang satu tugas dan setiap tugas satu orang.",
      "Tabel harus persegi; kalau jumlahnya berbeda, tambahkan baris atau kolom dummy."]
  },
  {
    id: "T4-02", topic: 4, level: "aplikasi", src: "buku", lihat: "asg/konsep",
    q: "Ada 5 asisten dan 5 kelas praktikum. Kalau semua kemungkinan penugasan dicoba satu per satu (enumerasi), ada berapa susunan?",
    options: ["25 susunan", "10 susunan", "120 susunan", "3.125 susunan"],
    answer: 2,
    explain: "Asisten pertama punya 5 pilihan kelas, asisten kedua 4, lalu 3, 2, dan 1, jadi totalnya 5! = 5 × 4 × 3 × 2 × 1 = 120 susunan. Untuk 8 orang sudah ada 40.320 susunan. Karena itu dipakai metode Hungarian yang tidak perlu membandingkan semua susunan.",
    why: [
      "25 = 5 × 5 adalah banyaknya sel di tabel, bukan banyaknya susunan penugasan.",
      "10 adalah banyaknya cara memilih dua dari lima (kombinasi), bukan susunan penugasan.",
      null,
      "5⁵ menganggap satu kelas boleh dipegang beberapa asisten sekaligus, padahal tidak boleh."]
  },
  {
    id: "T4-03", topic: 4, level: "aplikasi", src: "slide", lihat: "asg/hungarian",
    papan: [tab("Mahasiswa \\ Tugas", DESAIN.kolom, DESAIN.baris, DESAIN.nilai)],
    q: "Tabel berisi waktu (menit) setiap mahasiswa menyelesaikan setiap tugas desain. Setelah reduksi baris, berapa isi baris Sinta?",
    options: ["1, 0, 5", "0, 2, 6", "4, 5, 0", "2, 1, 6"],
    answer: 0,
    explain: "Reduksi baris: cari nilai terkecil di baris Sinta, yaitu 10, lalu kurangkan dari semua nilai di baris itu. Hasilnya 11 − 10 = 1, 10 − 10 = 0, dan 15 − 10 = 5. Setelah reduksi baris, setiap baris pasti punya minimal satu angka 0.",
    why: [
      null,
      "Ini hasil mengurangkan nilai terkecil setiap kolom (reduksi kolom), padahal yang diminta reduksi baris.",
      "Ini hasil mengurangkan dari nilai terbesar; itu langkah konversi maksimasi, bukan reduksi baris.",
      "Yang dikurangkan harus nilai terkecil di baris Sinta sendiri (10), bukan nilai dari baris lain."]
  },
  {
    id: "T4-04", topic: 4, level: "aplikasi", src: "slide", lihat: "asg/hungarian",
    papan: [blok(DESAIN, "reduksi-baris")],
    q: "Ini tabel waktu tugas desain setelah reduksi baris. Setelah reduksi kolom, berapa isi baris Bima?",
    options: ["5, 0, 1", "4, 0, 1", "5, 0, 0", "4, 0, 0"],
    answer: 3,
    explain: "Nilai terkecil setiap kolom hasil reduksi baris adalah 1 (Poster), 0 (Video), dan 1 (Caption). Kurangkan dari setiap kolom: baris Bima menjadi 5 − 1 = 4, 0 − 0 = 0, dan 1 − 1 = 0. Kolom Video tidak berubah karena nilai terkecilnya sudah 0.",
    why: [
      "Ini isi baris Bima sebelum reduksi kolom; kolom Poster dan Caption masih harus dikurangi 1.",
      "Kolom Caption juga harus dikurangi 1 karena nilai terkecilnya 1.",
      "Kolom Poster juga harus dikurangi 1 karena nilai terkecilnya 1.",
      null]
  },
  {
    id: "T4-05", topic: 4, level: "aplikasi", src: "slide", lihat: "asg/hungarian",
    papan: [blok(KURIR, "tes-garis", 0)],
    q: "Semua angka 0 di tabel opportunity cost 4 × 4 ini bisa ditutup dengan 3 garis seperti di papan. Apa kesimpulannya?",
    options: [
      "Sudah optimal, karena setiap baris punya angka 0",
      "Belum optimal: 3 garis < 4 baris, jadi tabel harus direvisi",
      "Sudah optimal, karena jumlah garisnya lebih dari 2",
      "Perlu ditambah baris dummy supaya garisnya menjadi 4"],
    answer: 1,
    explain: "Penempatan optimal baru bisa dibuat kalau jumlah garis minimum sama dengan jumlah baris (atau kolom). Di sini hanya perlu 3 garis untuk tabel 4 × 4, jadi belum ada empat angka 0 yang bisa dipilih tanpa bentrok. Langkah berikutnya adalah merevisi tabel.",
    why: [
      "Punya angka 0 di setiap baris belum cukup, karena nol-nol itu bisa bertumpuk di kolom yang sama.",
      null,
      "Syaratnya jumlah garis sama dengan jumlah baris, bukan sekadar lebih dari 2.",
      "Dummy hanya untuk tabel yang tidak persegi, sedangkan tabel ini sudah 4 × 4."]
  },
  {
    id: "T4-06", topic: 4, level: "aplikasi", src: "slide", lihat: "asg/hungarian",
    papan: [blok(KURIR, "tes-garis", 0)],
    q: "Di tabel opportunity cost pada papan, nilai terkecil yang tidak tertutup garis adalah 1. Setelah revisi, berapa nilai sel Gilang–Dago (tertutup garis baris dan garis kolom)?",
    options: [
      "1, karena sel di perpotongan dua garis ditambah 1",
      "0, karena sel yang tertutup garis tidak berubah",
      "−1, karena semua sel dikurangi 1",
      "2, karena tertutup dua garis jadi ditambah dua kali"],
    answer: 0,
    explain: "Aturan revisi: kurangkan nilai terkecil yang tidak tertutup (1) dari semua sel yang TIDAK tertutup garis, lalu tambahkan 1 ke sel di PERPOTONGAN dua garis. Gilang–Dago ada di perpotongan garis baris Gilang dan garis kolom Dago, jadi 0 + 1 = 1. Sel yang hanya tertutup satu garis tidak berubah.",
    why: [
      null,
      "Itu berlaku untuk sel yang tertutup SATU garis; sel perpotongan justru ditambah.",
      "Pengurangan hanya untuk sel yang tidak tertutup garis sama sekali.",
      "Sel perpotongan hanya ditambah sekali sebesar nilai terkecil, yaitu +1."]
  },
  {
    id: "T4-07", topic: 4, level: "aplikasi", src: "slide", lihat: "asg/hungarian",
    papan: [blok(KURIR, "revisi", 0, ["sorot"])],
    q: "Ini tabel opportunity cost kurir setelah revisi, dan sudah optimal. Penempatan mana yang aman dibuat PERTAMA?",
    options: ["Fajar → Dago", "Nadia → Buah Batu", "Gilang → Setiabudi", "Hana → Buah Batu"],
    answer: 2,
    explain: "Mulailah dari baris atau kolom yang hanya punya satu angka 0. Baris Gilang hanya punya satu 0 (Setiabudi), jadi Gilang pasti ke Setiabudi. Setelah itu Hana → Dago, Fajar → Buah Batu, dan Nadia → Cihampelas.",
    why: [
      "Kalau Fajar mengambil Dago, Hana tidak punya angka 0 lagi karena satu-satunya nol Hana ada di Dago.",
      "Kalau Nadia mengambil Buah Batu, Fajar terpaksa ke Dago dan Hana tidak kebagian angka 0.",
      null,
      "Sel Hana–Buah Batu bernilai 6, bukan 0, jadi bukan penempatan optimal."]
  },
  {
    id: "T4-08", topic: 4, level: "aplikasi", src: "latihan", lihat: "asg/hungarian",
    papan: [tab("Mahasiswa \\ Tugas", DESAIN.kolom, DESAIN.baris, DESAIN.nilai)],
    q: "Dari tabel waktu (menit) ini, berapa total waktu minimum kalau setiap mahasiswa mendapat satu tugas?",
    options: ["27 menit", "0 menit", "31 menit", "29 menit"],
    answer: 3,
    cekNilai: { metode: "asg", data: DESAIN, path: "total", format: "val", satuan: "menit" },
    explain: "Penempatan optimalnya Raka → Video (9), Sinta → Poster (11), dan Bima → Caption (9). Total diambil dari tabel AWAL: 9 + 11 + 9 = 29 menit. Angka 0 di tabel opportunity cost hanya menunjukkan sel yang dipilih, bukan nilainya.",
    why: [
      "27 hanya jumlah pengurang reduksi baris (9 + 10 + 8); pengurang reduksi kolom (1 + 1) belum ikut.",
      "Nilai 0 adalah opportunity cost; total harus dihitung dari nilai asli di tabel awal.",
      "31 adalah susunan lain (Raka → Caption, Sinta → Poster, Bima → Video) yang lebih lama.",
      null]
  },
  {
    id: "T4-09", topic: 4, level: "aplikasi", src: "latihan", lihat: "asg/hungarian",
    papan: [tab("Asisten \\ Kelas", KOREKSI.kolom, KOREKSI.baris, KOREKSI.nilai)],
    q: "Empat asisten akan mengoreksi ujian empat kelas. Tabel berisi waktu koreksi (jam). Berapa total waktu koreksi minimum?",
    options: ["41 jam", "39 jam", "40 jam", "42 jam"],
    answer: 0,
    cekNilai: { metode: "asg", data: KOREKSI, path: "total", format: "val", satuan: "jam" },
    explain: "Setelah reduksi baris dan kolom, angka 0 baru tertutup 3 garis, jadi perlu satu revisi dengan nilai terkecil tak tertutup = 1. Penempatan optimalnya Ayu → Kelas D (10), Bagas → Kelas A (9), Citra → Kelas B (11), dan Dimas → Kelas C (11). Totalnya 41 jam.",
    why: [
      null,
      "39 hanya jumlah nilai terkecil setiap baris; Ayu dan Citra sama-sama tercepat di Kelas B sehingga bentrok.",
      "40 adalah jumlah pengurang sebelum revisi, padahal tes garis saat itu baru 3 garis.",
      "42 adalah susunan lain (Ayu → Kelas B, Bagas → Kelas A, Citra → Kelas D, Dimas → Kelas C) yang tidak optimal."]
  },
  {
    id: "T4-10", topic: 4, level: "kasus", src: "latihan", lihat: "asg/khusus",
    ctxTitle: "Studio desain di Jalan Riau",
    ctx: "Studio ini punya 5 desainer (Raf, Sasa, Tara, Umar, Vera), tetapi hanya ada 4 proyek. Tabel biaya dilengkapi kolom dummy, lalu dikerjakan dengan metode Hungarian. Hasilnya, Umar jatuh ke kolom dummy.",
    q: "Apa arti Umar ditempatkan di kolom dummy?",
    options: [
      "Umar mengerjakan dua proyek sekaligus",
      "Umar tidak mendapat proyek pada penugasan ini",
      "Hasilnya tidak layak dan harus dihitung ulang",
      "Proyek dummy harus dicarikan pengerja dari luar studio"],
    answer: 1,
    explain: "Kolom dummy adalah proyek bayangan bernilai 0 yang dipakai agar tabel menjadi persegi. Desainer yang jatuh ke dummy berarti tidak mendapat proyek nyata. Total biaya tetap dihitung dari empat penempatan yang nyata saja.",
    why: [
      "Dalam assignment setiap orang hanya mendapat satu kolom, termasuk kolom dummy.",
      null,
      "Penempatan ke dummy adalah hal yang wajar pada tabel yang tidak seimbang.",
      "Dummy tidak nyata, jadi tidak ada pekerjaan yang perlu dicarikan orang."]
  },
  {
    id: "T4-11", topic: 4, level: "konsep", src: "slide", lihat: "asg/khusus",
    q: "Saat menambahkan baris atau kolom dummy pada tabel assignment, sel-sel dummy diisi nilai berapa?",
    options: [
      "M, supaya dummy tidak terpilih",
      "Nilai terbesar di tabel",
      "Rata-rata nilai di barisnya",
      "0, karena dummy tidak benar-benar ada"],
    answer: 3,
    explain: "Dummy hanya pelengkap agar jumlah baris sama dengan jumlah kolom. Karena tidak nyata, tidak ada biaya, waktu, atau profit di sana, jadi nilainya 0. Nilai M dipakai untuk penempatan yang dilarang, bukan untuk dummy.",
    why: [
      "M dipakai untuk penempatan terlarang; kalau semua sel dummy diberi M, tabelnya malah tidak bisa diselesaikan.",
      "Nilai terbesar dipakai saat mengubah maksimasi menjadi opportunity cost, bukan untuk mengisi dummy.",
      "Dummy tidak punya data apa pun, jadi tidak diisi rata-rata.",
      null]
  },
  {
    id: "T4-12", topic: 4, level: "aplikasi", src: "slide", lihat: "asg/khusus",
    papan: [tab("SPG \\ Booth", ["Booth 1", "Booth 2", "Booth 3"], ["Rani", "Sandi", "Tari"], [[72, 78, 90], [96, 85, 70], [88, 81, 79]])],
    q: "Tabel berisi penjualan (unit) yang ingin DIMAKSIMALKAN. Nilai terbesar di tabel adalah 96. Setelah diubah menjadi tabel opportunity cost, berapa nilai sel Rani–Booth 2?",
    options: ["78 (tidak berubah)", "−18", "18", "96"],
    answer: 2,
    explain: "Untuk maksimasi, setiap sel diubah menjadi nilai terbesar di tabel dikurangi nilai sel: 96 − 78 = 18. Artinya Rani di Booth 2 tertinggal 18 unit dari hasil terbaik di tabel. Setelah semua sel diubah, langkah Hungarian dijalankan seperti minimasi.",
    why: [
      "Tabel profit harus dikonversi dulu; tanpa konversi, Hungarian malah mencari penjualan terkecil.",
      "Urutan pengurangannya terbalik; yang benar nilai terbesar − nilai sel, sehingga hasilnya tidak negatif.",
      null,
      "96 adalah nilai terbesar di tabel, bukan hasil konversi sel Rani–Booth 2."]
  },
  {
    id: "T4-13", topic: 4, level: "aplikasi", src: "latihan", lihat: "asg/khusus",
    papan: [tab("SPG \\ Booth", BOOTH.kolom, BOOTH.baris, BOOTH.nilai)],
    q: "Tabel berisi penjualan harian (unit) setiap SPG di setiap booth. Berapa total penjualan MAKSIMUM kalau setiap SPG menjaga tepat satu booth?",
    options: ["186 unit", "175 unit", "110 unit", "25 unit"],
    answer: 1,
    cekNilai: { metode: "asg", data: BOOTH, path: "total", format: "val", satuan: "unit" },
    explain: "Ubah dulu ke opportunity cost (50 − nilai sel), lalu kerjakan Hungarian seperti biasa. Penempatan optimalnya Eka → Booth 2 (50), Feri → Booth 1 (41), Gita → Booth 3 (47), dan Hadi → Booth 4 (37), totalnya 175 unit. Nilai terbesar setiap baris tidak bisa diambil semua karena bentrok di booth yang sama.",
    why: [
      "186 adalah jumlah nilai terbesar setiap baris; Eka dan Hadi bentrok di Booth 2, Feri dan Gita bentrok di Booth 3.",
      null,
      "110 adalah hasil kalau tabel dikerjakan sebagai minimasi tanpa konversi.",
      "25 adalah jumlah opportunity cost sel terpilih; total harus dihitung dari tabel penjualan asli."]
  },
  {
    id: "T4-14", topic: 4, level: "konsep", src: "slide", lihat: "asg/khusus",
    q: "Pada soal MAKSIMASI, seorang karyawan tidak boleh ditempatkan di cabang tertentu. Bagaimana cara menandai sel itu?",
    options: [
      "Beri −M di tabel profit (setelah dikonversi menjadi M), supaya tidak pernah terpilih",
      "Beri 0 karena tidak menghasilkan apa-apa",
      "Beri +M di tabel profit supaya diperhatikan",
      "Hapus baris karyawan itu dari tabel"],
    answer: 0,
    explain: "Penempatan terlarang harus dibuat sangat tidak menarik. Di tabel profit, sel itu diberi −M (profit sangat buruk); setelah dikonversi ke opportunity cost, sel itu menjadi M (biaya peluang sangat besar). Akibatnya sel itu tidak pernah menjadi 0 dan tidak akan terpilih.",
    why: [
      null,
      "Nilai 0 masih bisa terpilih, terutama kalau ada dummy atau nilai kecil lain di tabel.",
      "+M di tabel profit justru membuat sel itu paling menarik sehingga pasti dipilih.",
      "Karyawan itu tetap boleh ditempatkan di cabang lain, jadi barisnya tidak boleh dihapus."]
  },
  {
    id: "T4-15", topic: 4, level: "aplikasi", src: "soal-dosen", lihat: "asg/khusus",
    ctxTitle: "Larangan",
    ctx: "Kiki sebenarnya paling cepat di Rute 3 (20 menit), tetapi tidak boleh mengambil rute itu karena motornya tidak kuat melewati tanjakan. Di tabel, sel Kiki–Rute 3 ditulis M.",
    papan: [tab("Kurir \\ Rute", RUTE.kolom, RUTE.baris, RUTE.nilai)],
    q: "Tabel berisi waktu tempuh (menit). Berapa total waktu tempuh minimum dengan memperhatikan larangan tersebut?",
    options: ["82 menit", "94 menit", "92 menit", "Tidak bisa dihitung karena ada sel M"],
    answer: 2,
    cekNilai: { metode: "asg", data: RUTE, path: "total", format: "val", satuan: "menit" },
    explain: "Sel terlarang diberi M agar tidak pernah terpilih, lalu Hungarian dikerjakan seperti biasa (di sini perlu satu revisi dengan nilai terkecil 2). Penempatan optimalnya Indra → Rute 2 (22), Joko → Rute 4 (21), Kiki → Rute 1 (24), dan Lala → Rute 3 (25). Totalnya 92 menit.",
    why: [
      "82 menit didapat kalau larangan diabaikan dan Kiki tetap mengambil Rute 3.",
      "94 menit adalah susunan lain (Indra → Rute 3, Joko → Rute 4, Kiki → Rute 2, Lala → Rute 1) yang lebih lama.",
      null,
      "Sel M tetap bisa dikerjakan; M hanya membuat sel itu tidak pernah terpilih."]
  },
  {
    id: "T4-16", topic: 4, level: "kasus", src: "latihan", lihat: "asg/khusus",
    ctxTitle: "Minimarket di Sukajadi",
    ctx: "Tiga karyawan (Maya, Niko, Oki) dibagi ke posisi Kasir, Gudang, dan Display. Waktu pelatihan (jam): Maya 5 / 5 / 7, Niko 5 / 5 / 8, Oki 6 / 7 / 4. Di penempatan akhir, Oki hanya punya satu 0 (Display), sedangkan baris Maya dan Niko sama-sama punya angka 0 di Kasir dan Gudang.",
    papan: [blok(TOKO, "tes-garis", 0, ["garisR", "garisK"])],
    q: "Apa kesimpulan dari kondisi ini?",
    options: [
      "Solusinya belum optimal, jadi tabel harus direvisi lagi",
      "Maya dan Niko harus diberi kolom dummy",
      "Total penempatan kedua pasti lebih besar, jadi hanya satu yang benar",
      "Ada dua solusi optimal dengan total yang sama, yaitu 14 jam"],
    answer: 3,
    cekNilai: { metode: "asg", data: TOKO, path: "total", format: "val", satuan: "jam" },
    explain: "Kalau tidak ada lagi baris atau kolom yang hanya punya satu 0, kita bebas memilih salah satu nol, dan itu tanda ada lebih dari satu solusi optimal. Oki → Display (4), lalu Maya → Kasir dan Niko → Gudang, atau Maya → Gudang dan Niko → Kasir; keduanya 5 + 5 + 4 = 14 jam. Manajer bebas memilih salah satu.",
    why: [
      "Jumlah garis sudah 3, sama dengan jumlah baris, jadi tabel sudah optimal.",
      "Tabelnya sudah 3 × 3 (persegi), jadi tidak perlu dummy.",
      "Kedua susunan sama-sama memakai sel bernilai 0 di tabel opportunity cost, jadi totalnya sama.",
      null]
  },
  {
    id: "T4-17", topic: 4, level: "kasus", src: "buku", lihat: "asg/hungarian",
    ctxTitle: "Lembur teknisi pabrik",
    ctx: "Penugasan 4 teknisi ke 4 mesin sudah diselesaikan dengan Hungarian: total waktu minimum 72 jam. Ternyata setiap angka di tabel kurang 5 jam karena ada waktu persiapan tambahan yang sama untuk semua pasangan.",
    q: "Apa yang terjadi dengan penempatan dan totalnya setelah setiap sel ditambah 5 jam?",
    options: [
      "Penempatannya sama; total menjadi 92 jam",
      "Penempatannya berubah, jadi semua langkah harus diulang",
      "Penempatannya sama; total tetap 72 jam",
      "Penempatannya sama; total menjadi 77 jam"],
    answer: 0,
    cekNilai: { metode: "asg", data: MESIN5, path: "total", format: "val", satuan: "jam" },
    explain: "Menambahkan angka yang sama ke semua sel tidak mengubah selisih antarsel, jadi tabel opportunity cost dan penempatannya tetap sama. Setiap teknisi mendapat tambahan 5 jam, sehingga total naik 4 × 5 = 20 jam menjadi 92 jam. Tidak perlu menghitung ulang dari awal.",
    why: [
      null,
      "Reduksi baris akan menghapus tambahan 5 itu, jadi langkah dan hasilnya sama persis.",
      "Total pasti naik karena setiap penempatan bertambah 5 jam.",
      "Tambahan 5 jam berlaku untuk keempat teknisi, bukan hanya sekali."]
  },
  {
    id: "T4-18", topic: 4, level: "kasus", src: "soal-dosen", lihat: "asg/khusus",
    ctxTitle: "Kunjungan sales",
    ctx: "Tiga sales (Rani, Sandi, Tio) harus mengunjungi empat toko (Pasteur, Antapani, Ujungberung, Cimahi). Setiap sales hanya sempat ke satu toko minggu ini, jadi satu toko ditunda ke minggu depan. Tabel berisi waktu tempuh (menit).",
    papan: [tab("Sales \\ Toko", SALES.kolom, SALES.baris, SALES.nilai)],
    q: "Berapa total waktu tempuh minimum minggu ini?",
    options: ["106 menit", "136 menit", "98 menit", "Tidak bisa dihitung karena tabelnya tidak persegi"],
    answer: 2,
    cekNilai: { metode: "asg", data: SALES, path: "total", format: "val", satuan: "menit" },
    explain: "Tambahkan baris dummy bernilai 0 supaya tabel menjadi 4 × 4. Penempatan optimalnya Rani → Pasteur (30), Sandi → Antapani (35), Tio → Ujungberung (33), dan Cimahi jatuh ke baris dummy (ditunda). Totalnya 30 + 35 + 33 = 98 menit.",
    why: [
      "106 menit berarti Rani mengambil Cimahi (38); itu bukan susunan tercepat.",
      "136 menit ikut menjumlahkan toko Cimahi, padahal toko di baris dummy tidak dikunjungi minggu ini.",
      null,
      "Tabel yang tidak persegi cukup ditambah baris dummy bernilai 0."]
  },
  {
    id: "T4-19", topic: 4, level: "kasus", src: "soal-dosen", lihat: "asg/gabungan",
    ctxTitle: "Komunitas Bandung Bersih",
    ctx: "Ada 5 relawan untuk 4 titik bersih-bersih. Tabel berisi perkiraan sampah yang bisa dikumpulkan (kg). Ulfa sebenarnya paling banyak di Alun-alun (52 kg), tetapi ia tidak boleh bertugas di sana karena sedang menjadi panitia acara di Alun-alun, jadi sel itu ditulis M. Komunitas ingin sampah terkumpul sebanyak mungkin.",
    papan: [tab("Relawan \\ Titik", RELAWAN.kolom, RELAWAN.baris, RELAWAN.nilai)],
    q: "Berapa total sampah maksimum yang bisa dikumpulkan?",
    options: ["198 kg", "190 kg", "156 kg", "Tidak bisa dihitung karena relawan lebih banyak dari titik"],
    answer: 1,
    cekNilai: { metode: "asg", data: RELAWAN, path: "total", format: "val", satuan: "kg" },
    explain: "Tambahkan kolom dummy (0), ubah ke opportunity cost dengan nilai terbesar yang boleh dipakai (50 − nilai sel), dan beri M untuk Ulfa–Alun-alun; perlu satu revisi dengan nilai terkecil 2. Hasilnya Rizky → Alun-alun (46), Salsa → Taman Lansia (49), Tegar → Babakan Siliwangi (47), Ulfa → CFD Dago (48), dan Vino ke dummy (tidak bertugas). Totalnya 190 kg.",
    why: [
      "198 kg didapat kalau larangan Ulfa–Alun-alun diabaikan.",
      null,
      "156 kg adalah hasil kalau tabel dikerjakan sebagai minimasi tanpa konversi.",
      "Cukup tambahkan kolom dummy; relawan yang jatuh ke dummy tidak mendapat titik."]
  },
  {
    id: "T4-20", topic: 4, level: "kasus", src: "latihan", lihat: "asg/hungarian",
    ctxTitle: "Kurir ojek online",
    ctx: "Empat kurir (Nadia, Fajar, Gilang, Hana) dikirim ke empat area (Dago, Cihampelas, Setiabudi, Buah Batu). Setiap kurir hanya ke satu area. Tabel berisi waktu tempuh (menit).",
    papan: [tab("Kurir \\ Area", KURIR.kolom, KURIR.baris, KURIR.nilai)],
    q: "Berapa total waktu tempuh minimum?",
    options: ["39 menit", "41 menit", "48 menit", "42 menit"],
    answer: 3,
    cekNilai: { metode: "asg", data: KURIR, path: "total", format: "val", satuan: "menit" },
    explain: "Reduksi baris (pengurang 10, 10, 8, 11) dan reduksi kolom (pengurang 1 di Setiabudi dan Buah Batu) menghasilkan tabel yang baru tertutup 3 garis. Setelah satu revisi dengan nilai terkecil 1, penempatannya Nadia → Cihampelas (10), Fajar → Buah Batu (12), Gilang → Setiabudi (9), dan Hana → Dago (11). Totalnya 42 menit.",
    why: [
      "39 menit hanya jumlah nilai terkecil setiap baris; nol-nolnya belum bisa ditempatkan tanpa bentrok.",
      "41 menit adalah jumlah pengurang sebelum revisi, padahal tabelnya belum optimal saat itu.",
      "48 menit didapat kalau memilih nol tanpa tes garis, misalnya Fajar → Dago sehingga Hana terpaksa ke Buah Batu.",
      null]
  }
  );
})();
