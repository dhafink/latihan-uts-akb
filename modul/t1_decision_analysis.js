// Modul Topik 1 — Decision Analysis. Semua angka contoh dihitung oleh solver.js.
(function () {
  var THOMPSON = { alt: ["Pabrik besar", "Pabrik kecil", "Tidak membangun"], state: ["Pasar baik", "Pasar buruk"],
    payoff: [[200000, -180000], [100000, -20000], [0, 0]], satuan: "$", goal: "max" };
  var COPIER = { alt: ["Mesin A", "Mesin B", "Mesin C"], state: ["10.000 kopi", "20.000 kopi", "30.000 kopi"],
    payoff: [[950, 1050, 1150], [850, 1100, 1350], [700, 1000, 1300]], satuan: "$", goal: "min", ukuran: "biaya sewa bulanan" };
  function ext(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  window.MODUL.push({
    topik: 1, id: "da", judul: "Decision Analysis",
    ringkas: "Memilih alternatif terbaik saat masa depan tidak pasti: tabel payoff, lima kriteria ketidakpastian, EMV, EVPI, pohon keputusan, Bayes, dan utility.",
    sub: [
      /* ================================================================ */
      {
        id: "dasar", judul: "Dasar pengambilan keputusan", menit: 10,
        ringkas: "Enam langkah keputusan, istilah alternatif–state of nature–payoff, dan tiga lingkungan keputusan.",
        gambaran: `<p><b>Decision theory</b> adalah cara yang analitis dan sistematis untuk mengambil keputusan. Keputusan yang baik itu berdasarkan logika, memakai semua data yang ada, mempertimbangkan semua alternatif, dan memakai pendekatan kuantitatif.</p>
<p>Hati-hati: <b>keputusan yang baik belum tentu hasilnya baik</b>. Kalau kamu sudah menghitung dengan benar lalu ternyata nasib sedang buruk, keputusanmu tetap keputusan yang baik. Dalam jangka panjang, cara yang sistematis akan memberi hasil yang lebih baik.</p>
<p>Contoh yang dipakai sepanjang modul ini adalah <b>Thompson Lumber</b>. John Thompson ingin membuat produk baru, gudang taman (storage shed). Ia bisa membangun pabrik besar, pabrik kecil, atau tidak membangun sama sekali. Pasarnya bisa baik atau buruk.</p>`,
        analogi: `Mau berangkat kuliah dan bingung bawa payung atau tidak. <b>Alternatif</b>: bawa / tidak bawa. <b>State of nature</b>: hujan / cerah (kamu tidak bisa mengaturnya). <b>Payoff</b>: hasil tiap kombinasi, misalnya "tidak bawa + hujan = basah kuyup".`,
        istilah: [
          ["Alternatif", "Pilihan tindakan yang BISA kita pilih, misalnya pabrik besar, pabrik kecil, tidak membangun."],
          ["State of nature", "Keadaan yang TIDAK bisa kita kendalikan, misalnya pasar baik atau pasar buruk."],
          ["Payoff (conditional value)", "Hasil dari satu alternatif pada satu keadaan, misalnya profit $200.000 kalau membangun pabrik besar dan pasar baik. Disebut <i>conditional</i> karena hasilnya bergantung pada keadaan yang terjadi."],
          ["Tabel payoff (decision table)", "Tabel dengan alternatif di baris, state of nature di kolom, dan payoff di isinya."],
          ["Do nothing", "Alternatif tidak melakukan apa-apa. Payoff-nya biasanya 0 dan sering jadi pilihan terbaik dalam kriteria pesimis. Jangan lupa memasukkannya."],
          ["Under certainty", "Hasil setiap alternatif diketahui pasti. Tinggal pilih yang terbaik."],
          ["Under uncertainty", "Ada beberapa kemungkinan keadaan, tapi <b>probabilitasnya tidak diketahui</b>. Pakai 5 kriteria: maximax, maximin, realisme, Laplace, minimax regret."],
          ["Under risk", "Ada beberapa kemungkinan keadaan dan <b>probabilitasnya diketahui</b>. Pakai EMV, EOL, EVPI, pohon keputusan."]
        ],
        langkah: [
          "<b>Definisikan masalah.</b> Thompson: apakah perlu memproduksi gudang taman?",
          "<b>Daftar semua alternatif.</b> Pabrik besar, pabrik kecil, tidak membangun. Jangan sampai ada alternatif yang terlewat.",
          "<b>Identifikasi state of nature.</b> Pasar baik atau pasar buruk. Jangan hanya membayangkan yang baik saja.",
          "<b>Tentukan payoff</b> setiap kombinasi alternatif × keadaan, lalu susun tabel payoff.",
          "<b>Pilih model keputusan</b> sesuai lingkungannya: pasti, tidak pasti (tanpa probabilitas), atau berisiko (ada probabilitas).",
          "<b>Terapkan model</b> dan ambil keputusan."
        ],
        contoh: [{
          judul: "Tabel payoff Thompson Lumber",
          soal: `Pabrik besar: profit $200.000 jika pasar baik, rugi $180.000 jika pasar buruk. Pabrik kecil: profit $100.000 jika pasar baik, rugi $20.000 jika pasar buruk. Tidak membangun: $0 di kedua keadaan. Susun tabel payoff-nya.`,
          metode: "da-ketidakpastian", data: ext(THOMPSON, { alpha: 0.8 }), sampai: 1
        }],
        variasi: [
          { judul: "Lingkungan keputusan menentukan metode", isi: `<ul>
<li><b>Pasti (certainty)</b>: contoh deposito 4% vs obligasi pemerintah 6%, keduanya dijamin. Langsung pilih yang terbaik.</li>
<li><b>Tidak pasti (uncertainty)</b>: soal tidak menyebut peluang sama sekali → pakai <a href="#modul/da/ketidakpastian">5 kriteria</a>.</li>
<li><b>Berisiko (risk)</b>: soal menyebut peluang, misalnya "probabilitas permintaan tinggi 0,8" → pakai <a href="#modul/da/risiko">EMV, EVPI, EOL</a> atau <a href="#modul/da/pohon">pohon keputusan</a>.</li></ul>` },
          { judul: "Profit atau biaya?", isi: `<p>Kalau payoff berupa <b>profit/pendapatan/nilai</b>, makin besar makin baik (maksimasi). Kalau payoff berupa <b>biaya/waktu/kerugian</b>, makin kecil makin baik (minimasi). Semua kriteria tetap bisa dipakai, hanya arah "terbaik" yang dibalik. Contoh soal biaya: biaya perawatan laptop Javar atau biaya sewa mesin fotokopi.</p>` }
        ],
        jebakan: [
          "Lupa memasukkan alternatif <b>tidak melakukan apa-apa</b> padahal soal menyebutnya (misalnya \"PT Bababa dapat memilih tidak menambah kapasitas\").",
          "Menulis <b>kerugian</b> sebagai angka positif. Rugi $180.000 ditulis −$180.000 di tabel payoff.",
          "Tertukar baris dan kolom: alternatif (yang kita pilih) di baris, keadaan (yang tidak bisa kita atur) di kolom.",
          "Soal menyebut probabilitas tapi tetap dikerjakan dengan 5 kriteria ketidakpastian (kecuali soal memang memintanya).",
          "Menganggap keputusan buruk hanya karena hasilnya buruk. Penilaian keputusan dilihat dari prosesnya."
        ],
        cek: [
          { q: "Pasar baik/buruk termasuk alternatif atau state of nature?", a: "State of nature, karena Thompson tidak bisa mengendalikannya. Alternatif adalah hal yang bisa ia pilih: pabrik besar, kecil, atau tidak membangun." },
          { q: "Soal: \"probabilitas pasar menerima produk adalah 60%\". Lingkungan keputusannya apa?", a: "Decision making under <b>risk</b>, karena probabilitasnya diketahui. Gunakan EMV (atau pohon keputusan)." },
          { q: "Kenapa payoff \"tidak membangun\" bernilai $0 di semua keadaan?", a: "Karena tidak ada investasi dan tidak ada penjualan, jadi tidak ada untung maupun rugi tambahan, apa pun keadaan pasarnya." }
        ],
        ringkasan: `<p>Keputusan = pilih <b>alternatif</b> (baris) ketika <b>state of nature</b> (kolom) tidak pasti. Isi tabel = <b>payoff</b>. Tanpa probabilitas → <b>uncertainty</b> (5 kriteria). Dengan probabilitas → <b>risk</b> (EMV dan kawan-kawan).</p>`,
        lembar: `<p>Selalu mulai dengan <b>tabel payoff</b> yang rapi: kolom pertama alternatif, kolom berikutnya setiap keadaan. Tulis rugi dengan tanda minus. Di bawah tabel, tulis satu kalimat: "Tujuan: memaksimalkan profit" atau "Tujuan: meminimalkan biaya".</p>`
      },

      /* ================================================================ */
      {
        id: "ketidakpastian", judul: "Lima kriteria dalam ketidakpastian", menit: 20, video: "v01",
        ringkas: "Maximax, maximin, kriteria realisme (Hurwicz), equally likely (Laplace), dan minimax regret, termasuk versi biaya.",
        gambaran: `<p>Saat probabilitas setiap keadaan <b>tidak diketahui</b>, kita tidak bisa menghitung rata-rata tertimbang. Yang bisa kita lakukan adalah memilih berdasarkan <b>sikap</b> pengambil keputusan:</p>
<ul><li><b>Optimis (maximax)</b>: membayangkan hasil terbaik.</li><li><b>Pesimis (maximin)</b>: berjaga-jaga terhadap hasil terburuk.</li><li><b>Realisme (Hurwicz)</b>: di tengah-tengah, dengan bobot optimisme α.</li><li><b>Equally likely (Laplace)</b>: menganggap semua keadaan sama mungkin.</li><li><b>Minimax regret</b>: meminimalkan penyesalan terbesar.</li></ul>
<p>Empat kriteria pertama dihitung langsung dari tabel payoff. Minimax regret perlu tabel baru, yaitu <b>tabel opportunity loss (regret)</b>.</p>`,
        analogi: `Memilih tempat makan sebelum tahu antreannya. Si optimis memilih resto yang <i>paling enak kalau sepi</i>. Si pesimis memilih yang <i>paling aman kalau ramai</i>. Si regret memilih yang membuatnya <i>paling sedikit menyesal</i> apa pun yang terjadi.`,
        istilah: [
          ["Maximax", "Kriteria optimis: ambil nilai TERBESAR tiap baris, lalu pilih yang terbesar."],
          ["Maximin", "Kriteria pesimis: ambil nilai TERKECIL tiap baris, lalu pilih yang terbesar (terbaik dari yang terburuk)."],
          ["Koefisien realisme (α)", "Angka 0–1 yang menunjukkan tingkat optimisme. α = 1 berarti 100% optimis, α = 0 berarti 100% pesimis."],
          ["Equally likely / Laplace", "Rata-rata setiap baris, karena semua keadaan dianggap berpeluang sama."],
          ["Opportunity loss / regret", "Selisih antara hasil terbaik yang mungkin pada suatu keadaan dan hasil yang kita dapat. Tidak pernah negatif."],
          ["Minimax regret", "Ambil regret TERBESAR tiap baris, lalu pilih yang TERKECIL."]
        ],
        rumus: [
          { nama: "Maximax (profit)", f: "max<sub>i</sub> ( max<sub>j</sub> payoff<sub>ij</sub> )", arti: "Biaya: min<sub>i</sub>( min<sub>j</sub> biaya ) — disebut minimin." },
          { nama: "Maximin (profit)", f: "max<sub>i</sub> ( min<sub>j</sub> payoff<sub>ij</sub> )", arti: "Biaya: min<sub>i</sub>( max<sub>j</sub> biaya ) — terbaik dari yang terburuk." },
          { nama: "Kriteria realisme (Hurwicz)", f: "α × (nilai terbaik baris) + (1 − α) × (nilai terburuk baris)", arti: "Profit: terbaik = terbesar, pilih hasil terbesar. Biaya: terbaik = terkecil, pilih hasil terkecil." },
          { nama: "Equally likely (Laplace)", f: "(jumlah payoff baris) ÷ (banyaknya keadaan)", arti: "Pilih rata-rata terbesar (profit) atau terkecil (biaya)." },
          { nama: "Regret", f: "Profit: regret<sub>ij</sub> = (terbesar di kolom j) − payoff<sub>ij</sub><br>Biaya: regret<sub>ij</sub> = biaya<sub>ij</sub> − (terkecil di kolom j)", arti: "Lalu minimax regret = pilih baris dengan regret maksimum paling kecil." }
        ],
        langkah: [
          "Susun tabel payoff. Tentukan tujuannya: memaksimalkan profit atau meminimalkan biaya.",
          "<b>Maximax</b>: tulis kolom tambahan \"maks baris\" → pilih yang terbesar.",
          "<b>Maximin</b>: tulis kolom \"min baris\" → pilih yang terbesar.",
          "<b>Realisme</b>: untuk setiap baris hitung α × terbaik + (1 − α) × terburuk → pilih yang terbesar.",
          "<b>Laplace</b>: hitung rata-rata setiap baris → pilih yang terbesar.",
          "<b>Minimax regret</b>: (a) cari nilai terbaik di <b>setiap kolom</b>; (b) regret = terbaik kolom − sel; (c) ambil regret terbesar tiap baris; (d) pilih yang terkecil.",
          "Rangkum keputusan setiap kriteria dalam satu tabel."
        ],
        contoh: [{
          judul: "Thompson Lumber, α = 0,8",
          soal: `Gunakan tabel payoff Thompson (pabrik besar $200.000 / −$180.000; pabrik kecil $100.000 / −$20.000; tidak membangun $0 / $0). Tentukan keputusan dengan maximax, maximin, realisme (α = 0,8), Laplace, dan minimax regret.`,
          metode: "da-ketidakpastian", data: ext(THOMPSON, { alpha: 0.8 })
        }],
        variasi: [
          { judul: "Versi biaya (minimasi)", isi: `<p>Kalau isinya biaya, arah "terbaik" dibalik: terbaik = terkecil. Optimis = pilih biaya terkecil dari biaya terkecil tiap baris (minimin). Pesimis = ambil biaya TERBESAR tiap baris, lalu pilih yang terkecil. Regret = biaya sel − biaya terkecil di kolom.</p>`,
            contoh: { soal: `Departemen kampus ingin menyewa mesin fotokopi. Biaya bulanan ($) untuk 10.000 / 20.000 / 30.000 kopi: Mesin A 950 / 1.050 / 1.150; Mesin B 850 / 1.100 / 1.350; Mesin C 700 / 1.000 / 1.300. Gunakan α = 0,7.`,
              metode: "da-ketidakpastian", data: ext(COPIER, { alpha: 0.7 }) } },
          { judul: "Lebih dari dua keadaan", isi: `<p>Kalau ada tiga keadaan atau lebih (misalnya permintaan tinggi, sedang, rendah), kriteria realisme <b>hanya memakai nilai terbaik dan terburuk</b>. Nilai tengah diabaikan. Laplace tetap memakai semuanya, dibagi banyaknya keadaan (dibagi 3, bukan 2).</p>` },
          { judul: "Hasil seri", isi: `<p>Kalau dua alternatif punya nilai yang sama, tulis keduanya: "Keputusan: A atau B (seri)". Jangan memilih salah satu secara acak tanpa keterangan.</p>` }
        ],
        jebakan: [
          "Regret dihitung per <b>KOLOM</b> (per keadaan), bukan per baris. Kesalahan paling sering!",
          "Untuk soal biaya, regret = sel − <b>terkecil</b> di kolom. Jangan pakai terbesar.",
          "<b>Maximin ≠ minimax regret.</b> Maximin melihat payoff terburuk; minimax regret melihat penyesalan terbesar.",
          "Pada kriteria realisme, α dikalikan ke nilai <b>terbaik</b>, bukan ke kolom pertama. Untuk biaya, nilai terbaik = terkecil.",
          "Laplace dibagi <b>banyaknya keadaan</b>. Dengan 3 keadaan, bagi 3.",
          "Rugi harus ikut dihitung dengan tanda minus: 0,8 × 200.000 + 0,2 × (−180.000) = 124.000, bukan 196.000."
        ],
        cek: [
          { q: "Payoff baris: 350.000 / 100.000 / −275.000 (tinggi/sedang/rendah). Berapa nilai realisme dengan α = 0,6?", a: "0,6 × 350.000 + 0,4 × (−275.000) = 210.000 − 110.000 = <b>100.000</b>. Nilai tengah 100.000 tidak dipakai." },
          { q: "Di tabel regret, kenapa baris \"tidak membangun\" pada kolom pasar buruk bernilai 0?", a: "Karena $0 adalah hasil TERBAIK pada kolom pasar buruk (dibanding rugi pabrik besar/kecil), jadi tidak ada penyesalan." },
          { q: "Biaya mesin C: 700 / 1.000 / 1.300; biaya terkecil tiap kolom: 700 / 1.000 / 1.150. Berapa regret maksimum mesin C?", a: "Regret = 0 / 0 / 150 → maksimum <b>150</b>." },
          { q: "Kriteria mana yang cocok untuk pengambil keputusan yang sangat menghindari risiko?", a: "<b>Maximin</b> (pesimis): menjamin hasil minimal yang paling besar." }
        ],
        ringkasan: `<ul><li><b>Maximax</b>: maks tiap baris → pilih maks.</li><li><b>Maximin</b>: min tiap baris → pilih maks.</li><li><b>Realisme</b>: α·terbaik + (1−α)·terburuk → pilih terbaik.</li><li><b>Laplace</b>: rata-rata baris → pilih terbaik.</li><li><b>Minimax regret</b>: regret per kolom → maks tiap baris → pilih min.</li></ul><p>Untuk biaya: semua "terbaik" berarti terkecil.</p>`,
        lembar: `<p>Gambar satu tabel payoff, lalu tambahkan kolom di kanannya: <b>Maks baris | Min baris | Realisme | Rata-rata</b>. Lingkari nilai terpilih. Buat tabel regret terpisah dengan kolom <b>Regret maks</b>. Tutup dengan tabel ringkas "Metode — Keputusan — Nilai".</p>`
      },

      /* ================================================================ */
      {
        id: "risiko", judul: "EMV, EVPI, dan EOL", menit: 20, video: "v02",
        ringkas: "Keputusan dalam risiko: expected monetary value, nilai informasi sempurna, dan expected opportunity loss.",
        gambaran: `<p>Kalau probabilitas setiap keadaan <b>diketahui</b>, kita bisa menghitung <b>rata-rata jangka panjang</b> setiap alternatif. Itulah <b>Expected Monetary Value (EMV)</b>: payoff dikali probabilitas, lalu dijumlahkan. Pilih EMV terbaik.</p>
<p>Lalu muncul pertanyaan: <i>berapa harga yang pantas dibayar untuk informasi yang memberi tahu pasti keadaan apa yang akan terjadi?</i> Jawabannya <b>EVPI (expected value of perfect information)</b>, yang menjadi <b>batas atas</b> harga informasi apa pun.</p>
<p>Cara lain yang hasilnya selalu sama dengan EMV adalah <b>EOL (expected opportunity loss)</b>: rata-rata penyesalan. Pilih EOL terkecil. EOL terkecil selalu sama dengan EVPI.</p>`,
        analogi: `Jualan es teh di depan kampus. Kalau 70% hari panas, rata-rata untung jangka panjang = 0,7 × untung saat panas + 0,3 × untung saat hujan. Itulah EMV. Ramalan cuaca yang 100% akurat punya nilai sebesar EVPI.`,
        istilah: [
          ["EMV", "Nilai harapan sebuah alternatif = Σ (payoff × probabilitas keadaan)."],
          ["EVwPI", "Expected value WITH perfect information: rata-rata hasil kalau kita selalu tahu keadaan yang akan terjadi, sehingga selalu memilih yang terbaik di setiap kolom."],
          ["EVPI", "Expected value OF perfect information: tambahan nilai karena informasi sempurna = EVwPI − EMV terbaik. Batas atas harga informasi."],
          ["EOL", "Expected opportunity loss = Σ (regret × probabilitas). Pilih yang terkecil."]
        ],
        rumus: [
          { nama: "EMV", f: "EMV(i) = Σ<sub>j</sub> payoff<sub>ij</sub> × P(j)", arti: "Profit: pilih EMV terbesar. Biaya: pilih EMV terkecil." },
          { nama: "EVwPI", f: "EVwPI = Σ<sub>j</sub> (payoff terbaik di kolom j) × P(j)", arti: "Profit: terbaik = terbesar. Biaya: terbaik = terkecil." },
          { nama: "EVPI", f: "Profit: EVPI = EVwPI − EMV terbaik<br>Biaya: EVPI = EMV terbaik − EVwPI", arti: "Selalu bernilai positif atau nol." },
          { nama: "EOL", f: "EOL(i) = Σ<sub>j</sub> regret<sub>ij</sub> × P(j)", arti: "EOL minimum = EVPI, dan keputusannya sama dengan EMV terbaik." }
        ],
        langkah: [
          "Susun tabel payoff dan tulis baris <b>probabilitas</b> di bawahnya. Pastikan jumlahnya 1.",
          "Hitung <b>EMV</b> setiap alternatif. Pilih yang terbaik.",
          "Cari nilai terbaik di <b>setiap kolom</b>, lalu hitung <b>EVwPI</b>.",
          "Hitung <b>EVPI</b> = EVwPI − EMV terbaik (untuk biaya: EMV terbaik − EVwPI).",
          "(Jika diminta) Buat tabel regret, hitung <b>EOL</b> setiap alternatif, pilih yang terkecil. Cek bahwa EOL minimum = EVPI.",
          "Tulis saran keputusan. Bandingkan harga informasi yang ditawarkan dengan EVPI."
        ],
        contoh: [{
          judul: "Thompson Lumber, P(pasar baik) = 0,5",
          soal: `Gunakan tabel payoff Thompson dengan probabilitas pasar baik = pasar buruk = 0,5. Hitung EMV, EVwPI, EVPI, dan EOL. Perusahaan riset menawarkan informasi sempurna seharga $65.000. Layak dibeli?`,
          metode: "da-risiko", data: ext(THOMPSON, { prob: [0.5, 0.5] })
        }],
        variasi: [
          { judul: "Versi biaya", isi: `<p>Untuk biaya, EMV terkecil yang dipilih, EVwPI memakai biaya terkecil di setiap kolom, dan EVPI = EMV terbaik − EVwPI (supaya hasilnya positif).</p>`,
            contoh: { soal: `Mesin fotokopi dengan probabilitas 10.000 / 20.000 / 30.000 kopi = 0,4 / 0,3 / 0,3. Pilih mesin dengan biaya harapan terkecil dan hitung EVPI.`,
              metode: "da-risiko", data: ext(COPIER, { prob: [0.4, 0.3, 0.3] }) } },
          { judul: "Membandingkan harga informasi dengan EVPI", isi: `<p>Di contoh Thompson, EVPI = $60.000. Penawaran informasi seharga $65.000 <b>tidak layak</b> karena lebih mahal dari nilai maksimum informasi sempurna. Informasi yang tidak sempurna (survei biasa) pasti bernilai lebih rendah lagi. Nilainya dihitung dengan <a href="#modul/da/bayes">EVSI</a>.</p>` }
        ],
        jebakan: [
          "<b>EVPI ≠ EVwPI.</b> EVwPI adalah nilai rata-rata dengan informasi; EVPI adalah selisihnya dengan EMV terbaik.",
          "Untuk biaya, EVPI = EMV terbaik − EVwPI (dibalik), supaya tidak negatif.",
          "EOL memakai tabel <b>regret</b>, bukan tabel payoff.",
          "Probabilitas harus berjumlah 1. Kalau soal hanya memberi P(high season) = 0,8, maka P(low season) = 0,2.",
          "Nilai negatif tetap dikalikan: 0,5 × (−180.000) = −90.000."
        ],
        cek: [
          { q: "EMV terbaik = 40.000 dan EVwPI = 100.000. Berapa EVPI?", a: "EVPI = 100.000 − 40.000 = <b>60.000</b>." },
          { q: "Kenapa EOL minimum selalu sama dengan EVPI?", a: "Karena EOL mengukur rata-rata kerugian akibat tidak tahu keadaan yang terjadi. Kerugian itulah yang hilang kalau kita punya informasi sempurna, sehingga nilainya sama dengan EVPI." },
          { q: "Biaya perawatan laptop baru: Rp18.000 (high season, p = 0,8) dan Rp10.000 (low season). Berapa EMV-nya?", a: "0,8 × 18.000 + 0,2 × 10.000 = 14.400 + 2.000 = <b>Rp16.400</b>." }
        ],
        ringkasan: `<p><b>EMV</b> = Σ payoff × p → pilih terbaik. <b>EVwPI</b> = Σ terbaik kolom × p. <b>EVPI</b> = EVwPI − EMV terbaik (biaya: dibalik). <b>EOL</b> = Σ regret × p → pilih terkecil; EOL minimum = EVPI.</p>`,
        lembar: `<p>Tulis tabel payoff + baris probabilitas + kolom EMV. Di bawahnya tulis perhitungan EMV satu per satu (dosen menilai cara). Lalu tulis baris "Dengan informasi sempurna" untuk EVwPI, perhitungan EVPI, dan kesimpulan: "Keputusan: Pabrik kecil (EMV $40.000). Informasi seharga $65.000 tidak layak karena EVPI hanya $60.000."</p>`
      },

      /* ================================================================ */
      {
        id: "sensitivitas", judul: "Analisis sensitivitas", menit: 12, video: "v02",
        ringkas: "Seberapa jauh probabilitas boleh berubah sebelum keputusan terbaik ikut berubah.",
        gambaran: `<p>Keputusan EMV bergantung pada probabilitas yang sering hanya berupa perkiraan. <b>Analisis sensitivitas</b> menjawab: <i>kalau probabilitasnya berbeda, apakah keputusanku berubah?</i></p>
<p>Untuk dua keadaan, misalkan <b>P</b> = peluang keadaan pertama, sehingga peluang keadaan kedua = 1 − P. Setiap alternatif menjadi <b>garis lurus</b> EMV terhadap P. Titik potong antargaris adalah batas tempat keputusan terbaik berganti.</p>`,
        istilah: [
          ["P", "Probabilitas keadaan pertama (misalnya pasar baik). Keadaan kedua = 1 − P."],
          ["Titik indiferen", "Nilai P saat dua alternatif punya EMV sama, sehingga kita tidak peduli memilih yang mana."],
          ["Rentang keputusan", "Interval nilai P tempat satu alternatif menjadi yang terbaik."]
        ],
        rumus: [
          { nama: "EMV sebagai fungsi P", f: "EMV(i) = a<sub>i</sub>·P + b<sub>i</sub>·(1 − P) = (a<sub>i</sub> − b<sub>i</sub>)·P + b<sub>i</sub>", arti: "a = payoff keadaan 1, b = payoff keadaan 2." },
          { nama: "Titik potong", f: "EMV(i) = EMV(k) → P = (b<sub>k</sub> − b<sub>i</sub>) / [(a<sub>i</sub> − b<sub>i</sub>) − (a<sub>k</sub> − b<sub>k</sub>)]", arti: "Cukup samakan dua persamaan garis lalu selesaikan P." }
        ],
        langkah: [
          "Tulis EMV setiap alternatif dalam bentuk P dan (1 − P), lalu sederhanakan menjadi bentuk (…)P + (…).",
          "Gambar garisnya (opsional tapi membantu): sumbu-x = P dari 0 sampai 1.",
          "Samakan EMV dua alternatif yang bersebelahan, lalu selesaikan P untuk mencari titik potong.",
          "Tulis tabel rentang P → alternatif terbaik."
        ],
        contoh: [{
          judul: "Thompson Lumber",
          soal: `Dengan payoff Thompson, untuk nilai P (peluang pasar baik) berapa saja Thompson sebaiknya tidak membangun, membangun pabrik kecil, atau membangun pabrik besar?`,
          metode: "da-sensitivitas", data: THOMPSON
        }],
        variasi: [
          { judul: "Sensitivitas pada pohon keputusan", isi: `<p>Cara yang sama dipakai untuk pohon keputusan. Contoh Thompson dengan survei: kalau p = peluang hasil survei positif, EMV(lakukan survei) = 106.400p + 2.400(1 − p) = 104.000p + 2.400. Survei tetap dipilih selama EMV-nya > $40.000 (EMV tanpa survei): 104.000p + 2.400 = 40.000 → <b>p = 0,36</b>. Jadi kalau peluang survei positif turun di bawah 0,36, survei tidak lagi layak.</p>` }
        ],
        jebakan: [
          "Salah mengalikan (1 − P): −180.000 × (1 − P) = −180.000 + 180.000P (tanda harus benar).",
          "Lupa garis \"tidak membangun\" (EMV = 0) yang menentukan titik potong pertama.",
          "Menulis rentang terbalik. Ingat: makin besar P (pasar baik makin mungkin), alternatif yang berani makin menarik."
        ],
        cek: [
          { q: "EMV(kecil) = 120.000P − 20.000. Pada P berapa EMV(kecil) = 0?", a: "120.000P = 20.000 → <b>P = 0,167</b>." },
          { q: "Kalau P = 0,7, apa keputusan Thompson?", a: "0,7 > 0,615, jadi <b>pabrik besar</b>." }
        ],
        ringkasan: `<p>Ubah setiap EMV menjadi garis terhadap P, samakan dua garis untuk mendapat titik potong, lalu tulis rentang P untuk setiap alternatif terbaik. Thompson: P &lt; 0,167 → tidak membangun; 0,167–0,615 → pabrik kecil; &gt; 0,615 → pabrik besar.</p>`,
        lembar: `<p>Tulis tiga persamaan garis, dua persamaan titik potong, dan tabel rentang. Sketsa grafik kecil akan memperjelas jawabanmu.</p>`
      },

      /* ================================================================ */
      {
        id: "pohon", judul: "Pohon keputusan", menit: 18, video: "v03",
        ringkas: "Menggambar keputusan bertahap dengan simpul □ dan ○, lalu menghitung mundur (rollback) dengan EMV.",
        gambaran: `<p>Semua soal tabel payoff bisa digambar sebagai <b>pohon keputusan</b>. Pohon sangat berguna kalau ada <b>beberapa keputusan berurutan</b>, misalnya "survei dulu atau tidak?", lalu "bangun besar, kecil, atau tidak?".</p>
<p>Ada dua jenis simpul. <b>Kotak □ = simpul keputusan</b>: kita yang memilih cabangnya. <b>Lingkaran ○ = simpul peluang</b>: alam/pasar yang menentukan, dengan probabilitas di setiap cabang. Payoff ditulis di ujung kanan.</p>
<p>Cara menghitungnya selalu dari <b>kanan ke kiri</b> (rollback). Di setiap lingkaran hitung EMV. Di setiap kotak pilih cabang terbaik dan coret (//) cabang lain.</p>`,
        istilah: [
          ["Simpul keputusan (□)", "Titik ketika pengambil keputusan memilih salah satu alternatif."],
          ["Simpul peluang (○)", "Titik ketika salah satu state of nature terjadi. Probabilitas cabangnya berjumlah 1."],
          ["Rollback", "Menghitung dari kanan ke kiri: EMV di simpul peluang, pilih terbaik di simpul keputusan."],
          ["Keputusan berurutan", "Keputusan yang hasilnya memengaruhi keputusan berikutnya, misalnya survei → bangun pabrik."]
        ],
        langkah: [
          "Definisikan masalahnya.",
          "Gambar pohon dari kiri ke kanan: □ untuk keputusan, ○ untuk keadaan. Masukkan SEMUA alternatif, termasuk tidak melakukan apa-apa.",
          "Tulis probabilitas di setiap cabang keadaan.",
          "Tulis payoff di ujung setiap cabang. Kalau ada biaya (misalnya survei), kurangkan dari semua payoff di cabang itu.",
          "Hitung mundur: EMV di setiap ○, pilih yang terbaik di setiap □, coret cabang yang tidak dipilih."
        ],
        contoh: [{
          judul: "Pohon sederhana Thompson",
          soal: `Gambar pohon keputusan Thompson Lumber dengan P(pasar baik) = 0,5 lalu tentukan keputusan terbaiknya.`,
          metode: "da-pohon", data: { goal: "max", satuan: "$", pohon: { jenis: "keputusan", cabang: [
            { label: "Pabrik besar", ke: { jenis: "peluang", cabang: [{ label: "Pasar baik", p: 0.5, ke: { jenis: "akhir", nilai: 200000 } }, { label: "Pasar buruk", p: 0.5, ke: { jenis: "akhir", nilai: -180000 } }] } },
            { label: "Pabrik kecil", ke: { jenis: "peluang", cabang: [{ label: "Pasar baik", p: 0.5, ke: { jenis: "akhir", nilai: 100000 } }, { label: "Pasar buruk", p: 0.5, ke: { jenis: "akhir", nilai: -20000 } }] } },
            { label: "Tidak membangun", ke: { jenis: "akhir", nilai: 0 } }] } }
        }],
        variasi: [
          { judul: "Pohon dua tahap (ada studi pendahuluan)", isi: `<p>Kalau ada pilihan melakukan studi dulu, cabang pertama menjadi "lakukan studi" vs "tanpa studi". Setelah studi, ada simpul peluang hasil studi (baik/buruk), lalu di setiap hasil ada keputusan bangun besar/kecil/tidak. Probabilitas pasar di cabang setelah studi adalah <b>probabilitas posterior</b> (sudah direvisi oleh hasil studi). Biaya studi dikurangkan dari setiap payoff di cabang studi.</p>`,
            contoh: { soal: `Monica ingin membuat pabrik perahu layar anak. Fasilitas kecil: $60.000 (pasar baik) / −$20.000 (pasar buruk). Fasilitas besar: $90.000 / −$30.000. Tanpa studi, P(pasar baik) = 0,6. Studi pendahuluan berbiaya $10.000; peluang studi baik 0,65; P(pasar baik | studi baik) = 0,8; P(pasar buruk | studi buruk) = 0,9. Apa saranmu dan berapa EVSI-nya?`,
              metode: "da-survei", data: { alt: ["Fasilitas kecil", "Fasilitas besar", "Tanpa fasilitas"], state: ["Pasar baik", "Pasar buruk"],
                payoff: [[60000, -20000], [90000, -30000], [0, 0]], prior: [0.6, 0.4], goal: "max", satuan: "$",
                survei: { label: "Studi", biaya: 10000, hasil: ["Studi baik", "Studi buruk"], pHasil: [0.65, 0.35], posterior: [[0.8, 0.2], [0.1, 0.9]] } } } },
          { judul: "Pohon untuk biaya", isi: `<p>Kalau payoff berupa biaya (misalnya biaya perawatan), rollback-nya sama, tetapi di simpul keputusan pilih <b>EMV terkecil</b>.</p>` }
        ],
        jebakan: [
          "Tertukar simbol: <b>□ = keputusan</b>, <b>○ = peluang</b>.",
          "Di simpul keputusan TIDAK ada probabilitas. Kita memilih, bukan merata-rata.",
          "Biaya survei harus dikurangkan dari <b>semua</b> payoff di cabang survei (termasuk cabang tidak membangun: 0 − 10.000 = −10.000).",
          "Menghitung dari kiri ke kanan. Rollback selalu dari kanan.",
          "Probabilitas setelah survei bukan probabilitas awal (prior), melainkan posterior."
        ],
        cek: [
          { q: "Di simpul keputusan, cabangnya punya EMV 106.400, 63.600, dan −10.000. Nilai simpul itu berapa?", a: "Pilih yang terbesar: <b>106.400</b>. Dua cabang lain dicoret." },
          { q: "Payoff pabrik besar $200.000. Kalau ada survei $10.000, berapa payoff di cabang survei?", a: "200.000 − 10.000 = <b>$190.000</b>." }
        ],
        ringkasan: `<p>□ pilih, ○ rata-rata. Gambar dari kiri, hitung dari kanan. Biaya informasi dikurangkan di ujung cabang. Hasil akhir: strategi lengkap, misalnya "lakukan survei; jika positif bangun besar, jika negatif bangun kecil".</p>`,
        lembar: `<p>Gambar pohon dengan rapi (beri nomor simpul ○ 1, 2, 3 …). Tulis probabilitas di cabang, payoff di ujung, EMV di atas setiap simpul, dan tanda // pada cabang yang tidak dipilih. Di bawahnya tulis perhitungan EMV setiap simpul.</p>`
      },

      /* ================================================================ */
      {
        id: "bayes", judul: "Bayes, EVSI, dan efisiensi informasi", menit: 22, video: "v03",
        ringkas: "Merevisi probabilitas dengan hasil survei (prior → posterior), lalu menilai berapa harga survei yang pantas.",
        gambaran: `<p>Survei atau riset pasar memberi informasi tambahan, tapi <b>tidak sempurna</b>. Teorema Bayes memakai dua hal: <b>prior</b> (perkiraan awal peluang pasar) dan <b>keandalan survei</b> (seberapa sering survei benar), untuk menghasilkan <b>posterior</b>, yaitu peluang pasar <i>setelah</i> kita tahu hasil survei.</p>
<p>Data dari soal biasanya berbentuk "P(survei positif | pasar baik) = 0,7". Itu <b>kebalikan</b> dari yang kita butuhkan di pohon, yaitu "P(pasar baik | survei positif)". Bayes membalikkannya.</p>
<p>Setelah pohon dihitung, <b>EVSI</b> (expected value of sample information) menunjukkan nilai survei yang sebenarnya, dan <b>efisiensi</b> membandingkannya dengan informasi sempurna (EVPI).</p>`,
        analogi: `Tes COVID antigen. Prior = peluang kamu sakit sebelum tes. Keandalan = seberapa sering tes positif kalau memang sakit. Posterior = peluang kamu benar-benar sakit SETELAH tesnya positif.`,
        istilah: [
          ["Prior", "Probabilitas awal suatu keadaan sebelum ada informasi baru. Contoh: P(pasar baik) = 0,5."],
          ["Kondisional / likelihood", "P(hasil survei | keadaan sebenarnya). Contoh: P(survei positif | pasar baik) = 0,7."],
          ["Joint", "Peluang dua hal terjadi bersamaan = kondisional × prior."],
          ["Posterior", "P(keadaan | hasil survei) = joint ÷ P(hasil survei). Inilah yang dipakai di cabang pohon setelah survei."],
          ["EVSI", "Expected value of sample information = berapa nilai tambah dari informasi sampel (survei)."],
          ["Efisiensi sampel", "EVSI ÷ EVPI × 100%. 100% berarti informasinya sempurna."]
        ],
        rumus: [
          { nama: "Teorema Bayes", f: "P(A | B) = P(B | A)·P(A) / [ P(B | A)·P(A) + P(B | A′)·P(A′) ]", arti: "A = keadaan (misalnya pasar baik), B = hasil survei (misalnya positif), A′ = kebalikan A." },
          { nama: "Peluang hasil survei", f: "P(positif) = P(pos | baik)·P(baik) + P(pos | buruk)·P(buruk)", arti: "Ini penyebut Bayes, sekaligus probabilitas cabang hasil survei di pohon." },
          { nama: "EVSI", f: "EVSI = (EV dengan SI + biaya survei) − EV tanpa SI", arti: "Biaya ditambahkan kembali karena sebelumnya sudah dikurangkan dari payoff." },
          { nama: "Efisiensi", f: "Efisiensi = EVSI / EVPI × 100%", arti: "Makin dekat 100%, makin bagus informasinya." }
        ],
        langkah: [
          "Tulis prior dan tabel keandalan survei P(hasil | keadaan). Lengkapi komplemennya: P(negatif | baik) = 1 − P(positif | baik).",
          "Untuk hasil <b>positif</b>: joint = kondisional × prior untuk setiap keadaan → jumlahkan = P(positif) → posterior = joint ÷ P(positif).",
          "Ulangi untuk hasil <b>negatif</b>.",
          "Masukkan P(positif), P(negatif), dan semua posterior ke pohon keputusan. Kurangkan biaya survei dari payoff di cabang survei.",
          "Rollback pohon untuk mendapat EV dengan survei dan EV tanpa survei.",
          "Hitung EVSI dan efisiensi. Survei layak kalau EVSI > biaya survei (setara dengan EV dengan survei > EV tanpa survei)."
        ],
        contoh: [{
          judul: "Thompson Lumber dengan survei pasar $10.000",
          soal: `Prior P(pasar baik) = P(pasar buruk) = 0,5. Keandalan survei: P(positif | pasar baik) = 0,7; P(positif | pasar buruk) = 0,2. Survei berbiaya $10.000. Hitung posterior, selesaikan pohon, lalu hitung EVSI dan efisiensinya. (Posterior dibulatkan 2 desimal seperti di buku.)`,
          metode: "da-survei", data: ext(THOMPSON, { prior: [0.5, 0.5],
            survei: { label: "Survei", biaya: 10000, hasil: ["Survei positif", "Survei negatif"], likelihood: [[0.7, 0.3], [0.2, 0.8]], bulat: 2 } })
        }],
        variasi: [
          { judul: "Soal Bayes saja (tanpa payoff)", isi: `<p>Kadang soal hanya meminta probabilitas yang direvisi, misalnya peluang driving range sukses jika survei mendukung. Cukup buat tabel prior–kondisional–joint–posterior.</p>`,
            contoh: { soal: `Peluang driving range golf sukses = 40%. Jika driving range akan sukses, peluang survei mendukung = 0,9. Jika tidak sukses, peluang survei tidak mendukung = 0,8. Hitung semua probabilitas yang direvisi.`,
              metode: "da-bayes", data: { state: ["Sukses", "Tidak sukses"], prior: [0.4, 0.6], hasil: ["Survei mendukung", "Survei tidak mendukung"], likelihood: [[0.9, 0.1], [0.2, 0.8]] } } },
          { judul: "Posterior sudah diberikan", isi: `<p>Ada soal yang langsung memberi P(pasar baik | info mendukung) dan P(info mendukung). Kalau begitu, langsung masukkan ke pohon tanpa menghitung Bayes. Contohnya soal apartemen quadplex/duplex di <a href="#pembahasan/pr-3">pembahasan PR Soal 3</a>.</p>` }
        ],
        jebakan: [
          "Tertukar arah: data soal adalah P(survei | pasar), sedangkan pohon butuh P(pasar | survei).",
          "Lupa komplemen: kalau P(tidak mendukung | tidak sukses) = 0,8, maka P(mendukung | tidak sukses) = 0,2.",
          "Penyebut posterior = P(hasil survei), yaitu JUMLAH joint, bukan 1.",
          "Probabilitas cabang hasil survei di pohon = P(positif) dan P(negatif), bukan prior.",
          "EVSI: jangan lupa menambahkan kembali biaya survei sebelum dikurangi EV tanpa survei.",
          "Pembulatan: buku membulatkan posterior ke 2 desimal (0,78), sehingga hasilnya sedikit berbeda dengan memakai 0,7778. Tulis pembulatan yang kamu pakai."
        ],
        cek: [
          { q: "Prior 0,5/0,5, P(pos | baik) = 0,7, P(pos | buruk) = 0,2. Berapa P(positif)?", a: "0,7 × 0,5 + 0,2 × 0,5 = 0,35 + 0,10 = <b>0,45</b>." },
          { q: "Lanjutan: berapa P(pasar baik | positif)?", a: "0,35 ÷ 0,45 = <b>0,78</b>." },
          { q: "EV dengan survei = 49.200 (biaya 10.000 sudah dikurangkan), EV tanpa survei = 40.000. Berapa EVSI?", a: "(49.200 + 10.000) − 40.000 = <b>19.200</b>. Survei layak karena 19.200 > 10.000." }
        ],
        ringkasan: `<p>Posterior = (kondisional × prior) ÷ P(hasil). Masukkan ke pohon, rollback, lalu EVSI = (EV dengan SI + biaya) − EV tanpa SI dan efisiensi = EVSI ÷ EVPI.</p>`,
        lembar: `<p>Buat dua tabel Bayes (untuk hasil positif dan negatif) dengan kolom: Keadaan | P(hasil | keadaan) | Prior | Joint | Posterior. Lalu gambar pohon lengkap dan tutup dengan perhitungan EVSI, efisiensi, dan strategi: "Lakukan survei; jika positif → …, jika negatif → …".</p>`
      },

      /* ================================================================ */
      {
        id: "utility", judul: "Teori utilitas", menit: 12, video: "v04",
        ringkas: "Ketika uang bukan satu-satunya ukuran: standard gamble, kurva utilitas, risk avoider vs risk seeker.",
        gambaran: `<p>EMV tidak selalu menggambarkan pilihan manusia. Orang membeli asuransi (EMV negatif), dan banyak orang memilih $2 juta pasti daripada lempar koin 50% dapat $5 juta (EMV $2,5 juta). Alasannya, <b>nilai uang bagi setiap orang berbeda</b>. Nilai keseluruhan suatu hasil disebut <b>utilitas</b>.</p>
<p>Dengan teori utilitas, payoff uang diganti dengan <b>nilai utilitas (0–1)</b>, lalu kita memilih alternatif dengan <b>expected utility</b> terbesar.</p>`,
        istilah: [
          ["Utilitas", "Nilai/kepuasan keseluruhan dari suatu hasil menurut pengambil keputusan."],
          ["Standard gamble", "Cara menilai utilitas: cari probabilitas p yang membuat kita indiferen antara hasil pasti dan undian (terbaik dengan p, terburuk dengan 1 − p). Utilitas hasil pasti = p."],
          ["Risk avoider", "Penghindar risiko. Kurva utilitas naik makin lambat (cekung ke bawah)."],
          ["Risk seeker", "Pencari risiko. Kurva utilitas naik makin cepat (cekung ke atas)."],
          ["Risk indifferent", "Netral terhadap risiko. Kurva utilitas berupa garis lurus, jadi keputusannya sama dengan EMV."]
        ],
        rumus: [
          { nama: "Standard gamble", f: "U(hasil lain) = p × U(terbaik) + (1 − p) × U(terburuk) = p × 1 + (1 − p) × 0 = p", arti: "Hasil terburuk diberi utilitas 0, hasil terbaik 1." },
          { nama: "Expected utility", f: "EU(i) = Σ<sub>j</sub> U(payoff<sub>ij</sub>) × P(j)", arti: "Pilih EU terbesar." }
        ],
        langkah: [
          "Beri utilitas 0 untuk hasil terburuk dan 1 untuk hasil terbaik.",
          "Untuk hasil lain, cari p indiferen (standard gamble) → utilitasnya = p. Gambarkan kurva utilitas.",
          "Ganti setiap payoff uang di pohon/tabel dengan nilai utilitasnya.",
          "Hitung expected utility (seperti EMV, tapi memakai utilitas) dan pilih yang terbesar."
        ],
        contoh: [{
          judul: "Mark Simkin dan lempar paku payung",
          soal: `Kalau paku jatuh dengan ujung ke atas (p = 0,45), Mark menang $10.000; kalau ke bawah (p = 0,55), ia kalah $10.000. Ia juga boleh tidak bermain ($0). Utilitas Mark: U(−$10.000) = 0,05; U($0) = 0,15; U($10.000) = 0,30. Apakah Mark sebaiknya bermain?`,
          metode: "da-pohon", data: { goal: "max", utilitas: true, pohon: { jenis: "keputusan", cabang: [
            { label: "Main", ke: { jenis: "peluang", cabang: [{ label: "Ujung ke atas", p: 0.45, ke: { jenis: "akhir", nilai: 0.30 } }, { label: "Ujung ke bawah", p: 0.55, ke: { jenis: "akhir", nilai: 0.05 } }] } },
            { label: "Tidak main", ke: { jenis: "akhir", nilai: 0.15 } }] } }
        }],
        variasi: [
          { judul: "Membangun kurva utilitas (Jane Dickson)", isi: `<p>Jane memilih antara bank ($5.000 pasti) dan properti ($0 atau $10.000). Ia baru mau memilih properti kalau peluang mendapat $10.000 minimal 80%, jadi <b>U($5.000) = 0,8</b>. Dengan cara yang sama, U($7.000) = 0,9 dan U($3.000) = 0,5. Kurvanya naik makin lambat, jadi Jane adalah <b>risk avoider</b>.</p>` },
          { judul: "EMV vs utilitas bisa berbeda", isi: `<p>Pada contoh Mark, EMV(main) = 0,45 × 10.000 + 0,55 × (−10.000) = −$1.000 < $0, jadi menurut EMV sebaiknya tidak bermain. Tapi menurut utilitas, Mark bermain (0,1625 > 0,15) karena ia <b>risk seeker</b>.</p>` }
        ],
        jebakan: [
          "Di pohon utilitas, yang dihitung adalah utilitas harapan, bukan EMV. Jangan mencampur angka uang dan utilitas.",
          "Utilitas terburuk = 0 dan terbaik = 1, bukan −1.",
          "Risk avoider = kurva cekung ke bawah (naik melambat); risk seeker = kurva cekung ke atas (naik makin cepat)."
        ],
        cek: [
          { q: "Kamu indiferen antara Rp1 juta pasti dan undian (Rp5 juta dengan p = 0,4; Rp0 dengan 0,6). Berapa U(Rp1 juta)?", a: "<b>0,4</b> (sama dengan p indiferen), dengan U(Rp5 juta) = 1 dan U(Rp0) = 0." },
          { q: "Kurva utilitas berupa garis lurus menunjukkan sikap apa?", a: "<b>Risk indifferent</b> (netral). Keputusannya sama dengan EMV." }
        ],
        ringkasan: `<p>Ganti uang dengan utilitas (0–1), hitung expected utility, pilih yang terbesar. Bentuk kurva menunjukkan sikap: cekung ke bawah = avoider, cekung ke atas = seeker, lurus = netral.</p>`,
        lembar: `<p>Tulis tabel/pohon dengan payoff uang, lalu di sebelahnya tulis utilitasnya. Hitung EU setiap alternatif dan tulis kesimpulan beserta sikap risiko pengambil keputusan.</p>`
      }
    ]
  });
})();
