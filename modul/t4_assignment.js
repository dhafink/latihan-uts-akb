// Modul Topik 4 — Assignment (penugasan). Semua angka contoh dihitung oleh solver.js.
(function () {
  var FIXIT = { baris: ["Adams", "Brown", "Cooper"], kolom: ["Proyek 1", "Proyek 2", "Proyek 3"],
    nilai: [[11, 14, 6], [8, 10, 11], [9, 12, 7]], goal: "min", satuan: "$", labelBaris: "Pekerja", labelKolom: "Proyek" };

  window.MODUL.push({
    topik: 4, id: "asg", judul: "Assignment",
    ringkas: "Menempatkan orang/mesin ke pekerjaan satu-satu dengan biaya terkecil atau hasil terbesar: model penugasan, metode Hungarian, dummy, maksimasi, dan larangan.",
    sub: [
      /* ================================================================ */
      {
        id: "konsep", judul: "Model assignment (penugasan)", menit: 12, video: "v09",
        ringkas: "Apa itu masalah penugasan, kenapa disebut kasus khusus transportasi, dan kenapa enumerasi cepat jadi tidak praktis.",
        gambaran: `<p><b>Masalah penugasan (assignment)</b> adalah cara menempatkan <b>satu</b> sumber daya ke <b>satu</b> tujuan: satu orang ke satu pekerjaan, satu mesin ke satu job, satu sales ke satu wilayah, satu kapal ke satu sektor patroli. Tujuannya meminimalkan total biaya/waktu, atau memaksimalkan total profit/efisiensi.</p>
<p>Model ini adalah <b>kasus khusus model transportasi</b> (dan juga linear programming): setiap sumber punya "supply" = 1 dan setiap tujuan punya "demand" = 1. Karena semua kapasitasnya 1, ada cara hitung yang jauh lebih cepat, yaitu <b>metode Hungarian</b>.</p>
<p>Untuk soal kecil, kita bisa mencoba semua kemungkinan (<b>enumerasi</b>). Contohnya Fix-It Shop: tiga tukang (Adams, Brown, Cooper) dan tiga proyek perbaikan, dengan biaya Adams $11/$14/$6, Brown $8/$10/$11, Cooper $9/$12/$7 untuk proyek 1/2/3.</p>
<div class="board"><div class="scroll"><table class="tb"><thead><tr><th>Proyek 1</th><th>Proyek 2</th><th>Proyek 3</th><th>Total biaya</th></tr></thead><tbody>
<tr><td>Adams</td><td>Brown</td><td>Cooper</td><td>11 + 10 + 7 = $28</td></tr>
<tr><td>Adams</td><td>Cooper</td><td>Brown</td><td>11 + 12 + 11 = $34</td></tr>
<tr><td>Brown</td><td>Adams</td><td>Cooper</td><td>8 + 14 + 7 = $29</td></tr>
<tr><td>Brown</td><td>Cooper</td><td>Adams</td><td>8 + 12 + 6 = $26</td></tr>
<tr><td>Cooper</td><td>Adams</td><td>Brown</td><td>9 + 14 + 11 = $34</td></tr>
<tr><td class="k-hijau">Cooper</td><td class="k-hijau">Brown</td><td class="k-hijau">Adams</td><td class="k-hijau">9 + 10 + 6 = $25</td></tr>
</tbody></table></div></div>
<p>Dengan 3 orang ada 3! = 6 kemungkinan, dan yang termurah $25. Tapi dengan 4 orang sudah ada 4! = 24 kemungkinan, dan 8 orang menghasilkan 8! = 40.320 kemungkinan. Karena itu kita butuh metode Hungarian.</p>`,
        analogi: `Membagi piket kelas: 3 teman, 3 tugas (sapu, pel, buang sampah). Setiap orang dapat <i>tepat satu</i> tugas dan setiap tugas dikerjakan <i>tepat satu</i> orang. Kamu mencari pembagian yang total waktunya paling singkat.`,
        istilah: [
          ["Assignment problem", "Masalah menempatkan setiap baris (orang/mesin) ke tepat satu kolom (pekerjaan/proyek) dan sebaliknya, supaya total biaya minimum (atau total hasil maksimum)."],
          ["Tabel/matriks biaya", "Tabel dengan baris = yang ditempatkan, kolom = tujuan penempatan, dan isi = biaya/waktu/profit setiap pasangan."],
          ["Enumerasi", "Mendaftar semua kemungkinan penempatan lalu memilih yang terbaik. Banyaknya n! (n faktorial), jadi hanya praktis untuk tabel kecil."],
          ["Variabel 0–1", "X<sub>ij</sub> = 1 kalau baris i ditempatkan ke kolom j, dan 0 kalau tidak."],
          ["Seimbang (balanced)", "Jumlah baris = jumlah kolom. Kalau tidak sama, tabel diseimbangkan dengan dummy."],
          ["Metode Hungarian (Flood's technique)", "Metode reduksi matriks untuk mencari penempatan optimal tanpa membandingkan semua kemungkinan."]
        ],
        rumus: [
          { nama: "Model LP penugasan", f: "Min Σ<sub>i</sub> Σ<sub>j</sub> c<sub>ij</sub> X<sub>ij</sub>", arti: "c<sub>ij</sub> = biaya kalau baris i ditempatkan ke kolom j. Untuk profit, tujuannya Max." },
          { nama: "Kendala", f: "Σ<sub>j</sub> X<sub>ij</sub> = 1 (setiap orang tepat satu pekerjaan)<br>Σ<sub>i</sub> X<sub>ij</sub> = 1 (setiap pekerjaan tepat satu orang)<br>X<sub>ij</sub> = 0 atau 1", arti: "Sama dengan model transportasi yang semua supply dan demand-nya 1." },
          { nama: "Banyaknya kemungkinan (enumerasi)", f: "n! = n × (n − 1) × … × 1", arti: "3! = 6 · 4! = 24 · 5! = 120 · 8! = 40.320." }
        ],
        langkah: [
          "Baca soal: tentukan apa yang menjadi <b>baris</b> (yang ditempatkan, misalnya orang) dan apa yang menjadi <b>kolom</b> (tujuan penempatan, misalnya proyek).",
          "Tentukan arah tujuan: <b>minimasi</b> (biaya, waktu, jarak) atau <b>maksimasi</b> (profit, hasil, efisiensi, penjualan).",
          "Susun tabel biaya/hasil. Tandai pasangan yang tidak boleh terjadi.",
          "Cek apakah tabel persegi (baris = kolom). Kalau tidak, tambahkan dummy (lihat subbab kasus khusus).",
          "Untuk tabel 2×2 atau 3×3 boleh dicek dengan enumerasi; untuk yang lebih besar pakai <a href=\"#modul/asg/hungarian\">metode Hungarian</a>.",
          "Tulis jawaban: siapa ke mana, dan total biaya/hasilnya."
        ],
        contoh: [{
          judul: "Asisten praktikum",
          soal: `Tiga asisten praktikum (Dita, Eko, Fani) akan dibagi ke tiga kelas praktikum (Senin, Rabu, Jumat). Waktu persiapan (menit) yang dibutuhkan: Dita 40 / 35 / 50, Eko 45 / 30 / 40, Fani 30 / 45 / 55 untuk kelas Senin / Rabu / Jumat. Setiap asisten memegang tepat satu kelas. Bagaimana pembagian dengan total waktu persiapan paling kecil?`,
          metode: "asg", data: { baris: ["Dita", "Eko", "Fani"], kolom: ["Kelas Senin", "Kelas Rabu", "Kelas Jumat"], nilai: [[40, 35, 50], [45, 30, 40], [30, 45, 55]], goal: "min", satuan: "menit", labelBaris: "Asisten", labelKolom: "Kelas" }
        }],
        variasi: [
          { judul: "Cek hasil dengan enumerasi", isi: `<p>Untuk contoh asisten, enam kemungkinannya (pemegang kelas Senin–Rabu–Jumat): Dita–Eko–Fani = 40 + 30 + 55 = 125; Dita–Fani–Eko = 40 + 45 + 40 = 125; Eko–Dita–Fani = 45 + 35 + 55 = 135; <b>Fani–Dita–Eko = 30 + 35 + 40 = 105</b>; Eko–Fani–Dita = 45 + 45 + 50 = 140; Fani–Eko–Dita = 30 + 30 + 50 = 110. Hasilnya sama dengan Hungarian: 105 menit. Untuk 3×3 enumerasi masih masuk akal, tapi untuk 5×5 sudah ada 120 kemungkinan.</p>` },
          { judul: "Isi tabel tidak harus rupiah", isi: `<p>Isi tabel bisa berupa biaya, waktu (menit/jam/hari), jarak (mil/km), atau nilai/rating. Yang penting arahnya jelas: waktu dan jarak diminimalkan, sedangkan profit dan rating dimaksimalkan.</p>`,
            contoh: { soal: `Empat mekanik (Billy, Taylor, Mark, John) menangani empat mobil. Waktu (menit) untuk pekerjaan 1/2/3/4: Billy 400 / 90 / 60 / 120; Taylor 650 / 120 / 90 / 180; Mark 480 / 120 / 80 / 180; John 500 / 110 / 90 / 150. Setiap mekanik memegang satu pekerjaan. Berapa total waktu minimum?`,
              metode: "asg", data: { baris: ["Billy", "Taylor", "Mark", "John"], kolom: ["Pekerjaan 1", "Pekerjaan 2", "Pekerjaan 3", "Pekerjaan 4"], nilai: [[400, 90, 60, 120], [650, 120, 90, 180], [480, 120, 80, 180], [500, 110, 90, 150]], goal: "min", satuan: "menit", labelBaris: "Mekanik", labelKolom: "Pekerjaan" } } },
          { judul: "Kenapa tidak memakai metode transportasi biasa?", isi: `<p>Secara teori bisa, karena assignment adalah transportasi dengan supply = demand = 1. Tapi solusinya sangat <b>degenerasi</b>: hanya n sel yang terisi, padahal stepping stone/MODI butuh m + n − 1 = 2n − 1 sel terisi. Karena itu metode Hungarian jauh lebih praktis.</p>` }
        ],
        jebakan: [
          "Tertukar baris dan kolom. Tidak salah selama konsisten, tapi biasanya baris = yang ditempatkan (orang/mesin) dan kolom = tujuan (pekerjaan/proyek).",
          "Satu orang ditempatkan ke dua pekerjaan. Dalam model assignment, setiap baris dan setiap kolom hanya boleh dipakai <b>satu kali</b>.",
          "Memilih yang termurah per baris secara rakus. Contoh Fix-It: Adams dan Cooper sama-sama paling murah di proyek 3, jadi tidak bisa keduanya.",
          "Lupa menentukan arah: waktu/biaya/jarak → minimasi, profit/hasil/efisiensi → maksimasi.",
          "Tabel tidak persegi tapi langsung dikerjakan. Seimbangkan dulu dengan dummy."
        ],
        cek: [
          { q: "Ada 5 orang dan 5 pekerjaan. Kalau dikerjakan dengan enumerasi, ada berapa kemungkinan penempatan?", a: "5! = 5 × 4 × 3 × 2 × 1 = <b>120</b> kemungkinan." },
          { q: "Kenapa model assignment disebut kasus khusus model transportasi?", a: "Karena setiap sumber (orang) punya supply = 1 dan setiap tujuan (pekerjaan) punya demand = 1, sehingga setiap orang tepat mendapat satu pekerjaan." },
          { q: "Apa arti X<sub>23</sub> = 1 pada model LP penugasan?", a: "Baris 2 (misalnya orang kedua) <b>ditempatkan</b> ke kolom 3 (misalnya proyek ketiga)." },
          { q: "Di Fix-It, Adams paling murah di proyek 3 ($6) dan Cooper juga paling murah di proyek 3 ($7). Kenapa jawabannya bukan dua-duanya ke proyek 3?", a: "Karena setiap proyek hanya boleh dikerjakan satu orang. Itulah sebabnya perlu metode seperti Hungarian yang memperhitungkan semua baris dan kolom sekaligus." }
        ],
        ringkasan: `<p>Assignment = penempatan <b>satu-satu</b> (baris ↔ kolom). Bentuk LP-nya: Min/Max Σ c<sub>ij</sub>X<sub>ij</sub> dengan setiap baris dan kolom = 1. Enumerasi menghasilkan n! kemungkinan, jadi untuk soal yang lebih besar dari 3×3 pakai metode Hungarian.</p>`,
        lembar: `<p>Tulis dulu "Baris = …, Kolom = …, Tujuan = minimasi/maksimasi", lalu tabel biaya awal. Kalau soal kecil dan kamu ingin mengecek, tulis tabel enumerasi seperti di atas. Akhiri dengan daftar penempatan dan totalnya, misalnya: "Fani → Senin (30), Dita → Rabu (35), Eko → Jumat (40); total 105 menit".</p>`
      },

      /* ================================================================ */
      {
        id: "hungarian", judul: "Metode Hungarian", menit: 22, video: "v09",
        ringkas: "Reduksi baris, reduksi kolom, tes garis minimum, revisi tabel, lalu penempatan di sel nol.",
        gambaran: `<p><b>Metode Hungarian (Flood's technique)</b> mencari penempatan optimal tanpa mencoba semua kemungkinan. Idenya adalah <b>reduksi matriks</b>: mengurangkan angka di tabel sampai berubah menjadi <b>tabel opportunity cost</b>, yaitu "penalti" kalau kita tidak memilih pasangan terbaik.</p>
<p>Mengurangkan angka yang sama dari satu baris (atau satu kolom) tidak mengubah penempatan terbaik, karena setiap baris pasti mendapat tepat satu kolom. Jadi kita bebas menggeser angka sampai muncul cukup banyak <b>nol</b>. Tujuannya: menemukan penempatan yang semuanya jatuh di sel bernilai <b>0</b>.</p>
<p>Ada tiga langkah inti: (1) buat tabel opportunity cost (reduksi baris lalu reduksi kolom), (2) tes optimal dengan menarik garis minimum, (3) kalau belum optimal, revisi tabel lalu ulangi tes.</p>`,
        analogi: `Membandingkan harga di beberapa toko. Yang penting bukan harga mutlaknya, tetapi <i>selisih</i> dari harga termurah. Kalau semua barang di toko A naik Rp1.000, toko termurah untuk setiap barang tidak berubah. Begitu juga mengurangkan angka yang sama dari satu baris.`,
        istilah: [
          ["Reduksi baris", "Setiap angka di satu baris dikurangi nilai terkecil di baris itu. Hasilnya: setiap baris punya minimal satu 0."],
          ["Reduksi kolom", "Dari hasil reduksi baris, setiap angka di satu kolom dikurangi nilai terkecil di kolom itu."],
          ["Tabel (total) opportunity cost", "Tabel hasil reduksi baris dan kolom. Angka 0 menandai pasangan dengan penalti nol."],
          ["Garis penutup minimum", "Jumlah garis horizontal/vertikal paling sedikit yang bisa menutup SEMUA angka 0."],
          ["Tes optimal", "Kalau jumlah garis minimum = jumlah baris (n), penempatan optimal bisa dibuat. Kalau kurang dari n, revisi tabel."],
          ["Perpotongan", "Sel yang tertutup dua garis sekaligus (garis horizontal dan vertikal)."]
        ],
        rumus: [
          { nama: "Reduksi baris", f: "c′<sub>ij</sub> = c<sub>ij</sub> − (min baris i)", arti: "Lakukan untuk setiap baris." },
          { nama: "Reduksi kolom", f: "c″<sub>ij</sub> = c′<sub>ij</sub> − (min kolom j dari tabel c′)", arti: "Pakai tabel hasil reduksi baris, bukan tabel awal." },
          { nama: "Tes optimal", f: "jumlah garis minimum = n → optimal<br>jumlah garis minimum &lt; n → revisi", arti: "n = jumlah baris = jumlah kolom (tabel persegi)." },
          { nama: "Revisi tabel", f: "k = nilai terkecil yang TIDAK tertutup garis<br>tidak tertutup: − k · perpotongan: + k · tertutup satu garis: tetap", arti: "Setelah revisi, kembali ke tes optimal." }
        ],
        langkah: [
          "<b>Reduksi baris</b>: cari nilai terkecil di setiap baris, kurangkan dari semua angka di baris itu.",
          "<b>Reduksi kolom</b>: dari tabel hasil langkah 1, cari nilai terkecil di setiap kolom, kurangkan dari kolom itu. Ini tabel total opportunity cost.",
          "<b>Tes optimal</b>: tutup semua angka 0 dengan garis horizontal/vertikal sesedikit mungkin. Kalau jumlah garis = n, lompat ke langkah 5.",
          "<b>Revisi</b>: cari nilai terkecil k yang tidak tertutup garis. Kurangkan k dari semua angka yang tidak tertutup, tambahkan k ke angka di perpotongan dua garis. Angka yang tertutup satu garis tidak berubah. Kembali ke langkah 3.",
          "<b>Penempatan</b>: pilih baris atau kolom yang hanya punya <b>satu</b> nol, tempatkan di sel itu, lalu coret baris dan kolomnya. Ulangi sampai semua terisi.",
          "<b>Total</b>: jumlahkan biaya dari <b>tabel awal</b> (bukan dari tabel opportunity cost)."
        ],
        contoh: [{
          judul: "Fix-It Shop",
          soal: `Tiga tukang (Adams, Brown, Cooper) dan tiga proyek perbaikan. Biaya ($) untuk proyek 1/2/3: Adams 11 / 14 / 6; Brown 8 / 10 / 11; Cooper 9 / 12 / 7. Tentukan penempatan dengan biaya total minimum menggunakan metode Hungarian.`,
          metode: "asg", data: FIXIT
        }],
        variasi: [
          { judul: "Cara menarik garis minimum", isi: `<p>Beberapa tips supaya garisnya benar-benar minimum:</p>
<ul><li>Mulailah dari baris atau kolom yang punya <b>paling banyak nol</b>, lalu tutup nol yang tersisa.</li>
<li>Garis hanya boleh horizontal (satu baris penuh) atau vertikal (satu kolom penuh), tidak boleh diagonal.</li>
<li>Cara cek cepat: kalau kamu bisa membuat n penempatan di sel 0 (tidak ada dua yang sebaris atau sekolom), berarti tabel sudah optimal. Kalau paling banyak hanya bisa n − 1, berarti garis minimumnya juga n − 1.</li>
<li>Kalau garismu lebih banyak dari yang perlu, kamu bisa salah menyimpulkan "sudah optimal". Coba lagi dengan susunan garis lain.</li></ul>
<p>Di Fix-It setelah reduksi, nol ada di Adams–3, Brown–1, Brown–2, dan Cooper–3. Cukup 2 garis (baris Brown + kolom proyek 3), jadi belum optimal (2 &lt; 3).</p>`,
            contoh: { soal: `Empat job (A12, A15, B2, B9) bisa dikerjakan di empat mesin (W, X, Y, Z). Jam kerja yang dibutuhkan: A12 10 / 14 / 16 / 13; A15 12 / 13 / 15 / 12; B2 9 / 12 / 12 / 11; B9 14 / 16 / 18 / 16. Tentukan penempatan dengan total jam paling kecil.`,
              metode: "asg", data: { baris: ["A12", "A15", "B2", "B9"], kolom: ["Mesin W", "Mesin X", "Mesin Y", "Mesin Z"], nilai: [[10, 14, 16, 13], [12, 13, 15, 12], [9, 12, 12, 11], [14, 16, 18, 16]], goal: "min", satuan: "jam", labelBaris: "Job", labelKolom: "Mesin" } } },
          { judul: "Penempatan akhir secara sistematis", isi: `<p>Jangan langsung memilih nol mana saja. Cari baris (atau kolom) yang hanya punya <b>satu</b> nol yang masih tersedia, tempatkan di sana, lalu coret baris dan kolomnya. Di Fix-It: Adams hanya punya nol di proyek 3 → Adams–3. Setelah baris Adams dan kolom 3 dicoret, Cooper hanya punya nol di proyek 1 → Cooper–1. Sisanya Brown–2. Totalnya dari tabel awal: 6 + 10 + 9 = <b>$25</b>.</p>
<p>Kalau tidak ada baris atau kolom yang hanya punya satu nol, pilih salah satu nol. Artinya ada lebih dari satu solusi optimal.</p>` },
          { judul: "Kapan reduksi kolom tidak mengubah apa-apa?", isi: `<p>Kalau setelah reduksi baris setiap kolom sudah punya minimal satu nol, nilai terkecil setiap kolom adalah 0, jadi reduksi kolom tidak mengubah tabel. Langkah itu tetap ditulis di lembar jawaban ("min kolom = 0") supaya penilai tahu kamu sudah mengeceknya.</p>` }
        ],
        jebakan: [
          "Reduksi kolom dihitung dari tabel <b>hasil reduksi baris</b>, bukan dari tabel awal.",
          "Garisnya harus <b>minimum</b>. Kalau kamu memakai 3 garis padahal cukup 2, kamu bisa salah menyimpulkan \"sudah optimal\".",
          "Saat revisi, angka yang tertutup <b>satu</b> garis tidak berubah. Hanya yang tidak tertutup (− k) dan perpotongan (+ k) yang berubah.",
          "Optimal bukan berarti \"jumlah nol ≥ n\". Yang menentukan adalah jumlah <b>garis minimum</b> = n.",
          "Total biaya diambil dari <b>tabel awal</b>. Angka di tabel opportunity cost (yang nol) bukan biayanya.",
          "Memilih nol secara rakus di penempatan akhir bisa membuat buntu. Mulailah dari baris/kolom yang hanya punya satu nol."
        ],
        cek: [
          { q: "Baris Adams: 11 / 14 / 6. Bagaimana baris ini setelah reduksi baris?", a: "Nilai terkecil 6, jadi 11 − 6 / 14 − 6 / 6 − 6 = <b>5 / 8 / 0</b>." },
          { q: "Setelah reduksi Fix-It, semua nol tertutup oleh 2 garis, padahal tabelnya 3×3. Apa langkah berikutnya?", a: "Belum optimal (2 &lt; 3). Cari nilai terkecil yang tidak tertutup garis (k = 2), kurangkan dari semua angka yang tidak tertutup, tambahkan ke perpotongan, lalu tes garis lagi." },
          { q: "Saat revisi dengan k = 2, angka di perpotongan dua garis bernilai 3. Menjadi berapa?", a: "3 + 2 = <b>5</b>." },
          { q: "Penempatan optimal Fix-It: Adams–3, Brown–2, Cooper–1. Berapa total biayanya?", a: "Dari tabel awal: 6 + 10 + 9 = <b>$25</b>." }
        ],
        ringkasan: `<ol><li>Reduksi baris → reduksi kolom.</li><li>Tutup semua nol dengan garis minimum.</li><li>Garis = n → optimal; garis &lt; n → revisi (tidak tertutup − k, perpotongan + k).</li><li>Tempatkan di sel 0, mulai dari baris/kolom yang hanya punya satu nol.</li><li>Total dari tabel awal.</li></ol>`,
        lembar: `<p>Tulis setiap tabel secara berurutan dengan judul: "Tabel awal", "Reduksi baris" (tulis min tiap baris di kanan), "Reduksi kolom" (tulis min tiap kolom di bawah), lalu gambar garis penutupnya dan tulis "jumlah garis = … &lt; n" atau "= n". Untuk revisi tulis "k = …". Di tabel terakhir lingkari nol yang dipilih, lalu buat tabel ringkas: Pekerja | Proyek | Biaya, dan totalnya.</p>`
      },

      /* ================================================================ */
      {
        id: "khusus", judul: "Kasus khusus: dummy, maksimasi, larangan", menit: 22, video: "v10",
        ringkas: "Tabel tidak seimbang (dummy bernilai 0), soal maksimasi (nilai terbesar − sel), penempatan terlarang (M), dan solusi optimal ganda.",
        gambaran: `<p>Metode Hungarian butuh tabel yang <b>persegi</b> dan bertujuan <b>minimasi</b>. Di soal nyata, keadaannya sering tidak begitu:</p>
<ul><li><b>Tidak seimbang</b>: jumlah orang ≠ jumlah pekerjaan → tambahkan <b>dummy</b> bernilai 0.</li>
<li><b>Maksimasi</b> (profit, efisiensi, hasil panen, penjualan) → ubah dulu menjadi tabel opportunity cost: <b>nilai terbesar di tabel − nilai sel</b>.</li>
<li><b>Penempatan terlarang</b> (seseorang tidak boleh/tidak bisa di posisi tertentu) → isi sel itu dengan <b>M</b>, bilangan yang sangat besar, supaya tidak pernah dipilih.</li>
<li><b>Solusi optimal ganda</b>: kadang ada beberapa penempatan dengan total yang sama.</li></ul>
<p>Setelah tabel disesuaikan, langkah Hungarian-nya sama persis seperti biasa.</p>`,
        analogi: `Ada 4 teman tapi hanya 3 kursi di mobil. Supaya tabelnya "persegi", kita tambahkan kursi bayangan (dummy). Teman yang mendapat kursi bayangan sebenarnya <i>tidak ikut</i>.`,
        istilah: [
          ["Dummy kolom", "Kolom bayangan bernilai 0, ditambahkan kalau baris (orang) lebih banyak dari kolom (pekerjaan). Orang yang jatuh ke dummy tidak mendapat pekerjaan."],
          ["Dummy baris", "Baris bayangan bernilai 0, ditambahkan kalau kolom (pekerjaan) lebih banyak dari baris (orang). Pekerjaan yang jatuh ke dummy tidak dikerjakan siapa pun."],
          ["Opportunity cost (maksimasi)", "Nilai terbesar di seluruh tabel dikurangi nilai sel. Mengubah soal maksimasi menjadi minimasi tanpa mengubah penempatan terbaik."],
          ["M (big M)", "Bilangan yang sangat besar untuk penempatan terlarang. M dikurangi atau ditambah angka biasa tetap ditulis M."],
          ["Solusi optimal ganda", "Lebih dari satu penempatan dengan total yang sama. Terlihat saat penempatan akhir tidak ada baris/kolom yang hanya punya satu nol."]
        ],
        rumus: [
          { nama: "Dummy", f: "baris &gt; kolom → tambah kolom dummy (isi 0)<br>kolom &gt; baris → tambah baris dummy (isi 0)", arti: "Tambah sebanyak selisihnya sampai tabel persegi." },
          { nama: "Maksimasi → minimasi", f: "opportunity cost<sub>ij</sub> = (nilai terbesar di tabel) − nilai<sub>ij</sub>", arti: "Total maksimum tetap dihitung dari tabel AWAL." },
          { nama: "Larangan", f: "c<sub>ij</sub> = M (untuk minimasi atau setelah konversi maksimasi)", arti: "Pada tabel profit asli, larangan sama dengan profit −M (sangat buruk)." }
        ],
        langkah: [
          "Cek ukuran tabel. Kalau tidak persegi, tambahkan dummy (baris atau kolom) bernilai 0.",
          "Tandai penempatan terlarang dengan M.",
          "Kalau soal maksimasi: cari nilai terbesar di tabel (tanpa sel M dan dummy), lalu ubah setiap sel menjadi (nilai terbesar − sel). Sel dummy tetap 0, sel terlarang tetap M.",
          "Kerjakan metode Hungarian seperti biasa: reduksi baris, reduksi kolom, tes garis, revisi, penempatan.",
          "Hitung total dari tabel <b>awal</b>. Penempatan ke dummy bernilai 0.",
          "Tulis arti dummy (siapa yang tidak mendapat tugas, atau tugas apa yang tidak dikerjakan) dan sebutkan kalau ada solusi optimal lain."
        ],
        contoh: [{
          judul: "Fix-It Shop dengan tukang keempat (Davis)",
          soal: `Fix-It Shop menambah tukang keempat, Davis, dengan biaya $10 / $13 / $8 untuk proyek 1/2/3, tetapi proyeknya tetap tiga. Biaya tukang lain sama seperti sebelumnya (Adams 11 / 14 / 6; Brown 8 / 10 / 11; Cooper 9 / 12 / 7). Tentukan penempatan dengan biaya minimum.`,
          metode: "asg", data: { baris: ["Adams", "Brown", "Cooper", "Davis"], kolom: ["Proyek 1", "Proyek 2", "Proyek 3"], nilai: [[11, 14, 6], [8, 10, 11], [9, 12, 7], [10, 13, 8]], goal: "min", satuan: "$", labelBaris: "Pekerja", labelKolom: "Proyek" }
        }],
        variasi: [
          { judul: "Dummy baris: pekerjaan lebih banyak dari orang", isi: `<p>Kalau kolom lebih banyak, tambahkan <b>baris dummy</b>. Kolom yang mendapat dummy berarti tidak diisi. Di contoh berikut ada 3 karyawan baru dan 4 kantor, jadi satu kantor tidak mendapat karyawan. Hasilnya: Jones → Miami ($1.100), Smith → New York ($800), Wilson → Omaha ($500), dan kantor Dallas tidak diisi. Total biaya relokasi <b>$2.400</b>.</p>`,
            contoh: { soal: `Perusahaan ingin menempatkan tiga karyawan baru (Jones, Smith, Wilson) ke kantor Omaha, Miami, Dallas, atau New York. Biaya relokasi ($): Jones 800 / 1.100 / 1.200 / 1.000; Smith 500 / 1.600 / 1.300 / 800; Wilson 500 / 1.000 / 2.300 / 1.500 (urutan Omaha / Miami / Dallas / New York). Setiap karyawan menempati satu kantor. Tentukan penempatan dengan biaya relokasi paling kecil.`,
              metode: "asg", data: { baris: ["Jones", "Smith", "Wilson"], kolom: ["Omaha", "Miami", "Dallas", "New York"], nilai: [[800, 1100, 1200, 1000], [500, 1600, 1300, 800], [500, 1000, 2300, 1500]], goal: "min", satuan: "$", labelBaris: "Karyawan", labelKolom: "Kantor" } } },
          { judul: "Maksimasi: nilai terbesar − nilai sel", isi: `<p>Untuk soal maksimasi, ubah dulu tabelnya: cari nilai <b>terbesar di seluruh tabel</b>, lalu setiap sel = nilai terbesar − sel. Pasangan terbaik (nilai paling besar) menjadi opportunity cost paling kecil. Setelah penempatan ditemukan, totalnya dihitung dari tabel <b>efisiensi awal</b>.</p>
<p>Kalau ada dummy, urutannya tidak masalah: dummy ditambah setelah konversi (isi 0) atau sebelum konversi (profit 0 → nilai terbesar − 0) menghasilkan penempatan yang sama. Pemutar di situs ini memakai cara pertama.</p>`,
            contoh: { soal: `Angkatan laut Inggris menugaskan 4 kapal untuk patroli di 4 sektor. Rating efisiensi (makin besar makin baik) untuk sektor A/B/C/D: Kapal 1 20 / 60 / 50 / 55; Kapal 2 60 / 30 / 80 / 75; Kapal 3 80 / 100 / 90 / 80; Kapal 4 65 / 80 / 75 / 70. Tentukan penempatan dengan total efisiensi terbesar.`,
              metode: "asg", data: { baris: ["Kapal 1", "Kapal 2", "Kapal 3", "Kapal 4"], kolom: ["Sektor A", "Sektor B", "Sektor C", "Sektor D"], nilai: [[20, 60, 50, 55], [60, 30, 80, 75], [80, 100, 90, 80], [65, 80, 75, 70]], goal: "max", labelBaris: "Kapal", labelKolom: "Sektor" } } },
          { judul: "Penempatan terlarang (M) dan solusi optimal ganda", isi: `<p>Kalau seseorang tidak boleh ditempatkan di suatu posisi, isi selnya dengan <b>M</b>. Pada soal maksimasi, sel terlarang tetap M setelah konversi (biaya peluangnya sangat besar). M dikurangi atau ditambah angka biasa tetap dianggap M.</p>
<p>Contoh berikut juga menunjukkan <b>solusi optimal ganda</b>. Saat penempatan akhir ada langkah yang tidak punya baris/kolom dengan satu nol, jadi kita memilih salah satu nol. Penempatan yang ditemukan pemutar: Seattle → Chicago (1.730), Arlington → Detroit (1.020), Oakland → Kansas City (1.500), Baltimore → Toronto (330) = 4.580 mil. Dua penempatan lain juga 4.580 mil: (1) Seattle → Detroit, Arlington → Chicago, Oakland → Kansas City, Baltimore → Toronto; (2) Seattle → Detroit, Arlington → Kansas City, Oakland → Chicago, Baltimore → Toronto. Semuanya sama baiknya.</p>`,
            contoh: { soal: `Empat kru wasit bisbol sedang bertugas di Seattle, Arlington, Oakland, dan Baltimore. Setelah itu mereka harus pindah ke pertandingan di Kansas City, Chicago, Detroit, dan Toronto. Jarak (mil): Seattle 1.500 / 1.730 / 1.940 / 2.070; Arlington 460 / 810 / 1.020 / 1.270; Oakland 1.500 / 1.850 / 2.080 / —; Baltimore 960 / 610 / 400 / 330. Kru Oakland tidak boleh dikirim ke Toronto. Tentukan penempatan dengan total jarak paling kecil.`,
              metode: "asg", data: { baris: ["Kru Seattle", "Kru Arlington", "Kru Oakland", "Kru Baltimore"], kolom: ["Kansas City", "Chicago", "Detroit", "Toronto"], nilai: [[1500, 1730, 1940, 2070], [460, 810, 1020, 1270], [1500, 1850, 2080, "M"], [960, 610, 400, 330]], goal: "min", satuan: "mil", labelBaris: "Kru", labelKolom: "Kota" } } }
        ],
        jebakan: [
          "Dummy diisi <b>0</b>, bukan M. M hanya untuk penempatan terlarang.",
          "Salah posisi dummy: orang lebih banyak → <b>kolom</b> dummy; pekerjaan lebih banyak → <b>baris</b> dummy.",
          "Langsung mengerjakan Hungarian pada tabel profit tanpa konversi. Hasilnya justru penempatan dengan total <b>terkecil</b>.",
          "Konversi maksimasi memakai nilai terbesar di <b>seluruh tabel</b>. Sel terlarang dan dummy tidak ikut dipakai sebagai nilai terbesar.",
          "Total maksimasi dihitung dari tabel <b>awal</b> (nilai asli), bukan dari tabel opportunity cost.",
          "Menulis jawaban tanpa menjelaskan arti dummy. Tulis misalnya \"Davis tidak mendapat proyek\" atau \"kantor Dallas tidak diisi\".",
          "Sel terlarang diisi 0. Ini salah besar, karena 0 justru membuat sel itu paling menarik untuk dipilih."
        ],
        cek: [
          { q: "Ada 3 karyawan dan 4 kantor. Dummy apa yang ditambahkan, dan apa artinya kalau kantor Dallas jatuh ke dummy?", a: "<b>Baris dummy</b> (karena kolom lebih banyak) bernilai 0. Artinya kantor Dallas tidak mendapat karyawan." },
          { q: "Nilai terbesar di tabel efisiensi = 100. Sel Kapal 1–Sektor D bernilai 55. Berapa opportunity cost-nya?", a: "100 − 55 = <b>45</b>." },
          { q: "Di soal kapal, penempatan optimalnya Kapal 1 → D, Kapal 2 → C, Kapal 3 → B, Kapal 4 → A. Berapa total efisiensinya?", a: "Dari tabel awal: 55 + 80 + 100 + 65 = <b>300</b>." },
          { q: "Kenapa Davis tetap membuat total Fix-It $25?", a: "Biaya Davis tidak lebih menguntungkan untuk kombinasi terbaiknya, jadi Davis jatuh ke kolom <b>dummy</b> (tidak mendapat proyek). Penempatan lainnya tetap Adams–3, Brown–2, Cooper–1 = $25." }
        ],
        ringkasan: `<ul><li>Tidak persegi → dummy bernilai 0 (orang lebih banyak → kolom dummy; pekerjaan lebih banyak → baris dummy).</li><li>Maksimasi → nilai terbesar − sel, lalu Hungarian biasa.</li><li>Terlarang → M.</li><li>Total selalu dari tabel awal; dummy = 0.</li><li>Kalau di penempatan akhir harus memilih di antara beberapa nol → ada solusi optimal lain.</li></ul>`,
        lembar: `<p>Sebelum Hungarian, tulis kalimat persiapan tabel, misalnya: "Tabel tidak seimbang (4 × 3) → tambah kolom dummy bernilai 0", "Kru Oakland–Toronto terlarang → M", "Soal maksimasi → nilai terbesar = 100, setiap sel = 100 − sel". Lalu kerjakan Hungarian dan tutup dengan tabel penempatan beserta artinya, misalnya "Davis → Dummy (tidak mendapat proyek)".</p>`
      },

      /* ================================================================ */
      {
        id: "gabungan", judul: "Soal gabungan: maksimasi + dummy + larangan", menit: 20, video: "v11",
        ringkas: "Bedah soal cerita gaya UTS yang memuat beberapa jebakan sekaligus, dari membaca soal sampai menulis jawaban akhir.",
        gambaran: `<p>Soal assignment di UTS jarang berupa tabel biasa. Biasanya soal cerita yang memuat <b>beberapa kasus khusus sekaligus</b>: jumlah orang tidak sama dengan jumlah tempat, tujuannya memaksimalkan hasil, dan ada satu orang yang tidak boleh ditempatkan di tempat tertentu.</p>
<p>Kuncinya adalah <b>urutan persiapan tabel</b> sebelum masuk ke langkah Hungarian:</p>
<ol><li>Susun tabel dari cerita (baris = orang, kolom = tempat).</li><li>Tandai larangan dengan M.</li><li>Seimbangkan dengan dummy bernilai 0.</li><li>Kalau maksimasi, ubah ke opportunity cost (nilai terbesar − sel).</li><li>Kerjakan Hungarian, lalu hitung total dari tabel awal.</li></ol>
<p>Setelah memahami contoh di bawah, coba bandingkan dengan <a href="#pembahasan/tugas-2">pembahasan Tugas Assignment Soal 2</a> (maksimasi hasil kebun) dan <a href="#pembahasan/tugas-1">Soal 1</a> (minimasi waktu penelitian).</p>`,
        analogi: `Seperti memasak dengan resep: semua bahan disiapkan dulu (tabel persegi, larangan, konversi), baru kompor dinyalakan (Hungarian). Kalau langsung masak sebelum bahannya siap, hasilnya kacau.`,
        istilah: [
          ["Soal gabungan", "Soal yang memuat lebih dari satu kasus khusus, misalnya maksimasi + dummy + larangan."],
          ["Kata kunci maksimasi", "\"sebesar mungkin\", \"hasil/penjualan/profit/efisiensi terbesar\", \"rating tertinggi\"."],
          ["Kata kunci minimasi", "\"secepat mungkin\", \"waktu/biaya/jarak terkecil\", \"sehemat mungkin\"."],
          ["Kata kunci larangan", "\"tidak dapat\", \"tidak boleh\", \"tidak bisa bekerja di\", \"pernah bermasalah di\"."],
          ["Dummy", "Baris/kolom bayangan bernilai 0. Siapa pun yang jatuh ke dummy tidak benar-benar mendapat tugas (atau tugasnya tidak dikerjakan)."]
        ],
        rumus: [
          { nama: "Urutan persiapan tabel", f: "cerita → tabel → M (larangan) → dummy 0 → (maks: nilai terbesar − sel) → Hungarian", arti: "Untuk maksimasi, nilai terbesar diambil dari sel asli (bukan M, bukan dummy)." },
          { nama: "Total akhir", f: "Total = Σ nilai ASLI pada sel yang ditempatkan (dummy = 0)", arti: "Jangan menjumlahkan angka dari tabel opportunity cost." }
        ],
        langkah: [
          "Baca soal dua kali. Garis bawahi: siapa yang ditempatkan, ke mana, angka apa yang diberikan, dan arah tujuannya.",
          "Susun tabel nilai asli. Baris = orang (kandidat/pekerja), kolom = tempat (cabang/pekerjaan/kebun).",
          "Cari kalimat larangan → isi sel itu dengan M.",
          "Hitung baris vs kolom. Tambahkan dummy bernilai 0 di sisi yang kurang.",
          "Kalau maksimasi: nilai terbesar (dari sel asli) − setiap sel. Dummy tetap 0, M tetap M.",
          "Kerjakan Hungarian: reduksi baris, reduksi kolom, tes garis, revisi bila perlu, penempatan.",
          "Hitung total dari tabel asli, tulis arti dummy, lalu jawab pertanyaan soal dengan kalimat lengkap."
        ],
        contoh: [{
          judul: "Kepala bar kedai kopi di Bandung",
          soal: `Kedai kopi "Seduh Bandung" membuka 4 cabang: Ciumbuleuit, Dago, Setiabudi, dan Pasteur. Ada 5 barista senior yang bisa dijadikan kepala bar (Raka, Nisa, Bima, Tiara, Fajar), dan setiap cabang hanya butuh satu kepala bar. Perkiraan penjualan (cup per hari) kalau barista itu memimpin cabang tersebut (urutan Ciumbuleuit / Dago / Setiabudi / Pasteur): Raka 135 / 130 / 125 / 115; Nisa 125 / 105 / 150 / 110; Bima 105 / 155 / 135 / —; Tiara 160 / 115 / 130 / 125; Fajar 140 / 140 / 115 / 110. Bima tidak bisa ditempatkan di Pasteur karena jarak rumahnya terlalu jauh. Pemilik ingin total penjualan sebesar mungkin. Siapa memimpin cabang mana, dan berapa total penjualan optimalnya?`,
          metode: "asg", data: { baris: ["Raka", "Nisa", "Bima", "Tiara", "Fajar"], kolom: ["Ciumbuleuit", "Dago", "Setiabudi", "Pasteur"],
            nilai: [[135, 130, 125, 115], [125, 105, 150, 110], [105, 155, 135, "M"], [160, 115, 130, 125], [140, 140, 115, 110]], goal: "max", satuan: "cup", labelBaris: "Barista", labelKolom: "Cabang" }
        }],
        variasi: [
          { judul: "Strategi membaca soal cerita (checklist)", isi: `<ul>
<li>☐ <b>Siapa</b> yang ditempatkan? → baris.</li>
<li>☐ <b>Ke mana</b> mereka ditempatkan? → kolom.</li>
<li>☐ Angkanya <b>biaya/waktu/jarak</b> (minimasi) atau <b>hasil/profit/penjualan</b> (maksimasi)? Cari kata "secepat mungkin", "sebesar mungkin", "seoptimal".</li>
<li>☐ Ada kalimat <b>"tidak dapat / tidak boleh"</b>? → M.</li>
<li>☐ Jumlah baris = jumlah kolom? Kalau tidak → dummy 0.</li>
<li>☐ Ada data yang tersebar di kalimat panjang ("Jocelyn dapat menyelesaikan tugas 1 selama 33 hari, tugas 2 …")? Pindahkan ke tabel dengan teliti; salah satu angka saja bisa mengubah jawaban.</li>
<li>☐ Pertanyaan meminta apa: penempatan saja, atau juga total optimal? Jawab keduanya.</li></ul>
<p>Pada contoh kedai kopi: 5 barista vs 4 cabang → <b>kolom dummy</b>; "penjualan sebesar mungkin" → <b>maksimasi</b> (nilai terbesar = 160); "Bima tidak bisa di Pasteur" → <b>M</b>. Hasilnya Raka → Pasteur (115), Nisa → Setiabudi (150), Bima → Dago (155), Tiara → Ciumbuleuit (160), Fajar → Dummy, total <b>580 cup per hari</b>; Fajar tidak menjadi kepala bar.</p>` },
          { judul: "Versi minimasi: dummy + larangan", isi: `<p>Kombinasi yang sama juga bisa muncul di soal minimasi (waktu atau biaya). Bedanya hanya tidak ada langkah konversi; langsung reduksi baris setelah tabel persegi dan larangan diisi M. Hasil contoh berikut: Truk Engkel → Antapani (50), Pikap L300 → Cihampelas (45), Pikap Gran Max → Buahbatu (55), Truk Colt → Dummy (tidak mendapat pesanan), total <b>150 menit</b>.</p>`,
            contoh: { soal: `Jasa angkut pindahan di Bandung punya 4 kendaraan (Truk Colt, Truk Engkel, Pikap L300, Pikap Gran Max) dan hari ini menerima 3 pesanan pindahan (Cihampelas, Antapani, Buahbatu). Waktu tempuh dari pool (menit): Truk Colt — / 55 / 70; Truk Engkel 60 / 50 / 65; Pikap L300 45 / 60 / 50; Pikap Gran Max 55 / 65 / 55 (urutan Cihampelas / Antapani / Buahbatu). Truk Colt tidak bisa masuk gang di Cihampelas. Setiap kendaraan melayani paling banyak satu pesanan. Tentukan penugasan dengan total waktu tempuh paling kecil.`,
              metode: "asg", data: { baris: ["Truk Colt", "Truk Engkel", "Pikap L300", "Pikap Gran Max"], kolom: ["Cihampelas", "Antapani", "Buahbatu"], nilai: [["M", 55, 70], [60, 50, 65], [45, 60, 50], [55, 65, 55]], goal: "min", satuan: "menit", labelBaris: "Kendaraan", labelKolom: "Pesanan" } } },
          { judul: "Bandingkan dengan soal dosen", isi: `<p>Tugas Assignment memakai pola yang sama. Soal 1: 4 mahasiswa dan 5 tugas penelitian (dummy <b>baris</b>), Joseph tidak bisa mengerjakan tugas 3 (M), dan waktunya diminimalkan. Soal 2: 5 kandidat dan 4 kebun (dummy <b>kolom</b>), Elina tidak boleh di kebun 1 (M), dan hasil panen dimaksimalkan. Lihat pembahasan langkah demi langkahnya di <a href="#pembahasan/tugas-1">Tugas Soal 1</a> dan <a href="#pembahasan/tugas-2">Tugas Soal 2</a>.</p>` }
        ],
        jebakan: [
          "Mencari nilai terbesar sebelum mengisi larangan, lalu tanpa sengaja memakai angka di sel terlarang. Isi M dulu, baru cari nilai terbesar dari sel lain.",
          "Mengisi dummy dengan nilai terbesar − 0 lalu lupa bahwa itu dummy. Boleh saja (penempatannya tetap sama), tapi di total akhir dummy tetap bernilai 0.",
          "Salah salin data dari kalimat panjang ke tabel. Cek ulang setiap baris sebelum mulai menghitung.",
          "Menjawab total dari tabel opportunity cost. Total selalu dari angka asli: 115 + 150 + 155 + 160 = 580.",
          "Lupa menjawab pertanyaan lengkap. Kalau soal bertanya \"berapa jumlah hasil optimal\", tulis angkanya beserta satuannya.",
          "Menempatkan seseorang ke sel M. Kalau penempatanmu jatuh di M, berarti ada salah hitung, karena M tidak akan pernah menjadi 0."
        ],
        cek: [
          { q: "Pada soal kedai kopi, berapa nilai terbesar yang dipakai untuk konversi, dan berapa opportunity cost sel Nisa–Setiabudi?", a: "Nilai terbesar = <b>160</b> (Tiara–Ciumbuleuit). Nisa–Setiabudi = 160 − 150 = <b>10</b>." },
          { q: "Apa arti Fajar jatuh ke kolom dummy?", a: "Fajar <b>tidak menjadi kepala bar</b> di cabang mana pun. Penjualannya dihitung 0." },
          { q: "Kenapa sel Bima–Pasteur tetap M setelah konversi maksimasi?", a: "Karena penempatan itu terlarang. Biaya peluangnya dibuat sangat besar (M) supaya tidak pernah terpilih." },
          { q: "Ada 4 kendaraan dan 3 pesanan. Dummy apa yang ditambahkan, dan siapa yang jatuh ke dummy di contoh jasa angkut?", a: "Kolom dummy (kendaraan lebih banyak). Truk Colt jatuh ke dummy, jadi tidak mendapat pesanan. Totalnya 50 + 45 + 55 = <b>150 menit</b>." }
        ],
        ringkasan: `<p>Siapkan tabel dulu: <b>M</b> untuk larangan → <b>dummy 0</b> sampai persegi → (maksimasi) <b>nilai terbesar − sel</b>. Setelah itu kerjakan Hungarian biasa. Jawaban akhir = penempatan + total dari tabel asli + arti dummy.</p>`,
        lembar: `<p>Contoh penulisan jawaban akhir: "Penempatan optimal: Raka → Pasteur (115 cup), Nisa → Setiabudi (150 cup), Bima → Dago (155 cup), Tiara → Ciumbuleuit (160 cup), Fajar → Dummy (tidak menjadi kepala bar). Total penjualan optimal = 580 cup per hari." Tulis juga kalimat persiapan tabel (dummy, M, konversi) di bagian awal jawaban supaya penilai bisa mengikuti caramu.</p>`
      }
    ]
  });
})();
