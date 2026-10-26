// Pembahasan soal dosen: Latihan Decision Analysis, PR AKB Decision Analysis, Tugas Assignment.
// Langkah dihitung solver.js; kunciCek dicek ulang oleh cek_soal.js.
(function () {
  var G1 = "Latihan Decision Analysis", G2 = "PR AKB — Decision Analysis", G3 = "Tugas Assignment";

  window.PEMBAHASAN.push(
    /* ------------------------------------------------------------------ */
    {
      id: "latihan-1", grup: G1, topik: 1, modul: "da/ketidakpastian",
      judul: "Soal 1 — PT Bababa menambah kapasitas",
      ringkas: "Lima kriteria ketidakpastian dengan tiga keadaan permintaan, α = 0,6.",
      soal: "PT. Bababa sedang merencanakan penambahan kapasitas untuk produksinya, dengan pilihan kapasitas ukuran besar dan ukuran kecil, untuk menghadapi kemungkinan perubahan permintaan kalung pelacak hewan peliharaan.\n\nJika permintaan tinggi: kapasitas besar memberi profit $350.000, kapasitas kecil $200.000. Jika permintaan sedang: kapasitas besar $100.000, kapasitas kecil $90.000. Jika permintaan rendah: kapasitas besar rugi $275.000, kapasitas kecil rugi $80.000. PT. Bababa juga dapat memilih untuk tidak menambah kapasitas (tidak ada untung maupun rugi tambahan).\n\nBuatlah saran keputusan agar profit optimal dengan metode: 1. Maximax, 2. Maximin, 3. Realism (α = 0,6), 4. Laplace, 5. Minimax Regret.",
      diketahui: `<ul><li>Alternatif: kapasitas besar, kapasitas kecil, <b>tidak menambah</b> (jangan lupa!).</li><li>Keadaan: permintaan tinggi, sedang, rendah (3 keadaan, tanpa probabilitas → keputusan dalam ketidakpastian).</li><li>Payoff = profit, jadi tujuannya <b>maksimasi</b>. Rugi ditulis negatif.</li><li>α = 0,6 (60% optimis).</li></ul>`,
      bagian: [{
        judul: "Penyelesaian langkah demi langkah",
        pengantar: `<p>Karena ada <b>tiga</b> keadaan, kriteria realisme hanya memakai nilai terbaik dan terburuk (nilai tengah diabaikan), sedangkan Laplace dibagi 3.</p>`,
        metode: "da-ketidakpastian",
        data: { alt: ["Kapasitas besar", "Kapasitas kecil", "Tidak menambah"], state: ["Permintaan tinggi", "Permintaan sedang", "Permintaan rendah"],
          payoff: [[350000, 100000, -275000], [200000, 90000, -80000], [0, 0, 0]], goal: "max", alpha: 0.6, satuan: "$" },
        kunciCek: [{ path: "keputusan.optimis.idx", nilai: [0] }, { path: "keputusan.pesimis.idx", nilai: [2] }, { path: "keputusan.realisme.nilai", nilai: 100000 },
          { path: "keputusan.laplace.nilai", nilai: 70000 }, { path: "keputusan.regret.nilai", nilai: 150000 }]
      }],
      jawaban: `<ul>
<li><b>Maximax</b> → kapasitas besar ($350.000).</li>
<li><b>Maximin</b> → tidak menambah kapasitas ($0).</li>
<li><b>Realism (α = 0,6)</b> → kapasitas besar: 0,6 × 350.000 + 0,4 × (−275.000) = $100.000 (kecil hanya $88.000).</li>
<li><b>Laplace</b> → kapasitas kecil: (200.000 + 90.000 − 80.000) / 3 = $70.000 (besar $58.333,33).</li>
<li><b>Minimax regret</b> → kapasitas kecil (regret maksimum $150.000; besar $275.000; tidak menambah $350.000).</li></ul>`,
      jebakan: [
        "Lupa alternatif <b>tidak menambah kapasitas</b>. Padahal alternatif inilah jawaban maximin.",
        "Realism memakai nilai tengah ($100.000). Seharusnya hanya nilai terbaik ($350.000) dan terburuk (−$275.000).",
        "Laplace dibagi 2. Seharusnya dibagi 3 karena ada tiga keadaan.",
        "Regret dihitung per baris. Seharusnya per kolom: terbaik di kolom permintaan rendah adalah $0, jadi regret kapasitas besar di kolom itu = 0 − (−275.000) = 275.000."
      ]
    },
    /* ------------------------------------------------------------------ */
    {
      id: "latihan-2", grup: G1, topik: 1, modul: "da/pohon",
      judul: "Soal 2 — Javar dan biaya perawatan laptop",
      ringkas: "Pohon keputusan untuk BIAYA (minimasi) dengan P(high season) = 0,8.",
      soal: "Javar berjualan lewat online marketplace memakai 3 smartphone dan mempertimbangkan membeli laptop. Pilihannya: laptop baru dengan spek cukup, laptop bekas spek 2 tahun lalu, atau tidak membeli laptop.\n\nBiaya perawatan setelah high season (tanggal kembar, gajian) / saat low season:\n• Laptop baru: Rp18.000 / Rp10.000\n• Laptop bekas: Rp25.000 / Rp9.000\n• Tidak membeli laptop (perawatan 2 smartphone): Rp20.000 / Rp7.000\n\nKarena tokonya menjual barang viral, probabilitas high season = 0,8.\n\nBantu Javar memilih keputusan dengan biaya pemeliharaan optimal. Buat dalam bentuk pohon keputusan disertai EMV-nya.",
      diketahui: `<ul><li>Payoff berupa <b>biaya</b> → pilih EMV <b>terkecil</b>.</li><li>P(high season) = 0,8, sehingga P(low season) = 1 − 0,8 = 0,2.</li><li>Tiga alternatif, dua keadaan.</li></ul>`,
      bagian: [{
        judul: "Pohon keputusan dan EMV",
        pengantar: `<p>Gambar satu simpul keputusan (□) dengan tiga cabang. Setiap cabang menuju simpul peluang (○) high/low season. Hitung EMV dari kanan, lalu pilih yang <b>termurah</b>.</p>`,
        metode: "da-pohon",
        data: { goal: "min", satuan: "Rp", pohon: { jenis: "keputusan", cabang: [
          { label: "Laptop baru", ke: { jenis: "peluang", cabang: [{ label: "High season", p: 0.8, ke: { jenis: "akhir", nilai: 18000 } }, { label: "Low season", p: 0.2, ke: { jenis: "akhir", nilai: 10000 } }] } },
          { label: "Laptop bekas", ke: { jenis: "peluang", cabang: [{ label: "High season", p: 0.8, ke: { jenis: "akhir", nilai: 25000 } }, { label: "Low season", p: 0.2, ke: { jenis: "akhir", nilai: 9000 } }] } },
          { label: "Tidak membeli", ke: { jenis: "peluang", cabang: [{ label: "High season", p: 0.8, ke: { jenis: "akhir", nilai: 20000 } }, { label: "Low season", p: 0.2, ke: { jenis: "akhir", nilai: 7000 } }] } }] } },
        kunciCek: [{ path: "nilai", nilai: 16400 }, { path: "pohon.pilih", nilai: 0 }]
      }, {
        judul: "Bonus: EVPI untuk soal biaya",
        pengantar: `<p>Tidak ditanyakan, tapi bagus untuk latihan: dengan informasi sempurna Javar selalu memilih biaya terkecil di setiap musim.</p>`,
        metode: "da-risiko",
        data: { alt: ["Laptop baru", "Laptop bekas", "Tidak membeli"], state: ["High season", "Low season"], payoff: [[18000, 10000], [25000, 9000], [20000, 7000]], prob: [0.8, 0.2], goal: "min", satuan: "Rp", tanpaEOL: true, ukuran: "biaya perawatan" },
        kunciCek: [{ path: "evpi", nilai: 600 }]
      }],
      jawaban: `<p>EMV: laptop baru = 0,8 × 18.000 + 0,2 × 10.000 = <b>Rp16.400</b>; laptop bekas = Rp21.800; tidak membeli = Rp17.400.</p><p><b>Saran: beli laptop baru</b>, karena biaya perawatan harapannya paling kecil (Rp16.400).</p>`,
      jebakan: [
        "Memilih EMV terbesar. Ini soal <b>biaya</b>, jadi yang dipilih EMV terkecil.",
        "Lupa P(low season) = 0,2 karena soal hanya menyebut 0,8.",
        "Tergoda biaya low season laptop bekas yang murah (Rp9.000). Padahal high season jauh lebih sering terjadi (80%)."
      ],
      catatan: "Catatan: soal tidak menyebut biaya perawatan smartphone yang masih dipakai ketika Javar membeli laptop, jadi biaya itu tidak dihitung. Kalau di kelas ada tambahan data, cukup tambahkan ke payoff cabang laptop."
    },
    /* ------------------------------------------------------------------ */
    {
      id: "latihan-3", grup: G1, topik: 1, modul: "da/bayes",
      judul: "Soal 3 — Asep dan driving range golf",
      ringkas: "Teorema Bayes: semua probabilitas yang direvisi dari hasil survei.",
      soal: "Asep golf berpikir untuk berinvestasi membangun driving range golf di Bandung. Asep menduga probabilitas kesuksesannya 40%. Temannya menyarankan survei kepada komunitas pemain golf. Probabilitas hasil survei sesuai harapan jika driving range sukses adalah 0,9. Probabilitas hasil survei tidak sesuai harapan jika driving range tidak sukses adalah 0,8.\n\nBantulah Asep memperhitungkan semua probabilitas dari keadaan dan keputusan untuk melakukan survei.",
      diketahui: `<ul><li>Prior: P(sukses) = 0,4 → P(tidak sukses) = 0,6.</li><li>P(sesuai | sukses) = 0,9 → P(tidak sesuai | sukses) = 0,1.</li><li>P(tidak sesuai | tidak sukses) = 0,8 → P(sesuai | tidak sukses) = 0,2.</li></ul><p>Yang dicari: P(hasil survei) dan semua posterior P(keadaan | hasil survei).</p>`,
      bagian: [{
        judul: "Tabel Bayes",
        metode: "da-bayes",
        data: { state: ["Sukses", "Tidak sukses"], prior: [0.4, 0.6], hasil: ["Survei sesuai harapan", "Survei tidak sesuai harapan"], likelihood: [[0.9, 0.1], [0.2, 0.8]] },
        kunciCek: [{ path: "pHasil.0", nilai: 0.48 }, { path: "posterior.0.0", nilai: 0.75 }, { path: "pHasil.1", nilai: 0.52 }, { path: "posterior.1.0", nilai: 0.04 / 0.52, tol: 1e-9 }]
      }],
      jawaban: `<ul><li>P(survei sesuai) = 0,9 × 0,4 + 0,2 × 0,6 = 0,36 + 0,12 = <b>0,48</b>; P(survei tidak sesuai) = <b>0,52</b>.</li>
<li>P(sukses | sesuai) = 0,36 / 0,48 = <b>0,75</b>; P(tidak sukses | sesuai) = <b>0,25</b>.</li>
<li>P(sukses | tidak sesuai) = 0,04 / 0,52 = <b>0,0769</b>; P(tidak sukses | tidak sesuai) = 0,48 / 0,52 = <b>0,9231</b>.</li></ul>
<p>Artinya, survei yang mendukung menaikkan peluang sukses dari 40% menjadi 75%, sedangkan survei yang tidak mendukung menurunkannya menjadi sekitar 7,7%.</p>`,
      jebakan: [
        "Tertukar arah probabilitas: 0,9 adalah P(survei sesuai | sukses), bukan P(sukses | survei sesuai).",
        "Lupa komplemen: P(sesuai | tidak sukses) = 1 − 0,8 = 0,2.",
        "Membagi joint dengan 1. Penyebutnya adalah P(hasil survei) = 0,48 atau 0,52."
      ],
      catatan: "Soal ini sama dengan Solved Problem 3-4 di buku Render (John Jenkins), hanya nama dan tempatnya yang diganti."
    },
    /* ------------------------------------------------------------------ */
    {
      id: "pr-1", grup: G2, topik: 1, modul: "da/ketidakpastian",
      judul: "Soal 1 — Susi memilih mata kuliah AKB atau Statin",
      ringkas: "Lima kriteria ketidakpastian dengan payoff berupa nilai, α = 0,7.",
      soal: "Susi ingin meningkatkan IPK di Manajemen UNPAR. Ia bisa mengambil mata kuliah AKB atau Statin (hanya salah satu), atau tidak mengambil keduanya semester ini. Ada tiga keadaan semangat belajar: tinggi, biasa, rendah.\n\nAKB: nilai maksimum 98 (semangat tinggi), 78 (biasa), 25 (rendah). Statin: 100 (tinggi), 65 (biasa), 30 (rendah). Tidak mengambil: tidak mendapat nilai apa pun.\n\nBantu Susi memberi saran keputusan agar nilainya optimal dengan metode: 1. Maximax, 2. Maximin, 3. Laplace, 4. Realism dengan nilai optimis 0,7, 5. Minimax Regret.",
      diketahui: `<ul><li>Payoff = nilai mata kuliah, makin besar makin baik (maksimasi).</li><li>Alternatif: AKB, Statin, tidak mengambil keduanya (payoff 0).</li><li>Tiga keadaan tanpa probabilitas → keputusan dalam ketidakpastian. α = 0,7.</li></ul>`,
      bagian: [{
        judul: "Penyelesaian langkah demi langkah",
        metode: "da-ketidakpastian",
        data: { alt: ["Mengambil AKB", "Mengambil Statin", "Tidak mengambil keduanya"], state: ["Semangat tinggi", "Semangat biasa", "Semangat rendah"],
          payoff: [[98, 78, 25], [100, 65, 30], [0, 0, 0]], goal: "max", alpha: 0.7, ukuran: "nilai" },
        kunciCek: [{ path: "keputusan.optimis.idx", nilai: [1] }, { path: "keputusan.pesimis.idx", nilai: [1] }, { path: "keputusan.laplace.idx", nilai: [0] },
          { path: "keputusan.realisme.nilai", nilai: 79 }, { path: "keputusan.regret.idx", nilai: [0] }]
      }],
      jawaban: `<ul>
<li><b>Maximax</b> → Statin (100).</li>
<li><b>Maximin</b> → Statin (30). Nilai terkecil AKB hanya 25.</li>
<li><b>Laplace</b> → AKB: (98 + 78 + 25) / 3 = 67 (Statin 65).</li>
<li><b>Realism (α = 0,7)</b> → Statin: 0,7 × 100 + 0,3 × 30 = 79 (AKB 0,7 × 98 + 0,3 × 25 = 76,1).</li>
<li><b>Minimax regret</b> → AKB (regret maksimum 5; Statin 13).</li></ul>
<p>Kesimpulan: tiga kriteria (maximax, maximin, realism) memilih <b>Statin</b>, sedangkan Laplace dan minimax regret memilih <b>AKB</b>. Saran akhir bergantung pada sikap Susi. Kalau ia ingin aman dari penyesalan, pilih AKB.</p>`,
      jebakan: [
        "Regret tidak pernah negatif. Contoh: regret AKB di semangat tinggi = 100 − 98 = 2.",
        "Realism: nilai tengah (78 dan 65) tidak dipakai.",
        "Tidak mengambil keduanya tetap ditulis sebagai baris dengan nilai 0."
      ]
    },
    /* ------------------------------------------------------------------ */
    {
      id: "pr-2", grup: G2, topik: 1, modul: "da/pohon",
      judul: "Soal 2 — PT Durabel: produk baru, produk lama, atau marketing",
      ringkas: "Pohon keputusan dan EMV dengan P(pasar menerima) = 60%.",
      soal: "PT. Durabel menjual baterai sekali pakai. Tahun ini mereka memutuskan apakah mengembangkan produk baru, mengembangkan produk lama, atau tidak mengembangkan produk dan memakai dananya untuk marketing produk lama. Dana pengembangan direncanakan $500.000. Keadaan yang mungkin: pasar menerima atau tidak menerima.\n\nProduk baru: pendapatan $275.000 jika diterima pasar, $50.000 jika tidak diterima. Produk lama: $220.000 jika diterima, $100.000 jika tidak diterima. Marketing produk lama saja: $300.000 jika pasar menerima, $0 jika tidak. Probabilitas pasar menerima = 60%.\n\nBuatlah pohon keputusan dan perhitungan EMV, lalu berikan saran keputusan yang tepat.",
      diketahui: `<ul><li>Payoff = pendapatan (maksimasi). P(menerima) = 0,6, P(tidak menerima) = 0,4.</li><li>Dana $500.000 dipakai di <b>semua</b> alternatif (pengembangan atau marketing), jadi tidak mengubah perbandingan.</li></ul>`,
      bagian: [{
        judul: "Pohon keputusan dan EMV",
        metode: "da-pohon",
        data: { goal: "max", satuan: "$", pohon: { jenis: "keputusan", cabang: [
          { label: "Kembangkan produk baru", ke: { jenis: "peluang", cabang: [{ label: "Pasar menerima", p: 0.6, ke: { jenis: "akhir", nilai: 275000 } }, { label: "Tidak menerima", p: 0.4, ke: { jenis: "akhir", nilai: 50000 } }] } },
          { label: "Kembangkan produk lama", ke: { jenis: "peluang", cabang: [{ label: "Pasar menerima", p: 0.6, ke: { jenis: "akhir", nilai: 220000 } }, { label: "Tidak menerima", p: 0.4, ke: { jenis: "akhir", nilai: 100000 } }] } },
          { label: "Marketing produk lama", ke: { jenis: "peluang", cabang: [{ label: "Pasar menerima", p: 0.6, ke: { jenis: "akhir", nilai: 300000 } }, { label: "Tidak menerima", p: 0.4, ke: { jenis: "akhir", nilai: 0 } }] } }] } },
        kunciCek: [{ path: "nilai", nilai: 185000 }, { path: "pohon.pilih", nilai: 0 }]
      }],
      jawaban: `<p>EMV produk baru = 0,6 × 275.000 + 0,4 × 50.000 = <b>$185.000</b>; produk lama = $172.000; marketing saja = $180.000.</p><p><b>Saran: kembangkan produk baru</b> (EMV terbesar). Kalau dana $500.000 dikurangkan, semua EMV menjadi negatif (−$315.000, −$328.000, −$320.000), tetapi urutannya tetap sama, jadi keputusannya tidak berubah.</p>`,
      jebakan: [
        "Ada salah ketik di soal: \"jika diterima pasar maka hanya $50.000\" untuk produk baru. Dari konteksnya maksudnya <b>jika tidak diterima</b>.",
        "Marketing saja memang punya payoff tertinggi saat pasar menerima ($300.000), tapi payoff-nya $0 saat tidak menerima. Itulah alasan EMV-nya kalah.",
        "Biaya yang sama untuk semua alternatif tidak mengubah keputusan, tapi kalau dikurangkan harus dikurangkan ke semua cabang."
      ]
    },
    /* ------------------------------------------------------------------ */
    {
      id: "pr-3", grup: G2, topik: 1, modul: "da/bayes",
      judul: "Soal 3 — Gelapmba: quadplex, duplex, atau kumpulkan informasi",
      ringkas: "Pohon keputusan dua tahap dengan probabilitas yang sudah direvisi, EMV, dan EVSI.",
      soal: "Gelapmba (perusahaan pembangunan) bisa membangun apartemen quadplex (1 lantai 4 unit), duplex (1 lantai 2 unit), mengumpulkan informasi, atau tidak melakukan apa pun. Hasil pengumpulan informasi bisa mendukung atau tidak mendukung. Biaya pengumpulan informasi $3.000, dan Gelapmba percaya peluang informasinya mendukung = 50%.\n\nJika pasar menerima: profit quadplex $15.000, duplex $5.000. Gelapmba tidak punya dana untuk membangun keduanya. Jika pasar tidak menerima: rugi $20.000 (quadplex) dan $10.000 (duplex).\n\nTanpa informasi tambahan, peluang pasar menerima = 0,7. Jika informasi mendukung, peluang pasar menerima naik menjadi 0,9. Jika tidak mendukung, turun menjadi 0,4. Gelapmba tetap boleh tidak membangun.\n\nBuatlah perhitungan probabilitas yang disesuaikan berdasarkan teori Bayesian, EMV, dan pohon keputusan, lalu berikan saran.",
      diketahui: `<ul><li>Probabilitas yang disesuaikan (posterior) <b>sudah diberikan</b>: P(menerima | mendukung) = 0,9 → P(tidak menerima | mendukung) = 0,1; P(menerima | tidak mendukung) = 0,4 → P(tidak menerima | tidak mendukung) = 0,6.</li>
<li>P(informasi mendukung) = 0,5 dan P(tidak mendukung) = 0,5.</li><li>Prior tanpa informasi: P(menerima) = 0,7.</li><li>Biaya informasi $3.000 dikurangkan dari setiap payoff di cabang "kumpulkan informasi" (quadplex jadi $12.000 / −$23.000, duplex $2.000 / −$13.000, tidak membangun −$3.000).</li></ul>`,
      bagian: [{
        judul: "Pohon keputusan, EMV, dan EVSI",
        pengantar: `<p>Bagian Bayes di soal ini hanya melengkapi komplemen probabilitas, karena posterior sudah diketahui. Setelah itu gambar pohon dua tahap dan hitung mundur.</p>`,
        metode: "da-survei",
        data: { alt: ["Quadplex", "Duplex", "Tidak membangun"], state: ["Pasar menerima", "Pasar tidak menerima"], payoff: [[15000, -20000], [5000, -10000], [0, 0]],
          prior: [0.7, 0.3], goal: "max", satuan: "$",
          survei: { label: "Pengumpulan informasi", biaya: 3000, hasil: ["Informasi mendukung", "Informasi tidak mendukung"], pHasil: [0.5, 0.5], posterior: [[0.9, 0.1], [0.4, 0.6]] },
          labelSurvei: "Kumpulkan informasi", labelTanpa: "Tanpa informasi" },
        kunciCek: [{ path: "evTanpaSI", nilai: 4500 }, { path: "evDenganSI", nilai: 2750 }, { path: "evsi", nilai: 1250 }, { path: "pohon.pilih", nilai: 1 }]
      }],
      jawaban: `<ul>
<li>Tanpa informasi: EMV quadplex = 0,7 × 15.000 + 0,3 × (−20.000) = <b>$4.500</b>; duplex = $500; tidak membangun = $0 → pilih quadplex.</li>
<li>Jika informasi mendukung: quadplex $8.500 (dipilih), duplex $500, tidak membangun −$3.000.</li>
<li>Jika informasi tidak mendukung: quadplex −$9.000, duplex −$7.000, tidak membangun −$3.000 (dipilih).</li>
<li>EMV mengumpulkan informasi = 0,5 × 8.500 + 0,5 × (−3.000) = <b>$2.750</b>.</li>
<li>EVSI = (2.750 + 3.000) − 4.500 = <b>$1.250</b>, lebih kecil dari biaya informasi $3.000.</li></ul>
<p><b>Saran: jangan kumpulkan informasi; langsung bangun quadplex</b> (EMV $4.500).</p>`,
      jebakan: [
        "Lupa mengurangi biaya informasi $3.000 dari cabang \"tidak membangun\" setelah informasi (menjadi −$3.000, bukan $0).",
        "Memakai 0,7 di cabang setelah informasi. Setelah informasi yang dipakai 0,9 atau 0,4.",
        "Menyimpulkan informasi layak hanya karena informasi itu \"menambah kepastian\". Bandingkan EMV-nya: $2.750 < $4.500."
      ],
      catatan: "Catatan: soal ini sama dengan Problem 3-40 di buku Render (Bill Holliday). Data bukunya sedikit tidak konsisten, karena 0,5 × 0,9 + 0,5 × 0,4 = 0,65, bukan 0,7. Penyelesaian di buku tetap memakai angka yang diberikan, seperti pembahasan ini."
    },
    /* ------------------------------------------------------------------ */
    {
      id: "pr-4", grup: G2, topik: 2, modul: "ahp/konsistensi",
      judul: "Soal 4 — Dania memilih daerah kos (AHP)",
      ringkas: "AHP 4 kriteria × 3 alternatif, termasuk entri di segitiga bawah dan matriks yang tidak konsisten.",
      soal: "Dania (mahasiswi UNPAR asal Semarang) memilih daerah kos untuk minimal 4 tahun: Bukit Jarian, Cisitu, atau Hegarmanah. Kriteria: jarak dari UNPAR, fasilitas kos, jarak dari tempat makan, dan dilewati transportasi umum. Penilaian Dania:\n\nKriteria — Jarak UNPAR vs Fasilitas 4, vs Jarak makanan 6, vs Transportasi 8; Fasilitas vs Jarak makanan 0,5, vs Transportasi 4; Jarak makanan vs Transportasi 3.\nJarak dari UNPAR — Bukit Jarian vs Cisitu 8, vs Hegarmanah 4; Hegarmanah vs Cisitu 3.\nFasilitas — Bukit Jarian vs Cisitu 6; Cisitu vs Hegarmanah 2; Hegarmanah vs Bukit Jarian 2.\nJarak dari tempat makan — Bukit Jarian vs Hegarmanah 2; Cisitu vs Bukit Jarian 9; Cisitu vs Hegarmanah 6.\nTransportasi umum — Cisitu vs Bukit Jarian 2; Cisitu vs Hegarmanah 3; Hegarmanah vs Bukit Jarian 0,5.\n\nHitung consistency ratio setiap penilaian dan tentukan prioritas tempat kos.",
      diketahui: `<p>Perhatikan: beberapa nilai diberikan di <b>segitiga bawah</b> (misalnya "Hegarmanah vs Cisitu = 3"). Isikan apa adanya di baris Hegarmanah kolom Cisitu, lalu kebalikannya (1/3) di baris Cisitu kolom Hegarmanah.</p><p>Kunci memakai RI versi dosen: n = 3 → 0,52 (batas CR 0,05); n = 4 → 0,89 (batas CR 0,08).</p>`,
      bagian: [{
        judul: "AHP lengkap: 5 matriks + sintesis",
        pengantar: `<p>Urutannya: matriks kriteria (4×4), lalu empat matriks alternatif (3×3), lalu sintesis. Setiap matriks dicek CR-nya.</p>`,
        metode: "ahp",
        data: { kriteria: ["Jarak UNPAR", "Fasilitas", "Jarak makanan", "Transportasi"],
          matKriteria: [[1, 4, 6, 8], [null, 1, 0.5, 4], [null, null, 1, 3], [null, null, null, 1]],
          alternatif: ["Bukit Jarian", "Cisitu", "Hegarmanah"],
          matAlternatif: [
            [[1, 8, 4], [null, 1, null], [null, 3, 1]],
            [[1, 6, null], [null, 1, 2], [2, null, 1]],
            [[1, null, 2], [9, 1, 6], [null, null, 1]],
            [[1, null, null], [2, 1, 3], [0.5, null, 1]]] },
        kunciCek: [{ path: "kriteria.CR", nilai: 0.0809, tol: 0.0005 }, { path: "kriteria.konsisten", nilai: false }, { path: "kriteria.konsistenBuku", nilai: true },
          { path: "alternatif.1.konsisten", nilai: false }, { path: "sintesis.urutan", nilai: [0, 1, 2] }, { path: "sintesis.total.0", nilai: 0.545, tol: 0.0005 }]
      }],
      jawaban: `<ul>
<li><b>Bobot kriteria</b>: jarak UNPAR 0,6166 · fasilitas 0,1535 · jarak makanan 0,1748 · transportasi 0,0552. λmax = 4,2159; CI = 0,0720; <b>CR = 0,0809</b> → sedikit di atas batas versi dosen 0,08 (tidak konsisten), tapi konsisten menurut buku (CR = 0,08 ≤ 0,10).</li>
<li><b>CR alternatif</b>: jarak UNPAR 0,0177 (konsisten) · fasilitas ≈ 1,22 (sangat tidak konsisten) · jarak makanan 0,1355 (tidak konsisten) · transportasi 0,0089 (konsisten).</li>
<li><b>Skor akhir</b>: Bukit Jarian 0,545 · Cisitu 0,2515 · Hegarmanah 0,2035.</li></ul>
<p><b>Prioritas: 1) Bukit Jarian, 2) Cisitu, 3) Hegarmanah.</b> Tambahkan catatan bahwa penilaian fasilitas dan jarak makanan (juga matriks kriteria menurut batas dosen) sebaiknya ditinjau ulang oleh Dania karena CR-nya melewati batas.</p>`,
      jebakan: [
        "Salah posisi angka yang diberikan di segitiga bawah. \"Hegarmanah vs Cisitu = 3\" berarti baris Hegarmanah kolom Cisitu = 3, dan baris Cisitu kolom Hegarmanah = 1/3.",
        "Matriks fasilitas berputar: Bukit Jarian > Cisitu, Cisitu > Hegarmanah, tapi Hegarmanah > Bukit Jarian. Itulah sebabnya CR-nya melonjak.",
        "Memakai RI buku (0,58 / 0,90) padahal kelas memakai RI 0,52 / 0,89. Tulis RI yang kamu pakai.",
        "Membulatkan CR kriteria menjadi 0,08 lalu menyebutnya konsisten. Nilai sebenarnya 0,0809, sedikit di atas batas 0,08."
      ],
      catatan: "Hasil bisa sedikit berbeda di digit ketiga kalau kamu membulatkan matriks normalisasi ke 3 desimal (seperti contoh handphone di kelas). Ranking akhirnya tetap sama."
    },
    /* ------------------------------------------------------------------ */
    {
      id: "tugas-1", grup: G3, topik: 4, modul: "asg/khusus",
      judul: "Soal 1 — Jojo menugaskan mahasiswa riset",
      ringkas: "Minimasi waktu, 4 mahasiswa × 5 tugas (dummy) + Joseph tidak boleh tugas 3.",
      soal: "Jojo menugaskan 4 mahasiswa (Jocelyn, Ceasar, Joseph, Dio) untuk 5 tugas penelitian tentang Bintang Laut. Waktu (hari) setiap mahasiswa untuk tugas 1–5:\n• Jocelyn: 33, 28, 31, 31, 30\n• Ceasar: 23, 22, 28, 26, 22\n• Joseph: 26, 32, 26, 24, 27\n• Dio: 24, 18, 21, 22, 23\n\nJoseph sedang punya masalah pribadi sehingga tidak dapat mengerjakan tugas 3 dengan sempurna. Jojo ingin tugas-tugas ini diselesaikan secepat mungkin.\n\nBuat penugasan yang memberi waktu penyelesaian optimal. Berapa waktu optimalnya?",
      diketahui: `<ul><li>Tujuan: <b>minimasi</b> total waktu.</li><li>4 baris (mahasiswa) × 5 kolom (tugas) → tambah <b>baris dummy</b> bernilai 0.</li><li>Joseph–Tugas 3 dilarang → isi <b>M</b> (biaya sangat besar).</li></ul>`,
      bagian: [{
        judul: "Metode Hungarian",
        metode: "asg",
        data: { baris: ["Jocelyn", "Ceasar", "Joseph", "Dio"], kolom: ["Tugas 1", "Tugas 2", "Tugas 3", "Tugas 4", "Tugas 5"],
          nilai: [[33, 28, 31, 31, 30], [23, 22, 28, 26, 22], [26, 32, "M", 24, 27], [24, 18, 21, 22, 23]], goal: "min", satuan: "hari", labelBaris: "Mahasiswa", labelKolom: "Tugas" },
        kunciCek: [{ path: "total", nilai: 95 }, { path: "optimalGanda", nilai: true }]
      }],
      jawaban: `<p>Salah satu penugasan optimal: <b>Jocelyn → Tugas 2 (28), Ceasar → Tugas 5 (22), Joseph → Tugas 4 (24), Dio → Tugas 3 (21)</b>, Tugas 1 jatuh ke dummy (tidak dikerjakan). <b>Total waktu optimal = 95 hari.</b></p>
<p>Solusinya tidak tunggal. Ada tiga penugasan yang sama-sama 95 hari:</p>
<ul><li>Jocelyn–T2, Ceasar–T5, Joseph–T4, Dio–T3 (Tugas 1 tidak dikerjakan)</li><li>Jocelyn–T3, Ceasar–T5, Joseph–T4, Dio–T2 (Tugas 1 tidak dikerjakan)</li><li>Jocelyn–T5, Ceasar–T1, Joseph–T4, Dio–T2 (Tugas 3 tidak dikerjakan)</li></ul>
<p>Jawabanmu benar selama totalnya 95 hari dan Joseph tidak mendapat Tugas 3.</p>`,
      jebakan: [
        "Lupa dummy, sehingga tabel 4×5 tidak bisa diselesaikan dengan Hungarian.",
        "Memberi Joseph–Tugas 3 nilai 0 atau mencoretnya tanpa M. Seharusnya M supaya tidak pernah terpilih.",
        "Menjumlahkan total dari tabel opportunity cost. Total harus diambil dari tabel waktu awal."
      ],
      catatan: "Interpretasi: model assignment hanya mengizinkan satu tugas per orang, jadi dengan 4 mahasiswa satu tugas tidak bisa dikerjakan (dummy). \"Waktu optimal\" di sini adalah total hari kerja. Kalau dosen bermaksud semua tugas harus selesai (salah satu mahasiswa mengerjakan dua tugas), itu sudah di luar model assignment biasa. Tanyakan ke dosen kalau ragu."
    },
    /* ------------------------------------------------------------------ */
    {
      id: "tugas-2", grup: G3, topik: 4, modul: "asg/gabungan",
      judul: "Soal 2 — Jonathan dan pengawas kebun",
      ringkas: "Maksimasi hasil panen, 5 kandidat × 4 kebun (dummy) + Elina tidak boleh di kebun 1.",
      soal: "Jonathan punya 4 kebun dan 5 kandidat pengawas (Susy, Katie, Brando, Elina, Vlad). Perkiraan hasil (kg) setiap kandidat di kebun 1–4:\n• Susy: 81, 97, 89, 90\n• Katie: 72, 89, 77, 63\n• Brando: 92, 105, 89, 84\n• Elina: 85, 76, 68, 90\n• Vlad: 92, 101, 89, 86\n\nElina tidak dapat bekerja di kebun 1 karena pernah bermasalah dengan karyawan kebun 1. Jonathan ingin hasil buah sebesar mungkin.\n\nBuat penugasan yang memberi hasil optimal. Berapa jumlah hasil optimalnya?",
      diketahui: `<ul><li>Tujuan: <b>maksimasi</b> → ubah ke opportunity cost: nilai terbesar (105) − sel.</li><li>5 baris × 4 kolom → tambah <b>kolom dummy</b> bernilai 0.</li><li>Elina–Kebun 1 dilarang → <b>M</b> pada tabel opportunity cost (atau −M pada tabel profit).</li></ul>`,
      bagian: [{
        judul: "Metode Hungarian untuk maksimasi",
        metode: "asg",
        data: { baris: ["Susy", "Katie", "Brando", "Elina", "Vlad"], kolom: ["Kebun 1", "Kebun 2", "Kebun 3", "Kebun 4"],
          nilai: [[81, 97, 89, 90], [72, 89, 77, 63], [92, 105, 89, 84], ["M", 76, 68, 90], [92, 101, 89, 86]], goal: "max", satuan: "kg", labelBaris: "Kandidat", labelKolom: "Kebun" },
        kunciCek: [{ path: "total", nilai: 376 }, { path: "optimalGanda", nilai: false }]
      }],
      jawaban: `<p>Penugasan optimal (tunggal): <b>Susy → Kebun 3 (89 kg), Brando → Kebun 2 (105 kg), Elina → Kebun 4 (90 kg), Vlad → Kebun 1 (92 kg)</b>. Katie jatuh ke dummy (tidak mendapat kebun).</p><p><b>Hasil optimal = 376 kg.</b></p>`,
      jebakan: [
        "Langsung menjalankan Hungarian pada tabel kg tanpa mengubahnya. Hungarian hanya untuk minimasi.",
        "Memberi Elina–Kebun 1 nilai 85 (dari soal) padahal dilarang. Nilai 85 di soal hanya informasi, tapi pasangan ini tidak boleh dipakai.",
        "Menjawab total dari tabel opportunity cost. Jumlahkan kg asli: 89 + 105 + 90 + 92 = 376."
      ]
    }
  );
})();
