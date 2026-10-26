// Modul Topik 2 — AHP (Analytic Hierarchy Process). Semua angka contoh dihitung oleh solver.js.
(function () {
  var third = 1 / 3;
  var MOBIL_KRITERIA = [[1, 3, 2, 2], [null, 1, 0.25, 0.25], [null, 4, 1, 0.5], [null, 4, 2, 1]];
  var MOBIL = {
    kriteria: ["Harga", "MPG", "Kenyamanan", "Gaya"],
    matKriteria: MOBIL_KRITERIA,
    alternatif: ["Mobil A", "Mobil B", "Mobil C"],
    matAlternatif: [
      [[1, third, 0.25], [3, 1, 0.5], [4, 2, 1]],
      [[1, 0.25, 1 / 6], [4, 1, third], [6, 3, 1]],
      [[1, 2, 8], [0.5, 1, 6], [0.125, 1 / 6, 1]],
      [[1, third, 4], [3, 1, 7], [0.25, 1 / 7, 1]]]
  };
  var HP_KRITERIA = [[1, 1 / 8, 7], [8, 1, 8], [1 / 7, 1 / 8, 1]];
  var HANDPHONE = {
    kriteria: ["Kamera", "Storage", "Body"],
    matKriteria: HP_KRITERIA,
    alternatif: ["IPON", "Samsuang", "Huaweh"],
    matAlternatif: [
      [[1, 5, 8], [null, 1, 5], [null, null, 1]],
      [[1, 0.2, 5], [5, 1, 7], [null, null, 1]],
      [[1, 6, 8], [null, 1, 7], [null, null, 1]]]
  };

  window.MODUL.push({
    topik: 2, id: "ahp", judul: "AHP",
    ringkas: "Memilih alternatif terbaik dengan banyak kriteria: MFEP, perbandingan berpasangan skala 1–9, bobot, uji konsistensi (CI dan CR), dan sintesis ranking.",
    sub: [
      /* ================================================================ */
      {
        id: "mfep", judul: "Keputusan multifaktor (MFEP) dan kapan memakai AHP", menit: 10,
        ringkas: "Bobot faktor × nilai evaluasi lalu dijumlah, serta kapan kita butuh AHP karena bobotnya sulit ditentukan langsung.",
        gambaran: `<p>Banyak keputusan melibatkan <b>beberapa faktor sekaligus</b>. Memilih pekerjaan, misalnya, melibatkan gaji, jenjang karier, dan lokasi. Memilih kos melibatkan jarak, fasilitas, dan harga. Cara kuantitatif paling sederhana adalah <b>MFEP (Multifactor Evaluation Process)</b>.</p>
<p>Di MFEP, kamu sendiri yang memberi <b>bobot</b> setiap faktor (jumlahnya harus 1) dan <b>nilai evaluasi</b> setiap alternatif pada setiap faktor (misalnya skala 0–1). Skor akhir = jumlah dari (bobot × evaluasi). Alternatif dengan skor terbesar dipilih.</p>
<p>Masalahnya, sering kali kita <b>tidak yakin</b> berapa bobot yang tepat. Apakah gaji 0,3 atau 0,35? Di situlah <b>AHP (Analytic Hierarchy Process)</b> dari Thomas L. Saaty dipakai. AHP tidak meminta bobot langsung, tetapi hanya <b>membandingkan dua hal sekaligus</b> ("mana yang lebih penting, dan seberapa?"), lalu menghitung bobotnya untuk kita dan mengecek apakah penilaian kita konsisten.</p>`,
        analogi: `Memilih tempat makan siang bersama teman. Kalau kalian langsung sepakat "harga 60%, rasa 30%, jarak 10%", cukup pakai MFEP. Tapi kalau bingung memberi persentase, lebih mudah menjawab pertanyaan seperti "rasa vs harga, mana lebih penting, dan seberapa jauh?". Itulah cara kerja AHP.`,
        istilah: [
          ["Multifactor decision making", "Keputusan yang mempertimbangkan banyak faktor/kriteria sekaligus."],
          ["MFEP", "Multifactor Evaluation Process: bobot faktor dan nilai evaluasi ditentukan langsung, lalu dihitung skor tertimbangnya."],
          ["Bobot faktor (factor weight)", "Seberapa penting suatu faktor dibanding faktor lain. Di MFEP, semua bobot berjumlah 1."],
          ["Evaluasi faktor (factor evaluation)", "Seberapa baik suatu alternatif pada satu faktor, misalnya gaji AA dinilai 0,7."],
          ["Total weighted evaluation", "Skor akhir alternatif = Σ (bobot faktor × evaluasi faktor)."],
          ["AHP", "Analytic Hierarchy Process: bobot dan evaluasi dihitung dari perbandingan berpasangan, lengkap dengan uji konsistensi."]
        ],
        rumus: [
          { nama: "Skor MFEP", f: "Skor(alternatif i) = Σ<sub>j</sub> bobot<sub>j</sub> × evaluasi<sub>ij</sub>", arti: "Syarat: Σ bobot<sub>j</sub> = 1. Pilih skor terbesar." },
          { nama: "Kapan MFEP, kapan AHP?", f: "Yakin dengan bobot dan evaluasi → MFEP<br>Ragu, lebih mudah membandingkan berpasangan → AHP", arti: "AHP perlu lebih banyak hitungan, tapi bobotnya lebih terukur dan ada uji konsistensi (CR)." }
        ],
        langkah: [
          "Daftar semua <b>faktor</b> yang penting, lalu beri <b>bobot</b> setiap faktor. Pastikan jumlah bobot = 1.",
          "Beri <b>nilai evaluasi</b> setiap alternatif pada setiap faktor (skala yang sama untuk semua, misalnya 0–1).",
          "Kalikan bobot × evaluasi untuk setiap faktor.",
          "Jumlahkan hasil kali itu per alternatif menjadi <b>total weighted evaluation</b>.",
          "Pilih alternatif dengan total terbesar, lalu tulis urutannya."
        ],
        contoh: [{
          judul: "Steve Markel memilih pekerjaan",
          soal: `Steve menilai tiga faktor: gaji (bobot 0,3), jenjang karier (0,6), dan lokasi (0,1). Evaluasinya (skala 0–1): AA Company 0,7 / 0,9 / 0,6; EDS, Ltd. 0,8 / 0,7 / 0,8; PW, Inc. 0,9 / 0,6 / 0,9. Perusahaan mana yang sebaiknya dipilih?`,
          metode: "ahp-mfep", data: { faktor: ["Gaji", "Karier", "Lokasi"], bobot: [0.3, 0.6, 0.1], alternatif: ["AA Co.", "EDS, Ltd.", "PW, Inc."], evaluasi: [[0.7, 0.9, 0.6], [0.8, 0.7, 0.8], [0.9, 0.6, 0.9]] }
        }],
        variasi: [
          { judul: "Banyak faktor sekaligus", isi: `<p>Jumlah faktor tidak dibatasi. Yang penting bobotnya tetap berjumlah 1 dan setiap alternatif dinilai pada SEMUA faktor.</p>`,
            contoh: { soal: `George memilih pemutar musik. Bobot faktor: harga 0,4; warna 0,1; garansi 0,1; ukuran 0,1; merek 0,3. Evaluasi Sun: 0,7 / 0,9 / 0,8 / 0,8 / 0,9. Hitek: 0,6 / 0,9 / 0,9 / 0,8 / 0,9. Surgo: 0,8 / 0,4 / 0,4 / 0,2 / 0,6. Merek mana yang dipilih?`,
              metode: "ahp-mfep", data: { faktor: ["Harga", "Warna", "Garansi", "Ukuran", "Merek"], bobot: [0.4, 0.1, 0.1, 0.1, 0.3], alternatif: ["Sun", "Hitek", "Surgo"], evaluasi: [[0.7, 0.9, 0.8, 0.8, 0.9], [0.6, 0.9, 0.9, 0.8, 0.9], [0.8, 0.4, 0.4, 0.2, 0.6]] } } },
          { judul: "Evaluasi dengan skala 1–10", isi: `<p>Evaluasi tidak harus 0–1. Boleh skala 1–10, asal semua alternatif memakai skala yang sama. Total skornya ikut berskala 1–10, dan cara memilihnya tetap sama: ambil yang terbesar.</p>`,
            contoh: { soal: `Gina memilih program MBA. Bobot: biaya 0,6; reputasi 0,2; kualitas hidup 0,2. Rating (1 = buruk, 10 = sempurna): Univ A 4 / 9 / 7; Univ B 8 / 5 / 7; Univ C 7 / 6 / 3.`,
              metode: "ahp-mfep", data: { faktor: ["Biaya", "Reputasi", "Kualitas hidup"], bobot: [0.6, 0.2, 0.2], alternatif: ["Univ A", "Univ B", "Univ C"], evaluasi: [[4, 9, 7], [8, 5, 7], [7, 6, 3]] } } },
          { judul: "Kalau ragu memberi bobot → AHP", isi: `<p>Kalau Gina tidak nyaman memberi rating langsung, ia bisa membandingkan dua universitas sekaligus ("B jauh lebih murah dari A", "C sedikit lebih murah dari A", dan seterusnya). Dari perbandingan itu AHP menghitung bobotnya. Lanjutkan ke <a href="#modul/ahp/matriks">matriks perbandingan berpasangan</a>.</p>` }
        ],
        jebakan: [
          "Bobot faktor harus berjumlah <b>1</b>. Kalau soal memberi bobot yang jumlahnya bukan 1, cek ulang atau tanyakan, jangan langsung dipakai.",
          "Yang berjumlah 1 adalah <b>bobot</b>, bukan nilai evaluasi. Evaluasi tiap alternatif tidak harus berjumlah 1.",
          "Mengalikan evaluasi dengan bobot faktor yang salah (tertukar urutan kolom). Tulis tabel faktor × alternatif agar rapi.",
          "Lupa menjumlahkan semua faktor. Skor akhir = jumlah SEMUA (bobot × evaluasi), bukan hanya faktor terpenting.",
          "Menganggap MFEP dan AHP tidak berhubungan. Keduanya sama-sama menghasilkan bobot × evaluasi; bedanya AHP menghitung angka-angka itu dari perbandingan berpasangan."
        ],
        cek: [
          { q: "Bobot gaji 0,3, karier 0,6, lokasi 0,1. Evaluasi EDS: 0,8 / 0,7 / 0,8. Berapa skor EDS?", a: "0,3 × 0,8 + 0,6 × 0,7 + 0,1 × 0,8 = 0,24 + 0,42 + 0,08 = <b>0,74</b>." },
          { q: "Di MFEP, apa syarat bobot faktor?", a: "Semua bobot faktor harus <b>berjumlah 1</b>." },
          { q: "Kapan AHP lebih cocok daripada MFEP?", a: "Saat kita <b>tidak yakin</b> menentukan bobot atau evaluasi secara langsung. AHP cukup meminta perbandingan dua-dua, lalu menghitung bobotnya dan mengecek konsistensinya (CR)." }
        ],
        ringkasan: `<p><b>MFEP</b>: skor = Σ bobot × evaluasi, bobot berjumlah 1, pilih skor terbesar. Steve memilih AA Company (0,81 > 0,74 > 0,72). Kalau bobot sulit ditentukan langsung, pakai <b>AHP</b>.</p>`,
        lembar: `<p>Buat tabel dengan faktor di baris, kolom "Bobot", lalu satu kolom untuk setiap alternatif. Tulis perkalian bobot × evaluasi di setiap sel atau di bawah tabel, lalu baris "Total". Tutup dengan kalimat: "Pilih AA Company karena total tertimbangnya paling besar (0,81)".</p>`
      },

      /* ================================================================ */
      {
        id: "matriks", judul: "Matriks perbandingan berpasangan dan bobot", menit: 20, video: "v05",
        ringkas: "Hierarki tujuan–kriteria–alternatif, skala Saaty 1–9, melengkapi matriks resiprokal, normalisasi, dan priority vector.",
        gambaran: `<p>AHP memecah masalah menjadi <b>hierarki</b>. Level 1 adalah <b>tujuan</b> ("membeli mobil terbaik"), level 2 <b>kriteria</b> (harga, MPG, kenyamanan, gaya), dan level 3 <b>alternatif</b> (Mobil A, B, C).</p>
<p>Lalu setiap pasangan elemen dalam satu level dibandingkan dengan dua pertanyaan: <b>mana yang lebih penting/disukai?</b> dan <b>seberapa kuat?</b> Jawabannya memakai <b>skala Saaty 1–9</b>:</p>
<ul><li><b>1</b> = sama penting (equally preferred)</li><li><b>3</b> = sedikit lebih penting (moderately)</li><li><b>5</b> = lebih penting (strongly)</li><li><b>7</b> = sangat lebih penting (very strongly)</li><li><b>9</b> = mutlak lebih penting (extremely)</li><li><b>2, 4, 6, 8</b> = nilai antara, misalnya 6 = "strongly to very strongly"</li><li><b>Kebalikannya (1/3, 1/5, …)</b> dipakai untuk arah perbandingan sebaliknya</li></ul>
<p>Semua perbandingan disusun dalam <b>matriks perbandingan berpasangan</b>. Dari matriks itu kita hitung <b>bobot (priority vector)</b>: bagi setiap sel dengan jumlah kolomnya (normalisasi), lalu rata-ratakan setiap baris.</p>`,
        analogi: `Bayangkan memilih kos: "jarak ke kampus vs fasilitas, mana lebih penting?" Kamu menjawab "jarak, dan cukup jauh lebih penting" → 4. Otomatis "fasilitas vs jarak" = 1/4. Kamu tidak perlu menebak persentase, cukup membandingkan dua-dua.`,
        istilah: [
          ["Hierarki", "Susunan bertingkat: tujuan (level 1) → kriteria (level 2) → alternatif (level 3)."],
          ["Perbandingan berpasangan (pairwise comparison)", "Membandingkan dua elemen sekaligus dengan skala 1–9."],
          ["Matriks resiprokal", "Diagonal selalu 1, dan sel (j, i) = 1 / sel (i, j)."],
          ["Normalisasi", "Membagi setiap sel dengan jumlah kolomnya sehingga setiap kolom berjumlah 1."],
          ["Priority vector (bobot)", "Rata-rata setiap baris matriks normalisasi. Semua bobot berjumlah 1."],
          ["Jumlah perbandingan", "Untuk n elemen dibutuhkan n(n − 1)/2 penilaian, karena sisanya diisi resiprokal."]
        ],
        rumus: [
          { nama: "Resiprokal", f: "a<sub>ii</sub> = 1 &nbsp;&nbsp; a<sub>ji</sub> = 1 / a<sub>ij</sub>", arti: "Kalau Harga vs MPG = 3, maka MPG vs Harga = 1/3." },
          { nama: "Normalisasi", f: "n<sub>ij</sub> = a<sub>ij</sub> / Σ<sub>k</sub> a<sub>kj</sub>", arti: "Setiap sel dibagi jumlah kolomnya." },
          { nama: "Bobot (priority vector)", f: "w<sub>i</sub> = (n<sub>i1</sub> + n<sub>i2</sub> + … + n<sub>in</sub>) / n", arti: "Rata-rata baris matriks normalisasi. Σ w<sub>i</sub> = 1." },
          { nama: "Banyaknya penilaian", f: "n(n − 1) / 2", arti: "4 kriteria → 6 penilaian; 5 kriteria → 10 penilaian." }
        ],
        langkah: [
          "<b>Susun hierarki</b>: tujuan, kriteria, alternatif.",
          "<b>Isi matriks</b> dengan penilaian skala 1–9. Bacanya selalu \"<b>baris</b> dibanding <b>kolom</b>\".",
          "<b>Lengkapi</b>: diagonal = 1, sel kebalikan = 1/nilai. Perhatikan entri yang diberikan di segitiga BAWAH; kebalikannya ditulis di segitiga atas.",
          "Ubah pecahan menjadi desimal lalu <b>jumlahkan setiap kolom</b>.",
          "<b>Normalisasi</b>: bagi setiap sel dengan jumlah kolomnya. Cek bahwa setiap kolom berjumlah 1.",
          "<b>Bobot</b> = rata-rata setiap baris matriks normalisasi."
        ],
        contoh: [{
          judul: "Bobot kriteria memilih mobil",
          soal: `Kriteria: Harga, MPG, Kenyamanan, Gaya. Penilaian: Harga vs MPG = 3, Harga vs Kenyamanan = 2, Harga vs Gaya = 2, MPG vs Kenyamanan = 1/4, MPG vs Gaya = 1/4, Kenyamanan vs Gaya = 1/2. Lengkapi matriksnya dan hitung bobot setiap kriteria. (Langkah CR dibahas di subbab berikutnya.)`,
          metode: "ahp-matriks", data: { judul: "Kriteria mobil", item: ["Harga", "MPG", "Kenyamanan", "Gaya"], matriks: MOBIL_KRITERIA }, sampai: 3
        }],
        variasi: [
          { judul: "Penilaian diberikan di segitiga bawah", isi: `<p>Soal tidak selalu mengisi bagian atas diagonal. Kalau tertulis baris Z, kolom X = 2, artinya <b>Z dua kali lebih disukai dari X</b>, sehingga baris X, kolom Z = 1/2. Kasus ini muncul di soal kos Dania (misalnya baris Hegarmanah, kolom Cisitu = 3, sehingga Cisitu vs Hegarmanah = 1/3). Selalu lengkapi dulu matriksnya sebelum menjumlahkan kolom.</p>`,
            contoh: { soal: `Kriteria kinerja tiga laptop. Diketahui: Laptop X vs Laptop Y = 3 (baris X, kolom Y), Laptop Z vs Laptop X = 2 (baris Z, kolom X), Laptop Z vs Laptop Y = 4 (baris Z, kolom Y). Lengkapi matriksnya dan hitung bobotnya.`,
              metode: "ahp-matriks", data: { judul: "Kinerja", item: ["Laptop X", "Laptop Y", "Laptop Z"], matriks: [[1, 3, null], [null, 1, null], [2, 4, 1]] }, sampai: 3 } },
          { judul: "Perbandingan dalam bentuk kalimat", isi: `<p>Soal buku sering menulis perbandingan dengan kata-kata, misalnya "mobil 1 <i>equally to moderately preferred</i> dibanding mobil 2" (= 2), "mobil 1 <i>very strongly preferred</i> dibanding mobil 3" (= 7), "mobil 2 <i>moderately to strongly preferred</i> dibanding mobil 3" (= 4). Terjemahkan dulu setiap kalimat ke angka skala Saaty, baru susun matriksnya.</p>` },
          { judul: "Matriks alternatif per kriteria", isi: `<p>Selain matriks kriteria, kamu juga membuat <b>satu matriks alternatif untuk SETIAP kriteria</b>. Mobil A, B, C dibandingkan menurut harga, lalu menurut MPG, dan seterusnya. Dengan 4 kriteria berarti ada 1 + 4 = 5 matriks yang dihitung bobotnya.</p>` }
        ],
        jebakan: [
          "Membaca matriks terbalik. Sel (baris i, kolom j) = <b>baris i dibanding kolom j</b>. Kalau 4, berarti baris lebih penting.",
          "Lupa mengisi resiprokal di <b>segitiga bawah</b>, atau lupa membalik entri yang diberikan di segitiga bawah.",
          "Normalisasi per <b>baris</b>. Yang benar: bagi dengan jumlah <b>KOLOM</b>, lalu bobot = rata-rata <b>BARIS</b>.",
          "Membulatkan 1/3 menjadi 0,3. Pakai minimal 3–4 desimal (0,3333) supaya bobot tidak meleset.",
          "Lupa membuat matriks alternatif untuk setiap kriteria. Bobot kriteria saja belum cukup untuk ranking."
        ],
        cek: [
          { q: "Harga vs Gaya = 2. Berapa nilai Gaya vs Harga?", a: "<b>1/2 = 0,5</b>." },
          { q: "Berapa penilaian berpasangan yang dibutuhkan untuk 5 kriteria?", a: "5 × 4 / 2 = <b>10</b> penilaian." },
          { q: "Setelah normalisasi, setiap kolom berjumlah berapa?", a: "<b>1</b>. Kalau tidak, ada salah hitung di jumlah kolom atau pembagiannya." },
          { q: "Kolom Harga pada matriks mobil berisi 1; 1/3; 1/2; 1/2. Berapa jumlah kolomnya, dan berapa nilai normalisasi sel Harga–Harga?", a: "Jumlah = 1 + 0,3333 + 0,5 + 0,5 = <b>2,3333</b>. Normalisasi = 1 / 2,3333 = <b>0,4286</b>." }
        ],
        ringkasan: `<p>Susun hierarki → isi matriks (baris vs kolom, skala 1–9) → lengkapi resiprokal → jumlah kolom → normalisasi (÷ jumlah kolom) → bobot = rata-rata baris. Contoh mobil: Harga 0,3982; MPG 0,0851; Kenyamanan 0,2179; Gaya 0,2988.</p>`,
        lembar: `<p>Tulis tiga tabel berurutan: (1) matriks perbandingan lengkap dengan baris "Jumlah kolom", (2) matriks normalisasi, (3) kolom "Bobot" di sebelah kanannya. Tulis pecahan resiprokal sebagai pecahan (1/3) di tabel pertama, lalu desimal di tabel kedua.</p>`
      },

      /* ================================================================ */
      {
        id: "konsistensi", judul: "Uji konsistensi: λmax, CI, dan CR", menit: 20, video: "v05",
        ringkas: "Weighted sum vector, consistency vector, λmax, consistency index, random index versi dosen vs buku, dan consistency ratio.",
        gambaran: `<p>Penilaian manusia bisa <b>tidak konsisten</b>. Misalnya kamu bilang A dua kali lebih penting dari B, B dua kali lebih penting dari C, tapi A hanya sama penting dengan C. Itu tidak masuk akal, karena seharusnya A empat kali lebih penting dari C.</p>
<p>AHP mengukur konsistensi dengan <b>Consistency Ratio (CR)</b>. Caranya: kalikan matriks awal dengan bobot (<b>weighted sum</b>), bagi dengan bobot (<b>consistency vector</b>), rata-ratakan menjadi <b>λmax</b>, lalu hitung <b>CI = (λmax − n)/(n − 1)</b> dan <b>CR = CI / RI</b>. Kalau penilaiannya konsisten sempurna, λmax = n dan CI = 0.</p>
<p>Ada <b>dua versi</b> yang perlu kamu tahu. <b>Versi dosen</b> (slide dan contoh handphone) memakai RI n=3 = 0,52 dan n=4 = 0,89, dengan batas CR 0,05 untuk matriks 3×3, 0,08 untuk 4×4, dan 0,10 untuk 5×5 ke atas. <b>Versi buku Render</b> memakai RI n=3 = 0,58 dan n=4 = 0,90, dengan batas CR ≤ 0,10 untuk semua ukuran. Kunci di situs ini memakai versi dosen, dan hasil versi buku ditulis sebagai catatan.</p>`,
        analogi: `Kalau kamu bilang "nasi goreng lebih enak dari mie ayam, mie ayam lebih enak dari bakso, tapi bakso lebih enak dari nasi goreng", penilaianmu berputar. CR yang besar adalah "alarm" bahwa ada penilaian seperti itu di matriksmu.`,
        istilah: [
          ["Weighted sum vector", "Matriks AWAL dikali bobot: setiap baris, Σ (sel × bobot kolomnya)."],
          ["Consistency vector", "Weighted sum ÷ bobot baris itu."],
          ["λmax (lambda max)", "Rata-rata consistency vector. Untuk matriks konsisten sempurna, λmax = n."],
          ["Consistency Index (CI)", "(λmax − n) / (n − 1). Makin besar, makin tidak konsisten."],
          ["Random Index (RI)", "Nilai CI rata-rata dari matriks acak berukuran n. Diambil dari tabel."],
          ["Consistency Ratio (CR)", "CI / RI. Dibandingkan dengan batas; kalau melewati batas, penilaian perlu ditinjau ulang."]
        ],
        rumus: [
          { nama: "Weighted sum & consistency vector", f: "ws<sub>i</sub> = Σ<sub>j</sub> a<sub>ij</sub> × w<sub>j</sub> &nbsp;→&nbsp; cv<sub>i</sub> = ws<sub>i</sub> / w<sub>i</sub>", arti: "Pakai matriks AWAL (bukan normalisasi)." },
          { nama: "λmax dan CI", f: "λmax = (cv<sub>1</sub> + … + cv<sub>n</sub>) / n &nbsp;&nbsp; CI = (λmax − n) / (n − 1)", arti: "Matriks 2×2 selalu konsisten (CI = 0)." },
          { nama: "CR", f: "CR = CI / RI", arti: "Versi dosen: konsisten jika CR ≤ 0,05 (3×3), ≤ 0,08 (4×4), ≤ 0,10 (n ≥ 5). Versi buku: CR ≤ 0,10." },
          { nama: "Tabel RI (dosen / buku)", f: "n = 3 → 0,52 / 0,58<br>n = 4 → 0,89 / 0,90<br>n = 5 → 1,11 / 1,12<br>n = 6 → 1,25 / 1,24<br>n = 7 → 1,35 / 1,32<br>n = 8 → 1,40 / 1,41", arti: "n = 1 dan 2 → RI = 0 (selalu konsisten)." }
        ],
        langkah: [
          "Siapkan matriks awal dan bobot (priority vector) dari langkah normalisasi.",
          "Hitung <b>weighted sum</b> setiap baris: kalikan setiap sel matriks AWAL dengan bobot kolomnya, lalu jumlahkan.",
          "Hitung <b>consistency vector</b>: weighted sum ÷ bobot baris itu.",
          "<b>λmax</b> = rata-rata consistency vector.",
          "<b>CI</b> = (λmax − n) / (n − 1).",
          "<b>CR</b> = CI / RI (pilih RI sesuai ukuran n). Bandingkan dengan batasnya, lalu tulis kesimpulan: konsisten atau tidak."
        ],
        contoh: [{
          judul: "Hardware komputer Judy Grim",
          soal: `Judy membandingkan hardware tiga sistem komputer: SYSTEM-1 vs SYSTEM-2 = 3, SYSTEM-1 vs SYSTEM-3 = 9, SYSTEM-2 vs SYSTEM-3 = 6. Hitung bobot, λmax, CI, dan CR. Apakah penilaian Judy konsisten?`,
          metode: "ahp-matriks", data: { judul: "Hardware", item: ["SYSTEM-1", "SYSTEM-2", "SYSTEM-3"], matriks: [[1, 3, 9], [null, 1, 6], [null, null, 1]] }
        }],
        variasi: [
          { judul: "Contoh dosen yang tidak konsisten (handphone)", isi: `<p>Di contoh handphone dosen, Storage dinilai 8 kali lebih penting dari Kamera, Kamera 7 kali lebih penting dari Body, tapi Storage hanya 8 kali lebih penting dari Body. Kalau konsisten, Storage seharusnya jauh lebih dominan atas Body (8 × 7). Akibatnya λmax = 3,4758, CI = 0,2379, dan <b>CR = 0,4575</b>, jauh di atas batas 0,05 (lembar Excel dosen menulis 0,4599 karena bobotnya dibulatkan 3 desimal). Pelajarannya: <b>CR tetap harus dihitung dan dilaporkan</b>, walaupun ranking akhir tetap bisa dibuat.</p>`,
            contoh: { soal: `Kriteria memilih handphone: Kamera vs Storage = 1/8, Kamera vs Body = 7, Storage vs Body = 8. Hitung CR-nya.`,
              metode: "ahp-matriks", data: { judul: "Kriteria handphone", item: ["Kamera", "Storage", "Body"], matriks: HP_KRITERIA } } },
          { judul: "Versi dosen vs versi buku bisa berbeda kesimpulan", isi: `<p>Pada contoh Judy, CI = 0,0270. Versi buku: CR = 0,0270 / 0,58 = 0,0466 ≤ 0,10 → <b>konsisten</b> (ini jawaban di buku). Versi dosen: CR = 0,0270 / 0,52 = 0,0520, sedikit di atas batas 0,05 untuk 3×3 → <b>tidak konsisten (tipis)</b>. Contoh lain: matriks kriteria kos Dania di <a href="#pembahasan/pr-4">PR Soal 4</a> punya CR 0,0809, sedikit di atas batas 0,08 versi dosen tapi di bawah 0,10 versi buku. Di lembar ujian, tulis RI dan batas yang kamu pakai.</p>` },
          { judul: "Matriks kriteria mobil (4×4)", isi: `<p>Untuk matriks kriteria mobil di slide: λmax = 4,1849, CI = 0,0616, CR = 0,0616 / 0,89 = <b>0,0693 ≤ 0,08 → konsisten</b>. Slide menulis λmax 4,18, CI 0,06, dan CR 0,068 karena CI dibulatkan ke 0,06 dulu. Selisih kecil karena pembulatan seperti ini wajar.</p>` },
          { judul: "Kalau CR terlalu besar", isi: `<ol><li>Cari pasangan penilaian yang "berputar" atau tidak sejalan (A > B, B > C, tapi C ≥ A).</li><li>Tinjau ulang dan perbaiki penilaian itu, lalu hitung ulang bobot dan CR.</li><li>Kalau soal ujian tetap meminta ranking dengan data yang ada, lanjutkan hitungannya, tapi <b>tulis catatan</b> bahwa matriks tersebut tidak konsisten.</li></ol>` }
        ],
        jebakan: [
          "Weighted sum memakai matriks <b>AWAL</b>, bukan matriks normalisasi.",
          "Salah memilih RI: RI dipilih berdasarkan <b>n (ukuran matriks)</b>, bukan jumlah alternatif total. Matriks kriteria 4×4 pakai RI n=4.",
          "Tertukar batas: versi dosen 0,05 (3×3), 0,08 (4×4), 0,10 (n ≥ 5); versi buku 0,10 untuk semua. Tulis versi yang dipakai.",
          "Lupa menguji SEMUA matriks. Setiap matriks (kriteria dan setiap matriks alternatif) punya CR sendiri.",
          "Membulatkan bobot terlalu kasar (2 desimal) sehingga λmax dan CR melenceng. Pakai 4 desimal.",
          "CI = (λmax − n)/(n − 1), bukan dibagi n."
        ],
        cek: [
          { q: "λmax = 3,0541 untuk matriks 3×3. Berapa CI?", a: "(3,0541 − 3) / 2 = <b>0,0270</b>." },
          { q: "CI = 0,0616 untuk matriks 4×4. Berapa CR versi dosen, dan apakah konsisten?", a: "CR = 0,0616 / 0,89 = <b>0,0693</b> ≤ 0,08 → <b>konsisten</b>." },
          { q: "A vs B = 2, B vs C = 2, A vs C = 4. Berapa CI-nya?", a: "Matriks ini konsisten sempurna (2 × 2 = 4), jadi λmax = 3 dan <b>CI = 0</b>." },
          { q: "Berapa RI untuk matriks 3×3 menurut versi dosen dan versi buku?", a: "Versi dosen <b>0,52</b>, versi buku <b>0,58</b>." }
        ],
        ringkasan: `<p>ws = A × w → cv = ws ÷ w → λmax = rata-rata cv → CI = (λmax − n)/(n − 1) → CR = CI/RI. Versi dosen: RI 0,52 (n=3), 0,89 (n=4); batas 0,05 / 0,08 / 0,10. Versi buku: RI 0,58 / 0,90; batas 0,10. CR melewati batas → penilaian ditinjau ulang.</p>`,
        lembar: `<p>Untuk setiap matriks tulis: baris perhitungan weighted sum, consistency vector, λmax, CI, lalu "CR = CI/RI = … (RI = 0,52 untuk n = 3) ≤/> 0,05 → konsisten/tidak konsisten". Kalau ragu soal versi RI, tulis juga hasil versi buku dalam satu baris tambahan.</p>`
      },

      /* ================================================================ */
      {
        id: "sintesis", judul: "AHP lengkap: sintesis dan ranking", menit: 25, video: "v05",
        ringkas: "Menggabungkan bobot kriteria dan bobot alternatif per kriteria menjadi skor akhir, lengkap dengan rekap CR semua matriks.",
        gambaran: `<p>Setelah bobot <b>kriteria</b> dan bobot <b>alternatif pada setiap kriteria</b> didapat (dan konsistensinya dicek), langkah terakhir adalah <b>sintesis</b>: skor akhir setiap alternatif = jumlah dari (bobot kriteria × bobot alternatif pada kriteria itu). Hasilnya mirip MFEP, hanya saja semua angkanya berasal dari perbandingan berpasangan.</p>
<p>AHP melibatkan empat fase: <b>(1)</b> menyusun hierarki masalah, <b>(2)</b> mengumpulkan data perbandingan berpasangan, <b>(3)</b> menghitung bobot ternormalisasi dan CR, <b>(4)</b> sintesis untuk mendapat skor dan keputusan akhir.</p>`,
        analogi: `Seperti nilai akhir mata kuliah: setiap komponen (UTS, UAS, tugas) punya bobot, dan nilaimu di setiap komponen dikalikan bobotnya lalu dijumlah. Di AHP, "bobot komponen" = bobot kriteria dan "nilaimu" = bobot alternatif pada kriteria itu.`,
        istilah: [
          ["Bobot kriteria", "Priority vector dari matriks kriteria (level 2 hierarki)."],
          ["Bobot alternatif per kriteria", "Priority vector dari matriks alternatif untuk satu kriteria."],
          ["Sintesis", "Menggabungkan semua bobot menjadi skor akhir (overall/composite priority)."],
          ["Ranking", "Urutan alternatif dari skor akhir terbesar ke terkecil."],
          ["Rekap CR", "Daftar CR setiap matriks untuk memastikan semua penilaian konsisten."]
        ],
        rumus: [
          { nama: "Skor akhir (sintesis)", f: "Skor(alternatif i) = Σ<sub>j</sub> w<sub>kriteria j</sub> × w<sub>i | kriteria j</sub>", arti: "Jumlah semua skor akhir = 1. Alternatif dengan skor terbesar = prioritas pertama." },
          { nama: "Jumlah matriks", f: "1 matriks kriteria + (banyak kriteria) matriks alternatif", arti: "4 kriteria → 5 matriks, masing-masing dicek CR-nya." }
        ],
        langkah: [
          "<b>Struktur</b>: tulis hierarki tujuan → kriteria → alternatif.",
          "<b>Matriks kriteria</b>: lengkapi, normalisasi, hitung bobot, cek CR.",
          "<b>Matriks alternatif</b> untuk SETIAP kriteria: lengkapi, normalisasi, hitung bobot, cek CR.",
          "Susun <b>tabel sintesis</b>: alternatif di baris, kriteria di kolom, isi dengan bobot alternatif; tulis bobot kriteria di baris bawah.",
          "Hitung <b>skor akhir</b> = Σ bobot kriteria × bobot alternatif, lalu urutkan (ranking).",
          "Tulis <b>rekap CR</b> semua matriks dan kesimpulan keputusan."
        ],
        contoh: [{
          judul: "Memilih mobil terbaik (contoh slide)",
          soal: `Kriteria: Harga, MPG, Kenyamanan, Gaya (matriks kriteria seperti di subbab sebelumnya). Matriks alternatif (Mobil A, B, C):
Harga: A vs B = 1/3, A vs C = 1/4, B vs C = 1/2.
MPG: A vs B = 1/4, A vs C = 1/6, B vs C = 1/3.
Kenyamanan: A vs B = 2, A vs C = 8, B vs C = 6.
Gaya: A vs B = 1/3, A vs C = 4, B vs C = 7.
Tentukan ranking mobil dengan AHP.`,
          metode: "ahp", data: MOBIL
        }],
        variasi: [
          { judul: "Catatan salah ketik di slide", isi: `<p>Pada perhitungan akhir di slide tertulis "0,0218 × 0,593" untuk kriteria kenyamanan. Seharusnya <b>0,218</b> (bobot kenyamanan 0,2179). Angka akhirnya tetap benar: Mobil A 0,265; Mobil B 0,421; Mobil C 0,314 → ranking <b>B – C – A</b>. Hitungan persis solver: 0,2646; 0,4210; 0,3143.</p><p>Satu hal lagi: dengan batas versi dosen, matriks MPG (CR 0,0520) sedikit melewati batas 0,05 untuk 3×3, sedangkan versi buku (0,0466) masih konsisten. Lihat rekap CR di langkah terakhir pemutar.</p>` },
          { judul: "Contoh dosen: memilih handphone", isi: `<p>Contoh di lembar Excel dosen memakai kriteria Kamera, Storage, Body untuk IPON, Samsuang, dan Huaweh. Ranking akhirnya <b>Samsuang (0,5671) > IPON (0,3630) > Huaweh (0,0699)</b>. Excel dosen menulis 0,5673; 0,3638; 0,0699 karena pembulatan. Tapi perhatikan rekap CR-nya: semua matriks melewati batas versi dosen. Di ujian, tetap tulis hasilnya beserta catatan konsistensinya.</p>`,
            contoh: { soal: `Kriteria: Kamera vs Storage = 1/8, Kamera vs Body = 7, Storage vs Body = 8.
Kamera: IPON vs Samsuang = 5, IPON vs Huaweh = 8, Samsuang vs Huaweh = 5.
Storage: IPON vs Samsuang = 1/5, IPON vs Huaweh = 5, Samsuang vs Huaweh = 7.
Body: IPON vs Samsuang = 6, IPON vs Huaweh = 8, Samsuang vs Huaweh = 7.
Tentukan prioritas handphone.`,
              metode: "ahp", data: HANDPHONE } },
          { judul: "Kalau bobot kriteria sudah diketahui", isi: `<p>Kadang soal sudah memberi bobot kriteria (misalnya dari MFEP) dan hanya meminta matriks alternatif. Cukup hitung bobot alternatif setiap kriteria, lalu lakukan sintesis dengan bobot yang diberikan.</p>` }
        ],
        jebakan: [
          "Mengalikan bobot alternatif dengan bobot kriteria yang salah urutannya. Tulis tabel sintesis dengan judul kolom kriteria yang jelas.",
          "Memakai angka matriks AWAL di sintesis. Yang dipakai adalah <b>bobot (priority vector)</b>.",
          "Lupa mengecek CR matriks alternatif. Setiap matriks punya CR sendiri.",
          "Memilih alternatif dengan bobot terbesar di SATU kriteria saja. Keputusan berdasarkan skor akhir gabungan.",
          "Jumlah skor akhir harus ≈ 1. Kalau jauh dari 1, ada salah hitung."
        ],
        cek: [
          { q: "Bobot kriteria: Harga 0,3982; MPG 0,0851; Kenyamanan 0,2179; Gaya 0,2988. Bobot Mobil B: 0,3202; 0,2737; 0,3412; 0,6555. Berapa skor Mobil B?", a: "0,3982 × 0,3202 + 0,0851 × 0,2737 + 0,2179 × 0,3412 + 0,2988 × 0,6555 ≈ <b>0,4210</b>." },
          { q: "Dengan 3 kriteria dan 4 alternatif, berapa matriks yang harus dihitung?", a: "1 matriks kriteria (3×3) + 3 matriks alternatif (4×4) = <b>4 matriks</b>." },
          { q: "Mobil B paling unggul di kriteria apa sehingga menang?", a: "<b>Gaya</b> (bobot 0,6555 pada kriteria yang bobotnya 0,2988) dan cukup baik di harga. Mobil C unggul di harga dan MPG, tapi sangat lemah di kenyamanan dan gaya." }
        ],
        ringkasan: `<p>AHP lengkap = hierarki → bobot kriteria (+CR) → bobot alternatif per kriteria (+CR) → sintesis Σ bobot kriteria × bobot alternatif → ranking. Contoh mobil: B (0,4210) > C (0,3143) > A (0,2646).</p>`,
        lembar: `<p>Urutan jawaban yang rapi: (1) gambar hierarki, (2) untuk setiap matriks: tabel lengkap, normalisasi + bobot, perhitungan λmax–CI–CR, (3) tabel sintesis dengan baris bobot kriteria, (4) perhitungan skor akhir setiap alternatif, (5) rekap CR, (6) kesimpulan: "Prioritas pertama: Mobil B, kedua Mobil C, ketiga Mobil A".</p>`
      }
    ]
  });
})();
