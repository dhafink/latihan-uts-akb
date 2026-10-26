// kalkulator.js — form input soal sendiri → langkah penyelesaian dari solver.js.
(function () {
  "use strict";
  var KEY = "akbKuis.kalk";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function saveAll(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  var esc = function (s) { return window.RENDER.esc(s); };

  // ---------- parser ----------
  var H = null;   // helper dari app.js (parseNum)
  function list(t) { return String(t || "").split(/[,;\n]+/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function cell(s, opt) {
    s = String(s).trim();
    if (/^(M|-M|−M)$/i.test(s)) { if (opt && opt.m) return "M"; throw new Error("M hanya boleh dipakai di transportasi/assignment"); }
    if (s === "-" || s === "_" || s === "?" || s === "") { if (opt && opt.kosong) return null; throw new Error("ada sel kosong"); }
    var f = s.match(/^(-?\d+(?:[.,]\d+)?)\/(\d+(?:[.,]\d+)?)$/);
    if (f) return H.parseNum(f[1]) / H.parseNum(f[2]);
    var x = H.parseNum(s);
    if (!isFinite(x)) throw new Error("\"" + s + "\" bukan angka");
    return x;
  }
  function matrix(t, opt) {
    var rows = String(t || "").split(/\n/).map(function (r) { return r.trim(); }).filter(Boolean);
    return rows.map(function (r) { return r.split(/[\s;|]+/).filter(function (x) { return x !== ""; }).map(function (c) { return cell(c, opt); }); });
  }
  function nums(t) { return list(t.replace(/\s+/g, ";")).map(function (x) { return cell(x); }); }
  function cek(cond, msg) { if (!cond) throw new Error(msg); }
  function dims(M, r, c, nama) { cek(M.length === r, nama + ": harus " + r + " baris (sekarang " + M.length + ")"); M.forEach(function (row, i) { cek(row.length === c, nama + " baris " + (i + 1) + ": harus " + c + " angka (sekarang " + row.length + ")"); }); }
  function kode(names) {
    var used = {};
    return names.map(function (n, i) {
      var k = n.replace(/[^A-Za-z0-9]/g, "").slice(0, 1).toUpperCase() || "S" + (i + 1);
      if (used[k]) k = n.replace(/[^A-Za-z0-9]/g, "").slice(0, 2) || k + (i + 1);
      if (used[k]) k = k + (i + 1);
      used[k] = 1; return k;
    });
  }

  // ---------- definisi metode ----------
  var GOAL = { id: "goal", label: "Tujuan", tipe: "pilih", opsi: [["max", "Maksimasi (profit/nilai)"], ["min", "Minimasi (biaya/waktu)"]] };
  var M = [
    { id: "kriteria", nama: "5 kriteria ketidakpastian", lihat: "da/ketidakpastian",
      f: [{ id: "alt", label: "Alternatif (pisahkan dengan koma)", def: "Pabrik besar, Pabrik kecil, Tidak membangun" },
          { id: "state", label: "Keadaan / state of nature", def: "Pasar baik, Pasar buruk" },
          { id: "payoff", label: "Tabel payoff (satu baris per alternatif, angka dipisah spasi)", tipe: "area", def: "200000 -180000\n100000 -20000\n0 0" },
          GOAL, { id: "alpha", label: "α (koefisien realisme)", def: "0,8" }, { id: "satuan", label: "Satuan (mis. $ atau Rp, boleh kosong)", def: "$" }],
      buat: function (v) { var alt = list(v.alt), st = list(v.state), P = matrix(v.payoff); dims(P, alt.length, st.length, "Payoff");
        return { metode: "da-ketidakpastian", data: { alt: alt, state: st, payoff: P, goal: v.goal, alpha: cell(v.alpha), satuan: v.satuan.trim() } }; } },
    { id: "emv", nama: "EMV, EVPI, EOL", lihat: "da/risiko",
      f: [{ id: "alt", label: "Alternatif", def: "Mesin A, Mesin B, Mesin C" }, { id: "state", label: "Keadaan", def: "10.000 kopi, 20.000 kopi, 30.000 kopi" },
          { id: "payoff", label: "Tabel payoff", tipe: "area", def: "950 1050 1150\n850 1100 1350\n700 1000 1300" },
          { id: "prob", label: "Probabilitas setiap keadaan (dipisah spasi)", def: "0,4 0,3 0,3" }, GOAL, { id: "satuan", label: "Satuan", def: "$" }],
      defGoal: "min",
      buat: function (v) { var alt = list(v.alt), st = list(v.state), P = matrix(v.payoff), pr = nums(v.prob); dims(P, alt.length, st.length, "Payoff");
        cek(pr.length === st.length, "Probabilitas harus " + st.length + " angka"); cek(Math.abs(pr.reduce(function (a, b) { return a + b; }, 0) - 1) < 1e-6, "Jumlah probabilitas harus 1");
        return { metode: "da-risiko", data: { alt: alt, state: st, payoff: P, prob: pr, goal: v.goal, satuan: v.satuan.trim() } }; } },
    { id: "sensitivitas", nama: "Sensitivitas (2 keadaan)", lihat: "da/sensitivitas",
      f: [{ id: "alt", label: "Alternatif", def: "Pabrik besar, Pabrik kecil, Tidak membangun" }, { id: "state", label: "Dua keadaan (P = peluang keadaan pertama)", def: "Pasar baik, Pasar buruk" },
          { id: "payoff", label: "Tabel payoff (2 kolom)", tipe: "area", def: "200000 -180000\n100000 -20000\n0 0" }, GOAL, { id: "satuan", label: "Satuan", def: "$" }],
      buat: function (v) { var alt = list(v.alt), st = list(v.state), P = matrix(v.payoff); cek(st.length === 2, "Harus tepat 2 keadaan"); dims(P, alt.length, 2, "Payoff");
        return { metode: "da-sensitivitas", data: { alt: alt, state: st, payoff: P, goal: v.goal, satuan: v.satuan.trim() } }; } },
    { id: "bayes", nama: "Teorema Bayes", lihat: "da/bayes",
      f: [{ id: "state", label: "Keadaan", def: "Sukses, Tidak sukses" }, { id: "prior", label: "Prior setiap keadaan", def: "0,4 0,6" },
          { id: "hasil", label: "Hasil informasi/survei", def: "Survei baik, Survei buruk" },
          { id: "like", label: "P(hasil | keadaan): satu baris per KEADAAN, satu kolom per hasil", tipe: "area", def: "0,9 0,1\n0,2 0,8" }],
      buat: function (v) { var st = list(v.state), pr = nums(v.prior), ha = list(v.hasil), L = matrix(v.like); cek(pr.length === st.length, "Prior harus " + st.length + " angka"); dims(L, st.length, ha.length, "Kondisional");
        return { metode: "da-bayes", data: { state: st, prior: pr, hasil: ha, likelihood: L } }; } },
    { id: "survei", nama: "Pohon + survei (EVSI)", lihat: "da/bayes",
      f: [{ id: "alt", label: "Alternatif", def: "Pabrik besar, Pabrik kecil, Tidak membangun" }, { id: "state", label: "Keadaan", def: "Pasar baik, Pasar buruk" },
          { id: "payoff", label: "Tabel payoff (sebelum dikurangi biaya survei)", tipe: "area", def: "200000 -180000\n100000 -20000\n0 0" },
          { id: "prior", label: "Prior (tanpa survei)", def: "0,5 0,5" }, { id: "biaya", label: "Biaya survei", def: "10000" }, { id: "hasil", label: "Hasil survei", def: "Positif, Negatif" },
          { id: "mode", label: "Data keandalan survei", tipe: "pilih", opsi: [["like", "P(hasil | keadaan) diketahui → hitung Bayes"], ["post", "Posterior & P(hasil) sudah diberikan"]] },
          { id: "like", label: "Jika Bayes: P(hasil | keadaan), satu baris per KEADAAN", tipe: "area", def: "0,7 0,3\n0,2 0,8" },
          { id: "phasil", label: "Jika posterior diberikan: P(hasil) setiap hasil", def: "0,45 0,55" },
          { id: "post", label: "Jika posterior diberikan: P(keadaan | hasil), satu baris per HASIL", tipe: "area", def: "0,78 0,22\n0,27 0,73" },
          { id: "bulat", label: "Bulatkan posterior (desimal, kosongkan = tidak)", def: "2" }, GOAL, { id: "satuan", label: "Satuan", def: "$" }],
      buat: function (v) { var alt = list(v.alt), st = list(v.state), P = matrix(v.payoff), pr = nums(v.prior), ha = list(v.hasil); dims(P, alt.length, st.length, "Payoff");
        cek(pr.length === st.length, "Prior harus " + st.length + " angka");
        var sv = { label: "Survei", biaya: cell(v.biaya), hasil: ha };
        if (v.mode === "post") { sv.pHasil = nums(v.phasil); sv.posterior = matrix(v.post); cek(sv.pHasil.length === ha.length, "P(hasil) harus " + ha.length + " angka"); dims(sv.posterior, ha.length, st.length, "Posterior"); }
        else { sv.likelihood = matrix(v.like); dims(sv.likelihood, st.length, ha.length, "Kondisional"); if (v.bulat.trim()) sv.bulat = Math.round(cell(v.bulat)); }
        return { metode: "da-survei", data: { alt: alt, state: st, payoff: P, prior: pr, goal: v.goal, satuan: v.satuan.trim(), survei: sv } }; } },
    { id: "ahp", nama: "AHP satu matriks", lihat: "ahp/konsistensi",
      f: [{ id: "item", label: "Item yang dibandingkan", def: "Harga, MPG, Kenyamanan, Gaya" },
          { id: "mat", label: "Matriks perbandingan (boleh 1/3; tulis - untuk sel yang akan diisi resiprokal)", tipe: "area", def: "1 3 2 2\n- 1 1/4 1/4\n- 4 1 1/2\n- 4 2 1" }],
      buat: function (v) { var it = list(v.item), A = matrix(v.mat, { kosong: true }); dims(A, it.length, it.length, "Matriks");
        return { metode: "ahp-matriks", data: { item: it, matriks: A } }; } },
    { id: "ahp-lengkap", nama: "AHP lengkap", lihat: "ahp/sintesis",
      f: [{ id: "krit", label: "Kriteria", def: "Harga, MPG, Kenyamanan, Gaya" },
          { id: "matk", label: "Matriks kriteria", tipe: "area", def: "1 3 2 2\n- 1 1/4 1/4\n- 4 1 1/2\n- 4 2 1" },
          { id: "alt", label: "Alternatif", def: "Mobil A, Mobil B, Mobil C" },
          { id: "mata", label: "Matriks alternatif untuk setiap kriteria (urut sesuai kriteria, pisahkan dengan baris kosong)", tipe: "area", tinggi: 260,
            def: "1 1/3 1/4\n- 1 1/2\n- - 1\n\n1 1/4 1/6\n- 1 1/3\n- - 1\n\n1 2 8\n- 1 6\n- - 1\n\n1 1/3 4\n- 1 7\n- - 1" }],
      buat: function (v) { var k = list(v.krit), a = list(v.alt), K = matrix(v.matk, { kosong: true }); dims(K, k.length, k.length, "Matriks kriteria");
        var blocks = String(v.mata).split(/\n\s*\n/).map(function (b) { return matrix(b, { kosong: true }); }).filter(function (m) { return m.length; });
        cek(blocks.length === k.length, "Harus ada " + k.length + " matriks alternatif (sekarang " + blocks.length + ")");
        blocks.forEach(function (m, i) { dims(m, a.length, a.length, "Matriks " + k[i]); });
        return { metode: "ahp", data: { kriteria: k, matKriteria: K, alternatif: a, matAlternatif: blocks } }; } },
    { id: "transportasi", nama: "Transportasi", lihat: "tp/stepping",
      f: [{ id: "sumber", label: "Sumber (pabrik/gudang)", def: "Des Moines, Evansville, Fort Lauderdale" }, { id: "supply", label: "Supply setiap sumber", def: "100 300 300" },
          { id: "tujuan", label: "Tujuan", def: "Albuquerque, Boston, Cleveland" }, { id: "demand", label: "Demand setiap tujuan", def: "300 200 200" },
          { id: "biaya", label: "Biaya/profit per unit (satu baris per sumber; M = rute terlarang)", tipe: "area", def: "5 4 3\n8 4 3\n9 7 5" },
          { id: "goal", label: "Tujuan", tipe: "pilih", opsi: [["min", "Minimasi biaya"], ["max", "Maksimasi profit"]] },
          { id: "awal", label: "Solusi awal", tipe: "pilih", opsi: [["nwc", "Northwest corner"], ["vam", "Vogel (VAM)"]] },
          { id: "evaluasi", label: "Evaluasi", tipe: "pilih", opsi: [["stepping", "Stepping stone"], ["modi", "MODI"]] }, { id: "satuan", label: "Satuan", def: "$" }],
      buat: function (v) { var s = list(v.sumber), t = list(v.tujuan), S = nums(v.supply), D = nums(v.demand), C = matrix(v.biaya, { m: true });
        cek(S.length === s.length, "Supply harus " + s.length + " angka"); cek(D.length === t.length, "Demand harus " + t.length + " angka"); dims(C, s.length, t.length, "Biaya");
        var ks = kode(s), kt = kode(t);
        return { metode: "tp", data: { sumber: s.map(function (n, i) { return { nama: n, kode: ks[i], supply: S[i] }; }), tujuan: t.map(function (n, i) { return { nama: n, kode: kt[i], demand: D[i] }; }),
          biaya: C, goal: v.goal, satuan: v.satuan.trim(), kata: v.goal === "max" ? "profit" : "biaya" }, opsi: { awal: v.awal, evaluasi: v.evaluasi } }; } },
    { id: "assignment", nama: "Assignment (Hungarian)", lihat: "asg/hungarian",
      f: [{ id: "baris", label: "Baris (orang/sumber daya)", def: "Adams, Brown, Cooper" }, { id: "kolom", label: "Kolom (tugas/proyek)", def: "Proyek 1, Proyek 2, Proyek 3" },
          { id: "nilai", label: "Tabel biaya/waktu/profit (M = tidak boleh)", tipe: "area", def: "11 14 6\n8 10 11\n9 12 7" },
          { id: "goal", label: "Tujuan", tipe: "pilih", opsi: [["min", "Minimasi"], ["max", "Maksimasi"]] }, { id: "satuan", label: "Satuan", def: "$" }],
      buat: function (v) { var b = list(v.baris), k = list(v.kolom), N = matrix(v.nilai, { m: true }); dims(N, b.length, k.length, "Tabel");
        return { metode: "asg", data: { baris: b, kolom: k, nilai: N, goal: v.goal, satuan: v.satuan.trim() } }; } }
  ];

  window.KALKULATOR = function (APP, mid, helpers, auto) {
    H = helpers;
    var m = M.filter(function (x) { return x.id === mid; })[0] || M[0];
    var all = load(), v = all[m.id] || {};
    var h = '<h1>Kalkulator langkah</h1><p class="lead">Ketik soal dari buku atau soal teman, lalu putar langkah penyelesaiannya. Angka dipisah spasi; desimal boleh 0,5 atau 0.5.</p><div class="tabs">' +
      M.map(function (x) { return '<button type="button" data-m="' + x.id + '" class="' + (x === m ? "on" : "") + '">' + esc(x.nama) + "</button>"; }).join("") + '</div><div class="card"><div class="form">';
    m.f.forEach(function (f) {
      var val = v[f.id] != null ? v[f.id] : (f.id === "goal" && m.defGoal ? m.defGoal : f.def);
      h += '<div class="f"><label class="lb" for="k-' + f.id + '">' + esc(f.label) + "</label>";
      if (f.tipe === "area") h += '<textarea id="k-' + f.id + '" spellcheck="false"' + (f.tinggi ? ' style="min-height:' + f.tinggi + 'px"' : "") + ">" + esc(val || "") + "</textarea>";
      else if (f.tipe === "pilih") h += '<select id="k-' + f.id + '">' + f.opsi.map(function (o) { return '<option value="' + o[0] + '"' + (val === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select>";
      else h += '<input type="text" id="k-' + f.id + '" value="' + esc(val || "") + '">';
      h += "</div>";
    });
    h += '<div class="start-row"><span><button class="link" type="button" id="kReset">Kembalikan contoh</button> · <a class="link" href="#modul/' + m.lihat + '">Pelajari metodenya</a></span><button class="btn primary" type="button" id="kGo">Hitung & putar langkah →</button></div><p class="err" id="kErr" hidden></p></div></div><div id="kOut" style="margin-top:18px"></div>';
    APP.innerHTML = h;
    Array.prototype.forEach.call(APP.querySelectorAll("[data-m]"), function (b) { b.addEventListener("click", function () { location.hash = "#kalkulator/" + b.getAttribute("data-m"); }); });
    function baca() { var o = {}; m.f.forEach(function (f) { o[f.id] = document.getElementById("k-" + f.id).value; }); return o; }
    document.getElementById("kReset").addEventListener("click", function () { delete all[m.id]; saveAll(all); window.KALKULATOR(APP, m.id, H); });
    document.getElementById("kGo").addEventListener("click", function () {
      var err = document.getElementById("kErr"), out = document.getElementById("kOut");
      err.hidden = true; window.PLAYER.stopAll();
      var vals = baca(); all[m.id] = vals; saveAll(all);
      try {
        var c = m.buat(vals);
        out.innerHTML = '<div class="player-box"></div>';
        var r = H.mountPlayer(out.firstChild, c);
        if (r) out.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) { err.textContent = "Periksa input: " + e.message; err.hidden = false; out.innerHTML = ""; }
    });
    if (auto) document.getElementById("kGo").click();
  };
})();
