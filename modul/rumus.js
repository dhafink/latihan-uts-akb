// Lembar rumus satu halaman (route #modul/rumus). Bisa dicetak (Ctrl+P).
window.LEMBAR_RUMUS = [
  { judul: "🎲 Decision Analysis", isi: [
    ["Maximax / Maximin", "Profit: maks baris → pilih maks / min baris → pilih maks. Biaya: min baris → pilih min / maks baris → pilih min."],
    ["Realisme (Hurwicz)", "α × terbaik + (1 − α) × terburuk (abaikan nilai tengah)."],
    ["Laplace", "Rata-rata baris = jumlah ÷ banyaknya keadaan."],
    ["Regret", "Profit: terbesar kolom − sel. Biaya: sel − terkecil kolom. Minimax regret: regret maks tiap baris → pilih terkecil."],
    ["EMV", "Σ payoff × p. Pilih terbesar (profit) / terkecil (biaya)."],
    ["EVwPI / EVPI", "EVwPI = Σ (terbaik kolom × p). EVPI = EVwPI − EMV terbaik (biaya: EMV terbaik − EVwPI)."],
    ["EOL", "Σ regret × p. EOL minimum = EVPI."],
    ["Sensitivitas", "EMV = (a − b)P + b. Samakan dua garis → P titik potong."],
    ["Pohon", "□ keputusan (pilih), ○ peluang (EMV). Hitung dari kanan. Biaya info dikurangkan dari payoff cabangnya."],
    ["Bayes", "Joint = P(hasil | keadaan) × prior. P(hasil) = Σ joint. Posterior = joint ÷ P(hasil)."],
    ["EVSI / efisiensi", "EVSI = (EV dengan SI + biaya) − EV tanpa SI. Efisiensi = EVSI ÷ EVPI × 100%."],
    ["Utilitas", "U(terburuk) = 0, U(terbaik) = 1, U(lain) = p indiferen. EU = Σ U × p."]
  ] },
  { judul: "⚖️ AHP", isi: [
    ["Skala Saaty", "1 sama penting · 3 sedikit lebih · 5 lebih · 7 sangat lebih · 9 mutlak lebih · 2, 4, 6, 8 di antaranya · kebalikannya 1/a."],
    ["Jumlah perbandingan", "n(n − 1) / 2."],
    ["Bobot", "Bagi setiap sel dengan jumlah kolom → rata-rata BARIS = priority vector."],
    ["λmax", "Weighted sum = matriks awal × bobot; consistency vector = weighted sum ÷ bobot; λmax = rata-ratanya."],
    ["CI / CR", "CI = (λmax − n) / (n − 1). CR = CI ÷ RI."],
    ["RI (dosen)", "n = 3: 0,52 · 4: 0,89 · 5: 1,11 · 6: 1,25 · 7: 1,35. Batas CR: 0,05 (3×3), 0,08 (4×4), 0,10 (≥ 5)."],
    ["RI (buku)", "n = 3: 0,58 · 4: 0,90 · 5: 1,12 · 6: 1,24 · 7: 1,32. Batas CR 0,10."],
    ["Sintesis", "Skor alternatif = Σ (bobot kriteria × bobot alternatif pada kriteria itu)."],
    ["MFEP", "Total = Σ bobot faktor × evaluasi (bobot berjumlah 1)."]
  ] },
  { judul: "🚚 Transportasi", isi: [
    ["Seimbang?", "Supply > demand → kolom dummy. Demand > supply → baris dummy. Biaya dummy 0."],
    ["Sel terisi", "Harus m + n − 1. Kurang → degenerasi → isi 0 di sel yang tidak membentuk jalur tertutup."],
    ["NWC", "Mulai pojok kiri atas; habiskan supply/demand; bergerak kanan/bawah sampai pojok kanan bawah."],
    ["VAM", "Pinalti = selisih dua biaya termurah tiap baris/kolom → pinalti terbesar → isi sel termurah → coret → ulangi."],
    ["Stepping stone", "Sel kosong (+), jalur tertutup belok hanya di sel terisi, tanda ± bergantian. Index = Σ biaya bertanda."],
    ["MODI", "R1 = 0; R + K = C untuk sel terisi; I = C − R − K untuk sel kosong."],
    ["Optimal", "Min: semua I ≥ 0 (masuk: paling negatif). Maks: semua I ≤ 0 (masuk: paling positif). I = 0 → optimal ganda."],
    ["Pindah unit", "θ = nilai terkecil di sel bertanda −; + θ di sel +, − θ di sel −."],
    ["Terlarang", "Min: biaya M. Maks: profit −M."],
    ["LP", "m·n variabel; m + n kendala (supply ≤, demand =)."]
  ] },
  { judul: "🧩 Assignment", isi: [
    ["Syarat", "Tabel persegi. Kurang baris/kolom → dummy bernilai 0."],
    ["Maksimasi", "Opportunity cost = nilai terbesar di tabel − sel."],
    ["Terlarang", "Isi M (tidak pernah terpilih)."],
    ["Langkah 1", "Kurangi nilai terkecil tiap baris, lalu nilai terkecil tiap kolom."],
    ["Langkah 2", "Tutup semua 0 dengan garis seminimal mungkin. Garis = n → optimal."],
    ["Langkah 3", "Garis < n: k = terkecil yang tidak tertutup; kurangi k dari sel tak tertutup, tambah k di perpotongan. Ulangi langkah 2."],
    ["Penempatan", "Pilih baris/kolom yang hanya punya satu 0, tempatkan, coret baris & kolomnya, ulangi."],
    ["Total", "Jumlahkan dari tabel AWAL, bukan tabel opportunity cost."]
  ] }
];
