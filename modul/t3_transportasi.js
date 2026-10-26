// Modul Topik 3 — Transportasi. Semua angka contoh dihitung oleh solver.js.
(function () {
  var EXEC = { sumber: [{ nama: "Des Moines", kode: "D", supply: 100 }, { nama: "Evansville", kode: "E", supply: 300 }, { nama: "Fort Lauderdale", kode: "F", supply: 300 }],
    tujuan: [{ nama: "Albuquerque", kode: "A", demand: 300 }, { nama: "Boston", kode: "B", demand: 200 }, { nama: "Cleveland", kode: "C", demand: 200 }],
    biaya: [[5, 4, 3], [8, 4, 3], [9, 7, 5]], goal: "min", satuan: "$" };
  var EXEC250 = { sumber: [{ nama: "Des Moines", kode: "D", supply: 250 }, { nama: "Evansville", kode: "E", supply: 300 }, { nama: "Fort Lauderdale", kode: "F", supply: 300 }],
    tujuan: EXEC.tujuan, biaya: EXEC.biaya, goal: "min", satuan: "$" };
  var HAPPY = { sumber: [{ nama: "Plant W", kode: "W", supply: 200 }, { nama: "Plant X", kode: "X", supply: 175 }, { nama: "Plant Y", kode: "Y", supply: 75 }],
    tujuan: [{ nama: "Gudang A", kode: "A", demand: 250 }, { nama: "Gudang B", kode: "B", demand: 100 }, { nama: "Gudang C", kode: "C", demand: 150 }],
    biaya: [[6, 4, 9], [10, 5, 8], [12, 7, 6]], goal: "min", satuan: "$" };
  var MARTIN = { sumber: [{ nama: "Gudang 1", kode: "G1", supply: 100 }, { nama: "Gudang 2", kode: "G2", supply: 120 }, { nama: "Gudang 3", kode: "G3", supply: 80 }],
    tujuan: [{ nama: "Pelanggan 1", kode: "P1", demand: 100 }, { nama: "Pelanggan 2", kode: "P2", demand: 100 }, { nama: "Pelanggan 3", kode: "P3", demand: 100 }],
    biaya: [[8, 2, 6], [10, 9, 9], [7, 10, 7]], goal: "min", satuan: "$" };
  var HARD = { sumber: [{ nama: "Plant 1", kode: "1", supply: 70 }, { nama: "Plant 2", kode: "2", supply: 50 }, { nama: "Plant 3", kode: "3", supply: 30 }],
    tujuan: [{ nama: "Proyek A", kode: "A", demand: 40 }, { nama: "Proyek B", kode: "B", demand: 50 }, { nama: "Proyek C", kode: "C", demand: 60 }],
    biaya: [[10, 4, 11], [12, 5, 8], [9, 7, 6]], goal: "min", satuan: "$" };
  var KOPI = { sumber: [{ nama: "Lembang", kode: "L", supply: 60 }, { nama: "Pangalengan", kode: "P", supply: 50 }, { nama: "Ciwidey", kode: "C", supply: 40 }],
    tujuan: [{ nama: "Dago", kode: "D", demand: 50 }, { nama: "Braga", kode: "B", demand: 60 }, { nama: "Cihampelas", kode: "H", demand: 40 }],
    biaya: [[4000, 6000, 5000], [7000, "M", 6000], [8000, 5000, 7000]], goal: "min", satuan: "Rp" };
  var TEH = { sumber: [{ nama: "Kebun Walini", kode: "W", supply: 80 }, { nama: "Kebun Rancabali", kode: "R", supply: 60 }, { nama: "Kebun Malabar", kode: "M", supply: 60 }],
    tujuan: [{ nama: "Toko Bandung", kode: "B", demand: 60 }, { nama: "Toko Cimahi", kode: "C", demand: 90 }, { nama: "Toko Garut", kode: "G", demand: 50 }],
    biaya: [[12000, 9000, 7000], [8000, 11000, 10000], [10000, 13000, 6000]], goal: "max", satuan: "Rp" };
  // Hardgrave: biaya sel = biaya kirim + biaya produksi per unit di pabrik asal
  var HG_TUJUAN = [{ nama: "Detroit", kode: "DET", demand: 10000 }, { nama: "Dallas", kode: "DAL", demand: 12000 }, { nama: "New York", kode: "NY", demand: 15000 }, { nama: "Los Angeles", kode: "LA", demand: 9000 }];
  var HG_LAMA = [{ nama: "Cincinnati", kode: "CIN", supply: 15000 }, { nama: "Salt Lake City", kode: "SLC", supply: 6000 }, { nama: "Pittsburgh", kode: "PIT", supply: 14000 }];
  var HG_BIAYA = [[73, 103, 88, 108], [85, 80, 100, 90], [88, 97, 78, 118]];
  var HG_SEA = { sumber: HG_LAMA.concat([{ nama: "Seattle (baru)", kode: "SEA", supply: 11000 }]), tujuan: HG_TUJUAN,
    biaya: HG_BIAYA.concat([[113, 91, 118, 80]]), goal: "min", satuan: "$" };
  var HG_BIR = { sumber: HG_LAMA.concat([{ nama: "Birmingham (baru)", kode: "BIR", supply: 11000 }]), tujuan: HG_TUJUAN,
    biaya: HG_BIAYA.concat([[84, 79, 90, 99]]), goal: "min", satuan: "$" };

  var SOAL_EXEC = `Executive Furniture punya 3 pabrik meja: Des Moines (kapasitas 100), Evansville (300), dan Fort Lauderdale (300). Meja dikirim ke 3 gudang: Albuquerque (butuh 300), Boston (200), dan Cleveland (200). Biaya kirim per meja ($): Des Moines → A/B/C = 5 / 4 / 3; Evansville → 8 / 4 / 3; Fort Lauderdale → 9 / 7 / 5.`;

  window.MODUL.push({
    topik: 3, id: "tp", judul: "Transportasi",
    ringkas: "Mengirim barang dari beberapa sumber ke beberapa tujuan dengan biaya termurah: tabel transportasi, NWC, stepping stone, MODI, VAM, dan kasus-kasus khusus.",
    sub: [
      /* ================================================================ */
      {
        id: "model", judul: "Model transportasi", menit: 12,
        ringkas: "Sumber, tujuan, supply, demand, tabel transportasi, keseimbangan, dan syarat sel terisi m + n − 1.",
        gambaran: `<p>Model transportasi adalah bagian khusus dari <b>linear programming</b>. Masalahnya: barang dikirim dari beberapa <b>sumber</b> (pabrik, gudang) yang punya <b>kapasitas (supply)</b> ke beberapa <b>tujuan</b> (gudang, toko, proyek) yang punya <b>kebutuhan (demand)</b>. Setiap rute punya biaya kirim per unit. Kita mencari <b>berapa unit dikirim lewat rute mana</b> supaya total biaya paling kecil (atau total profit paling besar).</p>
<p>Karena strukturnya istimewa, soal transportasi tidak perlu diselesaikan dengan metode simplex. Cukup dua tahap: <b>(1) solusi awal</b> dengan Northwest Corner atau VAM, lalu <b>(2) evaluasi dan perbaikan</b> dengan Stepping Stone atau MODI sampai optimal.</p>
<p>Contoh sepanjang topik ini adalah <b>Executive Furniture</b>: 3 pabrik meja mengirim ke 3 gudang. Total supply 700 = total demand 700, jadi masalahnya <b>seimbang (balanced)</b>.</p>`,
        analogi: `Kamu punya 3 gudang paket di Bandung dan harus mengantar ke 3 kecamatan. Setiap gudang punya stok terbatas, setiap kecamatan butuh jumlah tertentu, dan ongkos kurir berbeda-beda per rute. Pertanyaannya: rute mana yang dipakai dan berapa paket per rute supaya ongkos totalnya paling hemat?`,
        istilah: [
          ["Sumber (source)", "Tempat asal barang, misalnya pabrik Des Moines. Ditulis di BARIS tabel."],
          ["Tujuan (destination)", "Tempat barang dikirim, misalnya gudang Boston. Ditulis di KOLOM tabel."],
          ["Supply / kapasitas", "Jumlah maksimum yang bisa dikirim dari satu sumber. Ditulis di kolom paling kanan."],
          ["Demand / kebutuhan", "Jumlah yang dibutuhkan satu tujuan. Ditulis di baris paling bawah."],
          ["Tabel transportasi", "Tabel dengan biaya per unit di kotak kecil (sudut kanan atas setiap sel) dan jumlah unit yang dikirim di tengah sel."],
          ["Seimbang (balanced)", "Total supply = total demand. Kalau tidak seimbang, tambahkan dummy."],
          ["Sel terisi", "Sel (rute) yang dipakai untuk mengirim, termasuk sel berisi 0 yang sengaja ditaruh saat degenerasi."],
          ["m + n − 1", "Jumlah sel terisi yang wajib ada agar solusi bisa dievaluasi. m = jumlah baris, n = jumlah kolom."]
        ],
        rumus: [
          { nama: "Fungsi tujuan", f: "Minimalkan Σ<sub>i</sub> Σ<sub>j</sub> C<sub>ij</sub> · X<sub>ij</sub>", arti: "C<sub>ij</sub> = biaya per unit dari sumber i ke tujuan j; X<sub>ij</sub> = unit yang dikirim." },
          { nama: "Batasan supply dan demand", f: "Σ<sub>j</sub> X<sub>ij</sub> ≤ supply<sub>i</sub> ; Σ<sub>i</sub> X<sub>ij</sub> = demand<sub>j</sub> ; X<sub>ij</sub> ≥ 0", arti: "Kirim tidak melebihi kapasitas, dan setiap tujuan terpenuhi." },
          { nama: "Syarat sel terisi", f: "jumlah sel terisi = m + n − 1", arti: "3 sumber × 3 tujuan → 3 + 3 − 1 = 5 sel terisi. Kurang dari itu disebut degenerasi." },
          { nama: "Total biaya", f: "Total = Σ (unit di sel terisi × biaya per unit sel itu)", arti: "Hanya sel terisi yang dihitung. Sel dummy berbiaya 0." }
        ],
        langkah: [
          "Tentukan sumber (baris) dan tujuan (kolom). Tulis supply di kanan dan demand di bawah.",
          "Tulis biaya per unit di kotak kecil setiap sel.",
          "<b>Cek keseimbangan</b>: total supply = total demand? Kalau tidak, tambahkan baris/kolom dummy berbiaya 0.",
          "Buat <b>solusi awal</b>: <a href=\"#modul/tp/nwc\">Northwest Corner</a> atau <a href=\"#modul/tp/vam\">VAM</a>.",
          "Pastikan sel terisi = m + n − 1. Kalau kurang, tambahkan angka 0 (degenerasi).",
          "<b>Evaluasi</b> sel kosong dengan <a href=\"#modul/tp/stepping\">Stepping Stone</a> atau <a href=\"#modul/tp/modi\">MODI</a>. Perbaiki sampai optimal.",
          "Tulis jawaban akhir: daftar rute, unit, dan total biaya."
        ],
        contoh: [
          { judul: "Tabel transportasi Executive Furniture", soal: SOAL_EXEC + ` Susun tabel transportasinya dan cek apakah seimbang.`,
            metode: "tp", data: EXEC, opsi: { awal: "nwc", tanpaOptimasi: true }, sampai: 1 },
          { judul: "Gambaran utuh: dari solusi awal sampai optimal", soal: `Masih soal Executive Furniture. Ini alur lengkapnya secara ringkas: solusi awal dengan VAM, lalu dicek dengan MODI. Detail setiap metode ada di subbab berikutnya.`,
            metode: "tp", data: EXEC, opsi: { awal: "vam", evaluasi: "modi" } }
        ],
        variasi: [
          { judul: "Supply lebih besar dari demand → kolom dummy", isi: `<p>Kalau pabrik Des Moines dinaikkan kapasitasnya menjadi 250, total supply = 850 sedangkan total demand = 700. Tambahkan <b>kolom dummy</b> (gudang bayangan) dengan demand 850 − 700 = 150 dan biaya 0. Unit yang "dikirim" ke dummy sebenarnya <b>tidak dikirim</b>, alias kapasitas yang menganggur.</p>`,
            contoh: { soal: `Executive Furniture dengan kapasitas Des Moines 250 (supply total 850, demand total 700). Susun tabel seimbangnya dan buat solusi awal Northwest Corner.`,
              metode: "tp", data: EXEC250, opsi: { awal: "nwc", tanpaOptimasi: true } } },
          { judul: "Demand lebih besar dari supply → baris dummy", isi: `<p>Kebalikannya, kalau kebutuhan lebih besar, tambahkan <b>baris dummy</b> (sumber bayangan) dengan supply sebesar kekurangannya dan biaya 0. Unit dari dummy berarti <b>permintaan yang tidak terpenuhi</b>. Contoh lengkapnya ada di <a href="#modul/tp/khusus">kasus khusus</a>.</p>` },
          { judul: "Transportasi sebagai linear programming", isi: `<p>Dengan m sumber dan n tujuan, model LP-nya punya <b>m × n variabel</b> dan <b>m + n batasan</b>. Executive Furniture: 3 × 3 = 9 variabel dan 3 + 3 = 6 batasan. Penulisan lengkapnya ada di subbab <a href="#modul/tp/lainnya">formulasi LP dan lokasi fasilitas</a>.</p>` }
        ],
        jebakan: [
          "Lupa <b>mengecek keseimbangan</b> sebelum mulai. Kalau supply ≠ demand, metode apa pun akan macet di akhir.",
          "Memberi dummy biaya M atau biaya rata-rata. Biaya dummy selalu <b>0</b>, karena tidak ada barang yang benar-benar dikirim.",
          "Tertukar menulis biaya per unit (kotak kecil) dengan jumlah unit (tengah sel).",
          "Menghitung total biaya dengan biaya × supply. Yang benar: <b>unit di sel × biaya sel itu</b>, dijumlahkan untuk semua sel terisi.",
          "Lupa bahwa baris/kolom dummy ikut dihitung di m + n − 1."
        ],
        cek: [
          { q: "Ada 4 sumber dan 5 tujuan. Berapa variabel dan batasan model LP-nya, dan berapa sel terisi yang dibutuhkan?", a: "Variabel 4 × 5 = <b>20</b>, batasan 4 + 5 = <b>9</b>, sel terisi 4 + 5 − 1 = <b>8</b>." },
          { q: "Supply total 850, demand total 700. Apa yang ditambahkan?", a: "<b>Kolom dummy</b> (tujuan bayangan) dengan demand 150 dan biaya 0." },
          { q: "Sel D–A berisi 100 unit dengan biaya $5, sel F–C berisi 200 unit dengan biaya $5. Berapa sumbangan keduanya ke total biaya?", a: "100 × 5 + 200 × 5 = 500 + 1.000 = <b>$1.500</b>." }
        ],
        ringkasan: `<p>Sumber di baris (supply di kanan), tujuan di kolom (demand di bawah), biaya di kotak kecil. Cek seimbang → solusi awal (NWC/VAM) → pastikan m + n − 1 sel terisi → evaluasi (Stepping Stone/MODI) → ulangi sampai optimal.</p>`,
        lembar: `<p>Gambar tabel transportasi besar dan rapi: biaya di kotak kecil sudut kanan atas, alokasi di tengah. Tulis "Supply = … , Demand = … → seimbang / tambah dummy". Setiap iterasi gambar tabel baru (jangan menimpa tabel lama) dan tulis total biayanya di bawah tabel.</p>`
      },

      /* ================================================================ */
      {
        id: "nwc", judul: "Northwest Corner (pokiapokaba)", menit: 10, video: "v06",
        ringkas: "Solusi awal paling cepat: mulai dari pojok kiri atas, habiskan supply atau demand, berakhir di pojok kanan bawah.",
        gambaran: `<p><b>Northwest Corner Rule</b> (NWC) adalah cara tercepat membuat solusi awal. Di kelas disingkat <b>pokiapokaba</b>: <b>po</b>jok <b>ki</b>ri <b>a</b>tas → <b>po</b>jok <b>ka</b>nan <b>ba</b>wah.</p>
<p>Mulai dari sel kiri atas. Isi sebanyak mungkin, yaitu <b>min(sisa supply, sisa demand)</b>. Kalau supply barisnya habis, turun ke baris berikutnya. Kalau demand kolomnya terpenuhi, geser ke kolom berikutnya. Begitu terus sampai pojok kanan bawah.</p>
<p>NWC <b>tidak melihat biaya sama sekali</b>, jadi hasilnya biasanya belum optimal. Itu wajar, karena NWC hanya titik awal untuk dievaluasi dengan Stepping Stone atau MODI.</p>`,
        analogi: `Seperti menuang air ke deretan gelas dari kiri ke kanan: isi gelas pertama sampai penuh, sisa air dituang ke gelas berikutnya. Kalau teko habis, ambil teko berikutnya. Kamu tidak peduli gelas mana yang "paling penting".`,
        istilah: [
          ["Northwest corner", "Pojok kiri atas tabel, tempat NWC dimulai."],
          ["Sisa supply / sisa demand", "Kapasitas atau kebutuhan yang belum terpakai setelah pengisian sebelumnya."],
          ["Pola tangga", "Bentuk alokasi NWC yang turun-ke-kanan seperti anak tangga."],
          ["Solusi awal feasible", "Alokasi yang memenuhi semua supply dan demand, belum tentu termurah."],
          ["Degenerasi pada NWC", "Supply dan demand habis BERSAMAAN sebelum pojok terakhir, sehingga sel terisi kurang dari m + n − 1."]
        ],
        rumus: [
          { nama: "Isi sel", f: "alokasi = min( sisa supply baris, sisa demand kolom )", arti: "Setelah mengisi, kurangi sisa supply dan sisa demand dengan jumlah itu." },
          { nama: "Arah gerak", f: "supply habis → turun · demand habis → ke kanan · keduanya habis → taruh 0, lalu turun serong", arti: "Angka 0 menjaga pola tangga supaya sel terisi tetap m + n − 1." }
        ],
        langkah: [
          "Mulai dari sel pojok kiri atas.",
          "Isi sel dengan min(sisa supply, sisa demand).",
          "Kalau supply baris habis → turun ke baris berikutnya (kolom tetap).",
          "Kalau demand kolom terpenuhi → geser ke kolom berikutnya (baris tetap).",
          "Kalau keduanya habis bersamaan (bukan di pojok terakhir) → taruh angka 0 di sel sebelahnya, lalu bergerak serong.",
          "Ulangi sampai pojok kanan bawah. Cek: sel terisi = m + n − 1, lalu hitung total biaya."
        ],
        contoh: [{
          judul: "NWC untuk Executive Furniture", soal: SOAL_EXEC + ` Buat solusi awal dengan Northwest Corner dan hitung total biayanya.`,
          metode: "tp", data: EXEC, opsi: { awal: "nwc", tanpaOptimasi: true }
        }],
        variasi: [
          { judul: "Degenerasi di solusi awal (Martin Shipping)", isi: `<p>Kalau supply dan demand habis bersamaan di tengah jalan, pola tangga "putus". Taruh <b>angka 0</b> di sel sebelahnya (ke kanan atau ke bawah; solver di situs ini memilih ke kanan) dan perlakukan sel itu sebagai sel terisi. Martin: Gudang 1 (100) dan Pelanggan 1 (100) habis bersamaan, jadi 0 ditaruh di G1–P2. Hasil awal: G1–P1 100, G1–P2 0, G2–P2 100, G2–P3 20, G3–P3 80, total biaya $2.440 dengan 5 sel terisi.</p>`,
            contoh: { soal: `Martin Shipping punya Gudang 1/2/3 dengan supply 100 / 120 / 80 untuk Pelanggan 1/2/3 yang masing-masing butuh 100. Biaya ($): G1 → 8 / 2 / 6; G2 → 10 / 9 / 9; G3 → 7 / 10 / 7. Buat solusi awal NWC.`,
              metode: "tp", data: MARTIN, opsi: { awal: "nwc", tanpaOptimasi: true } } },
          { judul: "NWC dengan baris dummy", isi: `<p>Baris/kolom dummy diperlakukan seperti baris/kolom biasa: NWC tetap berjalan dari kiri atas, dan dummy biasanya terisi di akhir. Contoh Happy Sound (supply 450, demand 500) menghasilkan solusi awal $2.850 dengan 50 unit dari dummy ke Gudang C.</p>`,
            contoh: { soal: `Happy Sound: Plant W/X/Y dengan supply 200 / 175 / 75; Gudang A/B/C butuh 250 / 100 / 150. Biaya ($): W → 6 / 4 / 9; X → 10 / 5 / 8; Y → 12 / 7 / 6. Seimbangkan lalu buat solusi awal NWC.`,
              metode: "tp", data: HAPPY, opsi: { awal: "nwc", tanpaOptimasi: true } } }
        ],
        jebakan: [
          "Mengisi dengan supply/demand AWAL, bukan <b>sisanya</b>. Setelah D–A diisi 100, demand Albuquerque tinggal 200.",
          "Melompat ke sel termurah. NWC <b>tidak</b> melihat biaya; urutannya selalu kiri atas → kanan bawah.",
          "Saat supply dan demand habis bersamaan, lupa menaruh angka 0 sehingga sel terisi kurang dari m + n − 1.",
          "Berhenti di NWC lalu menganggapnya optimal. NWC hanya solusi awal; Executive Furniture: NWC $4.200, padahal optimal $3.900.",
          "Lupa mengecek jumlah setiap baris = supply dan setiap kolom = demand setelah selesai."
        ],
        cek: [
          { q: "Executive Furniture: setelah D–A = 100, sel apa yang diisi berikutnya dan berapa?", a: "Supply D habis → turun ke <b>E–A</b>, diisi min(300, 200) = <b>200</b>." },
          { q: "Hasil NWC Executive Furniture: D–A 100, E–A 200, E–B 100, F–B 100, F–C 200. Berapa total biayanya?", a: "100×5 + 200×8 + 100×4 + 100×7 + 200×5 = 500 + 1.600 + 400 + 700 + 1.000 = <b>$4.200</b>." },
          { q: "Kenapa solusi NWC jarang optimal?", a: "Karena NWC mengisi sel berdasarkan posisi (pojok kiri atas), <b>tanpa mempertimbangkan biaya</b>." }
        ],
        ringkasan: `<p>Pokiapokaba: isi min(sisa supply, sisa demand) mulai dari kiri atas; supply habis → turun, demand habis → kanan, keduanya habis → taruh 0. Hasilnya feasible tapi belum tentu murah.</p>`,
        lembar: `<p>Gambar tabel, isi alokasi NWC, lalu tulis "Sel terisi = 5 = m + n − 1 = 3 + 3 − 1 ✓". Tulis perhitungan total biaya lengkap: 100×5 + 200×8 + … = $4.200. Kalau ada degenerasi, lingkari angka 0 dan beri keterangan.</p>`
      },

      /* ================================================================ */
      {
        id: "stepping", judul: "Stepping Stone", menit: 20, video: "v06",
        ringkas: "Menguji setiap sel kosong dengan jalur tertutup ±, menghitung improvement index, lalu memindahkan unit sampai optimal.",
        gambaran: `<p><b>Stepping Stone</b> menjawab pertanyaan untuk setiap sel kosong: <i>"kalau 1 unit dikirim lewat rute ini, total biaya naik atau turun berapa?"</i> Jawabannya disebut <b>improvement index</b>.</p>
<p>Caranya, dari sel kosong buat <b>jalur tertutup</b> yang bergerak horizontal/vertikal dan hanya <b>berbelok di sel terisi</b>. Beri tanda + di sel awal, lalu −, +, − bergantian di setiap belokan. Index = jumlah biaya bertanda.</p>
<p>Untuk minimasi: kalau ada index <b>negatif</b>, biaya masih bisa turun. Pilih yang paling negatif, pindahkan unit sebanyak <b>θ = nilai terkecil di sel bertanda −</b>, lalu evaluasi lagi. Kalau semua index ≥ 0, solusi sudah <b>optimal</b>.</p>`,
        analogi: `Seperti batu loncatan di sungai: kamu hanya boleh berpijak (berbelok) di batu yang ada (sel terisi), dan harus kembali ke titik awal. Setiap pijakan bergantian "tambah satu" dan "kurangi satu" supaya jumlah baris dan kolom tetap seimbang.`,
        istilah: [
          ["Sel kosong", "Rute yang belum dipakai. Setiap sel kosong dievaluasi."],
          ["Jalur tertutup", "Lintasan dari sel kosong kembali ke dirinya, bergerak horizontal/vertikal, berbelok hanya di sel terisi. Jumlah titiknya selalu genap."],
          ["Improvement index (I)", "Perubahan total biaya kalau 1 unit dikirim lewat sel kosong itu. Negatif = menghemat."],
          ["Sel masuk", "Sel kosong yang dipilih untuk mulai dipakai (index paling negatif)."],
          ["θ (theta)", "Jumlah unit yang dipindah = alokasi terkecil di antara sel bertanda −."],
          ["Sel keluar", "Sel bertanda − yang menjadi 0 dan dikosongkan."]
        ],
        rumus: [
          { nama: "Improvement index", f: "I<sub>ij</sub> = Σ biaya sel bertanda (+) − Σ biaya sel bertanda (−)", arti: "Sel awal (yang kosong) selalu bertanda +." },
          { nama: "Unit yang dipindah", f: "θ = min( alokasi di sel bertanda − )", arti: "Tambahkan θ ke sel +, kurangkan θ dari sel −." },
          { nama: "Perubahan biaya", f: "Biaya baru = biaya lama + I × θ", arti: "Contoh: 4.200 + (−2) × 100 = 4.000." },
          { nama: "Syarat optimal", f: "Minimasi: semua I ≥ 0 · Maksimasi: semua I ≤ 0", arti: "Ada I = 0 di solusi optimal → ada solusi optimal lain." }
        ],
        langkah: [
          "Pastikan sel terisi = m + n − 1.",
          "Pilih satu sel kosong, beri tanda +.",
          "Buat jalur tertutup kembali ke sel itu, berbelok hanya di sel terisi. Beri tanda −, +, −, … bergantian di setiap belokan.",
          "Hitung improvement index = jumlah biaya bertanda.",
          "Ulangi untuk SEMUA sel kosong. Kalau semua index ≥ 0 → optimal, selesai.",
          "Kalau ada yang negatif: pilih yang paling negatif, θ = alokasi terkecil di sel bertanda −, tambah/kurang θ di sepanjang jalur, hitung biaya baru, lalu kembali ke langkah 2."
        ],
        contoh: [{
          judul: "Executive Furniture sampai optimal", soal: SOAL_EXEC + ` Mulai dari solusi NWC ($4.200), gunakan Stepping Stone sampai optimal.`,
          metode: "tp", data: EXEC, opsi: { awal: "nwc", evaluasi: "stepping" }
        }],
        variasi: [
          { judul: "Jalur yang panjang", isi: `<p>Tidak semua jalur berbentuk kotak 4 titik. Di iterasi pertama Executive Furniture, jalur sel D–C adalah <b>+DC −DA +EA −EB +FB −FC</b> (6 titik), sehingga I<sub>DC</sub> = +3 − 5 + 8 − 4 + 7 − 5 = <b>+4</b>. Jalur boleh <b>melewati</b> sel (terisi maupun kosong) tanpa berbelok; tanda hanya diberikan di sel tempat berbelok.</p>` },
          { judul: "Membaca hasil iterasi", isi: `<p>Iterasi 1: index DB +3, DC +4, EC +1, FA <b>−2</b> → F–A masuk, θ = min(100, 200) = 100, biaya $4.200 + (−2)(100) = $4.000. Iterasi 2: DB +3, DC +2, EC <b>−1</b>, FB +2 → E–C masuk, θ = 100, biaya $3.900. Iterasi 3: DB +2, DC +2, EA +1, FB +1, semuanya ≥ 0 → <b>optimal $3.900</b>.</p>` },
          { judul: "Index sama-sama paling negatif", isi: `<p>Kalau dua sel punya index paling negatif yang sama, pilih salah satu; hasil akhirnya tetap optimal. Supaya konsisten, solver di situs ini memilih yang lebih dulu dalam urutan membaca (baris atas dulu, lalu kolom kiri).</p>` },
          { judul: "Versi maksimasi", isi: `<p>Kalau tabelnya berisi profit, logikanya dibalik: pilih index <b>positif terbesar</b>, dan solusi optimal tercapai saat semua index <b>≤ 0</b>. Contoh lengkapnya ada di <a href="#modul/tp/khusus">kasus khusus</a>.</p>` }
        ],
        jebakan: [
          "Berbelok di sel kosong. Belokan hanya boleh di <b>sel terisi</b>; sel kosong hanya boleh dilewati lurus.",
          "Tanda tidak bergantian. Urutannya selalu + (sel awal), −, +, −, … dan jumlah titiknya genap.",
          "Mengambil θ dari sel bertanda +. θ adalah alokasi terkecil di sel bertanda <b>−</b>.",
          "Berhenti setelah satu iterasi. Setelah memindahkan unit, <b>semua</b> sel kosong harus dievaluasi ulang karena jalurnya berubah.",
          "Di slide, perhitungan I<sub>DB</sub> tertulis +4 − 5 + 5 − 4; angka ketiganya seharusnya 8 (biaya E–A). Hasilnya tetap +3.",
          "Salah syarat optimal: untuk biaya, optimal kalau semua index ≥ 0 (boleh ada 0), bukan semua positif."
        ],
        cek: [
          { q: "Jalur F–A pada iterasi 1 adalah +FA −FB +EB −EA dengan biaya 9, 7, 4, 8. Berapa indexnya?", a: "+9 − 7 + 4 − 8 = <b>−2</b>, jadi mengirim lewat F–A menghemat $2 per unit." },
          { q: "Sel bertanda − di jalur F–A berisi 100 (F–B) dan 200 (E–A). Berapa θ dan sel mana yang keluar?", a: "θ = min(100, 200) = <b>100</b>; F–B menjadi 0 sehingga <b>F–B keluar</b>." },
          { q: "Biaya sekarang $4.000, index paling negatif −1 dengan θ = 100. Berapa biaya baru?", a: "4.000 + (−1)(100) = <b>$3.900</b>." }
        ],
        ringkasan: `<p>Setiap sel kosong: jalur tertutup ± (belok di sel terisi) → index = Σ biaya bertanda. Minimasi: ada index negatif → pilih paling negatif, pindahkan θ = min di sel −, ulangi. Semua index ≥ 0 → optimal.</p>`,
        lembar: `<p>Untuk setiap iterasi tulis daftar: "Sel D–B: +DB −DA +EA −EB = +4 − 5 + 8 − 4 = +3". Gambar tanda ± dan panah jalur pada tabel untuk sel yang masuk. Tulis θ, tabel baru, dan biaya baru. Penutup: "Semua index ≥ 0 → optimal, total biaya $3.900", lalu daftar rute dan unitnya.</p>`
      },

      /* ================================================================ */
      {
        id: "modi", judul: "MODI (Modified Distribution)", menit: 18, video: "v07",
        ringkas: "Menghitung semua improvement index dengan cepat lewat nilai baris R dan kolom K, tanpa membuat jalur untuk setiap sel.",
        gambaran: `<p><b>MODI</b> memberi improvement index yang <b>sama persis</b> dengan Stepping Stone, tetapi jauh lebih cepat. Kamu tidak perlu menggambar jalur untuk setiap sel kosong; jalur hanya dibuat untuk satu sel yang terpilih masuk.</p>
<p>Idenya: setiap baris diberi nilai <b>R<sub>i</sub></b> dan setiap kolom diberi nilai <b>K<sub>j</sub></b>, dengan syarat untuk setiap <b>sel terisi</b>: R<sub>i</sub> + K<sub>j</sub> = C<sub>ij</sub>. Tetapkan <b>R<sub>1</sub> = 0</b>, lalu selesaikan persamaannya satu per satu. Setelah itu, index setiap sel kosong = <b>C<sub>ij</sub> − R<sub>i</sub> − K<sub>j</sub></b>.</p>`,
        analogi: `Stepping Stone seperti menghitung harga setiap jalan alternatif satu per satu. MODI seperti membuat "daftar harga patokan" per baris dan per kolom dulu, lalu setiap sel kosong cukup dibandingkan dengan patokan itu.`,
        istilah: [
          ["R<sub>i</sub>", "Nilai baris ke-i (sumber). R<sub>1</sub> selalu ditetapkan 0."],
          ["K<sub>j</sub>", "Nilai kolom ke-j (tujuan)."],
          ["Persamaan sel terisi", "R<sub>i</sub> + K<sub>j</sub> = C<sub>ij</sub>, ditulis HANYA untuk sel terisi. Ada m + n − 1 persamaan."],
          ["Improvement index", "I<sub>ij</sub> = C<sub>ij</sub> − R<sub>i</sub> − K<sub>j</sub> untuk sel kosong. Nilainya sama dengan hasil Stepping Stone."]
        ],
        rumus: [
          { nama: "Sel terisi", f: "R<sub>i</sub> + K<sub>j</sub> = C<sub>ij</sub> , dengan R<sub>1</sub> = 0", arti: "Selesaikan berurutan: cari persamaan yang salah satu nilainya sudah diketahui." },
          { nama: "Sel kosong", f: "I<sub>ij</sub> = C<sub>ij</sub> − R<sub>i</sub> − K<sub>j</sub>", arti: "Minimasi: pilih I paling negatif. Semua I ≥ 0 → optimal." }
        ],
        langkah: [
          "Mulai dari solusi awal (NWC/VAM) dengan sel terisi = m + n − 1.",
          "Tulis persamaan R<sub>i</sub> + K<sub>j</sub> = C<sub>ij</sub> untuk setiap sel terisi.",
          "Tetapkan R<sub>1</sub> = 0, lalu selesaikan semua R dan K. Nilai negatif itu normal.",
          "Hitung I<sub>ij</sub> = C<sub>ij</sub> − R<sub>i</sub> − K<sub>j</sub> untuk setiap sel kosong.",
          "Kalau semua I ≥ 0 → optimal. Kalau ada yang negatif, pilih yang paling negatif.",
          "Buat jalur tertutup HANYA untuk sel itu (seperti Stepping Stone), pindahkan θ, lalu hitung ulang R dan K dari awal."
        ],
        contoh: [{
          judul: "Executive Furniture dengan MODI", soal: SOAL_EXEC + ` Mulai dari solusi NWC, gunakan MODI sampai optimal.`,
          metode: "tp", data: EXEC, opsi: { awal: "nwc", evaluasi: "modi" }
        }],
        variasi: [
          { judul: "Catatan untuk slide MODI iterasi 2", isi: `<p>Di iterasi 2 (setelah F–A masuk), persamaannya menghasilkan R<sub>3</sub> = 4 dan dari R<sub>3</sub> + K<sub>3</sub> = 5 diperoleh <b>K<sub>3</sub> = 1</b>. Slide menuliskan K<sub>3</sub> = 4 saat menghitung index, sehingga tertulis I<sub>DC</sub> = 3 − 0 − 4 = −1 dan I<sub>EC</sub> = 3 − 3 − 4 = −4. Yang benar: <b>I<sub>DC</sub> = 3 − 0 − 1 = +2</b> dan <b>I<sub>EC</sub> = 3 − 3 − 1 = −1</b>, sama dengan hasil Stepping Stone. Keputusannya tidak berubah: E–C tetap yang masuk.</p>` },
          { judul: "Nilai R dan K negatif itu biasa", isi: `<p>Di iterasi 1 Executive Furniture: R = 0, 3, 6 dan K = 5, 1, <b>−1</b>. K<sub>3</sub> = −1 tidak salah. Saat menghitung index, beri kurung: I<sub>DC</sub> = 3 − 0 − (−1) = <b>+4</b>.</p>` },
          { judul: "MODI untuk maksimasi", isi: `<p>Persamaannya sama persis. Bedanya hanya di keputusan: pilih index <b>positif terbesar</b>, dan solusi optimal saat semua index ≤ 0.</p>` },
          { judul: "Stepping Stone atau MODI?", isi: `<ul><li>Hasil index keduanya <b>selalu sama</b>.</li><li>Stepping Stone: jalur untuk SETIAP sel kosong. Cocok untuk tabel kecil atau kalau soal memintanya.</li><li>MODI: cukup persamaan R/K + satu jalur untuk sel masuk. Lebih cepat untuk tabel besar.</li><li>Ikuti metode yang diminta soal.</li></ul>` }
        ],
        jebakan: [
          "Menulis persamaan R + K = C untuk sel KOSONG. Persamaan hanya untuk sel <b>terisi</b>.",
          "Rumus index terbalik. Yang benar <b>C − R − K</b>, bukan R + K − C.",
          "Lupa kurung saat R atau K negatif: 3 − 0 − (−1) = +4, bukan 3 − 0 − 1.",
          "Memakai R dan K iterasi lama. Setelah unit dipindah, <b>hitung ulang</b> semua R dan K.",
          "Mengira MODI tidak butuh jalur. Jalur tetap diperlukan untuk sel yang masuk, supaya tahu sel mana yang + dan −.",
          "Ikut menyalin kesalahan slide di iterasi 2. Cek lagi: dari R<sub>3</sub> = 4 dan C<sub>33</sub> = 5, maka K<sub>3</sub> = 1."
        ],
        cek: [
          { q: "Sel terisi D–A (biaya 5) dan E–A (biaya 8), dengan R<sub>1</sub> = 0. Berapa K<sub>1</sub> dan R<sub>2</sub>?", a: "R<sub>1</sub> + K<sub>1</sub> = 5 → <b>K<sub>1</sub> = 5</b>; R<sub>2</sub> + 5 = 8 → <b>R<sub>2</sub> = 3</b>." },
          { q: "R<sub>3</sub> = 6, K<sub>1</sub> = 5, C<sub>FA</sub> = 9. Berapa I<sub>FA</sub>?", a: "9 − 6 − 5 = <b>−2</b>, jadi F–A layak dipakai." },
          { q: "Iterasi terakhir: R = 0, 2, 4 dan K = 5, 2, 1. Berapa I<sub>EA</sub> (C = 8)?", a: "8 − 2 − 5 = <b>+1</b>. Semua index ≥ 0, jadi solusi $3.900 optimal." }
        ],
        ringkasan: `<p>Sel terisi: R + K = C, R<sub>1</sub> = 0. Sel kosong: I = C − R − K. Pilih I paling negatif, buat jalurnya, pindahkan θ, lalu hitung ulang R dan K. Semua I ≥ 0 → optimal.</p>`,
        lembar: `<p>Tulis R<sub>i</sub> di kiri setiap baris dan K<sub>j</sub> di atas setiap kolom. Daftar persamaan bernomor: "(1) R1 + K1 = 5 → K1 = 5 …". Lalu daftar index: "IDB = C12 − R1 − K2 = 4 − 0 − 1 = +3". Tulis sel yang masuk, jalurnya, θ, tabel baru, dan biaya baru.</p>`
      },

      /* ================================================================ */
      {
        id: "vam", judul: "Vogel's Approximation Method (VAM)", menit: 15, video: "v07",
        ringkas: "Solusi awal yang memperhatikan biaya lewat pinalti (opportunity cost), sering langsung optimal.",
        gambaran: `<p><b>VAM</b> lebih rumit daripada NWC, tetapi solusi awalnya jauh lebih baik dan <b>kadang langsung optimal</b>. Bedanya, VAM memperhatikan biaya.</p>
<p>Di setiap baris dan kolom, hitung <b>pinalti</b> = selisih biaya termurah dan termurah kedua. Pinalti ini adalah <b>opportunity cost</b>: kerugian kalau kita terpaksa memakai rute terbaik kedua. Baris/kolom dengan pinalti terbesar paling "berbahaya" kalau tidak segera diisi, jadi isi sel termurahnya sebanyak mungkin, coret baris/kolom yang sudah habis, lalu hitung pinalti lagi.</p>
<p>Pada Executive Furniture, VAM langsung menghasilkan <b>$3.900</b>, yang ternyata sudah optimal (NWC hanya $4.200).</p>`,
        analogi: `Memilih tempat duduk di kelas. Ada teman yang punya satu kursi favorit dan pilihan keduanya jauh lebih buruk (pinalti besar), ada juga yang bebas duduk di mana saja (pinalti kecil). Yang pinaltinya besar dipersilakan memilih duluan.`,
        istilah: [
          ["Pinalti (opportunity cost)", "Selisih biaya termurah dan termurah kedua di satu baris atau kolom (yang belum dicoret)."],
          ["Baris/kolom dicoret (X)", "Baris yang supply-nya habis atau kolom yang demand-nya terpenuhi. Sel-selnya tidak dihitung lagi."],
          ["Sel termurah di garis terpilih", "Sel dengan biaya terkecil di baris/kolom berpinalti terbesar. Di sinilah alokasi diberikan."],
          ["Solusi awal VAM", "Hasil VAM. Tetap harus dicek dengan MODI/Stepping Stone apakah sudah optimal."]
        ],
        rumus: [
          { nama: "Pinalti (minimasi)", f: "pinalti = biaya termurah kedua − biaya termurah", arti: "Dihitung untuk setiap baris dan kolom yang belum dicoret." },
          { nama: "Pinalti (maksimasi)", f: "pinalti = profit terbesar − profit terbesar kedua", arti: "Lalu isi sel dengan profit terbesar di garis terpilih." },
          { nama: "Alokasi", f: "isi = min( sisa supply, sisa demand ) di sel termurah garis berpinalti terbesar", arti: "Garis yang habis dicoret, lalu pinalti dihitung ulang." }
        ],
        langkah: [
          "Hitung pinalti setiap baris dan setiap kolom (termurah kedua − termurah).",
          "Pilih baris/kolom dengan pinalti terbesar.",
          "Di garis itu, isi sel dengan biaya terendah sebanyak min(sisa supply, sisa demand).",
          "Coret (X) baris atau kolom yang sudah habis.",
          "Hitung ulang pinalti hanya dari sel yang belum dicoret.",
          "Ulangi sampai semua terisi. Kalau tinggal satu baris/kolom, isi langsung sisanya. Lalu cek optimalitas dengan MODI/Stepping Stone."
        ],
        contoh: [{
          judul: "VAM untuk Executive Furniture", soal: SOAL_EXEC + ` Buat solusi awal dengan VAM, lalu cek dengan MODI apakah sudah optimal.`,
          metode: "tp", data: EXEC, opsi: { awal: "vam", evaluasi: "modi" }
        }],
        variasi: [
          { judul: "Membaca pinalti Executive Furniture", isi: `<ul><li>Putaran 1: baris D/E/F = 1 / 1 / 2, kolom A/B/C = <b>3</b> / 0 / 0 → kolom A, isi D–A 100. Baris D dicoret.</li><li>Putaran 2: baris E/F = 1 / 2, kolom A/B/C = 1 / <b>3</b> / 2 → kolom B, isi E–B 200. Kolom B dicoret.</li><li>Putaran 3: baris E/F = <b>5</b> / 4, kolom A/C = 1 / 2 → baris E, isi E–C 100. Baris E dicoret.</li><li>Sisa baris F: F–A 200, F–C 100. Total $3.900, dan MODI menunjukkan semua index ≥ 0.</li></ul>` },
          { judul: "Pinalti seri", isi: `<p>Kalau dua garis punya pinalti terbesar yang sama, pilih garis yang memuat sel <b>termurah</b>. Kalau masih seri, solver di situs ini memilih yang lebih dulu ditemukan (baris dari atas, lalu kolom dari kiri). Pilihan lain juga boleh; solusi akhirnya tetap optimal setelah dievaluasi.</p>` },
          { judul: "Supply dan demand habis bersamaan", isi: `<p>Coret <b>salah satu</b> saja (misalnya barisnya), dan biarkan kolomnya tetap dengan sisa 0. Nanti kolom itu akan menerima alokasi 0 sehingga sel terisi tetap m + n − 1.</p>` },
          { judul: "VAM untuk maksimasi", isi: `<p>Pinalti = profit terbesar − profit terbesar kedua. Pilih garis berpinalti terbesar, lalu isi sel dengan <b>profit terbesar</b> di garis itu.</p>` }
        ],
        jebakan: [
          "Mengisi sel termurah di SELURUH tabel. VAM mengisi sel termurah di <b>garis berpinalti terbesar</b>.",
          "Tidak menghitung ulang pinalti setelah mencoret. Pinalti berubah setiap putaran.",
          "Ikut menghitung sel yang sudah dicoret (X) saat mencari termurah kedua.",
          "Menganggap VAM pasti optimal. VAM hanya solusi awal; tetap cek dengan MODI atau Stepping Stone.",
          "Lupa bahwa sel dummy (biaya 0) ikut dihitung dalam pinalti."
        ],
        cek: [
          { q: "Kolom A berisi biaya 5, 8, 9. Berapa pinaltinya?", a: "Termurah 5, termurah kedua 8 → pinalti <b>3</b>." },
          { q: "Setelah baris D dan kolom B dicoret, baris E tinggal berisi biaya 8 (A) dan 3 (C). Berapa pinaltinya dan sel mana yang diisi kalau baris E terpilih?", a: "Pinalti 8 − 3 = <b>5</b>; isi sel termurah <b>E–C</b>." },
          { q: "VAM menghasilkan $3.900 dan NWC $4.200. Apa artinya?", a: "VAM memberi solusi awal yang lebih murah. Di soal ini bahkan <b>langsung optimal</b>, terbukti karena semua index MODI ≥ 0." }
        ],
        ringkasan: `<p>Pinalti = termurah kedua − termurah (per baris dan kolom) → pilih pinalti terbesar → isi sel termurahnya sebanyak mungkin → coret → hitung ulang. Lalu cek optimal dengan MODI/Stepping Stone.</p>`,
        lembar: `<p>Tambahkan kolom "Pinalti" di kanan tabel dan baris "Pinalti" di bawah. Untuk setiap putaran tulis pinaltinya (boleh bertumpuk: 3 | 1 | …), tandai garis terpilih, beri X pada sel yang dicoret. Setelah selesai, tulis total biaya dan lanjutkan dengan MODI.</p>`
      },

      /* ================================================================ */
      {
        id: "khusus", judul: "Kasus khusus transportasi", menit: 25, video: "v08",
        ringkas: "Tidak seimbang (dummy), degenerasi, solusi optimal ganda, rute terlarang (M), dan maksimasi profit.",
        gambaran: `<p>Soal UTS sering menggabungkan beberapa kasus khusus sekaligus. Lima kasus yang wajib dikenali:</p>
<ul><li><b>Tidak seimbang</b> → tambah dummy berbiaya 0.</li><li><b>Degenerasi</b> → sel terisi kurang dari m + n − 1 → taruh angka 0.</li><li><b>Solusi optimal ganda</b> → ada index = 0 di tabel optimal.</li><li><b>Rute terlarang</b> → biaya M (sangat besar) untuk minimasi, −M untuk maksimasi.</li><li><b>Maksimasi profit</b> → pilih index positif terbesar; optimal kalau semua index ≤ 0.</li></ul>`,
        analogi: `Seperti soal cerita matematika yang diberi "jebakan": angkanya tidak pas, ada jalan yang ditutup, atau tujuannya untung bukan hemat. Langkah dasarnya tetap sama, hanya ada penyesuaian kecil di awal atau di syarat berhenti.`,
        istilah: [
          ["Dummy source (baris)", "Sumber bayangan saat demand > supply. Unitnya = permintaan yang tidak terpenuhi."],
          ["Dummy destination (kolom)", "Tujuan bayangan saat supply > demand. Unitnya = kapasitas yang tidak terkirim."],
          ["Degenerasi", "Sel terisi < m + n − 1. Bisa terjadi di solusi awal atau saat iterasi."],
          ["Solusi optimal ganda", "Index bernilai 0 di tabel optimal: ada susunan rute lain dengan total biaya yang sama."],
          ["Rute terlarang", "Rute yang tidak boleh dipakai. Diberi biaya M (minimasi) atau −M (maksimasi)."],
          ["Maksimasi", "Tabel berisi profit. Index positif berarti profit masih bisa naik."]
        ],
        rumus: [
          { nama: "Dummy", f: "jumlah dummy = | total supply − total demand | , biaya dummy = 0", arti: "Supply lebih besar → kolom dummy. Demand lebih besar → baris dummy." },
          { nama: "Degenerasi", f: "sel terisi < m + n − 1 → tambahkan angka 0", arti: "Taruh 0 di sel yang tidak membentuk jalur tertutup dengan sel terisi lain." },
          { nama: "Rute terlarang", f: "minimasi: C<sub>ij</sub> = M · maksimasi: C<sub>ij</sub> = −M", arti: "M dianggap jauh lebih besar dari angka apa pun, jadi M − 7.000 tetap sangat besar." },
          { nama: "Syarat optimal maksimasi", f: "semua I ≤ 0 ; sel masuk = I positif terbesar", arti: "Kebalikan dari minimasi." }
        ],
        langkah: [
          "Baca soal: biaya atau profit? Ada rute yang tidak boleh? Supply = demand?",
          "Seimbangkan dengan dummy (biaya 0). Tulis M / −M pada rute terlarang.",
          "Buat solusi awal (NWC/VAM). Kalau sel terisi < m + n − 1, tambahkan angka 0.",
          "Evaluasi dengan Stepping Stone/MODI. Minimasi: masuk = index paling negatif. Maksimasi: masuk = index positif terbesar.",
          "Kalau dua sel bertanda − sama-sama paling kecil (θ seri), kosongkan satu saja; sisanya tetap diisi 0.",
          "Di tabel optimal, cek index = 0 (optimal ganda), lalu jelaskan arti dummy di jawaban akhir."
        ],
        contoh: [{
          judul: "Happy Sound: baris dummy + degenerasi saat iterasi",
          soal: `Happy Sound: Plant W/X/Y dengan supply 200 / 175 / 75; Gudang A/B/C butuh 250 / 100 / 150. Biaya ($): W → 6 / 4 / 9; X → 10 / 5 / 8; Y → 12 / 7 / 6. Selesaikan dengan NWC + Stepping Stone dan jelaskan arti baris dummy.`,
          metode: "tp", data: HAPPY, opsi: { awal: "nwc", evaluasi: "stepping" }
        }],
        variasi: [
          { judul: "Kolom dummy (supply > demand)", isi: `<p>Executive Furniture dengan Des Moines berkapasitas 250: tambahkan kolom dummy 150. Solusi NWC $3.350, optimalnya <b>$3.300</b>, dan <b>Fort Lauderdale menyisakan 150 unit</b> yang tidak terkirim.</p>`,
            contoh: { soal: `Executive Furniture dengan kapasitas Des Moines 250, Evansville 300, Fort Lauderdale 300; demand Albuquerque 300, Boston 200, Cleveland 200. Selesaikan dengan NWC + Stepping Stone.`,
              metode: "tp", data: EXEC250, opsi: { awal: "nwc", evaluasi: "stepping" } } },
          { judul: "Degenerasi di solusi awal (Martin)", isi: `<p>NWC Martin langsung degenerasi, jadi angka 0 ditaruh di G1–P2 (biaya awal $2.440). Perhatikan iterasi ke-3: θ = 0 karena sel bertanda − yang terkecil berisi 0. Unit yang dipindah 0, biaya tidak berubah, tetapi susunan sel terisi berganti. Hasil optimal <b>$1.860</b>.</p>`,
            contoh: { soal: `Martin Shipping: supply Gudang 1/2/3 = 100 / 120 / 80, demand Pelanggan 1/2/3 = 100 / 100 / 100. Biaya ($): G1 → 8 / 2 / 6; G2 → 10 / 9 / 9; G3 → 7 / 10 / 7. Selesaikan dengan NWC + Stepping Stone.`,
              metode: "tp", data: MARTIN, opsi: { awal: "nwc", evaluasi: "stepping" } } },
          { judul: "Degenerasi saat iterasi (Bagwell Paint)", isi: `<p>Bagwell Paint sudah punya tabel: A–1 70, B–1 50, B–2 80, C–1 30, C–3 50 (biaya $2.700). Index: A–2 +2, A–3 +1, <b>B–3 −15</b>, C–2 +11. Jalur B–3: +B3 −B1 +C1 −C3, dan θ = min(50, 50) = 50, <b>seri</b>. Kalau keduanya dikosongkan, sel terisi tinggal 4 (degenerasi). Jadi hanya satu yang keluar: B–1 (biaya 15) dikosongkan, sedangkan <b>C–3 (biaya 10, lebih murah) tetap diisi 0</b>. Biaya turun 15 × 50 = 750 menjadi <b>$1.950</b>, yang ternyata sudah optimal. Contoh Happy Sound di atas mengalami kejadian yang sama di iterasi 1.</p>`,
            contoh: { soal: `Bagwell Paint: supply Pabrik A/B/C = 70 / 130 / 80, demand Gudang 1/2/3 = 150 / 80 / 50. Biaya ($): A → 8 / 5 / 16; B → 15 / 10 / 7; C → 3 / 9 / 10. Tabel solusi saat ini: A–1 70, B–1 50, B–2 80, C–1 30, C–3 50. Lanjutkan dengan stepping stone.`,
              metode: "tp", data: { sumber: [{ nama: "Pabrik A", kode: "A", supply: 70 }, { nama: "Pabrik B", kode: "B", supply: 130 }, { nama: "Pabrik C", kode: "C", supply: 80 }],
                tujuan: [{ nama: "Gudang 1", kode: "1", demand: 150 }, { nama: "Gudang 2", kode: "2", demand: 80 }, { nama: "Gudang 3", kode: "3", demand: 50 }],
                biaya: [[8, 5, 16], [15, 10, 7], [3, 9, 10]], goal: "min", satuan: "$" },
              opsi: { awalTabel: [[70, null, null], [50, 80, null], [30, null, 50]], evaluasi: "stepping" } } },
          { judul: "Solusi optimal ganda (Hardrock Concrete)", isi: `<p>Solusi NWC Hardrock ($1.040) langsung optimal, tetapi index sel 3–A = <b>0</b>. Artinya rute 3–A bisa dipakai tanpa mengubah biaya. Dengan memindahkan 20 unit lewat jalur 3–A, diperoleh susunan lain: 1–A 20, 1–B 50, 2–C 50, 3–A 20, 3–C 10, juga $1.040. Optimal ganda memberi manajemen <b>fleksibilitas</b> memilih rute.</p>`,
            contoh: { soal: `Hardrock Concrete: Plant 1/2/3 berkapasitas 70 / 50 / 30 truk; Proyek A/B/C butuh 40 / 50 / 60. Biaya ($/truk): Plant 1 → 10 / 4 / 11; Plant 2 → 12 / 5 / 8; Plant 3 → 9 / 7 / 6. Selesaikan dengan NWC + Stepping Stone.`,
              metode: "tp", data: HARD, opsi: { awal: "nwc", evaluasi: "stepping" } } },
          { judul: "Rute terlarang (M)", isi: `<p>Jalan Pangalengan–Braga sedang ditutup, jadi biayanya ditulis <b>M</b>. Solusi awal bisa saja terpaksa memakai sel M (total biaya mengandung M). Itu tanda belum optimal: index sel lain akan bernilai −M + … (sangat negatif), sehingga iterasi otomatis mengosongkan sel M. Hasil akhir tidak boleh memakai rute M.</p>`,
            contoh: { soal: `Tiga roasteri kopi (Lembang 60, Pangalengan 50, Ciwidey 40 karung) memasok kafe Dago (50), Braga (60), dan Cihampelas (40). Ongkos per karung (Rp): Lembang → 4.000 / 6.000 / 5.000; Pangalengan → 7.000 / tidak bisa / 6.000; Ciwidey → 8.000 / 5.000 / 7.000. Rute Pangalengan–Braga ditutup. Selesaikan dengan VAM + Stepping Stone.`,
              metode: "tp", data: KOPI, opsi: { awal: "vam", evaluasi: "stepping" } } },
          { judul: "Maksimasi profit", isi: `<p>Isi tabel adalah profit per peti. Langkahnya sama, tetapi <b>sel masuk = index positif terbesar</b> dan solusi optimal saat <b>semua index ≤ 0</b>. Rute terlarang pada maksimasi diberi <b>−M</b>. Pada contoh teh, NWC memberi Rp1.990.000; index R–G = +6.000 sehingga R–G masuk dengan θ = 50 dan profit naik menjadi <b>Rp2.290.000</b> (optimal).</p>`,
            contoh: { soal: `Tiga kebun teh (Walini 80, Rancabali 60, Malabar 60 peti) memasok Toko Bandung (60), Cimahi (90), dan Garut (50). Profit per peti (Rp): Walini → 12.000 / 9.000 / 7.000; Rancabali → 8.000 / 11.000 / 10.000; Malabar → 10.000 / 13.000 / 6.000. Maksimalkan total profit dengan NWC + Stepping Stone.`,
              metode: "tp", data: TEH, opsi: { awal: "nwc", evaluasi: "stepping" } } }
        ],
        jebakan: [
          "Arah dummy terbalik. <b>Supply lebih besar → KOLOM dummy</b>; <b>demand lebih besar → BARIS dummy</b>.",
          "Memberi dummy biaya M. Dummy selalu biaya 0; yang diberi M adalah rute terlarang.",
          "Lupa menjelaskan arti dummy di jawaban: unit di baris dummy = permintaan tidak terpenuhi; unit di kolom dummy = kapasitas tidak terkirim.",
          "Saat θ seri, mengosongkan semua sel yang menjadi 0. Hanya <b>satu</b> yang keluar; sisanya tetap diisi 0 (biasanya yang biayanya lebih murah).",
          "Angka 0 hasil degenerasi dianggap sel kosong. Sel berisi 0 adalah <b>sel terisi</b> dan dipakai sebagai belokan jalur.",
          "Pada maksimasi masih memilih index negatif dan berhenti saat semua ≥ 0. Untuk profit: pilih positif terbesar, berhenti saat semua ≤ 0.",
          "Rute terlarang di soal maksimasi diberi +M. Untuk profit, rute terlarang harus <b>−M</b> (profit sangat buruk)."
        ],
        cek: [
          { q: "Supply total 450, demand total 500. Apa yang ditambahkan dan apa arti unitnya?", a: "<b>Baris dummy</b> dengan supply 50 dan biaya 0. Unit dari dummy = <b>permintaan yang tidak terpenuhi</b>." },
          { q: "Tabel 3 × 4 punya 5 sel terisi. Apa masalahnya?", a: "Seharusnya 3 + 4 − 1 = 6 sel terisi. Ini <b>degenerasi</b>, jadi tambahkan satu angka 0 di sel yang tidak membentuk jalur tertutup." },
          { q: "Di tabel optimal (minimasi), index sel 3–A = 0 dan sel lain positif. Apa artinya?", a: "Solusi sudah optimal, dan ada <b>solusi optimal lain</b> dengan biaya sama kalau rute 3–A dipakai." },
          { q: "Soal maksimasi, index terbesar +6.000 dan lainnya negatif. Langkah berikutnya?", a: "Masukkan sel dengan index <b>+6.000</b>, karena profit masih bisa naik 6.000 per unit." }
        ],
        ringkasan: `<ul><li>Tidak seimbang → dummy biaya 0 (supply &gt; demand: kolom; demand &gt; supply: baris).</li><li>Sel terisi &lt; m + n − 1 → taruh 0; θ seri → hanya satu sel yang keluar.</li><li>Index 0 di tabel optimal → optimal ganda.</li><li>Rute terlarang: M (biaya) atau −M (profit).</li><li>Maksimasi: masuk = index positif terbesar; optimal saat semua ≤ 0.</li></ul>`,
        lembar: `<p>Di awal jawaban, tulis semua penyesuaian: "Supply 450 &lt; demand 500 → tambah baris dummy 50 (biaya 0)", "Rute P–B terlarang → biaya M". Saat degenerasi, lingkari angka 0. Di akhir, tulis interpretasi: "Gudang A kekurangan 50 unit (dari dummy)" dan "Ada solusi optimal lain karena I = 0" bila ada.</p>`
      },

      /* ================================================================ */
      {
        id: "lainnya", judul: "Formulasi LP, transshipment, dan lokasi fasilitas", menit: 15,
        ringkas: "Menulis model transportasi sebagai LP, mengenal titik transshipment, dan memilih lokasi pabrik baru dengan dua tabel transportasi.",
        gambaran: `<p>Model transportasi sebenarnya adalah <b>linear programming</b> dengan variabel X<sub>ij</sub> = unit dari sumber i ke tujuan j. Tabel dan algoritma transportasi hanyalah cara cepat menyelesaikannya.</p>
<p><b>Transshipment</b>: barang harus melewati titik perantara (misalnya pusat distribusi) sebelum sampai tujuan. Di titik perantara berlaku <b>unit masuk = unit keluar</b>.</p>
<p><b>Lokasi fasilitas</b>: kalau perusahaan memilih lokasi pabrik baru, selesaikan <b>satu soal transportasi untuk setiap kandidat lokasi</b> (pabrik lama + kandidat), lalu pilih kandidat dengan <b>total biaya sistem</b> terkecil. Biaya setiap sel = biaya kirim + biaya produksi di pabrik asal.</p>`,
        analogi: `Memilih lokasi cabang warung baru: kamu bandingkan dua skenario lengkap ("kalau buka di Dago" vs "kalau buka di Buah Batu"), masing-masing dihitung total ongkos produksi dan antarnya, lalu pilih skenario yang paling murah secara keseluruhan.`,
        istilah: [
          ["Variabel keputusan X<sub>ij</sub>", "Jumlah unit dari sumber i ke tujuan j. Ada m × n variabel."],
          ["Batasan supply", "Σ<sub>j</sub> X<sub>ij</sub> ≤ supply<sub>i</sub> untuk setiap sumber."],
          ["Batasan demand", "Σ<sub>i</sub> X<sub>ij</sub> = demand<sub>j</sub> untuk setiap tujuan."],
          ["Titik transshipment", "Lokasi perantara yang menerima lalu meneruskan barang (masuk = keluar)."],
          ["Analisis lokasi fasilitas", "Membandingkan total biaya sistem untuk setiap kandidat lokasi baru dengan model transportasi."]
        ],
        rumus: [
          { nama: "LP Executive Furniture", f: "Min 5X<sub>11</sub> + 4X<sub>12</sub> + 3X<sub>13</sub> + 8X<sub>21</sub> + 4X<sub>22</sub> + 3X<sub>23</sub> + 9X<sub>31</sub> + 7X<sub>32</sub> + 5X<sub>33</sub>", arti: "Kendala: X11 + X12 + X13 ≤ 100; X21 + X22 + X23 ≤ 300; X31 + X32 + X33 ≤ 300; X11 + X21 + X31 = 300; X12 + X22 + X32 = 200; X13 + X23 + X33 = 200; semua X ≥ 0." },
          { nama: "Transshipment", f: "unit masuk ke titik perantara = unit keluar dari titik itu", arti: "Contoh Chicago: X<sub>13</sub> + X<sub>23</sub> = X<sub>35</sub> + X<sub>36</sub> + X<sub>37</sub>." },
          { nama: "Biaya sel lokasi fasilitas", f: "C<sub>ij</sub> = biaya kirim i → j + biaya produksi per unit di i", arti: "Cincinnati → Detroit: 25 + 48 = 73." }
        ],
        langkah: [
          "<b>Lokasi fasilitas</b>: hitung kekurangan kapasitas yang harus dipenuhi pabrik baru (total demand − supply pabrik lama).",
          "Untuk setiap kandidat, susun tabel transportasi: pabrik lama + kandidat, dengan biaya sel = biaya kirim + biaya produksi.",
          "Selesaikan setiap tabel sampai optimal (VAM + MODI paling cepat).",
          "Bandingkan total biaya sistem. Pilih kandidat dengan total terkecil.",
          "<b>Formulasi LP</b>: definisikan X<sub>ij</sub>, tulis fungsi tujuan, batasan supply (≤), batasan demand (=), dan X<sub>ij</sub> ≥ 0."
        ],
        contoh: [{
          judul: "Hardgrave Machine: kandidat Seattle",
          soal: `Hardgrave punya pabrik Cincinnati (15.000 unit/bulan, biaya produksi $48), Salt Lake City (6.000; $50), dan Pittsburgh (14.000; $52). Demand gudang: Detroit 10.000, Dallas 12.000, New York 15.000, Los Angeles 9.000 (total 46.000), jadi pabrik baru harus memasok 11.000. Kandidat Seattle berbiaya produksi $53. Biaya kirim ($) ke Detroit/Dallas/New York/LA: Cincinnati 25 / 55 / 40 / 60; Salt Lake 35 / 30 / 50 / 40; Pittsburgh 36 / 45 / 26 / 66; Seattle 60 / 38 / 65 / 27. Biaya di tabel sudah ditambah biaya produksi. Hitung total biaya sistem jika Seattle dipilih.`,
          metode: "tp", data: HG_SEA, opsi: { awal: "vam", evaluasi: "modi" }
        }],
        variasi: [
          { judul: "Kandidat kedua: Birmingham", isi: `<p>Ulangi dengan Birmingham (biaya produksi $49; biaya kirim ke Detroit/Dallas/New York/LA = 35 / 30 / 41 / 50). Total biaya sistem dengan Birmingham <b>$3.741.000</b>, sedangkan dengan Seattle <b>$3.704.000</b>. Jadi pilih <b>Seattle</b>, lebih hemat $37.000 per bulan. Perhatikan: walaupun biaya produksi Birmingham lebih murah, total sistemnya lebih mahal.</p>`,
            contoh: { soal: `Hardgrave dengan kandidat Birmingham (11.000 unit, produksi $49). Biaya sel = biaya kirim + biaya produksi. Hitung total biaya sistem.`,
              metode: "tp", data: HG_BIR, opsi: { awal: "vam", evaluasi: "modi" } } },
          { judul: "Transshipment: Frosty Machines", isi: `<p>Pabrik Toronto (800) dan Detroit (700) mengirim mesin salju ke pusat distribusi Chicago dan Buffalo, lalu ke New York (450), Philadelphia (350), dan St. Louis (300). Tidak ada pengiriman langsung pabrik → toko. Biaya: Toronto → Chicago/Buffalo 4 / 7; Detroit → 5 / 7; Chicago → NY/Phila/StL 6 / 4 / 5; Buffalo → 2 / 3 / 4. Model LP-nya memakai batasan supply pabrik, batasan demand toko, dan <b>masuk = keluar</b> di Chicago dan Buffalo. Hasil optimal buku: Toronto–Chicago 650, Toronto–Buffalo 150, Detroit–Buffalo 300, Chicago–Philadelphia 350, Chicago–St. Louis 300, Buffalo–New York 450, dengan total <b>$9.550</b>.</p>` },
          { judul: "Assignment adalah transportasi khusus", isi: `<p>Kalau semua supply dan demand bernilai 1 (satu orang untuk satu pekerjaan), model transportasi berubah menjadi <a href="#modul/asg/konsep">model assignment</a>, yang diselesaikan lebih mudah dengan metode Hungarian.</p>` }
        ],
        jebakan: [
          "Lokasi fasilitas: lupa menambahkan <b>biaya produksi</b> ke biaya kirim di setiap sel.",
          "Membandingkan biaya pabrik baru saja. Yang dibandingkan adalah <b>total biaya seluruh sistem</b> (pabrik lama + baru).",
          "Formulasi LP: batasan demand ditulis ≤. Demand harus terpenuhi, jadi ditulis <b>=</b> (supply boleh ≤).",
          "Transshipment: membuat rute langsung pabrik → toko padahal soal mengharuskan lewat titik perantara.",
          "Jumlah variabel dan batasan tertukar: variabel = m × n, batasan = m + n."
        ],
        cek: [
          { q: "Biaya kirim Pittsburgh → New York $26 dan biaya produksi Pittsburgh $52. Berapa biaya selnya?", a: "26 + 52 = <b>$78</b>." },
          { q: "Total sistem: Seattle $3.704.000, Birmingham $3.741.000. Pilih mana?", a: "<b>Seattle</b>, karena total biaya sistemnya lebih kecil $37.000." },
          { q: "Tulis batasan demand Albuquerque dalam model LP Executive Furniture.", a: "<b>X<sub>11</sub> + X<sub>21</sub> + X<sub>31</sub> = 300</b>." }
        ],
        ringkasan: `<p>Transportasi = LP dengan m × n variabel dan m + n batasan. Transshipment: titik perantara masuk = keluar. Lokasi fasilitas: satu tabel per kandidat, biaya sel = kirim + produksi, pilih total sistem terkecil.</p>`,
        lembar: `<p>Untuk soal lokasi fasilitas, tulis dua tabel lengkap (satu per kandidat) beserta total biayanya, lalu kesimpulan: "Pilih Seattle karena $3.704.000 &lt; $3.741.000". Untuk formulasi LP, definisikan variabel dulu ("X<sub>ij</sub> = unit dari pabrik i ke gudang j"), lalu fungsi tujuan dan semua batasan dengan label.</p>`
      }
    ]
  });
})();
