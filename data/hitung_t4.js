// Latihan hitung Topik 4 — Assignment. ID H4-01..H4-04. Semua kunci diverifikasi cek_soal.js lewat "dari".
(function () {
  function tab(sudut, kolom, baris, nilai) {
    return { t: "tabel", head: [sudut].concat(kolom), rows: baris.map(function (b, i) {
      return [{ v: b, k: "lab" }].concat(nilai[i].map(function (x) { return { v: String(x) }; }));
    }) };
  }

  var LAB = { baris: ["Aldo", "Bella", "Candra", "Dinda"], kolom: ["Basis Data", "Jaringan", "Statistika", "Pemrograman"],
    nilai: [[15, 16, 12, 15], [8, 14, 15, 12], [8, 17, 13, 9], [12, 14, 12, 10]], goal: "min", satuan: "jam", labelBaris: "Asisten", labelKolom: "Praktikum" };
  var KIRIM = { baris: ["Eko", "Fina", "Galih", "Hesti"], kolom: ["Cibiru", "Cimahi", "Lembang", "Soreang", "Kopo"],
    nilai: [[55, 49, 54, 37, 47], ["M", 55, 45, 48, 37], [47, 50, 42, 46, 47], [35, 52, 55, 51, 30]], goal: "min", satuan: "menit", labelBaris: "Kurir", labelKolom: "Rute" };
  var PVJ = { baris: ["Nisa", "Oscar", "Putri", "Qori"], kolom: ["Booth A", "Booth B", "Booth C", "Booth D"],
    nilai: [[41, 48, 35, 23], [41, 50, 50, 35], [22, 38, 21, 50], [29, 42, 44, 45]], goal: "max", satuan: "unit", labelBaris: "SPG", labelKolom: "Booth" };
  var FEST = { baris: ["Ilham", "Jihan", "Kevin", "Laras"], kolom: ["Pos Dago", "Pos Braga", "Pos Cihampelas", "Pos Gedung Sate", "Pos Saparua"],
    nilai: [[35, 43, 49, 60, 55], [55, "M", 48, 57, 39], [52, 49, 53, 38, 30], [52, 47, 42, 33, 55]], goal: "max", satuan: "orang", labelBaris: "Koordinator", labelKolom: "Pos" };

  window.HITUNG.push(
  {
    id: "H4-01", topik: 4, modul: "asg/hungarian",
    judul: "Asisten lab dan jadwal praktikum",
    ringkas: "Minimasi 4 × 4 yang perlu satu kali revisi.",
    cerita: "Laboratorium komputer FEB UNPAR punya empat asisten (Aldo, Bella, Candra, Dinda) yang harus menyiapkan modul untuk empat praktikum: Basis Data, Jaringan, Statistika, dan Pemrograman. Setiap asisten hanya memegang satu praktikum dan setiap praktikum hanya butuh satu asisten.\n\nTabel berisi perkiraan waktu persiapan (jam). Koordinator lab ingin total waktu persiapan sesingkat mungkin. Gunakan metode Hungarian.",
    papan: [tab("Asisten \\ Praktikum", LAB.kolom, LAB.baris, LAB.nilai)],
    tanya: [
      { id: "a", teks: "Berapa total waktu persiapan minimum (jam)?", tipe: "angka", satuan: "jam", kunci: 43, kunciTeks: "43 jam", dari: { bagian: 0, path: "total" } },
      { id: "b", teks: "Aldo memegang praktikum apa?", tipe: "pilih", opsi: LAB.kolom, kunci: "Statistika", kunciTeks: "Statistika (12 jam)", dari: { bagian: 0, path: "penempatan.0.1", nama: LAB.kolom } },
      { id: "c", teks: "Candra memegang praktikum apa?", tipe: "pilih", opsi: LAB.kolom, kunci: "Pemrograman", kunciTeks: "Pemrograman (9 jam)", dari: { bagian: 0, path: "penempatan.2.1", nama: LAB.kolom } },
      { id: "d", teks: "Dinda memegang praktikum apa?", tipe: "pilih", opsi: LAB.kolom, kunci: "Jaringan", kunciTeks: "Jaringan (14 jam)", dari: { bagian: 0, path: "penempatan.3.1", nama: LAB.kolom } }
    ],
    bagian: [{ judul: "Metode Hungarian", metode: "asg", data: LAB }],
    poin: [
      "Reduksi baris dengan pengurang 12, 8, 8, dan 10",
      "Reduksi kolom: hanya kolom Jaringan yang dikurangi 4",
      "Tes garis pertama: 3 garis < 4, jadi belum optimal",
      "Revisi dengan nilai terkecil tak tertutup = 1 (kurangi sel bebas, tambah di perpotongan garis)",
      "Tes garis kedua: 4 garis = 4, jadi sudah optimal",
      "Penempatan dimulai dari baris yang hanya punya satu angka 0",
      "Total dihitung dari tabel awal: 12 + 8 + 9 + 14 = 43 jam"
    ],
    jebakan: [
      "Bella dan Candra sama-sama paling cepat di Basis Data (8 jam). Jangan langsung memberi keduanya Basis Data; tes garis yang menentukan.",
      "Jangan berhenti setelah reduksi kolom. Tes garis dulu, karena di sini baru ada 3 garis.",
      "Total diambil dari tabel waktu asli, bukan dari angka 0 di tabel opportunity cost."
    ]
  },
  {
    id: "H4-02", topik: 4, modul: "asg/khusus",
    judul: "Kurir paket dan satu rute yang ditunda",
    ringkas: "Minimasi tidak seimbang (4 kurir, 5 rute) dengan satu penempatan terlarang.",
    cerita: "Sebuah jasa kirim di Bandung punya empat kurir (Eko, Fina, Galih, Hesti) dan lima rute pengantaran hari ini: Cibiru, Cimahi, Lembang, Soreang, dan Kopo. Setiap kurir hanya mengambil satu rute, jadi satu rute terpaksa ditunda ke besok.\n\nFina tidak boleh mengambil rute Cibiru karena motornya sedang diservis di bengkel yang jauh dari Cibiru (ditulis M). Tabel berisi perkiraan waktu tempuh (menit). Kepala gudang ingin total waktu tempuh sekecil mungkin.",
    papan: [tab("Kurir \\ Rute", KIRIM.kolom, KIRIM.baris, KIRIM.nilai)],
    tanya: [
      { id: "a", teks: "Berapa total waktu tempuh minimum hari ini (menit)?", tipe: "angka", satuan: "menit", kunci: 151, kunciTeks: "151 menit", dari: { bagian: 0, path: "total" } },
      { id: "b", teks: "Rute mana yang ditunda ke besok?", tipe: "pilih", opsi: KIRIM.kolom, kunci: "Cimahi", kunciTeks: "Cimahi (jatuh ke baris dummy)", dari: { bagian: 0, path: "penempatan.4.1", nama: KIRIM.kolom } },
      { id: "c", teks: "Fina mengambil rute apa?", tipe: "pilih", opsi: KIRIM.kolom, kunci: "Kopo", kunciTeks: "Kopo (37 menit)", dari: { bagian: 0, path: "penempatan.1.1", nama: KIRIM.kolom } },
      { id: "d", teks: "Hesti mengambil rute apa?", tipe: "pilih", opsi: KIRIM.kolom, kunci: "Cibiru", kunciTeks: "Cibiru (35 menit)", dari: { bagian: 0, path: "penempatan.3.1", nama: KIRIM.kolom } },
      { id: "e", teks: "Setelah diseimbangkan dengan dummy, tabelnya punya berapa baris?", tipe: "angka", kunci: 5, kunciTeks: "5 baris (4 kurir + 1 dummy)", dari: { bagian: 0, path: "baris.length" } }
    ],
    bagian: [{ judul: "Metode Hungarian dengan dummy dan larangan", metode: "asg", data: KIRIM }],
    poin: [
      "Menambahkan baris dummy bernilai 0 karena ada 4 kurir untuk 5 rute",
      "Menandai Fina–Cibiru dengan M",
      "Reduksi baris dengan pengurang 37, 37, 42, 30, dan 0 untuk dummy",
      "Reduksi kolom tidak mengubah tabel karena baris dummy sudah memberi 0 di setiap kolom",
      "Tes garis pertama: 4 garis < 5, lalu revisi dengan nilai terkecil tak tertutup = 5",
      "Tes garis kedua: 5 garis, lalu penempatan dari baris yang hanya punya satu 0",
      "Total dari tabel awal: 37 + 37 + 42 + 35 = 151 menit; rute di baris dummy (Cimahi) ditunda"
    ],
    jebakan: [
      "Hesti paling cepat di Kopo (30 menit), tetapi solusi optimalnya Hesti ke Cibiru dan Fina ke Kopo, karena Fina tidak boleh ke Cibiru. Jangan memilih yang tercepat untuk setiap orang.",
      "Larangan diberi M, bukan 0. Kalau diberi 0, Fina malah akan terpilih ke Cibiru.",
      "Rute yang jatuh ke baris dummy berarti ditunda, bukan dikerjakan oleh kurir bayangan, dan tidak ikut dijumlahkan."
    ]
  },
  {
    id: "H4-03", topik: 4, modul: "asg/khusus",
    judul: "SPG di pameran Paris Van Java",
    ringkas: "Maksimasi 4 × 4: konversi ke opportunity cost, lalu satu kali revisi.",
    cerita: "Sebuah merek minuman menyewa empat booth (A, B, C, D) di pameran Paris Van Java dan punya empat SPG: Nisa, Oscar, Putri, dan Qori. Setiap booth dijaga tepat satu SPG.\n\nTabel berisi perkiraan penjualan per hari (unit) setiap SPG di setiap booth. Manajer ingin total penjualan sebesar mungkin.",
    papan: [tab("SPG \\ Booth", PVJ.kolom, PVJ.baris, PVJ.nilai)],
    tanya: [
      { id: "a", teks: "Berapa total penjualan maksimum per hari (unit)?", tipe: "angka", satuan: "unit", kunci: 185, kunciTeks: "185 unit", dari: { bagian: 0, path: "total" } },
      { id: "b", teks: "Nisa menjaga booth mana?", tipe: "pilih", opsi: PVJ.kolom, kunci: "Booth A", kunciTeks: "Booth A (41 unit)", dari: { bagian: 0, path: "penempatan.0.1", nama: PVJ.kolom } },
      { id: "c", teks: "Oscar menjaga booth mana?", tipe: "pilih", opsi: PVJ.kolom, kunci: "Booth B", kunciTeks: "Booth B (50 unit)", dari: { bagian: 0, path: "penempatan.1.1", nama: PVJ.kolom } },
      { id: "d", teks: "Qori menjaga booth mana?", tipe: "pilih", opsi: PVJ.kolom, kunci: "Booth C", kunciTeks: "Booth C (44 unit)", dari: { bagian: 0, path: "penempatan.3.1", nama: PVJ.kolom } }
    ],
    bagian: [{ judul: "Konversi maksimasi lalu metode Hungarian", metode: "asg", data: PVJ }],
    poin: [
      "Mengenali bahwa ini maksimasi, lalu mengubah setiap sel menjadi 50 − nilai sel",
      "Reduksi baris dengan pengurang 2, 0, 0, dan 5",
      "Reduksi kolom: kolom Booth A dikurangi 7",
      "Tes garis pertama: 3 garis < 4, jadi belum optimal",
      "Revisi dengan nilai terkecil tak tertutup = 1",
      "Tes garis kedua: 4 garis, lalu penempatan dimulai dari Putri → Booth D",
      "Total dari tabel penjualan asli: 41 + 50 + 50 + 44 = 185 unit"
    ],
    jebakan: [
      "Putri dan Qori sama-sama paling laku di Booth D, dan Oscar sama kuat di Booth B dan C. Mengambil angka terbesar setiap baris akan bentrok.",
      "Jangan lupa mengonversi tabel. Hungarian tanpa konversi akan mencari penjualan terkecil.",
      "Total diambil dari tabel penjualan asli, bukan dari tabel opportunity cost."
    ]
  },
  {
    id: "H4-04", topik: 4, modul: "asg/gabungan",
    judul: "Koordinator festival kuliner Bandung",
    ringkas: "Soal gaya UTS: maksimasi + dummy (4 orang, 5 pos) + penempatan terlarang.",
    cerita: "Panitia festival kuliner Bandung punya empat koordinator relawan (Ilham, Jihan, Kevin, Laras) untuk lima pos informasi: Pos Dago, Pos Braga, Pos Cihampelas, Pos Gedung Sate, dan Pos Saparua. Setiap koordinator memegang satu pos, sehingga satu pos terpaksa berjalan tanpa koordinator (cukup dijaga relawan biasa).\n\nTabel berisi perkiraan jumlah pengunjung yang bisa dilayani per jam (orang). Jihan tidak boleh memegang Pos Braga karena ia juga mengisi acara musik di panggung Braga (ditulis M). Panitia ingin jumlah pengunjung yang terlayani sebanyak mungkin.",
    papan: [tab("Koordinator \\ Pos", FEST.kolom, FEST.baris, FEST.nilai)],
    tanya: [
      { id: "a", teks: "Berapa total pengunjung maksimum yang bisa dilayani per jam (orang)?", tipe: "angka", satuan: "orang", kunci: 223, kunciTeks: "223 orang", dari: { bagian: 0, path: "total" } },
      { id: "b", teks: "Pos mana yang berjalan tanpa koordinator?", tipe: "pilih", opsi: FEST.kolom, kunci: "Pos Braga", kunciTeks: "Pos Braga (jatuh ke baris dummy)", dari: { bagian: 0, path: "penempatan.4.1", nama: FEST.kolom } },
      { id: "c", teks: "Jihan memegang pos mana?", tipe: "pilih", opsi: FEST.kolom, kunci: "Pos Dago", kunciTeks: "Pos Dago (55 orang)", dari: { bagian: 0, path: "penempatan.1.1", nama: FEST.kolom } },
      { id: "d", teks: "Ilham memegang pos mana?", tipe: "pilih", opsi: FEST.kolom, kunci: "Pos Gedung Sate", kunciTeks: "Pos Gedung Sate (60 orang)", dari: { bagian: 0, path: "penempatan.0.1", nama: FEST.kolom } },
      { id: "e", teks: "Laras memegang pos mana?", tipe: "pilih", opsi: FEST.kolom, kunci: "Pos Saparua", kunciTeks: "Pos Saparua (55 orang)", dari: { bagian: 0, path: "penempatan.3.1", nama: FEST.kolom } }
    ],
    bagian: [{ judul: "Dummy, larangan, konversi maksimasi, lalu Hungarian", metode: "asg", data: FEST }],
    poin: [
      "Menambahkan baris dummy bernilai 0 karena ada 4 koordinator untuk 5 pos",
      "Menandai Jihan–Pos Braga sebagai terlarang",
      "Mengubah maksimasi menjadi opportunity cost: 60 − nilai sel; sel terlarang menjadi M dan dummy tetap 0",
      "Reduksi baris dengan pengurang 0, 3, 7, 5, dan 0",
      "Reduksi kolom tidak mengubah tabel karena baris dummy sudah memberi 0",
      "Tes garis pertama: 4 garis < 5, lalu revisi dengan nilai terkecil tak tertutup = 2",
      "Tes garis kedua: 5 garis, lalu penempatan dimulai dari Ilham → Pos Gedung Sate",
      "Total dari tabel asli: 60 + 55 + 53 + 55 = 223 orang; Pos Braga tanpa koordinator"
    ],
    jebakan: [
      "Jihan juga kuat di Pos Gedung Sate (57), tetapi Ilham lebih unggul di sana (60). Yang dicari total terbesar, bukan nilai terbesar setiap orang.",
      "Sel terlarang diberi −M di tabel asli (atau M setelah konversi), bukan 0.",
      "Pos Braga punya nilai cukup besar untuk Kevin (49), tetapi tetap kosong karena total keseluruhan lebih besar kalau Kevin di Pos Cihampelas.",
      "Total diambil dari tabel asli; baris dummy tidak menyumbang apa pun."
    ]
  }
  );
})();
