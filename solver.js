// solver.js — mesin hitung materi AKB (Analisa Kuantitatif Bisnis).
// Semua tabel langkah di modul, pembahasan, latihan hitung, kalkulator, dan video berasal dari sini.
// Dipakai di browser (window.SOLVER) dan di node (require("./solver.js")).
//
// Setiap fungsi utama mengembalikan { hasil..., steps: [ { judul, narasi, papan: [blok...] } ] }.
// Blok papan (semua isinya sudah berupa teks siap tampil):
//   { t:"tabel", head:[...], rows:[[sel...]], judul?, catatan? }      sel = { v, k? }  k = kelas sorotan
//   { t:"rumus", baris:[...], sorot? }                                  baris perhitungan
//   { t:"tp", ... }   tabel transportasi (biaya di sudut, alokasi, tanda ±, jalur, pinalti, R/K)
//   { t:"asg", ... }  tabel penugasan (garis penutup, sel terpilih)
//   { t:"pohon", pohon, tampil:[id], coret:[id] }  pohon keputusan
//   { t:"garis", ... } grafik sensitivitas
//   { t:"teks", isi } · { t:"hasil", isi } · { t:"catatan", isi, jenis:"jebakan"|"info" }
// Kelas sorotan: kuning (sedang dihitung), hijau (terpilih/jawaban), biru (plus/hasil),
// pink (minus/jebakan), redup, lab (label baris).
(function (root) {
  "use strict";
  var EPS = 1e-9;

  /* ================= format angka gaya Indonesia: 40.000 · 0,167 · −$180.000 ================= */
  function round(x, dp) { var f = Math.pow(10, dp); return Math.round(x * f + (x >= 0 ? 1e-7 : -1e-7)) / f; }
  function grp(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function num(x, dp) {
    if (dp == null) dp = 4;
    if (!isFinite(x)) return String(x);
    var r = round(x, dp);
    if (Math.abs(r) < Math.pow(10, -dp) / 2) r = 0;
    var s = Math.abs(r).toFixed(dp).split(".");
    var dec = (s[1] || "").replace(/0+$/, "");
    return (r < 0 ? "−" : "") + grp(s[0]) + (dec ? "," + dec : "");
  }
  function fix(x, dp) {
    var r = round(x, dp);
    if (Math.abs(r) < Math.pow(10, -dp) / 2) r = 0;
    var s = Math.abs(r).toFixed(dp).split(".");
    return (r < 0 ? "−" : "") + grp(s[0]) + (dp ? "," + s[1] : "");
  }
  function val(x, unit, dp) {
    if (unit === "$" || unit === "Rp") return (round(x, dp == null ? 4 : dp) < 0 ? "−" : "") + unit + num(Math.abs(x), dp);
    return num(x, dp) + (unit ? " " + unit : "");
  }
  function par(x, unit, dp) { var s = val(x, unit, dp); return x < -EPS ? "(" + s + ")" : s; }
  function signed(x, dp) { return (round(x, dp == null ? 4 : dp) > 0 ? "+" : "") + num(x, dp); }
  function pct(x, dp) { return num(x * 100, dp == null ? 1 : dp) + "%"; }
  function sum(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }
  function grid(m, n, v) { var g = []; for (var i = 0; i < m; i++) { g.push([]); for (var j = 0; j < n; j++) g[i].push(v); } return g; }
  function copy(g) { return g.map(function (r) { return r.slice(); }); }
  function joinNama(arr) { return arr.length <= 1 ? (arr[0] || "") : arr.slice(0, -1).join(", ") + " dan " + arr[arr.length - 1]; }

  /* ================= bilangan simbolik c + m·M (rute/penempatan terlarang) ================= */
  function L(x) {
    if (x && typeof x === "object") return { c: x.c || 0, m: x.m || 0 };
    if (x === "M") return { c: 0, m: 1 };
    if (x === "-M" || x === "−M") return { c: 0, m: -1 };
    return { c: +x || 0, m: 0 };
  }
  function ladd(a, b) { return { c: a.c + b.c, m: a.m + b.m }; }
  function lsub(a, b) { return { c: a.c - b.c, m: a.m - b.m }; }
  function lneg(a) { return { c: -a.c, m: -a.m }; }
  function lcmp(a, b) {
    var dm = a.m - b.m; if (Math.abs(dm) > EPS) return dm > 0 ? 1 : -1;
    var dc = a.c - b.c; if (Math.abs(dc) > 1e-7) return dc > 0 ? 1 : -1;
    return 0;
  }
  function lisM(a) { return Math.abs(a.m) > EPS; }
  function lstr(a, dp, opt) {
    a = L(a); opt = opt || {};
    if (!lisM(a)) return opt.tanda ? signed(a.c, dp) : num(a.c, dp);
    var mm = Math.abs(a.m) === 1 ? "M" : num(Math.abs(a.m), dp) + "M";
    var lead = a.m < 0 ? "−" + mm : (opt.tanda ? "+" + mm : mm);
    if (opt.mSaja || Math.abs(a.c) < 1e-7) return lead;
    return lead + (a.c > 0 ? " + " : " − ") + num(Math.abs(a.c), dp);
  }

  /* ================= pembuat langkah & blok ================= */
  function step(judul, narasi, papan, extra) {
    var s = { judul: judul, narasi: narasi, papan: papan || [] };
    if (extra) for (var k in extra) s[k] = extra[k];
    return s;
  }
  function sel(v, k) { var c = { v: v == null ? "" : String(v) }; if (k) c.k = k; return c; }
  function lab(v) { return sel(v, "lab"); }
  function tabel(head, rows, opt) { var t = { t: "tabel", head: head, rows: rows }; if (opt) for (var k in opt) t[k] = opt[k]; return t; }
  function rumus(baris, sorot) { var r = { t: "rumus", baris: baris }; if (sorot != null) r.sorot = sorot; return r; }
  function hasil(isi) { return { t: "hasil", isi: isi }; }
  function teks(isi) { return { t: "teks", isi: isi }; }
  function catatan(isi, jenis) { return { t: "catatan", isi: isi, jenis: jenis || "info" }; }

  /* =====================================================================================
   * 1. DECISION ANALYSIS
   * ===================================================================================== */
  var DA = {};

  function bestIdx(vals, wantMax) {
    var b = vals[0];
    vals.forEach(function (v) { if (wantMax ? v > b : v < b) b = v; });
    var idx = []; vals.forEach(function (v, i) { if (Math.abs(v - b) < 1e-7) idx.push(i); });
    return { nilai: b, idx: idx };
  }

  function payoffHead(p, extra) { return ["Alternatif"].concat(p.state, extra || []); }
  function payoffRows(p, extraCols, hiRows, hiCells) {
    var u = p.satuan || "", dp = p.dp;
    return p.payoff.map(function (r, i) {
      var row = [lab(p.alt[i])];
      r.forEach(function (x, j) { row.push(sel(val(x, u, dp), hiCells && hiCells[i] && hiCells[i][j])); });
      (extraCols || []).forEach(function (col) { row.push(sel(col.v[i], col.k && col.k[i])); });
      if (hiRows && hiRows.indexOf(i) !== -1) row.forEach(function (c) { if (c.k !== "lab") c.k = c.k || "hijau"; });
      return row;
    });
  }

  // Keputusan dalam ketidakpastian: maximax, maximin, Hurwicz, Laplace, minimax regret.
  // p = { alt:[], state:[], payoff:[[...]], goal:"max"|"min", alpha?, satuan?, dp? }
  DA.ketidakpastian = function (p) {
    var max = p.goal !== "min", u = p.satuan || "", dp = p.dp, a = p.alpha;
    var nS = p.state.length;
    var rows = p.payoff.map(function (r) {
      var hi = Math.max.apply(null, r), lo = Math.min.apply(null, r);
      var o = { best: max ? hi : lo, worst: max ? lo : hi, avg: sum(r) / nS };
      if (a != null) o.hur = a * o.best + (1 - a) * o.worst;
      return o;
    });
    var colBest = p.state.map(function (_, j) {
      var col = p.payoff.map(function (r) { return r[j]; });
      return max ? Math.max.apply(null, col) : Math.min.apply(null, col);
    });
    var regret = p.payoff.map(function (r) { return r.map(function (x, j) { return max ? colBest[j] - x : x - colBest[j]; }); });
    rows.forEach(function (o, i) { o.maxReg = Math.max.apply(null, regret[i]); });
    function pick(key, wantMax) { return bestIdx(rows.map(function (o) { return o[key]; }), wantMax); }
    var kep = { optimis: pick("best", max), pesimis: pick("worst", max), laplace: pick("avg", max), regret: pick("maxReg", false) };
    if (a != null) kep.realisme = pick("hur", max);
    function names(k) { return joinNama(k.idx.map(function (i) { return p.alt[i]; })); }

    var steps = [];
    var tujuan = max ? "memaksimalkan " + (p.ukuran || "keuntungan") : "meminimalkan " + (p.ukuran || "biaya");
    steps.push(step("Tabel payoff",
      "Susun dulu tabel payoff: alternatif di baris, keadaan (state of nature) di kolom. Tujuannya " + tujuan +
      ". Probabilitas tiap keadaan tidak diketahui, jadi ini keputusan dalam ketidakpastian.",
      [tabel(payoffHead(p), payoffRows(p))]));

    // optimis
    var lblOpt = max ? "Maks baris" : "Min baris";
    var kOpt = rows.map(function (_, i) { return kep.optimis.idx.indexOf(i) !== -1 ? "hijau" : "kuning"; });
    steps.push(step(max ? "Maximax (optimis)" : "Optimis untuk biaya (minimin)",
      (max ? "Orang optimis membayangkan hasil terbaik. Ambil nilai TERBESAR di setiap baris, lalu pilih yang paling besar."
           : "Untuk biaya, hasil terbaik = biaya terkecil. Ambil biaya TERKECIL di setiap baris, lalu pilih yang paling kecil.") +
      " Keputusan: " + names(kep.optimis) + " (" + val(kep.optimis.nilai, u, dp) + ").",
      [tabel(payoffHead(p, [lblOpt]), payoffRows(p, [{ v: rows.map(function (o) { return val(o.best, u, dp); }), k: kOpt }])),
       hasil((max ? "Maximax" : "Optimis") + " → " + names(kep.optimis) + " (" + val(kep.optimis.nilai, u, dp) + ")")],
      { kunci: "optimis" }));

    // pesimis
    var lblPes = max ? "Min baris" : "Maks baris";
    var kPes = rows.map(function (_, i) { return kep.pesimis.idx.indexOf(i) !== -1 ? "hijau" : "kuning"; });
    steps.push(step(max ? "Maximin (pesimis)" : "Pesimis untuk biaya (minimax)",
      (max ? "Orang pesimis membayangkan hasil terburuk. Ambil nilai TERKECIL di setiap baris, lalu pilih yang paling besar (terbaik dari yang terburuk)."
           : "Untuk biaya, hasil terburuk = biaya terbesar. Ambil biaya TERBESAR di setiap baris, lalu pilih yang paling kecil.") +
      " Keputusan: " + names(kep.pesimis) + " (" + val(kep.pesimis.nilai, u, dp) + ").",
      [tabel(payoffHead(p, [lblPes]), payoffRows(p, [{ v: rows.map(function (o) { return val(o.worst, u, dp); }), k: kPes }])),
       hasil((max ? "Maximin" : "Pesimis") + " → " + names(kep.pesimis) + " (" + val(kep.pesimis.nilai, u, dp) + ")")],
      { kunci: "pesimis" }));

    // realisme (Hurwicz)
    if (a != null) {
      var lines = rows.map(function (o, i) {
        return p.alt[i] + ": " + num(a) + " × " + par(o.best, u, dp) + " + " + num(1 - a) + " × " + par(o.worst, u, dp) + " = " + val(o.hur, u, dp);
      });
      var kRe = rows.map(function (_, i) { return kep.realisme.idx.indexOf(i) !== -1 ? "hijau" : "kuning"; });
      steps.push(step("Kriteria realisme (Hurwicz), α = " + num(a),
        "Gabungan optimis dan pesimis: α × (nilai terbaik) + (1 − α) × (nilai terburuk). α = " + num(a) + " berarti " +
        pct(a, 0) + " optimis. " + (max ? "Pilih rata-rata tertimbang terbesar." : "Untuk biaya, terbaik = terkecil; pilih hasil terkecil.") +
        (nS > 2 ? " Nilai di tengah tidak dipakai, hanya terbaik dan terburuk." : "") +
        " Keputusan: " + names(kep.realisme) + ".",
        [rumus(lines),
         tabel(payoffHead(p, ["Realisme"]), payoffRows(p, [{ v: rows.map(function (o) { return val(o.hur, u, dp); }), k: kRe }])),
         hasil("Realisme → " + names(kep.realisme) + " (" + val(kep.realisme.nilai, u, dp) + ")")],
        { kunci: "realisme" }));
    }

    // laplace
    var linesL = rows.map(function (o, i) {
      return p.alt[i] + ": (" + p.payoff[i].map(function (x) { return par(x, u, dp); }).join(" + ") + ") / " + nS + " = " + val(o.avg, u, dp);
    });
    var kLa = rows.map(function (_, i) { return kep.laplace.idx.indexOf(i) !== -1 ? "hijau" : "kuning"; });
    steps.push(step("Equally likely (Laplace)",
      "Anggap semua keadaan punya peluang sama, jadi hitung rata-rata setiap baris. " +
      (max ? "Pilih rata-rata terbesar." : "Pilih rata-rata biaya terkecil.") + " Keputusan: " + names(kep.laplace) + ".",
      [rumus(linesL),
       tabel(payoffHead(p, ["Rata-rata"]), payoffRows(p, [{ v: rows.map(function (o) { return val(o.avg, u, dp); }), k: kLa }])),
       hasil("Laplace → " + names(kep.laplace) + " (" + val(kep.laplace.nilai, u, dp) + ")")],
      { kunci: "laplace" }));

    // minimax regret — langkah 1: terbaik per kolom
    var hiBest = p.payoff.map(function (r) { return r.map(function (x, j) { return Math.abs(x - colBest[j]) < 1e-7 ? "kuning" : null; }); });
    var bestRow = [lab(max ? "Terbaik (maks)" : "Terbaik (min)")].concat(colBest.map(function (x) { return sel(val(x, u, dp), "biru"); }));
    steps.push(step("Minimax regret — cari nilai terbaik tiap kolom",
      "Regret (opportunity loss) = penyesalan karena tidak memilih alternatif terbaik pada keadaan itu. Pertama, cari nilai terbaik di SETIAP KOLOM (" +
      (max ? "terbesar" : "terkecil, karena ini biaya") + ").",
      [tabel(payoffHead(p), payoffRows(p, null, null, hiBest).concat([bestRow]))]));
    // langkah 2: tabel regret
    var regHead = payoffHead(p, ["Regret maks"]);
    var kRg = rows.map(function (_, i) { return kep.regret.idx.indexOf(i) !== -1 ? "hijau" : "kuning"; });
    var regRows = regret.map(function (r, i) {
      return [lab(p.alt[i])].concat(r.map(function (x) { return sel(val(x, u, dp)); }), [sel(val(rows[i].maxReg, u, dp), kRg[i])]);
    });
    var contoh = p.alt.length ? (max ? val(colBest[0], u, dp) + " − " + par(p.payoff[0][0], u, dp) + " = " + val(regret[0][0], u, dp)
                                     : val(p.payoff[0][0], u, dp) + " − " + par(colBest[0], u, dp) + " = " + val(regret[0][0], u, dp)) : "";
    steps.push(step("Minimax regret — tabel penyesalan",
      (max ? "Regret = nilai terbaik di kolom − nilai sel." : "Regret = nilai sel − biaya terbaik di kolom.") +
      " Contoh sel pertama: " + contoh + ". Regret tidak pernah negatif. Lalu ambil regret TERBESAR di setiap baris, dan pilih yang PALING KECIL. Keputusan: " + names(kep.regret) + ".",
      [tabel(regHead, regRows),
       hasil("Minimax regret → " + names(kep.regret) + " (regret maks " + val(kep.regret.nilai, u, dp) + ")")],
      { kunci: "regret" }));

    // ringkasan
    var ring = [
      [lab(max ? "Maximax (optimis)" : "Optimis (minimin)"), sel(names(kep.optimis), "hijau"), sel(val(kep.optimis.nilai, u, dp))],
      [lab(max ? "Maximin (pesimis)" : "Pesimis (minimax)"), sel(names(kep.pesimis), "hijau"), sel(val(kep.pesimis.nilai, u, dp))]
    ];
    if (a != null) ring.push([lab("Realisme (α = " + num(a) + ")"), sel(names(kep.realisme), "hijau"), sel(val(kep.realisme.nilai, u, dp))]);
    ring.push([lab("Laplace"), sel(names(kep.laplace), "hijau"), sel(val(kep.laplace.nilai, u, dp))]);
    ring.push([lab("Minimax regret"), sel(names(kep.regret), "hijau"), sel(val(kep.regret.nilai, u, dp))]);
    steps.push(step("Ringkasan keputusan",
      "Setiap kriteria mencerminkan sikap pengambil keputusan, jadi wajar kalau jawabannya berbeda-beda. Di lembar jawaban, tulis keputusan untuk setiap metode yang diminta.",
      [tabel(["Kriteria", "Keputusan", "Nilai"], ring)]));

    return { rows: rows, colBest: colBest, regret: regret, keputusan: kep, steps: steps };
  };

  // Keputusan dalam risiko: EMV, EVwPI, EVPI, EOL.
  // p = { alt, state, payoff, prob:[...], goal, satuan, dp, tanpaEOL? }
  DA.risiko = function (p) {
    var max = p.goal !== "min", u = p.satuan || "", dp = p.dp;
    var pr = p.prob;
    var emv = p.payoff.map(function (r) { var s = 0; r.forEach(function (x, j) { s += x * pr[j]; }); return s; });
    var bE = bestIdx(emv, max);
    var colBest = p.state.map(function (_, j) {
      var col = p.payoff.map(function (r) { return r[j]; });
      return max ? Math.max.apply(null, col) : Math.min.apply(null, col);
    });
    var evwpi = 0; colBest.forEach(function (x, j) { evwpi += x * pr[j]; });
    var evpi = max ? evwpi - bE.nilai : bE.nilai - evwpi;
    var regret = p.payoff.map(function (r) { return r.map(function (x, j) { return max ? colBest[j] - x : x - colBest[j]; }); });
    var eol = regret.map(function (r) { var s = 0; r.forEach(function (x, j) { s += x * pr[j]; }); return s; });
    var bL = bestIdx(eol, false);
    function names(idx) { return joinNama(idx.map(function (i) { return p.alt[i]; })); }
    var probRow = [lab("Probabilitas")].concat(pr.map(function (x) { return sel(num(x), "biru"); }));

    var steps = [];
    steps.push(step("Tabel payoff dengan probabilitas",
      "Probabilitas setiap keadaan diketahui, jadi ini keputusan dalam risiko. Cek dulu: jumlah probabilitas = " + num(sum(pr)) + ".",
      [tabel(payoffHead(p), payoffRows(p).concat([probRow]))]));

    var linesE = emv.map(function (e, i) {
      return "EMV(" + p.alt[i] + ") = " + p.payoff[i].map(function (x, j) { return num(pr[j]) + " × " + par(x, u, dp); }).join(" + ") + " = " + val(e, u, dp);
    });
    var kE = emv.map(function (_, i) { return bE.idx.indexOf(i) !== -1 ? "hijau" : "kuning"; });
    steps.push(step("Expected Monetary Value (EMV)",
      "EMV = jumlah dari (payoff × probabilitas) di setiap baris, yaitu rata-rata hasil jangka panjang. " +
      (max ? "Pilih EMV terbesar." : "Karena ini biaya, pilih EMV terkecil.") + " Keputusan: " + names(bE.idx) + " dengan EMV " + val(bE.nilai, u, dp) + ".",
      [rumus(linesE),
       tabel(payoffHead(p, ["EMV"]), payoffRows(p, [{ v: emv.map(function (e) { return val(e, u, dp); }), k: kE }]).concat([probRow])),
       hasil("Keputusan terbaik: " + names(bE.idx) + " (EMV " + val(bE.nilai, u, dp) + ")")],
      { kunci: "emv" }));

    var hiBest = p.payoff.map(function (r) { return r.map(function (x, j) { return Math.abs(x - colBest[j]) < 1e-7 ? "kuning" : null; }); });
    var wpiRow = [lab("Dengan info sempurna")].concat(colBest.map(function (x) { return sel(val(x, u, dp), "biru"); }));
    steps.push(step("EVwPI dan EVPI",
      "Kalau kita tahu pasti keadaan apa yang akan terjadi, kita selalu memilih nilai terbaik di setiap kolom. EVwPI = jumlah (nilai terbaik kolom × probabilitas). " +
      "EVPI = selisih EVwPI dengan EMV terbaik, yaitu batas atas harga yang pantas dibayar untuk informasi sempurna.",
      [tabel(payoffHead(p), payoffRows(p, null, null, hiBest).concat([wpiRow, probRow])),
       rumus(["EVwPI = " + colBest.map(function (x, j) { return num(pr[j]) + " × " + par(x, u, dp); }).join(" + ") + " = " + val(evwpi, u, dp),
              max ? "EVPI = EVwPI − EMV terbaik = " + val(evwpi, u, dp) + " − " + par(bE.nilai, u, dp) + " = " + val(evpi, u, dp)
                  : "EVPI = EMV terbaik − EVwPI = " + val(bE.nilai, u, dp) + " − " + par(evwpi, u, dp) + " = " + val(evpi, u, dp)]),
       hasil("EVPI = " + val(evpi, u, dp) + " → jangan bayar informasi lebih dari ini")],
      { kunci: "evpi" }));

    if (!p.tanpaEOL) {
      var linesO = eol.map(function (e, i) {
        return "EOL(" + p.alt[i] + ") = " + regret[i].map(function (x, j) { return num(pr[j]) + " × " + val(x, u, dp); }).join(" + ") + " = " + val(e, u, dp);
      });
      var kO = eol.map(function (_, i) { return bL.idx.indexOf(i) !== -1 ? "hijau" : "kuning"; });
      var regRows = regret.map(function (r, i) {
        return [lab(p.alt[i])].concat(r.map(function (x) { return sel(val(x, u, dp)); }), [sel(val(eol[i], u, dp), kO[i])]);
      });
      steps.push(step("Expected Opportunity Loss (EOL)",
        "Buat tabel regret (seperti minimax regret), lalu kalikan dengan probabilitas. Pilih EOL terkecil. EOL minimum selalu memberi keputusan yang sama dengan EMV terbaik, dan nilainya sama dengan EVPI.",
        [tabel(payoffHead(p, ["EOL"]), regRows.concat([probRow])), rumus(linesO),
         hasil("EOL minimum: " + names(bL.idx) + " = " + val(bL.nilai, u, dp) + " (= EVPI)")],
        { kunci: "eol" }));
    }
    return { emv: emv, terbaik: bE, colBest: colBest, evwpi: evwpi, evpi: evpi, regret: regret, eol: eol, eolMin: bL, steps: steps };
  };

  // Analisis sensitivitas untuk 2 keadaan: P = peluang keadaan pertama.
  // p = { alt, state:[s1, s2], payoff, goal, satuan, dp }
  DA.sensitivitas = function (p) {
    var max = p.goal !== "min", u = p.satuan || "", dp = p.dp;
    var lines = p.payoff.map(function (r) { return { slope: r[0] - r[1], b: r[1] }; });
    function bestAt(P) {
      var vals = lines.map(function (l) { return l.slope * P + l.b; });
      return bestIdx(vals, max).idx[0];
    }
    var cand = [0, 1];
    for (var i = 0; i < lines.length; i++) for (var j = i + 1; j < lines.length; j++) {
      var ds = lines[i].slope - lines[j].slope;
      if (Math.abs(ds) > EPS) { var P = (lines[j].b - lines[i].b) / ds; if (P > EPS && P < 1 - EPS) cand.push(P); }
    }
    cand.sort(function (a, b) { return a - b; });
    var ranges = [];
    for (var k = 0; k < cand.length - 1; k++) {
      if (cand[k + 1] - cand[k] < 1e-9) continue;
      var w = bestAt((cand[k] + cand[k + 1]) / 2);
      if (ranges.length && ranges[ranges.length - 1].alt === w) ranges[ranges.length - 1].sampai = cand[k + 1];
      else ranges.push({ dari: cand[k], sampai: cand[k + 1], alt: w });
    }
    var titik = [];
    for (var r = 1; r < ranges.length; r++) {
      var a = lines[ranges[r - 1].alt], b = lines[ranges[r].alt];
      titik.push({ P: ranges[r].dari, kiri: ranges[r - 1].alt, kanan: ranges[r].alt, nilai: a.slope * ranges[r].dari + a.b, ds: a.slope - b.slope, db: b.b - a.b });
    }
    var eq = lines.map(function (l, i) {
      var r = p.payoff[i];
      return "EMV(" + p.alt[i] + ") = " + val(r[0], u, dp) + "P + " + par(r[1], u, dp) + "(1 − P) = " + val(l.slope, u, dp) + "P " + (l.b < 0 ? "− " + val(-l.b, u, dp) : "+ " + val(l.b, u, dp));
    });
    var tLines = titik.map(function (t) {
      var A = lines[t.kiri], B = lines[t.kanan];
      return "EMV(" + p.alt[t.kiri] + ") = EMV(" + p.alt[t.kanan] + ") → " + num(A.slope, dp) + "P " + (A.b < 0 ? "− " + num(-A.b, dp) : "+ " + num(A.b, dp)) +
        " = " + num(B.slope, dp) + "P " + (B.b < 0 ? "− " + num(-B.b, dp) : "+ " + num(B.b, dp)) + " → P = " + num(t.db, dp) + " / " + num(t.ds, dp) + " = " + num(t.P, 3);
    });
    var rows = ranges.map(function (g) { return [sel(num(g.dari, 3) + " – " + num(g.sampai, 3)), sel(p.alt[g.alt], "hijau")]; });
    var steps = [
      step("Tulis EMV sebagai fungsi P",
        "Misalkan P = peluang " + p.state[0] + ", sehingga peluang " + p.state[1] + " = 1 − P. Setiap alternatif menjadi garis lurus terhadap P.",
        [rumus(eq), { t: "garis", alt: p.alt, garis: lines, titik: titik.map(function (t) { return t.P; }), satuan: u }]),
      step("Cari titik potong",
        "Keputusan terbaik berganti di titik tempat dua garis EMV berpotongan. Samakan kedua persamaan, lalu selesaikan P.",
        [rumus(tLines.length ? tLines : ["Tidak ada titik potong di antara 0 dan 1 — satu alternatif selalu terbaik."])]),
      step("Rentang keputusan terbaik",
        "Di setiap rentang P, pilih garis yang " + (max ? "paling atas" : "paling bawah") + ".",
        [tabel(["Rentang P", "Alternatif terbaik"], rows), { t: "garis", alt: p.alt, garis: lines, titik: titik.map(function (t) { return t.P; }), satuan: u }])
    ];
    return { garis: lines, rentang: ranges, titik: titik, steps: steps };
  };

  // Teorema Bayes: prior × kondisional → joint → posterior.
  // p = { state:[], prior:[], hasil:[], likelihood:[[P(hasil k | state i)]] (baris = state), bulat? }
  DA.bayes = function (p) {
    var nS = p.state.length, nH = p.hasil.length, dpPost = p.bulat || 4;
    var pH = [], post = [], joint = [];
    for (var k = 0; k < nH; k++) {
      joint[k] = []; var s = 0;
      for (var i = 0; i < nS; i++) { joint[k][i] = p.likelihood[i][k] * p.prior[i]; s += joint[k][i]; }
      pH[k] = s;
      post[k] = joint[k].map(function (j) { return s > EPS ? j / s : 0; });
    }
    var postR = p.bulat ? post.map(function (r) { return r.map(function (x) { return round(x, p.bulat); }); }) : post;
    var steps = [];
    var likeRows = p.hasil.map(function (h, k) {
      return [lab(h)].concat(p.state.map(function (_, i) { return sel("P(" + h + " | " + p.state[i] + ") = " + num(p.likelihood[i][k])); }));
    });
    steps.push(step("Data: prior dan keandalan informasi",
      "Prior = peluang awal setiap keadaan sebelum ada informasi baru. Kondisional = seberapa sering informasi (survei) memberi hasil tertentu ketika keadaan sebenarnya sudah diketahui. Yang kita cari kebalikannya: peluang keadaan SETELAH melihat hasil informasi (posterior).",
      [tabel(["Hasil informasi"].concat(p.state), likeRows),
       rumus(p.state.map(function (st, i) { return "P(" + st + ") = " + num(p.prior[i]); }))]));
    for (var k2 = 0; k2 < nH; k2++) {
      var rows = p.state.map(function (st, i) {
        return [lab(st), sel(num(p.likelihood[i][k2])), sel("× " + num(p.prior[i])), sel("= " + num(joint[k2][i]), "kuning"),
                sel(num(joint[k2][i]) + " / " + num(pH[k2]) + " = " + num(postR[k2][i], dpPost), "hijau")];
      });
      rows.push([lab("Jumlah"), sel(""), sel(""), sel("P(" + p.hasil[k2] + ") = " + num(pH[k2]), "biru"), sel(num(sum(postR[k2]), dpPost))]);
      steps.push(step("Revisi peluang jika hasil = " + p.hasil[k2],
        "Kalikan kondisional dengan prior untuk mendapat peluang gabungan (joint). Jumlah joint = P(" + p.hasil[k2] + ") = " + num(pH[k2]) +
        ". Lalu posterior = joint ÷ P(" + p.hasil[k2] + ").",
        [tabel(["Keadaan", "P(" + p.hasil[k2] + " | keadaan)", "Prior", "Joint", "Posterior"], rows),
         rumus(p.state.map(function (st, i) {
           return "P(" + st + " | " + p.hasil[k2] + ") = (" + num(p.likelihood[i][k2]) + " × " + num(p.prior[i]) + ") / " + num(pH[k2]) + " = " + num(postR[k2][i], dpPost);
         }))],
        { kunci: "bayes-" + k2 }));
    }
    return { pHasil: pH, posterior: postR, posteriorPersis: post, joint: joint, steps: steps };
  };

  // Pohon keputusan: rollback dari kanan ke kiri.
  // simpul: { jenis:"keputusan", cabang:[{label, biaya?, ke}] } | { jenis:"peluang", cabang:[{label, p, ke}] } | { jenis:"akhir", nilai }
  // opt = { goal, satuan, dp, utilitas?: true (nilai akhir = utilitas) }
  DA.pohon = function (rootNode, opt) {
    opt = opt || {};
    var max = opt.goal !== "min", u = opt.utilitas ? "" : (opt.satuan || ""), dp = opt.dp;
    var nC = 0, nD = 0, nT = 0, order = [];
    var LETTER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    function build(n, adj) {
      var o = { jenis: n.jenis };
      if (n.jenis === "akhir") {
        o.id = "t" + (++nT); o.asli = n.nilai; o.nilai = n.nilai - (opt.utilitas ? 0 : adj); o.label = n.label;
        if (n.uang != null) o.uang = n.uang;
        return o;
      }
      if (n.jenis === "peluang") { o.id = "c" + (++nC); o.kode = String(nC); }
      else { o.id = "d" + (++nD); o.kode = LETTER[nD - 1]; }
      if (n.label) o.label = n.label;
      o.cabang = n.cabang.map(function (b) {
        var c = { label: b.label };
        if (b.p != null) c.p = b.p;
        if (b.biaya) c.biaya = b.biaya;
        c.ke = build(b.ke, adj + (b.biaya || 0));
        return c;
      });
      return o;
    }
    var tree = build(rootNode, 0);
    var steps = [], tampil = [], coret = [];
    function snap() { return { t: "pohon", pohon: tree, tampil: tampil.slice(), coret: coret.slice(), satuan: u, dp: dp }; }
    function nm(n) { return n.jenis === "peluang" ? "simpul " + n.kode : "simpul keputusan " + n.kode; }
    steps.push(step("Gambar pohon keputusan",
      "Pohon dibaca dari kiri ke kanan: kotak = simpul keputusan (kita yang memilih), lingkaran = simpul peluang (alam yang menentukan). " +
      "Peluang ditulis di setiap cabang dan payoff di ujung kanan." + (rootHasBiaya(tree) ? " Biaya informasi sudah dikurangkan dari setiap payoff di cabang yang memakainya." : "") +
      " Hitungnya dari KANAN ke KIRI (rollback).",
      [snap()]));
    function rootHasBiaya(n) { return (n.cabang || []).some(function (b) { return b.biaya || rootHasBiaya(b.ke); }); }
    function solve(n) {
      if (n.jenis === "akhir") { tampil.push(n.id); return n.nilai; }
      var vals = n.cabang.map(function (b) { return solve(b.ke); });
      if (n.jenis === "peluang") {
        var s = 0; n.cabang.forEach(function (b, i) { s += b.p * vals[i]; });
        n.nilai = s; tampil.push(n.id);
        steps.push(step("EMV " + nm(n),
          (opt.utilitas ? "Hitung utilitas harapan: " : "Di simpul peluang, hitung nilai harapan: ") + "jumlahkan (peluang × nilai) dari setiap cabang.",
          [rumus([(opt.utilitas ? "EU" : "EMV") + "(simpul " + n.kode + ") = " + n.cabang.map(function (b, i) { return num(b.p) + " × " + par(vals[i], u, dp); }).join(" + ") + " = " + val(s, u, dp)]), snap()],
          { simpul: n.id }));
      } else {
        var bi = bestIdx(vals, max);
        n.pilih = bi.idx[0]; n.nilai = bi.nilai; tampil.push(n.id);
        n.cabang.forEach(function (b, i) { if (i !== n.pilih) coret.push(b.ke.id); });
        steps.push(step("Pilih di " + nm(n),
          "Di simpul keputusan, bandingkan nilai setiap cabang lalu pilih yang " + (max ? "terbesar" : "terkecil") + ". Cabang lain dicoret (//).",
          [rumus(n.cabang.map(function (b, i) { return b.label + ": " + val(vals[i], u, dp) + (i === n.pilih ? "  ← dipilih" : ""); }), n.pilih), snap()],
          { simpul: n.id }));
      }
      return n.nilai;
    }
    var v = solve(tree);
    var path = [];
    (function walk(n) {
      if (n.jenis === "keputusan") { path.push(n.cabang[n.pilih].label); walk(n.cabang[n.pilih].ke); }
      else if (n.jenis === "peluang") n.cabang.forEach(function (b) { walk(b.ke); });
    })(tree);
    return { pohon: tree, nilai: v, steps: steps };
  };

  // Pohon dengan informasi tambahan (survei): Bayes → rollback → EVSI → efisiensi.
  // p = { alt, state, payoff, prior, goal, satuan, dp,
  //       survei: { label?, biaya, hasil:[...], likelihood?:[[...]] | pHasil:[...], posterior:[[k][i]], bulat? },
  //       labelSurvei?, labelTanpa? }
  DA.survei = function (p) {
    var max = p.goal !== "min", u = p.satuan || "", dp = p.dp, sv = p.survei;
    var bay = null, pH, post;
    if (sv.likelihood) {
      bay = DA.bayes({ state: p.state, prior: p.prior, hasil: sv.hasil, likelihood: sv.likelihood, bulat: sv.bulat });
      pH = bay.pHasil.map(function (x) { return sv.bulat ? round(x, sv.bulat) : x; }); post = bay.posterior;
    } else { pH = sv.pHasil; post = sv.posterior; }
    function sub(probs) {
      return { jenis: "keputusan", cabang: p.alt.map(function (a, i) {
        var r = p.payoff[i], konst = r.every(function (x) { return Math.abs(x - r[0]) < EPS; });
        return { label: a, ke: konst ? { jenis: "akhir", nilai: r[0] } : { jenis: "peluang", cabang: p.state.map(function (s, j) { return { label: s, p: probs[j], ke: { jenis: "akhir", nilai: r[j] } }; }) } };
      }) };
    }
    var rootNode = { jenis: "keputusan", cabang: [
      { label: p.labelSurvei || ("Lakukan " + (sv.label || "survei").toLowerCase()), biaya: max ? sv.biaya : -sv.biaya,
        ke: { jenis: "peluang", cabang: sv.hasil.map(function (h, k) { return { label: h, p: pH[k], ke: sub(post[k]) }; }) } },
      { label: p.labelTanpa || ("Tanpa " + (sv.label || "survei").toLowerCase()), ke: sub(p.prior) }
    ] };
    var pohon = DA.pohon(rootNode, { goal: p.goal, satuan: u, dp: dp });
    var T = pohon.pohon;
    var evSI = T.cabang[0].ke.nilai, evNo = T.cabang[1].ke.nilai;
    var risk = DA.risiko({ alt: p.alt, state: p.state, payoff: p.payoff, prob: p.prior, goal: p.goal, satuan: u, dp: dp, tanpaEOL: true });
    var evsi = max ? (evSI + sv.biaya) - evNo : evNo - (evSI - sv.biaya);
    var eff = risk.evpi > EPS ? evsi / risk.evpi : 0;
    var steps = (bay ? bay.steps : []).concat(pohon.steps);
    var keputusan = [];
    var akar = T.cabang[T.pilih];
    if (T.pilih === 0) {
      keputusan.push(akar.label + " (EMV " + val(evSI, u, dp) + " vs " + val(evNo, u, dp) + ")");
      akar.ke.cabang.forEach(function (b) { keputusan.push("Jika " + b.label + " → " + b.ke.cabang[b.ke.pilih].label); });
    } else keputusan.push(akar.label + ", lalu pilih " + akar.ke.cabang[akar.ke.pilih].label + " (EMV " + val(evNo, u, dp) + ")");
    steps.push(step("Nilai informasi sampel (EVSI) dan efisiensi",
      "EVSI = berapa nilai informasi survei sebenarnya. Biaya survei sudah dikurangkan dari payoff, jadi tambahkan kembali dulu, lalu bandingkan dengan EV tanpa survei. Efisiensi membandingkan EVSI dengan EVPI (informasi sempurna).",
      [rumus([
        max ? "EVSI = (EV dengan SI + biaya) − EV tanpa SI = (" + val(evSI, u, dp) + " + " + val(sv.biaya, u, dp) + ") − " + par(evNo, u, dp) + " = " + val(evsi, u, dp)
            : "EVSI = EV tanpa SI − (EV dengan SI − biaya) = " + val(evNo, u, dp) + " − (" + val(evSI, u, dp) + " − " + val(sv.biaya, u, dp) + ") = " + val(evsi, u, dp),
        "EVPI (dari tabel prior) = " + val(risk.evpi, u, dp),
        "Efisiensi = EVSI / EVPI × 100% = " + val(evsi, u, dp) + " / " + val(risk.evpi, u, dp) + " × 100% = " + pct(eff)]),
       evsi > sv.biaya + EPS ? catatan("EVSI (" + val(evsi, u, dp) + ") lebih besar dari biaya survei (" + val(sv.biaya, u, dp) + "), jadi survei layak dilakukan.")
                             : catatan("EVSI (" + val(evsi, u, dp) + ") tidak lebih besar dari biaya survei (" + val(sv.biaya, u, dp) + "), jadi survei tidak sepadan.", "jebakan")],
      { kunci: "evsi" }));
    steps.push(step("Saran keputusan", "Tulis strategi lengkapnya: keputusan pertama, lalu keputusan lanjutan untuk setiap hasil informasi.",
      [hasil(keputusan.join(" · "))]));
    return { bayes: bay, pHasil: pH, posterior: post, pohon: T, evDenganSI: evSI, evTanpaSI: evNo, evsi: evsi, evpi: risk.evpi, efisiensi: eff, keputusan: keputusan, steps: steps };
  };

  /* =====================================================================================
   * 2. AHP
   * ===================================================================================== */
  var AHP = {};
  var RI_DOSEN = { 1: 0, 2: 0, 3: 0.52, 4: 0.89, 5: 1.11, 6: 1.25, 7: 1.35, 8: 1.40, 9: 1.45, 10: 1.49 };
  var RI_BUKU = { 1: 0, 2: 0, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49 };
  function batasDosen(n) { return n <= 3 ? 0.05 : n === 4 ? 0.08 : 0.10; }
  AHP.RI_DOSEN = RI_DOSEN; AHP.RI_BUKU = RI_BUKU; AHP.batasDosen = batasDosen;

  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function fracStr(x) {
    if (isInt(x)) return num(x, 0);
    if (isInt(1 / x)) return "1/" + num(1 / x, 0);
    return num(x, 3);
  }

  // Matriks perbandingan berpasangan → bobot, λmax, CI, CR.
  // p = { judul?, item:[...], matriks:[[...]] (null = kosong, diisi resiprokal), dp? }
  AHP.matriks = function (p) {
    var n = p.item.length, dp = p.dp == null ? 4 : p.dp;
    var A = grid(n, n, null), given = grid(n, n, false);
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      var v = p.matriks[i][j];
      if (i === j) { A[i][j] = 1; given[i][j] = true; }
      else if (v != null && v !== "") { A[i][j] = +v; given[i][j] = true; }
    }
    var masalah = [];
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) if (i !== j) {
      if (A[i][j] == null && A[j][i] != null) A[i][j] = 1 / A[j][i];
      else if (A[i][j] == null) masalah.push(p.item[i] + " vs " + p.item[j] + " kosong");
      else if (given[i][j] && given[j][i] && Math.abs(A[i][j] * A[j][i] - 1) > 1e-6) masalah.push(p.item[i] + " vs " + p.item[j] + " tidak resiprokal");
    }
    if (masalah.length) throw new Error("Matriks AHP tidak lengkap: " + masalah.join("; "));
    var col = []; for (j = 0; j < n; j++) { col[j] = 0; for (i = 0; i < n; i++) col[j] += A[i][j]; }
    var N = A.map(function (r) { return r.map(function (x, j) { return x / col[j]; }); });
    var w = N.map(function (r) { return sum(r) / n; });
    var ws = A.map(function (r) { var s = 0; r.forEach(function (x, j) { s += x * w[j]; }); return s; });
    var cv = ws.map(function (x, i) { return x / w[i]; });
    var lam = sum(cv) / n;
    var CI = n > 2 ? (lam - n) / (n - 1) : 0;
    var riD = RI_DOSEN[n] || 1.49, riB = RI_BUKU[n] || 1.49;
    var CRd = riD > 0 ? CI / riD : 0, CRb = riB > 0 ? CI / riB : 0;
    var bD = batasDosen(n), okD = CRd <= bD + 1e-12, okB = CRb <= 0.10 + 1e-12;

    var judul = p.judul ? " — " + p.judul : "";
    var head = [p.judul || ""].concat(p.item);
    var steps = [];
    var rows1 = p.item.map(function (it, i) {
      return [lab(it)].concat(A[i].map(function (x, j) { return sel(fracStr(x), i === j ? "redup" : (given[i][j] ? null : "kuning")); }));
    });
    steps.push(step("Lengkapi matriks perbandingan" + judul,
      "Diagonal selalu 1 (membandingkan dengan dirinya sendiri). Kalau baris A vs kolom B bernilai a, maka baris B vs kolom A = 1/a (resiprokal). Sel kuning adalah hasil resiprokal yang kita isi sendiri.",
      [tabel(head, rows1)], { kunci: "lengkapi" }));
    var rows2 = p.item.map(function (it, i) { return [lab(it)].concat(A[i].map(function (x) { return sel(num(x, 4)); })); });
    rows2.push([lab("Jumlah kolom")].concat(col.map(function (c) { return sel(num(c, 4), "kuning"); })));
    steps.push(step("Jumlahkan setiap kolom" + judul,
      "Ubah pecahan menjadi desimal, lalu jumlahkan setiap kolom. Jumlah kolom dipakai untuk normalisasi.",
      [tabel(head, rows2)]));
    var rows3 = p.item.map(function (it, i) {
      return [lab(it)].concat(N[i].map(function (x) { return sel(fix(x, dp)); }), [sel(fix(w[i], dp), "hijau")]);
    });
    rows3.push([lab("Jumlah")].concat(N[0].map(function () { return sel("1"); }), [sel(num(sum(w), 3))]));
    steps.push(step("Normalisasi dan bobot (priority vector)" + judul,
      "Bagi setiap sel dengan jumlah kolomnya, sehingga setiap kolom berjumlah 1. Bobot (priority vector) = rata-rata setiap BARIS dari matriks normalisasi.",
      [rumus(p.item.map(function (it, i) { return "w(" + it + ") = (" + N[i].map(function (x) { return fix(x, dp); }).join(" + ") + ") / " + n + " = " + fix(w[i], dp); })),
       tabel(head.concat(["Bobot"]), rows3)],
      { kunci: "bobot" }));
    var wsLines = p.item.map(function (it, i) {
      return it + ": " + A[i].map(function (x, j) { return fracStr(x) + " × " + fix(w[j], dp); }).join(" + ") + " = " + fix(ws[i], dp) +
        "  →  " + fix(ws[i], dp) + " / " + fix(w[i], dp) + " = " + fix(cv[i], dp);
    });
    steps.push(step("Weighted sum vector dan λmax" + judul,
      "Kalikan matriks AWAL dengan bobot (baris × bobot, lalu dijumlah) untuk mendapat weighted sum. Bagi dengan bobot masing-masing untuk mendapat consistency vector. λmax = rata-rata consistency vector.",
      [rumus(wsLines.concat(["λmax = (" + cv.map(function (x) { return fix(x, dp); }).join(" + ") + ") / " + n + " = " + fix(lam, dp)]))],
      { kunci: "lambda" }));
    var crLines = [
      "CI = (λmax − n) / (n − 1) = (" + fix(lam, dp) + " − " + n + ") / " + (n - 1) + " = " + fix(CI, dp),
      "CR (versi dosen) = CI / RI = " + fix(CI, dp) + " / " + num(riD) + " = " + fix(CRd, dp) + "  → batas " + num(bD) + " → " + (okD ? "KONSISTEN" : "TIDAK konsisten"),
      "CR (versi buku)  = CI / RI = " + fix(CI, dp) + " / " + num(riB) + " = " + fix(CRb, dp) + "  → batas 0,1 → " + (okB ? "konsisten" : "tidak konsisten")
    ];
    steps.push(step("Consistency Index dan Consistency Ratio" + judul,
      "CI mengukur seberapa jauh λmax dari n. CR = CI / RI, dengan RI (random index) sesuai ukuran matriks n = " + n + ". " +
      (n <= 2 ? "Matriks 2×2 selalu konsisten." : "Kunci memakai versi dosen (RI " + num(riD) + ", batas " + num(bD) + "); versi buku ditulis sebagai catatan."),
      [rumus(crLines),
       okD ? hasil("CR = " + fix(CRd, dp) + " ≤ " + num(bD) + " → penilaian konsisten, bobot boleh dipakai")
           : catatan("CR = " + fix(CRd, dp) + " > " + num(bD) + " → penilaian TIDAK konsisten. Seharusnya perbandingan berpasangan ditinjau ulang. Kalau soal tetap meminta ranking, lanjutkan tapi tulis catatan ini.", "jebakan")],
      { kunci: "cr" }));
    return { item: p.item, A: A, kolom: col, N: N, bobot: w, ws: ws, cv: cv, lambda: lam, CI: CI, RI: riD, CR: CRd, batas: bD, konsisten: okD,
             RIbuku: riB, CRbuku: CRb, konsistenBuku: okB, steps: steps };
  };

  // Sintesis: skor akhir = Σ bobot kriteria × skor alternatif pada kriteria itu.
  // p = { kriteria:[], bobot:[], alternatif:[], skor:[[alt i][kriteria j]], dp? }
  AHP.sintesis = function (p) {
    var dp = p.dp == null ? 4 : p.dp;
    var tot = p.skor.map(function (r) { var s = 0; r.forEach(function (x, j) { s += x * p.bobot[j]; }); return s; });
    var order = tot.map(function (_, i) { return i; }).sort(function (a, b) { return tot[b] - tot[a]; });
    var rank = []; order.forEach(function (i, r) { rank[i] = r + 1; });
    var rows = p.alternatif.map(function (a, i) {
      return [lab(a)].concat(p.skor[i].map(function (x) { return sel(fix(x, dp)); }), [sel(fix(tot[i], dp), rank[i] === 1 ? "hijau" : "kuning"), sel(String(rank[i]))]);
    });
    rows.push([lab("Bobot kriteria")].concat(p.bobot.map(function (x) { return sel(fix(x, dp), "biru"); }), [sel(""), sel("")]));
    var lines = p.alternatif.map(function (a, i) {
      return a + ": " + p.skor[i].map(function (x, j) { return fix(p.bobot[j], dp) + " × " + fix(x, dp); }).join(" + ") + " = " + fix(tot[i], dp);
    });
    var steps = [step("Sintesis: skor akhir dan ranking",
      "Skor akhir setiap alternatif = jumlah (bobot kriteria × bobot alternatif pada kriteria itu). Alternatif dengan skor terbesar adalah prioritas pertama.",
      [rumus(lines), tabel(["Alternatif"].concat(p.kriteria, ["Skor akhir", "Rank"]), rows),
       hasil("Ranking: " + order.map(function (i) { return p.alternatif[i]; }).join(" > "))],
      { kunci: "sintesis" })];
    return { total: tot, urutan: order, rank: rank, steps: steps };
  };

  // AHP lengkap: matriks kriteria + matriks alternatif per kriteria + sintesis.
  // p = { kriteria:[], matKriteria, alternatif:[], matAlternatif:[matriks per kriteria], dp? }
  AHP.lengkap = function (p) {
    var steps = [];
    var K = AHP.matriks({ judul: "Kriteria", item: p.kriteria, matriks: p.matKriteria, dp: p.dp });
    K.steps.forEach(function (s) { s.bagian = "Kriteria"; steps.push(s); });
    var alts = p.matAlternatif.map(function (m, j) {
      var r = AHP.matriks({ judul: p.kriteria[j], item: p.alternatif, matriks: m, dp: p.dp });
      r.steps.forEach(function (s) { s.bagian = p.kriteria[j]; steps.push(s); });
      return r;
    });
    var S = AHP.sintesis({ kriteria: p.kriteria, bobot: K.bobot, alternatif: p.alternatif,
      skor: p.alternatif.map(function (_, i) { return alts.map(function (r) { return r.bobot[i]; }); }), dp: p.dp });
    var crRows = [[lab("Kriteria"), sel(fix(K.CR, 4), K.konsisten ? "hijau" : "pink"), sel(fix(K.CRbuku, 4))]].concat(alts.map(function (r, j) {
      return [lab(p.kriteria[j]), sel(fix(r.CR, 4), r.konsisten ? "hijau" : "pink"), sel(fix(r.CRbuku, 4))];
    }));
    S.steps.forEach(function (s) { s.bagian = "Sintesis"; steps.push(s); });
    steps.push(step("Rekap consistency ratio",
      "Setiap matriks perlu dicek konsistensinya. Merah muda = melewati batas versi dosen.",
      [tabel(["Matriks", "CR (dosen)", "CR (buku)"], crRows)], { bagian: "Sintesis" }));
    return { kriteria: K, alternatif: alts, sintesis: S, steps: steps };
  };

  // Multifactor Evaluation Process (bobot faktor diketahui langsung).
  // p = { faktor:[], bobot:[], alternatif:[], evaluasi:[[alt i][faktor j]] }
  AHP.mfep = function (p) {
    var tot = p.evaluasi.map(function (r) { var s = 0; r.forEach(function (x, j) { s += x * p.bobot[j]; }); return s; });
    var b = bestIdx(tot, true);
    var lines = p.alternatif.map(function (a, i) {
      return a + ": " + p.evaluasi[i].map(function (x, j) { return num(p.bobot[j]) + " × " + num(x) + " = " + num(x * p.bobot[j], 4); }).join(" ; ") + " → total " + num(tot[i], 4);
    });
    var rows = p.faktor.map(function (f, j) {
      return [lab(f), sel(num(p.bobot[j]), "biru")].concat(p.alternatif.map(function (_, i) { return sel(num(p.evaluasi[i][j])); }));
    });
    rows.push([lab("Total tertimbang"), sel(num(sum(p.bobot)))].concat(tot.map(function (t, i) { return sel(num(t, 4), b.idx.indexOf(i) !== -1 ? "hijau" : "kuning"); })));
    return { total: tot, terbaik: b, steps: [step("Multifactor Evaluation Process (MFEP)",
      "Kalau bobot faktor dan nilai evaluasi sudah bisa ditentukan langsung (bobot berjumlah 1), cukup kalikan bobot × evaluasi lalu jumlahkan. Pilih total terbesar.",
      [tabel(["Faktor", "Bobot"].concat(p.alternatif), rows), rumus(lines),
       hasil("Pilih " + joinNama(b.idx.map(function (i) { return p.alternatif[i]; })) + " (total " + num(b.nilai, 4) + ")")])] };
  };

  /* =====================================================================================
   * 3. TRANSPORTASI
   * ===================================================================================== */
  var TP = {};

  // p = { sumber:[{nama, kode?, supply}], tujuan:[{nama, kode?, demand}], biaya:[[...]] ("M" = terlarang),
  //       terlarang?:[[i,j]], goal, satuan?, satuanUnit? }
  TP.siapkan = function (p) {
    var max = p.goal === "max";
    var R = p.sumber.map(function (s) { return { nama: s.nama, kode: s.kode || s.nama, jumlah: s.supply }; });
    var K = p.tujuan.map(function (t) { return { nama: t.nama, kode: t.kode || t.nama, jumlah: t.demand }; });
    var terl = (p.terlarang || []).map(function (x) { return x.join(","); });
    var C = p.biaya.map(function (r, i) {
      return r.map(function (x, j) {
        if (x === "M" || x == null || terl.indexOf(i + "," + j) !== -1) return max ? { c: 0, m: -1 } : { c: 0, m: 1 };
        return L(x);
      });
    });
    var S = sum(R.map(function (r) { return r.jumlah; })), D = sum(K.map(function (k) { return k.jumlah; }));
    var dummyR = -1, dummyK = -1;
    if (S > D) { K.push({ nama: "Dummy", kode: "Dm", jumlah: S - D, dummy: true }); C.forEach(function (r) { r.push(L(0)); }); dummyK = K.length - 1; }
    else if (D > S) { R.push({ nama: "Dummy", kode: "Dm", jumlah: D - S, dummy: true }); C.push(K.map(function () { return L(0); })); dummyR = R.length - 1; }
    return { R: R, K: K, C: C, goal: max ? "max" : "min", satuan: p.satuan == null ? "$" : p.satuan, dummyR: dummyR, dummyK: dummyK, totalS: S, totalD: D,
             adaM: C.some(function (r) { return r.some(lisM); }), kata: p.kata || (max ? "profit" : "biaya") };
  };

  function cellCode(P, i, j) { return P.R[i].kode + P.K[j].kode; }
  function cellName(P, i, j) { return P.R[i].kode + "–" + P.K[j].kode; }
  function basicCount(A) { var n = 0; A.forEach(function (r) { r.forEach(function (x) { if (x != null) n++; }); }); return n; }
  function costStr(P, i, j) { return lstr(P.C[i][j]); }

  // blok tabel transportasi
  function tpBlock(P, A, opt) {
    opt = opt || {};
    var m = P.R.length, n = P.K.length;
    var b = {
      t: "tp", kodeR: P.R.map(function (r) { return r.kode; }), kodeK: P.K.map(function (k) { return k.kode; }),
      namaR: P.R.map(function (r) { return r.nama; }), namaK: P.K.map(function (k) { return k.nama; }),
      supply: (opt.supply || P.R.map(function (r) { return r.jumlah; })).map(function (x) { return num(x); }),
      demand: (opt.demand || P.K.map(function (k) { return k.jumlah; })).map(function (x) { return num(x); }),
      total: num(sum(P.R.map(function (r) { return r.jumlah; }))),
      biaya: P.C.map(function (r) { return r.map(function (c) { return lstr(c); }); }),
      alokasi: A.map(function (r) { return r.map(function (x) { return x == null ? null : num(x); }); }),
      dummyR: P.dummyR, dummyK: P.dummyK, kata: P.kata
    };
    ["sorot", "tanda", "jalur", "x", "pinaltiR", "pinaltiK", "R", "K", "indeks", "judul", "sisaS", "sisaD"].forEach(function (k) { if (opt[k] != null) b[k] = opt[k]; });
    return b;
  }

  function totalCost(P, A) {
    var t = { c: 0, m: 0 }, lines = [];
    A.forEach(function (r, i) { r.forEach(function (x, j) {
      if (x != null && x > EPS) { t = ladd(t, { c: P.C[i][j].c * x, m: P.C[i][j].m * x }); lines.push({ i: i, j: j, q: x }); }
    }); });
    return { nilai: t, rute: lines };
  }
  function costLines(P, A) {
    var tc = totalCost(P, A), u = P.satuan;
    var parts = tc.rute.map(function (r) { return num(r.q) + " × " + costStr(P, r.i, r.j); });
    return { nilai: tc.nilai, teks: "Total " + P.kata + " = " + parts.join(" + ") + " = " + (lisM(tc.nilai) ? lstr(tc.nilai) : val(tc.nilai.c, u)), rute: tc.rute };
  }
  function ruteTabel(P, A) {
    var tc = totalCost(P, A), u = P.satuan;
    var rows = tc.rute.map(function (r) {
      return [lab(P.R[r.i].nama), sel(P.K[r.j].nama), sel(num(r.q)), sel(costStr(P, r.i, r.j)), sel(lstr({ c: P.C[r.i][r.j].c * r.q, m: P.C[r.i][r.j].m * r.q }))];
    });
    rows.push([lab("Total"), sel(""), sel(""), sel(""), sel(lisM(tc.nilai) ? lstr(tc.nilai) : val(tc.nilai.c, u), "hijau")]);
    return tabel(["Dari", "Ke", "Unit", (P.kata === "profit" ? "Profit" : "Biaya") + "/unit", "Total"], rows);
  }

  function initialInfo(P) {
    var lines = ["Total supply = " + num(P.totalS) + ", total demand = " + num(P.totalD)];
    var nar = "Cek dulu apakah seimbang: total supply = " + num(P.totalS) + " dan total demand = " + num(P.totalD) + ". ";
    if (P.dummyK >= 0) nar += "Supply lebih besar, jadi tambahkan KOLOM dummy (tujuan bayangan) dengan demand " + num(P.K[P.dummyK].jumlah) + " dan biaya 0. Unit yang masuk dummy = kapasitas yang tidak terkirim. ";
    else if (P.dummyR >= 0) nar += "Demand lebih besar, jadi tambahkan BARIS dummy (sumber bayangan) dengan supply " + num(P.R[P.dummyR].jumlah) + " dan biaya 0. Unit dari dummy = permintaan yang tidak terpenuhi. ";
    else nar += "Seimbang (balanced), jadi tidak perlu dummy. ";
    if (P.adaM) nar += "Rute terlarang diberi nilai " + (P.goal === "max" ? "−M (profit sangat buruk)" : "M (biaya sangat besar)") + " supaya tidak terpakai. ";
    nar += "Tujuan: " + (P.goal === "max" ? "memaksimalkan profit." : "meminimalkan biaya.");
    return step("Tabel transportasi awal", nar, [tpBlock(P, grid(P.R.length, P.K.length, null))]);
  }

  // Northwest corner (pokiapokaba): mulai pojok kiri atas, habiskan baris atau kolom, bergerak ke kanan/bawah.
  TP.nwc = function (P) {
    var m = P.R.length, n = P.K.length;
    var s = P.R.map(function (r) { return r.jumlah; }), d = P.K.map(function (k) { return k.jumlah; });
    var A = grid(m, n, null), steps = [], i = 0, j = 0;
    while (i < m && j < n) {
      var q = Math.min(s[i], d[j]); A[i][j] = q;
      var nar = "Sel " + cellName(P, i, j) + ": sisa supply " + P.R[i].kode + " = " + num(s[i]) + ", sisa demand " + P.K[j].kode + " = " + num(d[j]) + " → isi min(" + num(s[i]) + ", " + num(d[j]) + ") = " + num(q) + ". ";
      s[i] -= q; d[j] -= q;
      var sorot = {}; sorot[i + "," + j] = "kuning";
      var ni = i, nj = j;
      if (Math.abs(s[i]) < EPS && Math.abs(d[j]) < EPS) {
        if (i === m - 1 && j === n - 1) { nar += "Supply dan demand terakhir habis. Selesai di pojok kanan bawah."; ni = m; }
        else if (j < n - 1) { A[i][j + 1] = 0; sorot[i + "," + (j + 1)] = "pink"; nar += "Supply " + P.R[i].kode + " DAN demand " + P.K[j].kode + " habis bersamaan → degenerasi. Taruh angka 0 di sel sebelahnya (" + cellName(P, i, j + 1) + ") supaya pola tangga tetap tersambung, lalu turun serong."; ni = i + 1; nj = j + 1; }
        else { A[i + 1][j] = 0; sorot[(i + 1) + "," + j] = "pink"; nar += "Supply dan demand habis bersamaan → taruh 0 di " + cellName(P, i + 1, j) + "."; ni = i + 1; nj = j + 1; }
      } else if (Math.abs(s[i]) < EPS) { nar += "Supply " + P.R[i].kode + " habis → turun ke baris berikutnya."; ni = i + 1; }
      else { nar += "Demand " + P.K[j].kode + " terpenuhi → geser ke kolom berikutnya."; nj = j + 1; }
      steps.push(step("Northwest corner — sel " + cellName(P, i, j), nar, [tpBlock(P, A, { sorot: sorot, sisaS: s.map(function (x) { return num(x); }), sisaD: d.map(function (x) { return num(x); }) })]));
      i = ni; j = nj;
    }
    return { A: A, steps: steps };
  };

  // Vogel's Approximation Method.
  TP.vam = function (P) {
    var m = P.R.length, n = P.K.length, max = P.goal === "max";
    var s = P.R.map(function (r) { return r.jumlah; }), d = P.K.map(function (k) { return k.jumlah; });
    var rowOn = P.R.map(function () { return true; }), colOn = P.K.map(function () { return true; });
    var A = grid(m, n, null), X = {}, steps = [], guard = 0;
    function better(a, b) { var c = lcmp(a, b); return max ? c > 0 : c < 0; }
    function pen(cells) {   // selisih rute terbaik dan kedua terbaik
      var arr = cells.slice().sort(function (a, b) { return max ? lcmp(b, a) : lcmp(a, b); });
      if (arr.length < 2) return null;
      return max ? lsub(arr[0], arr[1]) : lsub(arr[1], arr[0]);
    }
    while (guard++ < 100) {
      var rows = [], cols = [];
      rowOn.forEach(function (on, i) { if (on) rows.push(i); });
      colOn.forEach(function (on, j) { if (on) cols.push(j); });
      if (!rows.length || !cols.length) break;
      if (rows.length === 1 || cols.length === 1) {
        var sorot1 = {};
        rows.forEach(function (i) { cols.forEach(function (j) { var q = rows.length === 1 ? d[j] : s[i]; A[i][j] = q; s[i] -= q; d[j] -= q; sorot1[i + "," + j] = "kuning"; }); });
        steps.push(step("VAM — sisa satu " + (rows.length === 1 ? "baris" : "kolom"),
          "Tinggal satu " + (rows.length === 1 ? "baris (" + P.R[rows[0]].kode + ")" : "kolom (" + P.K[cols[0]].kode + ")") + ", jadi sisa unit langsung diisikan ke sel-selnya.",
          [tpBlock(P, A, { sorot: sorot1, x: Object.assign({}, X) })]));
        break;
      }
      var pR = P.R.map(function (_, i) { return rowOn[i] ? pen(cols.map(function (j) { return P.C[i][j]; })) : null; });
      var pK = P.K.map(function (_, j) { return colOn[j] ? pen(rows.map(function (i) { return P.C[i][j]; })) : null; });
      // pilih garis dengan pinalti terbesar; seri → yang memuat sel terbaik
      var best = null;
      function consider(type, idx, pv) {
        if (pv == null) return;
        var cells = type === "r" ? cols.map(function (j) { return { i: idx, j: j }; }) : rows.map(function (i) { return { i: i, j: idx }; });
        var bc = cells[0]; cells.forEach(function (c) { if (better(P.C[c.i][c.j], P.C[bc.i][bc.j])) bc = c; });
        var cand = { type: type, idx: idx, pen: pv, cell: bc };
        if (!best) { best = cand; return; }
        var cmp = lcmp(pv, best.pen);
        if (cmp > 0 || (cmp === 0 && better(P.C[bc.i][bc.j], P.C[best.cell.i][best.cell.j]))) best = cand;
      }
      pR.forEach(function (pv, i) { consider("r", i, pv); });
      pK.forEach(function (pv, j) { consider("k", j, pv); });
      var ci = best.cell.i, cj = best.cell.j, q = Math.min(s[ci], d[cj]);
      A[ci][cj] = q; s[ci] -= q; d[cj] -= q;
      var sorot = {}; sorot[ci + "," + cj] = "hijau";
      var lineName = best.type === "r" ? "baris " + P.R[best.idx].kode : "kolom " + P.K[best.idx].kode;
      var nar = "Hitung pinalti setiap baris dan kolom = selisih " + (max ? "profit terbesar dan kedua terbesar" : "biaya terkecil dan kedua terkecil") +
        ". Pinalti terbesar ada di " + lineName + " (" + lstr(best.pen) + "). Isi sel dengan " + (max ? "profit terbesar" : "biaya termurah") + " di sana, yaitu " +
        cellName(P, ci, cj) + ", sebanyak min(" + num(s[ci] + q) + ", " + num(d[cj] + q) + ") = " + num(q) + ". ";
      var rowDone = Math.abs(s[ci]) < EPS, colDone = Math.abs(d[cj]) < EPS;
      if (rowDone && colDone && rows.length > 1 && cols.length > 1) {
        rowOn[ci] = false; cols.forEach(function (j) { if (A[ci][j] == null) X[ci + "," + j] = true; });
        nar += "Supply dan demand habis bersamaan; coret barisnya saja, kolomnya tetap dengan sisa 0 (nanti terisi 0 agar tidak degenerasi).";
      } else if (rowDone) { rowOn[ci] = false; cols.forEach(function (j) { if (A[ci][j] == null) X[ci + "," + j] = true; }); nar += "Supply " + P.R[ci].kode + " habis → coret baris itu (X)."; }
      else { colOn[cj] = false; rows.forEach(function (i) { if (A[i][cj] == null) X[i + "," + cj] = true; }); nar += "Demand " + P.K[cj].kode + " terpenuhi → coret kolom itu (X)."; }
      steps.push(step("VAM — " + lineName + " (pinalti " + lstr(best.pen) + ")", nar,
        [tpBlock(P, A, { sorot: sorot, x: Object.assign({}, X),
          pinaltiR: pR.map(function (v) { return v == null ? null : lstr(v); }), pinaltiK: pK.map(function (v) { return v == null ? null : lstr(v); }),
          sisaS: s.map(function (x) { return num(x); }), sisaD: d.map(function (x) { return num(x); }) })]));
    }
    return { A: A, steps: steps };
  };

  // pohon basis: jalur tertutup untuk sel kosong (i,j)
  function findLoop(A, i, j) {
    var m = A.length, n = A[0].length;
    // simpul baris 0..m-1, kolom m..m+n-1; cari jalur r_i → c_j lewat sel basis
    var prev = {}, start = "r" + i, goal = "c" + j, queue = [start]; prev[start] = null;
    while (queue.length) {
      var u = queue.shift(); if (u === goal) break;
      var t = u[0], k = +u.slice(1);
      if (t === "r") { for (var c = 0; c < n; c++) if (A[k][c] != null && !(k === i && c === j) && !(("c" + c) in prev)) { prev["c" + c] = u; queue.push("c" + c); } }
      else { for (var r = 0; r < m; r++) if (A[r][k] != null && !(r === i && k === j) && !(("r" + r) in prev)) { prev["r" + r] = u; queue.push("r" + r); } }
    }
    if (!(goal in prev)) return null;
    var nodes = [], x = goal; while (x != null) { nodes.unshift(x); x = prev[x]; }
    var cells = [[i, j]];
    for (var q = 0; q < nodes.length - 1; q++) {
      var a = nodes[q], b = nodes[q + 1];
      cells.push(a[0] === "r" ? [+a.slice(1), +b.slice(1)] : [+b.slice(1), +a.slice(1)]);
    }
    return cells;   // tanda: indeks genap +, ganjil −
  }
  function loopIndex(P, cells) {
    var t = { c: 0, m: 0 };
    cells.forEach(function (c, k) { t = k % 2 === 0 ? ladd(t, P.C[c[0]][c[1]]) : lsub(t, P.C[c[0]][c[1]]); });
    return t;
  }
  function loopText(P, cells) { return cells.map(function (c, k) { return (k % 2 ? "−" : "+") + cellCode(P, c[0], c[1]); }).join(" "); }
  function loopCalc(P, cells, I) {
    return cells.map(function (c, k) { var s = lstr(P.C[c[0]][c[1]]); return (k % 2 ? "− " : (k ? "+ " : "+")) + s; }).join(" ") + " = " + lstr(I, 4, { tanda: true });
  }

  // tambahkan 0 bila sel basis < m + n − 1
  function fixDegeneracy(P, A, steps) {
    var m = A.length, n = A[0].length, need = m + n - 1;
    if (basicCount(A) >= need) return;
    var parent = []; for (var z = 0; z < m + n; z++) parent[z] = z;
    function f(x) { while (parent[x] !== x) x = parent[x] = parent[parent[x]]; return x; }
    A.forEach(function (r, i) { r.forEach(function (x, j) { if (x != null) parent[f(i)] = f(m + j); }); });
    var added = [];
    while (basicCount(A) < need) {
      var bestC = null;
      for (var i = 0; i < m; i++) for (var j = 0; j < n; j++) if (A[i][j] == null && f(i) !== f(m + j)) {
        if (!bestC || lcmp(P.C[i][j], P.C[bestC[0]][bestC[1]]) < 0) bestC = [i, j];
      }
      if (!bestC) break;
      A[bestC[0]][bestC[1]] = 0; parent[f(bestC[0])] = f(m + bestC[1]); added.push(bestC);
    }
    var sorot = {}; added.forEach(function (c) { sorot[c[0] + "," + c[1]] = "pink"; });
    steps.push(step("Degenerasi — tambahkan angka 0",
      "Syarat stepping stone/MODI: jumlah sel terisi harus m + n − 1 = " + need + ". Saat ini kurang, jadi tempatkan angka 0 (pengiriman bayangan) di " +
      added.map(function (c) { return cellName(P, c[0], c[1]); }).join(", ") + " dan perlakukan sebagai sel terisi. Pilih sel yang tidak membentuk jalur tertutup dengan sel terisi lain.",
      [tpBlock(P, A, { sorot: sorot })]));
  }

  // MODI: R_i + K_j = C_ij untuk sel terisi, R1 = 0.
  function modiUV(P, A) {
    var m = A.length, n = A[0].length, Rv = [], Kv = [], eqs = [];
    Rv[0] = { c: 0, m: 0 };
    var cells = []; A.forEach(function (r, i) { r.forEach(function (x, j) { if (x != null) cells.push([i, j]); }); });
    var done = {}, progress = true;
    while (progress) {
      progress = false;
      for (var k = 0; k < cells.length; k++) {
        var i = cells[k][0], j = cells[k][1], key = i + "," + j;
        if (done[key]) continue;
        var C = P.C[i][j], ri = "R" + (i + 1), kj = "K" + (j + 1);
        if (Rv[i] && !Kv[j]) { Kv[j] = lsub(C, Rv[i]); eqs.push(ri + " + " + kj + " = " + lstr(C) + " → " + lstr(Rv[i]) + " + " + kj + " = " + lstr(C) + " → " + kj + " = " + lstr(Kv[j])); }
        else if (!Rv[i] && Kv[j]) { Rv[i] = lsub(C, Kv[j]); eqs.push(ri + " + " + kj + " = " + lstr(C) + " → " + ri + " + " + lstr(Kv[j]) + " = " + lstr(C) + " → " + ri + " = " + lstr(Rv[i])); }
        else if (!Rv[i] && !Kv[j]) continue;
        done[key] = true; progress = true; break;
      }
    }
    return { R: Rv, K: Kv, eqs: eqs };
  }

  // Iterasi perbaikan sampai optimal. metode: "stepping" | "modi"
  TP.optimalkan = function (P, A0, metode) {
    var max = P.goal === "max", A = copy(A0), steps = [], iter = 0, iters = [];
    fixDegeneracy(P, A, steps);
    var m = A.length, n = A[0].length;
    var awal = costLines(P, A);
    steps.push(step(kapital(P.kata) + " solusi awal",
      "Hitung " + P.kata + " solusi awal: jumlahkan (unit × " + P.kata + " per unit) di setiap sel terisi. Sel terisi = " + basicCount(A) + " = m + n − 1 = " + (m + n - 1) + ", jadi siap dievaluasi.",
      [tpBlock(P, A), rumus([awal.teks])]));
    while (iter < 30) {
      iter++;
      var idx = {}, loops = {}, list = [], uv = null, idxLines = [];
      if (metode === "modi") {
        uv = modiUV(P, A);
        steps.push(step("MODI iterasi " + iter + " — hitung R dan K",
          "Untuk setiap sel TERISI, tulis R(baris) + K(kolom) = " + P.kata + " sel itu. Tetapkan R1 = 0, lalu selesaikan satu per satu.",
          [tpBlock(P, A, { R: uv.R.map(function (x) { return lstr(x); }), K: uv.K.map(function (x) { return lstr(x); }) }), rumus(uv.eqs.map(function (e, k) { return "(" + (k + 1) + ") " + e; }))],
          { iterasi: iter }));
      }
      for (var i = 0; i < m; i++) for (var j = 0; j < n; j++) if (A[i][j] == null) {
        var cells = findLoop(A, i, j), I;
        if (metode === "modi") {
          I = lsub(lsub(P.C[i][j], uv.R[i]), uv.K[j]);
          idxLines.push("I" + cellCode(P, i, j) + " = C" + (i + 1) + (j + 1) + " − R" + (i + 1) + " − K" + (j + 1) + " = " + lstr(P.C[i][j]) + " − " + par0(uv.R[i]) + " − " + par0(uv.K[j]) + " = " + lstr(I, 4, { tanda: true }));
        } else {
          I = loopIndex(P, cells);
          var tanda = {}; cells.forEach(function (c, k) { tanda[c[0] + "," + c[1]] = k % 2 ? "−" : "+"; });
          var sorot = {}; sorot[i + "," + j] = "kuning";
          steps.push(step("Stepping stone iterasi " + iter + " — sel " + cellName(P, i, j),
            "Mulai dari sel kosong " + cellName(P, i, j) + " (tanda +). Buat jalur tertutup yang hanya berbelok di sel terisi, bergerak horizontal/vertikal, dengan tanda + dan − bergantian. Improvement index = jumlah " + P.kata + " bertanda.",
            [tpBlock(P, A, { tanda: tanda, jalur: cells, sorot: sorot }), rumus(["Jalur: " + loopText(P, cells), "I" + cellCode(P, i, j) + " = " + loopCalc(P, cells, I)])],
            { iterasi: iter, sel: [i, j] }));
          idxLines.push("I" + cellCode(P, i, j) + " = " + lstr(I, 4, { tanda: true }) + "   (" + loopText(P, cells) + ")");
        }
        idx[i + "," + j] = I; loops[i + "," + j] = cells; list.push({ i: i, j: j, I: I });
      }
      // pilih sel masuk
      var enter = null;
      list.forEach(function (e) { var s = lcmp(e.I, { c: 0, m: 0 }); if (max ? s > 0 : s < 0) { if (!enter || (max ? lcmp(e.I, enter.I) > 0 : lcmp(e.I, enter.I) < 0)) enter = e; } });
      var indeksMap = {}; list.forEach(function (e) { indeksMap[e.i + "," + e.j] = lstr(e.I, 4, { tanda: true }); });
      var zeros = list.filter(function (e) { return lcmp(e.I, { c: 0, m: 0 }) === 0; });
      if (!enter) {
        var fin = costLines(P, A);
        var nar = "Semua improvement index " + (max ? "≤ 0" : "≥ 0") + ", jadi solusi sudah OPTIMAL. ";
        if (zeros.length) nar += "Ada index bernilai 0 (" + zeros.map(function (e) { return cellName(P, e.i, e.j); }).join(", ") + ") → ada solusi optimal lain dengan " + P.kata + " sama. ";
        var dumNote = [];
        if (P.dummyK >= 0) A.forEach(function (r, i2) { if (r[P.dummyK] > EPS) dumNote.push(P.R[i2].nama + " menyisakan " + num(r[P.dummyK]) + " unit (tidak terkirim)"); });
        if (P.dummyR >= 0) A[P.dummyR].forEach(function (x, j2) { if (x > EPS) dumNote.push(P.K[j2].nama + " kekurangan " + num(x) + " unit"); });
        steps.push(step("Solusi optimal", nar + (dumNote.length ? "Arti dummy: " + dumNote.join("; ") + "." : ""),
          [tpBlock(P, A, { indeks: indeksMap }), rumus(idxLines), ruteTabel(P, A), hasil("Total " + P.kata + " optimal = " + (lisM(fin.nilai) ? lstr(fin.nilai) : val(fin.nilai.c, P.satuan)))],
          { iterasi: iter, kunci: "optimal" }));
        iters.push({ A: copy(A), indeks: indeksMap, optimal: true, R: uv && uv.R, K: uv && uv.K });
        return { A: A, iterasi: iters, total: fin.nilai, optimalGanda: zeros.length > 0, steps: steps };
      }
      var path = loops[enter.i + "," + enter.j];
      var minus = path.filter(function (_, k) { return k % 2 === 1; });
      var theta = Math.min.apply(null, minus.map(function (c) { return A[c[0]][c[1]]; }));
      var ties = minus.filter(function (c) { return Math.abs(A[c[0]][c[1]] - theta) < EPS; });
      var leave = ties[0];
      ties.forEach(function (c) { if (lcmp(P.C[c[0]][c[1]], P.C[leave[0]][leave[1]]) > 0) leave = c; });
      var tanda2 = {}; path.forEach(function (c, k) { tanda2[c[0] + "," + c[1]] = k % 2 ? "−" : "+"; });
      var pilihNar = (metode === "modi" ? "Hitung improvement index setiap sel kosong: I = C − R − K. " : "Rekap improvement index semua sel kosong. ") +
        "Masih ada index " + (max ? "positif" : "negatif") + ", jadi belum optimal. Pilih yang paling " + (max ? "besar" : "negatif") + ": " + cellName(P, enter.i, enter.j) + " (" + lstr(enter.I, 4, { tanda: true }) + "). " +
        "Jumlah unit yang dipindah = nilai TERKECIL di sel bertanda − pada jalurnya = " + num(theta) + ".";
      if (ties.length > 1) pilihNar += " Ada " + ties.length + " sel bertanda − dengan nilai terkecil yang sama → setelah dipindah, hanya " + cellName(P, leave[0], leave[1]) + " yang dikosongkan; sel lain tetap diisi 0 (supaya tidak degenerasi).";
      var sorotE = {}; sorotE[enter.i + "," + enter.j] = "kuning";
      steps.push(step((metode === "modi" ? "MODI" : "Stepping stone") + " iterasi " + iter + " — pilih sel masuk", pilihNar,
        [tpBlock(P, A, { indeks: indeksMap, tanda: tanda2, jalur: path, sorot: sorotE }), rumus(idxLines.concat(["Jalur " + cellName(P, enter.i, enter.j) + ": " + loopText(P, path), "θ = min(" + minus.map(function (c) { return num(A[c[0]][c[1]]); }).join(", ") + ") = " + num(theta)]))],
        { iterasi: iter }));
      var before = costLines(P, A).nilai;
      path.forEach(function (c, k) { var v = A[c[0]][c[1]] || 0; A[c[0]][c[1]] = k % 2 ? v - theta : v + theta; });
      A[leave[0]][leave[1]] = null;
      ties.forEach(function (c) { if (c !== leave && Math.abs(A[c[0]][c[1]]) < EPS) A[c[0]][c[1]] = 0; });
      var after = costLines(P, A);
      var sorotN = {}; path.forEach(function (c) { if (A[c[0]][c[1]] != null) sorotN[c[0] + "," + c[1]] = "biru"; });
      var delta = lsub(after.nilai, before);
      steps.push(step("Tabel baru setelah iterasi " + iter,
        "Tambahkan " + num(theta) + " ke sel bertanda +, kurangkan dari sel bertanda −. Sel " + cellName(P, leave[0], leave[1]) + " menjadi kosong. " +
        P.kata.charAt(0).toUpperCase() + P.kata.slice(1) + " berubah " + parM(enter.I) + " × " + num(theta) + " = " + lstr(delta, 4, { tanda: true }) + ".",
        [tpBlock(P, A, { sorot: sorotN }), rumus([after.teks])],
        { iterasi: iter }));
      iters.push({ A: copy(A), indeks: indeksMap, masuk: [enter.i, enter.j], keluar: leave, theta: theta, R: uv && uv.R, K: uv && uv.K });
    }
    throw new Error("Transportasi: iterasi terlalu banyak");
  };
  // kurung untuk nilai negatif atau berbentuk M ± c, supaya "a − (M − 6)" tidak salah baca
  function par0(x) { var s = lstr(x); return (x.c < -EPS && !lisM(x)) || x.m < -EPS || (lisM(x) && Math.abs(x.c) > 1e-7) ? "(" + s + ")" : s; }
  function parM(x) { var s = lstr(x, 4, { tanda: true }); return lisM(x) && Math.abs(x.c) > 1e-7 ? "(" + s + ")" : s; }
  function kapital(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // p: data soal; opt = { awal: "nwc"|"vam", evaluasi: "stepping"|"modi", tanpaOptimasi?, awalTabel? }
  TP.selesaikan = function (p, opt) {
    opt = opt || {};
    var P = TP.siapkan(p);
    var steps = [initialInfo(P)];
    var init;
    if (opt.awalTabel) {
      // solusi awal sudah diberikan soal (null = sel kosong; ukurannya termasuk dummy bila ada)
      if (opt.awalTabel.length !== P.R.length || opt.awalTabel[0].length !== P.K.length) throw new Error("Ukuran awalTabel tidak cocok dengan tabel (termasuk dummy)");
      init = { A: copy(opt.awalTabel), steps: [step("Solusi awal dari soal", "Soal sudah memberikan tabel solusi awal, jadi kita langsung mengevaluasinya.", [tpBlock(P, opt.awalTabel)])] };
    } else init = opt.awal === "vam" ? TP.vam(P) : TP.nwc(P);
    steps = steps.concat(init.steps);
    var c0 = costLines(P, init.A);
    if (opt.tanpaOptimasi) {
      steps.push(step(kapital(P.kata) + " solusi awal", "Total " + P.kata + " solusi awal.", [tpBlock(P, init.A), rumus([c0.teks])]));
      return { P: P, awal: init.A, biayaAwal: c0.nilai, steps: steps };
    }
    var o = TP.optimalkan(P, init.A, opt.evaluasi || "stepping");
    steps = steps.concat(o.steps);
    return { P: P, awal: init.A, biayaAwal: c0.nilai, A: o.A, total: o.total, iterasi: o.iterasi, optimalGanda: o.optimalGanda, steps: steps };
  };

  /* =====================================================================================
   * 4. ASSIGNMENT — Metode Hungarian
   * ===================================================================================== */
  var ASG = {};

  // pencocokan maksimum pada sel nol (untuk garis minimum dan penempatan)
  function maxMatching(Z) {
    var n = Z.length, mc = [], mr = [];
    for (var i = 0; i < n; i++) { mr[i] = -1; mc[i] = -1; }
    function aug(i, seen) {
      for (var j = 0; j < n; j++) if (Z[i][j] && !seen[j]) {
        seen[j] = true;
        if (mc[j] < 0 || aug(mc[j], seen)) { mr[i] = j; mc[j] = i; return true; }
      }
      return false;
    }
    var size = 0; for (i = 0; i < n; i++) if (aug(i, {})) size++;
    return { size: size, mr: mr, mc: mc };
  }
  // garis minimum (teorema König): baris tak terjangkau + kolom terjangkau dari baris tanpa pasangan
  function minCover(Z) {
    var n = Z.length, M = maxMatching(Z), visR = [], visC = [];
    var stack = []; for (var i = 0; i < n; i++) if (M.mr[i] < 0) { visR[i] = true; stack.push(i); }
    while (stack.length) {
      var r = stack.pop();
      for (var j = 0; j < n; j++) if (Z[r][j] && !visC[j]) { visC[j] = true; var r2 = M.mc[j]; if (r2 >= 0 && !visR[r2]) { visR[r2] = true; stack.push(r2); } }
    }
    var rows = [], cols = [];
    for (i = 0; i < n; i++) { rows[i] = !visR[i]; cols[i] = !!visC[i]; }
    return { rows: rows, cols: cols, count: M.size };
  }
  function hasPerfect(Z, takenR, takenC) {
    var idxR = [], idxC = [];
    for (var i = 0; i < Z.length; i++) { if (!takenR[i]) idxR.push(i); if (!takenC[i]) idxC.push(i); }
    var sub = idxR.map(function (r) { return idxC.map(function (c) { return Z[r][c]; }); });
    return sub.length === 0 || maxMatching(sub).size === sub.length;
  }

  // p = { baris:[], kolom:[], nilai:[[...]] ("M"/null = terlarang), terlarang?:[[i,j]], goal, satuan?, labelBaris?, labelKolom? }
  ASG.selesaikan = function (p) {
    var max = p.goal === "max", u = p.satuan || "";
    var rowsN = p.baris.slice(), colsN = p.kolom.slice();
    var terl = (p.terlarang || []).map(function (x) { return x.join(","); });
    var V = p.nilai.map(function (r, i) { return r.map(function (x, j) { return (x === "M" || x == null || terl.indexOf(i + "," + j) !== -1) ? null : +x; }); });
    var steps = [], dummyR = -1, dummyK = -1;
    var lb = p.labelBaris || "Baris", lk = p.labelKolom || "Kolom";
    function asgBlock(Mx, opt) {
      opt = opt || {};
      var b = { t: "asg", baris: rowsN.slice(), kolom: colsN.slice(), nilai: Mx.map(function (r) { return r.map(function (x) { return x == null ? "M" : (typeof x === "object" ? lstr(x, 4, { mSaja: true }) : num(x)); }); }),
                dummyR: dummyR, dummyK: dummyK, sudut: lb + " \\ " + lk };
      ["garisR", "garisK", "sorot", "pilih", "catR", "catK", "judul"].forEach(function (k) { if (opt[k] != null) b[k] = opt[k]; });
      return b;
    }
    var n0r = rowsN.length, n0c = colsN.length;
    var nar0 = "Setiap " + lb.toLowerCase() + " hanya boleh mendapat satu " + lk.toLowerCase() + " dan sebaliknya. Tujuan: " + (max ? "memaksimalkan total." : "meminimalkan total.");
    if (terl.length || V.some(function (r) { return r.some(function (x) { return x == null; }); })) nar0 += " Pasangan yang tidak boleh terjadi ditandai M.";
    steps.push(step("Tabel awal", nar0, [asgBlock(V)]));
    if (n0r !== n0c) {
      var nd = Math.abs(n0r - n0c);
      if (n0r > n0c) { for (var a = 0; a < nd; a++) { colsN.push("Dummy" + (nd > 1 ? " " + (a + 1) : "")); V.forEach(function (r) { r.push(0); }); } dummyK = n0c; }
      else { for (var b2 = 0; b2 < nd; b2++) { rowsN.push("Dummy" + (nd > 1 ? " " + (b2 + 1) : "")); V.push(colsN.map(function () { return 0; })); } dummyR = n0r; }
      steps.push(step("Seimbangkan dengan dummy",
        "Jumlah " + lb.toLowerCase() + " (" + n0r + ") ≠ jumlah " + lk.toLowerCase() + " (" + n0c + "). Tambahkan " + (n0r > n0c ? "KOLOM" : "BARIS") + " dummy bernilai 0 sampai tabelnya persegi. " +
        (n0r > n0c ? lb + " yang jatuh ke dummy berarti tidak mendapat " + lk.toLowerCase() + "." : lk + " yang jatuh ke dummy berarti tidak dikerjakan siapa pun."),
        [asgBlock(V)]));
    }
    var n = rowsN.length;
    // konversi maksimasi → tabel opportunity cost
    var Cst = V.map(function (r) { return r.map(function (x) { return x == null ? { c: 0, m: 1 } : { c: x, m: 0 }; }); });
    if (max) {
      var big = -Infinity;
      V.forEach(function (r, i) { r.forEach(function (x, j) { if (x != null && i !== dummyR && !(dummyK >= 0 && j >= dummyK) && !(dummyR >= 0 && i >= dummyR)) big = Math.max(big, x); }); });
      Cst = V.map(function (r, i) { return r.map(function (x, j) {
        if (x == null) return { c: 0, m: 1 };
        if ((dummyK >= 0 && j >= dummyK) || (dummyR >= 0 && i >= dummyR)) return { c: 0, m: 0 };
        return { c: big - x, m: 0 };
      }); });
      steps.push(step("Ubah maksimasi menjadi opportunity cost",
        "Metode Hungarian bekerja untuk minimasi. Cari nilai TERBESAR di tabel (" + num(big) + "), lalu setiap sel = " + num(big) + " − nilai sel. Sel dummy tetap 0" +
        (Cst.some(function (r) { return r.some(lisM); }) ? " dan sel terlarang menjadi M (biaya peluang sangat besar)." : "."),
        [asgBlock(Cst)], { kunci: "konversi" }));
    }
    // reduksi baris
    var rowMin = Cst.map(function (r) { var b = r[0]; r.forEach(function (x) { if (lcmp(x, b) < 0) b = x; }); return b; });
    var R1 = Cst.map(function (r, i) { return r.map(function (x) { return lsub(x, rowMin[i]); }); });
    steps.push(step("Reduksi baris",
      "Di setiap baris, cari nilai terkecil lalu kurangkan dari semua nilai di baris itu. Setiap baris jadi punya minimal satu angka 0.",
      [asgBlock(R1, { catR: rowMin.map(function (x) { return lcmp(x, { c: 0, m: 0 }) === 0 ? "0" : "−" + lstr(x, 4, { mSaja: true }); }) })], { kunci: "reduksi-baris" }));
    var colMin = []; for (var j = 0; j < n; j++) { var bm = R1[0][j]; for (var i = 0; i < n; i++) if (lcmp(R1[i][j], bm) < 0) bm = R1[i][j]; colMin[j] = bm; }
    var Mx = R1.map(function (r) { return r.map(function (x, j2) { return lsub(x, colMin[j2]); }); });
    steps.push(step("Reduksi kolom",
      "Dari hasil reduksi baris, cari nilai terkecil di setiap kolom lalu kurangkan dari kolom itu. Inilah tabel total opportunity cost." +
      (colMin.every(function (x) { return lcmp(x, { c: 0, m: 0 }) === 0; }) ? " (Semua kolom sudah punya 0, jadi tabelnya tidak berubah.)" : ""),
      [asgBlock(Mx, { catK: colMin.map(function (x) { return lcmp(x, { c: 0, m: 0 }) === 0 ? "0" : "−" + lstr(x, 4, { mSaja: true }); }) })], { kunci: "reduksi-kolom" }));
    var guard = 0;
    while (guard++ < 50) {
      var Z = Mx.map(function (r) { return r.map(function (x) { return lcmp(x, { c: 0, m: 0 }) === 0; }); });
      var cov = minCover(Z);
      var gR = cov.rows, gK = cov.cols;
      if (cov.count >= n) {
        steps.push(step("Tes garis: " + cov.count + " garis = " + n,
          "Tutup semua angka 0 dengan garis horizontal/vertikal sesedikit mungkin. Jumlah garis = " + cov.count + " = jumlah baris, jadi penempatan optimal SUDAH bisa dibuat di sel-sel 0.",
          [asgBlock(Mx, { garisR: gR, garisK: gK })], { kunci: "tes-garis" }));
        break;
      }
      var kmin = null;
      for (i = 0; i < n; i++) for (j = 0; j < n; j++) if (!gR[i] && !gK[j]) { if (!kmin || lcmp(Mx[i][j], kmin) < 0) kmin = Mx[i][j]; }
      steps.push(step("Tes garis: " + cov.count + " garis < " + n,
        "Tutup semua angka 0 dengan garis sesedikit mungkin. Hanya perlu " + cov.count + " garis, kurang dari " + n + ", jadi BELUM optimal. Cari nilai terkecil yang tidak tertutup garis: " + lstr(kmin, 4, { mSaja: true }) + ".",
        [asgBlock(Mx, { garisR: gR, garisK: gK })], { kunci: "tes-garis" }));
      var sor = {};
      Mx = Mx.map(function (r, i3) { return r.map(function (x, j3) {
        if (!gR[i3] && !gK[j3]) { sor[i3 + "," + j3] = "kuning"; return lsub(x, kmin); }
        if (gR[i3] && gK[j3]) { sor[i3 + "," + j3] = "biru"; return ladd(x, kmin); }
        return x;
      }); });
      steps.push(step("Revisi tabel opportunity cost",
        "Kurangkan " + lstr(kmin, 4, { mSaja: true }) + " dari semua nilai yang TIDAK tertutup garis (kuning). Tambahkan " + lstr(kmin, 4, { mSaja: true }) + " ke nilai di PERPOTONGAN dua garis (biru). Nilai yang hanya tertutup satu garis tidak berubah. Lalu tes garis lagi.",
        [asgBlock(Mx, { sorot: sor })], { kunci: "revisi" }));
    }
    // penempatan sistematis
    var Zf = Mx.map(function (r) { return r.map(function (x) { return lcmp(x, { c: 0, m: 0 }) === 0; }); });
    var takenR = [], takenC = [], assign = [], alasan = [], ganda = false;
    for (var it = 0; it < n; it++) {
      var pick = null, why = "";
      for (i = 0; i < n && !pick; i++) if (!takenR[i]) {
        var zs = []; for (j = 0; j < n; j++) if (!takenC[j] && Zf[i][j]) zs.push(j);
        if (zs.length === 1) { pick = [i, zs[0]]; why = "baris " + rowsN[i] + " hanya punya satu 0 yang tersedia"; }
      }
      for (j = 0; j < n && !pick; j++) if (!takenC[j]) {
        var zr = []; for (i = 0; i < n; i++) if (!takenR[i] && Zf[i][j]) zr.push(i);
        if (zr.length === 1) { pick = [zr[0], j]; why = "kolom " + colsN[j] + " hanya punya satu 0 yang tersedia"; }
      }
      if (!pick) {
        ganda = true;
        outer: for (i = 0; i < n; i++) if (!takenR[i]) for (j = 0; j < n; j++) if (!takenC[j] && Zf[i][j]) {
          takenR[i] = takenC[j] = true; var ok = hasPerfect(Zf, takenR, takenC); takenR[i] = takenC[j] = false;
          if (ok) { pick = [i, j]; why = "tidak ada baris/kolom dengan satu 0, jadi pilih salah satu (ada solusi optimal lain)"; break outer; }
        }
      }
      if (!pick) throw new Error("Hungarian: penempatan gagal");
      takenR[pick[0]] = takenC[pick[1]] = true; assign.push(pick); alasan.push(why);
    }
    var pilih = {}; assign.forEach(function (a2) { pilih[a2[0] + "," + a2[1]] = true; });
    var total = 0, lines = [], rowsT = [];
    var order = assign.slice().sort(function (x, y) { return x[0] - y[0]; });
    order.forEach(function (a3) {
      var v = V[a3[0]][a3[1]], isD = (dummyR >= 0 && a3[0] >= dummyR) || (dummyK >= 0 && a3[1] >= dummyK);
      total += v || 0;
      rowsT.push([lab(rowsN[a3[0]]), sel(colsN[a3[1]], isD ? "redup" : "hijau"), sel(isD ? "0 (dummy)" : val(v, u))]);
    });
    rowsT.push([lab("Total"), sel(""), sel(val(total, u), "hijau")]);
    steps.push(step("Penempatan akhir",
      "Buat penempatan di sel 0 secara sistematis: cari baris atau kolom yang hanya punya satu 0, tempatkan di situ, lalu coret baris dan kolomnya. Ulangi sampai semua terisi. " +
      assign.map(function (a4, k) { return (k + 1) + ") " + rowsN[a4[0]] + " → " + colsN[a4[1]] + " (" + alasan[k] + ")"; }).join(" "),
      [asgBlock(Mx, { pilih: pilih })], { kunci: "penempatan" }));
    var dumMsg = order.filter(function (a5) { return (dummyR >= 0 && a5[0] >= dummyR) || (dummyK >= 0 && a5[1] >= dummyK); })
      .map(function (a6) { return dummyK >= 0 ? rowsN[a6[0]] + " tidak mendapat " + lk.toLowerCase() : colsN[a6[1]] + " tidak dikerjakan siapa pun"; });
    steps.push(step("Hitung total dari tabel AWAL",
      "Ambil nilai " + (max ? "asli" : "biaya asli") + " dari tabel awal (bukan dari tabel opportunity cost), lalu jumlahkan." + (dumMsg.length ? " Arti dummy: " + dumMsg.join("; ") + "." : ""),
      [tabel([lb, lk, max ? "Nilai" : "Biaya"], rowsT), hasil("Total " + (max ? "maksimum" : "minimum") + " = " + val(total, u))], { kunci: "total" }));
    return { baris: rowsN, kolom: colsN, penempatan: order, total: total, optimalGanda: ganda, steps: steps };
  };

  /* ================= dispatcher ================= */
  function jalankan(metode, data, opsi) {
    switch (metode) {
      case "da-ketidakpastian": return DA.ketidakpastian(data);
      case "da-risiko": return DA.risiko(data);
      case "da-sensitivitas": return DA.sensitivitas(data);
      case "da-bayes": return DA.bayes(data);
      case "da-pohon": return DA.pohon(data.pohon, data);
      case "da-survei": return DA.survei(data);
      case "ahp": return AHP.lengkap(data);
      case "ahp-matriks": return AHP.matriks(data);
      case "ahp-sintesis": return AHP.sintesis(data);
      case "ahp-mfep": return AHP.mfep(data);
      case "tp": return TP.selesaikan(data, opsi || data.opsi);
      case "asg": return ASG.selesaikan(data);
    }
    throw new Error("Metode tidak dikenal: " + metode);
  }

  var SOLVER = { DA: DA, AHP: AHP, TP: TP, ASG: ASG, jalankan: jalankan,
                 fmt: { num: num, fix: fix, val: val, pct: pct, signed: signed, lstr: lstr, fracStr: fracStr }, L: L, lcmp: lcmp };
  if (typeof module !== "undefined" && module.exports) module.exports = SOLVER;
  else root.SOLVER = SOLVER;
})(typeof window !== "undefined" ? window : this);
