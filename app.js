// app.js — router dan semua halaman situs Latihan UTS AKB.
(function () {
  "use strict";

  var TOPIK = {
    1: { id: "da", nama: "Decision Analysis", ikon: "🎲" },
    2: { id: "ahp", nama: "AHP", ikon: "⚖️" },
    3: { id: "tp", nama: "Transportasi", ikon: "🚚" },
    4: { id: "asg", nama: "Assignment", ikon: "🧩" }
  };
  var LEVELS = { konsep: "Konsep", aplikasi: "Hitungan", kasus: "Studi kasus" };
  var SRC = { slide: "Slide kuliah", buku: "Buku Render", "soal-dosen": "Mirip soal dosen", latihan: "Latihan" };
  var LETTERS = "ABCD";
  // prefix sendiri: situs ini satu origin (dhafink.github.io) dengan kuis lain
  var KEY = { theme: "akbKuis.theme", modul: "akbKuis.modul", hitung: "akbKuis.hitung", session: "akbKuis.session", stats: "akbKuis.stats", prefs: "akbKuis.prefs" };

  var MODUL = window.MODUL || [], VIDEOS = window.VIDEOS || [], PEMB = window.PEMBAHASAN || [], HITUNG = window.HITUNG || [];
  var ALL = window.QUESTIONS || [];
  var BY_ID = {}; ALL.forEach(function (q) { BY_ID[q.id] = q; });

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = RENDER.esc;
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var APP = $("#app");

  /* ---------- tema: papan (default) / kertas ---------- */
  function applyTheme(t) {
    if (t === "kertas") document.documentElement.setAttribute("data-theme", "kertas"); else document.documentElement.removeAttribute("data-theme");
    $("#themeLbl").textContent = t === "kertas" ? "Papan" : "Kertas";
  }
  applyTheme(store.get(KEY.theme, null));
  $("#themeBtn").addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "kertas" ? "papan" : "kertas";
    applyTheme(next); store.set(KEY.theme, next); route();
  });

  /* ---------- data bantu ---------- */
  function topikById(id) { for (var k in TOPIK) if (TOPIK[k].id === id) return +k; return null; }
  function modulTopik(id) { return MODUL.filter(function (m) { return m.id === id; })[0]; }
  function subPath(m, s) { return m.id + "/" + s.id; }
  function allSubs() { var out = []; MODUL.slice().sort(function (a, b) { return a.topik - b.topik; }).forEach(function (m) { m.sub.forEach(function (s) { out.push({ m: m, s: s }); }); }); return out; }
  function videoById(id) { return VIDEOS.filter(function (v) { return v.id === id; })[0]; }
  function modulDone() { return store.get(KEY.modul, {}); }
  function runSteps(c) {
    var res = SOLVER.jalankan(c.metode, c.data, c.opsi);
    var st = res.steps;
    if (c.kunci) st = st.filter(function (s, i) { return i === 0 && c.denganAwal !== false || c.kunci.indexOf(s.kunci) !== -1; });
    if (c.dari != null || c.sampai != null) st = st.slice(c.dari || 0, c.sampai == null ? st.length : c.sampai);
    return { res: res, steps: st };
  }
  function mountPlayer(box, c, opt) {
    try {
      var r = runSteps(c);
      PLAYER.mount(box, r.steps, opt);
      return r.res;
    } catch (e) { box.innerHTML = '<p class="err">Gagal menghitung: ' + esc(e.message) + "</p>"; console.error(e); return null; }
  }
  function videoBox(vid) {
    var v = videoById(vid);
    if (!v) return "";
    if (v.ada) return '<div class="vid"><video controls preload="none" playsinline poster="' + esc(v.poster) + '" src="' + esc(v.file) + '"></video></div>';
    return '<div class="vid"><div class="soon">🎬 <b>' + esc(v.id.toUpperCase() + " · " + v.judul) + "</b><br>Video sedang dibuat. Sementara itu, putar animasi langkah di bawah.</div></div>";
  }
  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/[−–]/g, "-").replace(/\s|\$|rp|hari|kg|unit|menit|jam/gi, "");
    var pct = /%$/.test(s); s = s.replace(/%$/, "");
    if (!s) return NaN;
    var hasC = s.indexOf(",") !== -1, hasD = s.indexOf(".") !== -1;
    if (hasC && hasD) { if (s.lastIndexOf(",") > s.lastIndexOf(".")) s = s.replace(/\./g, "").replace(",", "."); else s = s.replace(/,/g, ""); }
    else if (hasC) { s = /^-?\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, "") : s.replace(",", "."); }
    else if (hasD) { if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ""); }
    var x = Number(s);
    return pct ? x / 100 : x;
  }

  /* ---------- router ---------- */
  function parse() { var h = decodeURIComponent(location.hash.replace(/^#\/?/, "")); return h ? h.split("/") : ["beranda"]; }
  function setActive(r) { Array.prototype.forEach.call(document.querySelectorAll("#menu a"), function (a) { a.classList.toggle("on", a.getAttribute("data-r") === r); }); }
  var lastRoute = "";
  function route() {
    PLAYER.stopAll();
    var seg = parse(), r = seg[0];
    if (r === "love" || r === "salah") { setActive("kuis"); viewKuis(r); return; }
    setActive(r);
    var key = seg.join("/");
    switch (r) {
      case "modul": seg[1] === "rumus" ? viewRumus() : seg[1] ? viewModul(seg[1], seg[2]) : viewModulIndex(); break;
      case "video": seg[1] ? viewVideo(seg[1]) : viewVideoIndex(); break;
      case "pembahasan": seg[1] ? viewPembahasan(seg[1]) : viewPembahasanIndex(); break;
      case "kuis": viewKuis(); break;
      case "hitung": seg[1] ? viewHitung(seg[1]) : viewHitungIndex(); break;
      case "kalkulator": viewKalkulator(seg[1], seg[2] === "jalan"); break;
      default: setActive("beranda"); viewBeranda();
    }
    if (key !== lastRoute) window.scrollTo(0, 0);
    lastRoute = key;
    document.title = (r === "beranda" ? "" : (document.querySelector("#app h1") ? document.querySelector("#app h1").textContent + " · " : "")) + "Latihan UTS AKB";
  }
  window.addEventListener("hashchange", route);

  /* =================== BERANDA =================== */
  function viewBeranda() {
    var done = modulDone(), stats = store.get(KEY.stats, {});
    var h = '<div class="hero"><div class="board"><h1>Latihan UTS AKB</h1>' +
      "<p>Analisa Kuantitatif Bisnis: Decision Analysis · AHP · Transportasi · Assignment.</p>" +
      '<div class="tulis">Lihat caranya → tiru langkahnya → kerjakan sendiri ✍️</div>' +
      '<div class="hero-rumus"><div>EMV = Σ payoff × p</div><div>EVPI = EVwPI − EMV*</div><div>CR = CI ÷ RI</div><div>I<sub>ij</sub> = C<sub>ij</sub> − R<sub>i</sub> − K<sub>j</sub></div><div>Hungarian: baris → kolom → garis</div><div>pokiapokaba ↘</div></div></div>' +
      '<div class="path">' +
      pathItem(1, "#modul", "Baca modul + tonton video", "Penjelasan lengkap, rumus, langkah, jebakan, dan contoh yang bisa diputar.") +
      pathItem(2, "#pembahasan", "Bedah soal dosen", "Latihan, PR, dan Tugas Assignment dibahas langkah demi langkah.") +
      pathItem(3, "#kuis", "Kuis pilihan ganda", ALL.length ? ALL.length + " soal konsep dan hitungan cepat." : "Bank soal sedang disusun.") +
      pathItem(4, "#hitung", "Latihan hitung", HITUNG.length ? HITUNG.length + " soal cerita gaya UTS, cek jawaban akhir." : "Soal hitung sedang disusun.") +
      pathItem(5, "#kalkulator", "Kalkulator langkah", "Ketik soal dari buku, lihat langkahnya.") +
      "</div></div>";
    h += '<h2>Topik UTS</h2><div class="grid">';
    Object.keys(TOPIK).forEach(function (k) {
      var t = TOPIK[k], m = modulTopik(t.id);
      var subs = m ? m.sub : [], nd = subs.filter(function (s) { return done[t.id + "/" + s.id]; }).length;
      var qs = ALL.filter(function (q) { return q.topic === +k; });
      var mastered = qs.filter(function (q) { return stats[q.id] && stats[q.id].seen && !stats[q.id].lastWrong; }).length;
      h += '<a class="tcard" href="#modul/' + t.id + '"><div class="tn">Topik ' + k + " " + t.ikon + "</div><h3>" + esc(t.nama) + "</h3><p>" +
        (m ? esc(m.ringkas) : "Modul sedang disusun.") + '</p><div class="small muted" style="margin-top:8px">Modul ' + nd + "/" + subs.length + " subbab" +
        (qs.length ? " · kuis dikuasai " + mastered + "/" + qs.length : "") + '</div><div class="bar"><div style="width:' + (subs.length ? Math.round(nd / subs.length * 100) : 0) + '%"></div></div></a>';
    });
    h += "</div>";
    APP.innerHTML = h;
  }
  function pathItem(n, href, t, s) { return '<a href="' + href + '"><span class="no">' + n + "</span><span><b>" + esc(t) + '</b><span class="s">' + esc(s) + "</span></span></a>"; }

  /* =================== MODUL =================== */
  function viewModulIndex() {
    var done = modulDone();
    var h = '<h1>Modul belajar</h1><p class="lead">Setiap subbab berisi gambaran, istilah, rumus, langkah, contoh yang bisa diputar langkah demi langkah, variasi soal, jebakan, cek pemahaman, dan cara menulis jawaban di lembar ujian.</p>' +
      '<a class="li" href="#modul/rumus" style="margin-bottom:16px"><span><span class="lt">📄 Lembar rumus satu halaman</span><br><span class="ls">Semua rumus dan langkah penting dari 4 topik. Bisa dicetak untuk belajar menjelang ujian.</span></span><span class="chip">Cetak</span></a>';
    MODUL.slice().sort(function (a, b) { return a.topik - b.topik; }).forEach(function (m) {
      h += '<div class="card"><div class="row-head"><h2>' + TOPIK[m.topik].ikon + " " + esc(m.judul) + '</h2><span class="chip">Topik ' + m.topik + "</span></div><p class=\"muted\" style=\"margin-top:-4px\">" + esc(m.ringkas) + '</p><div class="list">';
      m.sub.forEach(function (s, i) {
        var d = done[subPath(m, s)];
        h += '<a class="li" href="#modul/' + subPath(m, s) + '"><span><span class="lt">' + (i + 1) + ". " + esc(s.judul) + '</span><br><span class="ls">' + esc(s.ringkas || "") + "</span></span><span>" +
          (s.video ? '<span class="chip">🎬 ' + esc(s.video.toUpperCase()) + "</span> " : "") + (d ? '<span class="chip ok">✓ dipelajari</span>' : "") + "</span></a>";
      });
      h += "</div></div>";
    });
    if (!MODUL.length) h += '<div class="card">Modul sedang disusun.</div>';
    APP.innerHTML = h;
  }

  var SECS = [
    ["gambaran", "🧭", "Gambaran"], ["istilah", "📖", "Istilah penting"], ["rumus", "🧮", "Rumus"], ["langkah", "🪜", "Langkah-langkah"],
    ["contoh", "▶️", "Contoh lengkap"], ["variasi", "🔀", "Variasi & kasus khusus"], ["jebakan", "⚠️", "Jebakan yang sering muncul"],
    ["cek", "✅", "Cek pemahaman"], ["ringkasan", "📝", "Ringkasan & cara menulis jawaban"]
  ];
  function viewModul(tid, sid) {
    var m = modulTopik(tid);
    if (!m) { viewModulIndex(); return; }
    var s = m.sub.filter(function (x) { return x.id === sid; })[0] || m.sub[0];
    var all = allSubs(), pos = 0;
    all.forEach(function (x, i) { if (x.m === m && x.s === s) pos = i; });
    var done = modulDone();
    var toc = '<aside class="toc"><div class="tt">' + TOPIK[m.topik].ikon + " " + esc(m.judul) + '</div><div class="links">' +
      m.sub.map(function (x) { return '<a class="' + (x === s ? "on" : "") + '" href="#modul/' + subPath(m, x) + '"><span class="ck">' + (done[subPath(m, x)] ? "✓" : "") + "</span><span>" + esc(x.judul) + "</span></a>"; }).join("") +
      '</div><select aria-label="Pilih subbab">' + m.sub.map(function (x) { return '<option value="' + subPath(m, x) + '"' + (x === s ? " selected" : "") + ">" + esc(x.judul) + "</option>"; }).join("") + "</select>" +
      '<div class="links" style="margin-top:10px;border-top:1px solid var(--border);padding-top:8px">' +
      MODUL.slice().sort(function (a, b) { return a.topik - b.topik; }).filter(function (o) { return o !== m; }).map(function (o) { return '<a href="#modul/' + o.id + '"><span class="ck"></span><span>' + TOPIK[o.topik].ikon + " " + esc(o.judul) + "</span></a>"; }).join("") +
      "</div></aside>";
    var h = '<div class="modul">' + toc + '<article class="mod-body">' +
      '<div class="crumb"><a href="#modul">Modul</a> › ' + esc(m.judul) + "</div><h1>" + esc(s.judul) + "</h1>" +
      '<p class="lead">' + esc(s.ringkas || "") + "</p>" +
      '<div class="meta">' + (s.menit ? '<span class="chip">⏱ ±' + esc(s.menit) + " menit</span>" : "") + (s.video ? '<a class="chip" href="#video/' + esc(s.video) + '">🎬 Video ' + esc(s.video.toUpperCase()) + "</a>" : "") + "</div>";
    SECS.forEach(function (sec, idx) {
      var k = sec[0], v = s[k];
      if (k === "ringkasan" && !v && !s.lembar) return;
      if (k !== "ringkasan" && (v == null || (Array.isArray(v) && !v.length))) return;
      h += '<section class="sec" id="sec-' + k + '"><div class="sec-h"><span class="ic">' + sec[1] + '</span><div><div class="no">Bagian ' + (idx + 1) + "</div><h3>" + sec[2] + "</h3></div></div>" + secBody(k, s) + "</section>";
    });
    h += '<div class="done-btn"><button class="btn ' + (done[subPath(m, s)] ? "" : "primary") + '" id="doneBtn" type="button">' + (done[subPath(m, s)] ? "✓ Sudah dipelajari (klik untuk batal)" : "Tandai sudah dipelajari") + "</button></div>";
    var prev = all[pos - 1], next = all[pos + 1];
    h += '<div class="pager">' + (prev ? '<a class="btn ghost" href="#modul/' + subPath(prev.m, prev.s) + '">← ' + esc(prev.s.judul) + "</a>" : "<span></span>") +
      (next ? '<a class="btn primary" href="#modul/' + subPath(next.m, next.s) + '">' + esc(next.s.judul) + " →</a>" : '<a class="btn primary" href="#pembahasan">Lanjut ke pembahasan soal dosen →</a>') + "</div>";
    h += "</article></div>";
    APP.innerHTML = h;
    $(".toc select").addEventListener("change", function (e) { location.hash = "#modul/" + e.target.value; });
    $("#doneBtn").addEventListener("click", function () { var d = modulDone(); d[subPath(m, s)] = !d[subPath(m, s)]; store.set(KEY.modul, d); route(); });
    // pasang pemutar contoh
    Array.prototype.forEach.call(APP.querySelectorAll("[data-contoh]"), function (box) {
      var path = box.getAttribute("data-contoh").split(":"), c = path[0] === "c" ? s.contoh[+path[1]] : s.variasi[+path[1]].contoh;
      mountPlayer(box, c);
    });
  }
  function viewRumus() {
    var L = window.LEMBAR_RUMUS || [];
    var h = '<div class="crumb"><a href="#modul">Modul</a> › Lembar rumus</div><h1>Lembar rumus</h1><p class="lead">Ringkasan semua rumus dan langkah penting. Tekan Ctrl+P untuk mencetak (pakai tema Kertas supaya hemat tinta).</p><div class="rumus-grid">';
    L.forEach(function (b) {
      h += '<section class="board rumus-sheet"><h2>' + esc(b.judul) + "</h2><dl>" + b.isi.map(function (x) { return "<dt>" + esc(x[0]) + "</dt><dd>" + esc(x[1]) + "</dd>"; }).join("") + "</dl></section>";
    });
    APP.innerHTML = h + '</div><div class="pager"><button class="btn" type="button" onclick="window.print()">🖨️ Cetak</button><a class="btn primary" href="#modul">Kembali ke modul →</a></div>';
  }
  function secBody(k, s) {
    var v = s[k];
    switch (k) {
      case "gambaran": return '<div class="prose">' + v + (s.analogi ? '<div class="analogi">💡 ' + s.analogi + "</div>" : "") + "</div>";
      case "istilah": return '<dl class="istilah">' + v.map(function (x) { return "<div><dt>" + x[0] + "</dt><dd>" + x[1] + "</dd></div>"; }).join("") + "</dl>";
      case "rumus": return '<div class="rumus-card">' + v.map(function (x) { return '<div class="rc"><div class="rn">' + x.nama + '</div><div class="rf">' + x.f + "</div>" + (x.arti ? '<div class="ra">' + x.arti + "</div>" : "") + "</div>"; }).join("") + "</div>";
      case "langkah": return '<ol class="langkah">' + v.map(function (x) { return "<li><div>" + x + "</div></li>"; }).join("") + "</ol>";
      case "contoh":
        return (s.video ? videoBox(s.video) : "") + v.map(function (c, i) {
          return '<div class="contoh-box"><div class="soal"><div class="h">Contoh ' + (i + 1) + (c.judul ? " · " + esc(c.judul) : "") + '</div><div class="prose">' + c.soal + '</div></div><div data-contoh="c:' + i + '"></div></div>';
        }).join("");
      case "variasi":
        return v.map(function (x, i) {
          return '<div class="card" style="margin-top:12px"><h3>' + x.judul + '</h3><div class="prose">' + x.isi + "</div>" +
            (x.contoh ? '<div class="contoh-box"><div class="soal"><div class="h">Contoh</div><div class="prose">' + x.contoh.soal + '</div></div><div data-contoh="v:' + i + '"></div></div>' : "") + "</div>";
        }).join("");
      case "jebakan": return '<ul class="jebakan-list">' + v.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>";
      case "cek": return '<div class="cek">' + v.map(function (x) { return "<details><summary>" + x.q + '</summary><div class="ans">' + x.a + "</div></details>"; }).join("") + "</div>";
      case "ringkasan": return (v ? '<div class="ringkas prose">' + v + "</div>" : "") + (s.lembar ? '<div class="lembar prose"><div class="h">✍️ Cara menulis di lembar ujian</div>' + s.lembar + "</div>" : "");
    }
    return "";
  }

  /* =================== VIDEO =================== */
  function viewVideoIndex() {
    var h = '<h1>Video ilustrasi</h1><p class="lead">Video papan kapur bernarasi untuk setiap metode. Tonton dulu, lalu praktikkan dengan pemutar langkah di modul atau latihan hitung.</p><div class="grid">';
    VIDEOS.forEach(function (v) {
      h += '<a class="vcard" href="#video/' + v.id + '"><div class="th"' + (v.ada && v.poster ? ' style="background-image:url(' + esc(v.poster) + ')"' : "") + ">" + (v.ada ? "" : "🎬 " + esc(v.id.toUpperCase())) + '</div><div class="vb"><div class="vn">' + esc(v.id.toUpperCase()) + " · " + esc(TOPIK[v.topik].nama) + '</div><div class="vt">' + esc(v.judul) +
        '</div><div class="vs">' + (v.ada ? "⏱ " + esc(v.durasi || "") : "Sedang dibuat") + "</div></div></a>";
    });
    APP.innerHTML = h + "</div>";
  }
  function viewVideo(id) {
    var v = videoById(id); if (!v) { viewVideoIndex(); return; }
    var i = VIDEOS.indexOf(v), prev = VIDEOS[i - 1], next = VIDEOS[i + 1];
    var h = '<div class="narrow"><div class="crumb"><a href="#video">Video</a> › ' + esc(v.id.toUpperCase()) + "</div><h1>" + esc(v.judul) + '</h1><p class="lead">' + esc(v.ringkas || "") + "</p>" + videoBox(v.id) +
      '<div class="meta" style="margin-top:12px">' + (v.modul ? '<a class="btn sm" href="#modul/' + esc(v.modul) + '">📚 Buka subbab modul + contoh yang bisa diputar</a>' : "") + "</div>" +
      (v.isi ? '<div class="card" style="margin-top:16px"><h3>Isi video</h3><div class="prose"><ul>' + v.isi.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div>" : "") +
      '<div class="pager">' + (prev ? '<a class="btn ghost" href="#video/' + prev.id + '">← ' + esc(prev.judul) + "</a>" : "<span></span>") + (next ? '<a class="btn primary" href="#video/' + next.id + '">' + esc(next.judul) + " →</a>" : "") + "</div></div>";
    APP.innerHTML = h;
  }

  /* =================== PEMBAHASAN =================== */
  function viewPembahasanIndex() {
    var h = '<h1>Pembahasan soal dosen</h1><p class="lead">Soal Latihan, PR, dan Tugas dari kelas, dibahas langkah demi langkah. Coba kerjakan dulu di kertas, baru buka pembahasannya.</p>';
    var groups = [];
    PEMB.forEach(function (p) { if (groups.indexOf(p.grup) === -1) groups.push(p.grup); });
    groups.forEach(function (g) {
      h += '<div class="card"><h2>' + esc(g) + '</h2><div class="list">';
      PEMB.filter(function (p) { return p.grup === g; }).forEach(function (p) {
        h += '<a class="li" href="#pembahasan/' + p.id + '"><span><span class="lt">' + esc(p.judul) + '</span><br><span class="ls">' + esc(p.ringkas || "") + '</span></span><span class="chip">' + esc(TOPIK[p.topik].nama) + "</span></a>";
      });
      h += "</div></div>";
    });
    if (!PEMB.length) h += '<div class="card">Pembahasan sedang disusun.</div>';
    APP.innerHTML = h;
  }
  function viewPembahasan(id) {
    var p = PEMB.filter(function (x) { return x.id === id; })[0]; if (!p) { viewPembahasanIndex(); return; }
    var i = PEMB.indexOf(p), prev = PEMB[i - 1], next = PEMB[i + 1];
    var h = '<div class="narrow"><div class="crumb"><a href="#pembahasan">Pembahasan</a> › ' + esc(p.grup) + "</div><h1>" + esc(p.judul) + "</h1>" +
      '<div class="meta"><span class="chip">' + esc(TOPIK[p.topik].nama) + "</span>" + (p.modul ? '<a class="chip" href="#modul/' + esc(p.modul) + '">📚 Materi terkait</a>' : "") + "</div>" +
      '<div class="soal-asli"><div class="h">Soal</div>' + esc(p.soal) + "</div>" +
      (p.diketahui ? '<h2 class="bagian-h">Yang diketahui</h2><div class="prose">' + p.diketahui + "</div>" : "");
    p.bagian.forEach(function (b, k) {
      h += '<h2 class="bagian-h">' + esc(b.judul) + "</h2>" + (b.pengantar ? '<div class="prose">' + b.pengantar + "</div>" : "") + '<div data-bag="' + k + '"></div>';
    });
    h += '<h2 class="bagian-h">Jawaban akhir</h2><div class="ringkas prose">' + p.jawaban + "</div>";
    if (p.jebakan && p.jebakan.length) h += '<h2 class="bagian-h">Jebakan di soal ini</h2><ul class="jebakan-list">' + p.jebakan.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>";
    if (p.catatan) h += '<div class="cat-box info" style="margin-top:14px">' + p.catatan + "</div>";
    h += '<div class="pager">' + (prev ? '<a class="btn ghost" href="#pembahasan/' + prev.id + '">← ' + esc(prev.judul) + "</a>" : "<span></span>") + (next ? '<a class="btn primary" href="#pembahasan/' + next.id + '">' + esc(next.judul) + " →</a>" : '<a class="btn primary" href="#kuis">Lanjut ke kuis →</a>') + "</div></div>";
    APP.innerHTML = h;
    Array.prototype.forEach.call(APP.querySelectorAll("[data-bag]"), function (box) { mountPlayer(box, p.bagian[+box.getAttribute("data-bag")]); });
  }

  /* =================== LATIHAN HITUNG =================== */
  function hitungState() { return store.get(KEY.hitung, {}); }
  function viewHitungIndex() {
    var st = hitungState();
    var h = '<h1>Latihan hitung</h1><p class="lead">Soal cerita gaya UTS. Kerjakan di kertas seperti saat ujian, isi jawaban akhirnya, lalu putar langkah penyelesaiannya untuk mengecek caramu.</p>';
    Object.keys(TOPIK).forEach(function (k) {
      var list = HITUNG.filter(function (x) { return x.topik === +k; });
      if (!list.length) return;
      h += '<div class="card"><h2>' + TOPIK[k].ikon + " " + esc(TOPIK[k].nama) + '</h2><div class="list">';
      list.forEach(function (x) {
        var s = st[x.id] || {}, benar = x.tanya.filter(function (q) { return s.hasil && s.hasil[q.id]; }).length;
        h += '<a class="li" href="#hitung/' + x.id + '"><span><span class="chip id">' + esc(x.id) + '</span> <span class="lt">' + esc(x.judul) + '</span><br><span class="ls">' + esc(x.ringkas || "") + "</span></span><span>" +
          (s.cek ? '<span class="chip ' + (benar === x.tanya.length ? "ok" : "") + '">' + benar + "/" + x.tanya.length + " benar</span>" : "") + "</span></a>";
      });
      h += "</div></div>";
    });
    if (!HITUNG.length) h += '<div class="card">Soal latihan hitung sedang disusun. Sambil menunggu, coba <a href="#pembahasan">pembahasan soal dosen</a>.</div>';
    APP.innerHTML = h;
  }
  function viewHitung(id) {
    var x = HITUNG.filter(function (q) { return q.id === id; })[0]; if (!x) { viewHitungIndex(); return; }
    var all = hitungState(), s = all[x.id] || (all[x.id] = { jawab: {}, hasil: {}, poin: [] });
    var i = HITUNG.indexOf(x), prev = HITUNG[i - 1], next = HITUNG[i + 1];
    var h = '<div class="narrow"><div class="crumb"><a href="#hitung">Latihan hitung</a> › ' + esc(TOPIK[x.topik].nama) + "</div><h1>" + esc(x.judul) + "</h1>" +
      '<div class="meta"><span class="chip id">' + esc(x.id) + "</span>" + (x.modul ? '<a class="chip" href="#modul/' + esc(x.modul) + '">📚 Materi terkait</a>' : "") + "</div>" +
      '<div class="soal-asli"><div class="h">Soal</div>' + esc(x.cerita) + "</div>" +
      (x.papan ? '<div class="board" style="margin-top:12px">' + RENDER.papan(x.papan) + "</div>" : "") +
      '<h2 class="bagian-h">Jawabanmu</h2><p class="small muted">Tulis angka saja (boleh 40.000 atau 40000; desimal boleh 0,75 atau 0.75).</p><div class="jawab">';
    x.tanya.forEach(function (q) {
      h += '<div class="jq"><div class="jl">' + esc(q.id) + ") " + esc(q.teks) + '</div><div class="jin">';
      if (q.tipe === "pilih") h += '<select data-q="' + q.id + '"><option value="">— pilih —</option>' + q.opsi.map(function (o) { return "<option" + (s.jawab[q.id] === o ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") + "</select>";
      else h += '<input type="text" inputmode="decimal" data-q="' + q.id + '" value="' + esc(s.jawab[q.id] || "") + '" placeholder="jawaban' + (q.satuan ? " (" + esc(q.satuan) + ")" : "") + '">';
      h += '<span class="res" data-res="' + q.id + '"></span></div></div>';
    });
    h += '</div><div class="start-row"><span class="small muted" id="hInfo"></span><span><button class="btn" id="hCek" type="button">Cek jawaban</button> <button class="btn primary" id="hLihat" type="button">Putar langkah penyelesaian</button></span></div>' +
      '<div id="hSol" hidden></div>' +
      '<div class="pager">' + (prev ? '<a class="btn ghost" href="#hitung/' + prev.id + '">← ' + esc(prev.id) + "</a>" : "<span></span>") + (next ? '<a class="btn primary" href="#hitung/' + next.id + '">' + esc(next.id) + " →</a>" : "") + "</div></div>";
    APP.innerHTML = h;
    function save() { all[x.id] = s; store.set(KEY.hitung, all); }
    function cek(show) {
      var benar = 0;
      x.tanya.forEach(function (q) {
        var inp = APP.querySelector('[data-q="' + q.id + '"]'), v = inp.value, ok;
        s.jawab[q.id] = v;
        if (q.tipe === "pilih") ok = v === q.kunci;
        else {
          // terima penulisan gaya Indonesia (1.194 = seribu) maupun desimal titik/koma (1.194 / 1,194)
          var tol = q.tol != null ? q.tol : Math.max(0.005, Math.abs(q.kunci) * 0.001);
          var raw = String(v).trim().replace(/[−–]/g, "-").replace(/\s|\$|rp|hari|kg|unit|menit|jam|%/gi, "");
          var cands = [parseNum(v), Number(raw.replace(/,/g, "")), Number(raw.replace(/\./g, "").replace(",", ".")), Number(raw.replace(",", "."))];
          ok = v.trim() !== "" && cands.some(function (n) { return isFinite(n) && Math.abs(n - q.kunci) <= tol; });
        }
        s.hasil[q.id] = ok; if (ok) benar++;
        if (show) {
          var r = APP.querySelector('[data-res="' + q.id + '"]');
          r.className = "res " + (ok ? "ok" : "bad");
          r.textContent = ok ? "✓ Benar" : (v ? "✗ Belum tepat" : "✗ Kosong") + (s.dilihat ? " · kunci: " + (q.kunciTeks || q.kunci) : "");
        }
      });
      s.cek = true; save();
      $("#hInfo").textContent = benar + " dari " + x.tanya.length + " jawaban benar.";
    }
    function showSol() {
      s.dilihat = true; save();
      var box = $("#hSol"); box.hidden = false;
      var hh = "";
      x.bagian.forEach(function (b, k) { hh += '<h2 class="bagian-h">' + esc(b.judul) + '</h2><div data-hb="' + k + '"></div>'; });
      hh += '<h2 class="bagian-h">Kunci jawaban</h2><div class="ringkas prose"><ul>' + x.tanya.map(function (q) { return "<li><b>" + esc(q.id) + ")</b> " + esc(q.kunciTeks || String(q.kunci)) + "</li>"; }).join("") + "</ul></div>";
      if (x.poin) hh += '<h2 class="bagian-h">Cek caramu</h2><p class="small muted">Centang langkah yang sudah kamu tulis dengan benar di kertas.</p><div class="chk">' +
        x.poin.map(function (pn, k) { return '<label><input type="checkbox" data-p="' + k + '"' + (s.poin[k] ? " checked" : "") + "><span>" + esc(pn) + "</span></label>"; }).join("") + '</div><p class="e-self" id="hSelf"></p>';
      if (x.jebakan) hh += '<h2 class="bagian-h">Jebakan di soal ini</h2><ul class="jebakan-list">' + x.jebakan.map(function (j) { return "<li>" + j + "</li>"; }).join("") + "</ul>";
      box.innerHTML = hh;
      Array.prototype.forEach.call(box.querySelectorAll("[data-hb]"), function (b) { mountPlayer(b, x.bagian[+b.getAttribute("data-hb")]); });
      Array.prototype.forEach.call(box.querySelectorAll("[data-p]"), function (c) { c.addEventListener("change", function () { s.poin[+c.getAttribute("data-p")] = c.checked; save(); self(); }); });
      function self() { var p = $("#hSelf"); if (!p) return; var n = s.poin.filter(Boolean).length; p.textContent = "Skor cara: " + n + "/" + x.poin.length + " langkah benar."; }
      self();
      cek(true);
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    $("#hCek").addEventListener("click", function () { cek(true); });
    $("#hLihat").addEventListener("click", showSol);
    if (s.cek) cek(true);
    if (s.dilihat) { $("#hSol").hidden = true; }
  }

  /* =================== KALKULATOR =================== */
  function viewKalkulator(m, auto) { if (window.KALKULATOR) window.KALKULATOR(APP, m, { mountPlayer: mountPlayer, parseNum: parseNum }, auto); else APP.innerHTML = '<h1>Kalkulator langkah</h1><div class="card">Kalkulator sedang disiapkan. Untuk sekarang, putar contoh di <a href="#modul">Modul</a>.</div>'; }

  /* =================== KUIS (dari template kuis Manajemen Risiko) =================== */
  var stats = store.get(KEY.stats, {});
  var S = null, lastSession = null;
  var NT = Object.keys(TOPIK).length;
  function isCorrect(id, sess) { var a = (sess || S).answers[id]; return a !== undefined && a === BY_ID[id].answer; }
  function kshow(id) {
    ["home", "quiz", "result"].forEach(function (s) { var e = $("#" + s); if (e) e.hidden = s !== id; });
    if (id !== "result") { var hb = document.querySelector(".hearts"); if (hb) hb.remove(); }
    window.scrollTo(0, 0);
  }
  function viewKuis(demo) {
    APP.innerHTML = "";
    APP.appendChild(document.getElementById("tpl-kuis").content.cloneNode(true));
    bindKuis();
    if (demo && ALL.length) { renderHome(); demoResult(demo); return; }
    renderHome();
  }
  function renderHome() {
    var prefs = store.get(KEY.prefs, { topics: Object.keys(TOPIK).map(Number), count: "20", shuffle: true, onlyWrong: false });
    $("#totalInfo").textContent = ALL.length ? ALL.length + " soal pilihan ganda dari " + NT + " topik: konsep dan hitungan cepat. Klik jawaban → kunci dan pembahasan langsung muncul." : "Bank soal kuis sedang disusun. Sementara itu, pelajari modul dan pembahasan soal dosen dulu.";
    var grid = $("#topicGrid"); grid.innerHTML = "";
    Object.keys(TOPIK).forEach(function (k) {
      var t = +k, qs = ALL.filter(function (q) { return q.topic === t; });
      var seen = qs.filter(function (q) { return stats[q.id] && stats[q.id].seen; });
      var mastered = seen.filter(function (q) { return !stats[q.id].lastWrong; }).length;
      var lab = el("label", "topic"), cb = el("input"); cb.type = "checkbox"; cb.value = t; cb.checked = prefs.topics.indexOf(t) !== -1;
      cb.addEventListener("change", updateStartInfo);
      var body = el("div");
      body.appendChild(el("div", "tnum", "Topik " + t + " " + TOPIK[t].ikon));
      body.appendChild(el("div", "tname", TOPIK[t].nama));
      body.appendChild(el("div", "tmeta", qs.length + " soal" + (seen.length ? " · dikuasai " + mastered + "/" + qs.length : "")));
      lab.appendChild(cb); lab.appendChild(body); grid.appendChild(lab);
    });
    $("#countSel").value = prefs.count; $("#shuffleChk").checked = !!prefs.shuffle; $("#onlyWrongChk").checked = !!prefs.onlyWrong;
    var sess = store.get(KEY.session, null);
    var valid = sess && sess.ids && sess.ids.length && sess.idx < sess.ids.length && sess.ids.every(function (id) { return BY_ID[id]; });
    $("#resumeBox").hidden = !valid;
    if (valid) $("#resumeInfo").textContent = "Soal " + (sess.idx + 1) + " dari " + sess.ids.length + " · " + sess.label;
    updateStartInfo(); kshow("home");
  }
  function selectedPool() {
    var topics = Array.prototype.map.call(document.querySelectorAll("#topicGrid input:checked"), function (i) { return +i.value; });
    var pool = ALL.filter(function (q) { return topics.indexOf(q.topic) !== -1; });
    if ($("#onlyWrongChk").checked) pool = pool.filter(function (q) { return stats[q.id] && stats[q.id].lastWrong; });
    return { topics: topics, pool: pool };
  }
  function updateStartInfo() {
    var sel = selectedPool(), c = $("#countSel").value, n = c === "all" ? sel.pool.length : Math.min(+c, sel.pool.length);
    var wrongTotal = ALL.filter(function (q) { return stats[q.id] && stats[q.id].lastWrong; }).length;
    $("#wrongCount").textContent = wrongTotal ? "(" + wrongTotal + " soal)" : "(belum ada)";
    $("#startInfo").textContent = !sel.topics.length ? "Pilih minimal satu topik." : !sel.pool.length ? "Belum ada soal yang cocok dengan filter ini." : n + " soal akan dikerjakan (tersedia " + sel.pool.length + ").";
    $("#startBtn").disabled = !n;
  }
  function startFromHome() {
    var sel = selectedPool(), c = $("#countSel").value, doShuffle = $("#shuffleChk").checked;
    store.set(KEY.prefs, { topics: sel.topics, count: c, shuffle: doShuffle, onlyWrong: $("#onlyWrongChk").checked });
    var ids = sel.pool.map(function (q) { return q.id; });
    if (c !== "all") ids = shuffle(ids).slice(0, +c);
    if (doShuffle) ids = shuffle(ids); else ids.sort(function (a, b) { return ALL.indexOf(BY_ID[a]) - ALL.indexOf(BY_ID[b]); });
    var label = sel.topics.length === NT ? "Semua topik" : "Topik " + sel.topics.join(", ");
    if ($("#onlyWrongChk").checked) label += " · soal yang salah";
    startQuiz(ids, label);
  }
  function startQuiz(ids, label) {
    S = { ids: ids, perm: {}, idx: 0, answers: {}, label: label };
    ids.forEach(function (id) { var q = BY_ID[id], base = q.options.map(function (_, i) { return i; }); S.perm[id] = q.fixed ? base : shuffle(base); });
    save(); renderQuestion(); kshow("quiz");
  }
  function save() { store.set(KEY.session, S); }
  function updateHeader() {
    var answered = 0, correct = 0;
    S.ids.forEach(function (id) { if (S.answers[id] !== undefined) { answered++; if (isCorrect(id)) correct++; } });
    $("#qPos").textContent = "Soal " + (S.idx + 1) + " / " + S.ids.length;
    $("#qScore").textContent = "Benar " + correct + " dari " + answered + " dijawab";
    $("#bar").style.width = (answered / S.ids.length * 100) + "%";
  }
  function fillContext(box, q) {
    box.innerHTML = "";
    if (!q.ctx) { box.hidden = true; return; }
    box.appendChild(el("div", "ctx-title", q.ctxTitle || "Kasus"));
    box.appendChild(el("div", "ctx-body", q.ctx));
    box.hidden = false;
  }
  function fillFigure(box, q) {
    box.innerHTML = "";
    if (!q.papan) { box.hidden = true; return; }
    box.innerHTML = '<div class="board">' + RENDER.papan(q.papan) + "</div>";
    box.hidden = false;
    requestAnimationFrame(function () { RENDER.drawJalur(box); });
  }
  function renderQuestion() {
    var id = S.ids[S.idx], q = BY_ID[id];
    updateHeader();
    var meta = $("#qMeta"); meta.innerHTML = "";
    meta.appendChild(el("span", "chip id", q.id));
    meta.appendChild(el("span", "chip", "Topik " + q.topic + " · " + TOPIK[q.topic].nama));
    meta.appendChild(el("span", "chip", LEVELS[q.level] || q.level));
    if (SRC[q.src]) meta.appendChild(el("span", "chip", SRC[q.src]));
    fillContext($("#qCtx"), q); fillFigure($("#qFig"), q);
    $("#qText").textContent = q.q;
    var list = $("#opts"); list.innerHTML = "";
    S.perm[id].forEach(function (orig, d) {
      var b = el("button", "opt"); b.type = "button"; b.setAttribute("data-orig", orig);
      b.appendChild(el("span", "letter", LETTERS[d])); b.appendChild(el("span", "otext", q.options[orig]));
      b.addEventListener("click", function () { choose(orig); });
      list.appendChild(b);
    });
    $("#feedback").hidden = true; $("#nextBtn").hidden = true;
    $("#prevBtn").style.visibility = S.idx > 0 ? "visible" : "hidden";
    if (S.answers[id] !== undefined) reveal(q, S.answers[id], false);
  }
  function choose(orig) {
    var id = S.ids[S.idx], q = BY_ID[id];
    if (S.answers[id] !== undefined) return;
    S.answers[id] = orig;
    var st = stats[id] || { seen: 0, wrong: 0 };
    st.seen++; st.lastWrong = orig !== q.answer; if (st.lastWrong) st.wrong++;
    stats[id] = st; store.set(KEY.stats, stats); save();
    reveal(q, orig, true);
  }
  function reveal(q, chosen, focusNext) {
    var perm = S.perm[q.id];
    function letterOf(o) { return LETTERS[perm.indexOf(o)]; }
    Array.prototype.forEach.call(document.querySelectorAll("#opts .opt"), function (b) {
      var o = +b.getAttribute("data-orig"); b.disabled = true;
      if (o === q.answer) b.classList.add("correct"); else if (o === chosen) b.classList.add("wrong"); else b.classList.add("dim");
    });
    var ok = chosen === q.answer;
    var fb = $("#feedback"); fb.innerHTML = ""; fb.className = "feedback " + (ok ? "ok" : "bad");
    fb.appendChild(el("div", "fb-title", ok ? "✓ Benar!" : "✗ Kurang tepat"));
    var ans = el("p"); ans.appendChild(el("strong", null, "Jawaban benar: " + letterOf(q.answer) + ". ")); ans.appendChild(document.createTextNode(q.options[q.answer])); fb.appendChild(ans);
    fb.appendChild(el("p", null, q.explain));
    if (!ok && q.why && q.why[chosen]) {
      var w = el("div", "fb-why"); w.appendChild(el("strong", null, "Kenapa " + letterOf(chosen) + " kurang tepat: ")); w.appendChild(document.createTextNode(q.why[chosen])); fb.appendChild(w);
    }
    var det = el("details", "fb-all"); det.appendChild(el("summary", null, "Lihat pembahasan semua opsi"));
    var ul = el("ul");
    perm.forEach(function (o, d) {
      var li = el("li", o === q.answer ? "is-ok" : ""); li.appendChild(el("strong", null, LETTERS[d] + ". "));
      li.appendChild(document.createTextNode(o === q.answer ? "✓ Jawaban benar (lihat penjelasan di atas)." : ((q.why && q.why[o]) || "Tidak sesuai dengan konsep yang ditanyakan.")));
      ul.appendChild(li);
    });
    det.appendChild(ul); fb.appendChild(det);
    if (q.lihat) { var a = el("a", "fb-link", "📚 Lihat caranya di modul →"); a.href = "#modul/" + q.lihat; fb.appendChild(a); }
    fb.appendChild(el("p", "fb-ask", "Masih bingung? Catat ID soal “" + q.id + "” untuk didiskusikan bersama."));
    fb.hidden = false;
    var nb = $("#nextBtn"); nb.hidden = false; nb.textContent = S.idx === S.ids.length - 1 ? "Lihat hasil →" : "Lanjut →";
    if (focusNext) nb.focus({ preventScroll: true });
    updateHeader();
  }
  function next() { if (S.answers[S.ids[S.idx]] === undefined) return; if (S.idx < S.ids.length - 1) { S.idx++; save(); renderQuestion(); window.scrollTo(0, 0); } else showResult(); }
  function prev() { if (S.idx > 0) { S.idx--; save(); renderQuestion(); window.scrollTo(0, 0); } }
  function showResult() {
    lastSession = S; store.del(KEY.session);
    var total = S.ids.length, correct = S.ids.filter(function (id) { return isCorrect(id); }).length, pct = Math.round(correct / total * 100);
    $("#ring").style.setProperty("--p", pct); $("#resScore").textContent = pct + "%";
    $("#resDetail").textContent = correct + " benar dari " + total + " soal";
    $("#resMsg").textContent = pct >= 85 ? "Mantap! Konsep dan hitungannya sudah kuat — pertahankan." : pct >= 70 ? "Bagus. Tinggal rapikan beberapa bagian di bawah." : pct >= 50 ? "Lumayan. Buka pembahasan soal yang salah, lalu ulangi." : "Masih perlu latihan. Mulai dari modul topik dengan skor terendah.";
    var tb = $("#resTopics"); tb.innerHTML = "";
    Object.keys(TOPIK).forEach(function (k) {
      var t = +k, ids = S.ids.filter(function (id) { return BY_ID[id].topic === t; }); if (!ids.length) return;
      var c = ids.filter(function (id) { return isCorrect(id); }).length, p = Math.round(c / ids.length * 100);
      var row = el("div", "trow"); row.appendChild(el("div", null, t + ". " + TOPIK[t].nama));
      var bar = el("div", "tbar" + (p < 60 ? " low" : "")), fill = el("div"); fill.style.width = p + "%"; bar.appendChild(fill); row.appendChild(bar);
      row.appendChild(el("div", "tval", c + "/" + ids.length)); tb.appendChild(row);
    });
    var wrong = S.ids.filter(function (id) { return !isCorrect(id); }), wl = $("#wrongList"); wl.innerHTML = "";
    $("#wrongHead").textContent = wrong.length ? "Soal yang salah (" + wrong.length + ")" : "Semua jawaban benar 🎉";
    wrong.forEach(function (id) {
      var q = BY_ID[id], chosen = S.answers[id], d = el("details", "wrong-item");
      var sm = el("summary"); sm.appendChild(el("span", "chip id", q.id)); sm.appendChild(document.createTextNode(q.q)); d.appendChild(sm);
      var body = el("div", "wbody");
      if (q.ctx) { var cx = el("div", "ctx"); fillContext(cx, q); body.appendChild(cx); }
      if (q.papan) { var fg = el("div", "qfig"); fillFigure(fg, q); body.appendChild(fg); }
      var p1 = el("p"); p1.appendChild(el("span", "tag-bad", "Jawabanmu: ")); p1.appendChild(document.createTextNode(q.options[chosen])); body.appendChild(p1);
      var p2 = el("p"); p2.appendChild(el("span", "tag-ok", "Jawaban benar: ")); p2.appendChild(document.createTextNode(q.options[q.answer])); body.appendChild(p2);
      body.appendChild(el("p", null, q.explain));
      if (q.why && q.why[chosen]) { var p3 = el("p", "muted"); p3.textContent = "Kenapa pilihanmu kurang tepat: " + q.why[chosen]; body.appendChild(p3); }
      if (q.lihat) { var a = el("a", "fb-link", "📚 Lihat caranya di modul →"); a.href = "#modul/" + q.lihat; body.appendChild(a); }
      d.appendChild(body); wl.appendChild(d);
    });
    $("#retryWrongBtn").hidden = !wrong.length;
    kshow("result");
    celebrate(wrong.length, total);
  }
  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var typeTimer = null;
  function funMessage(nWrong, total) {
    if (!nWrong) return "Wiii, semua " + total + " soal benar! 🥳 Hitungannya rapi banget, UTS AKB pasti lancar ❤️";
    if (nWrong === 1) return "Cuma salah 1 soal! Dikit lagi sempurna 🤏 Ulangi yang salah, kamu pasti bisa 💪";
    if (nWrong <= 3) return "Salah " + nWrong + " soal… gapapa! Buka pembahasannya, putar langkahnya di modul, terus ulangi ya ✨";
    if (nWrong / total <= 0.5) return "Salah " + nWrong + " soal nih 🙈 Tarik napas, minum air dulu, lalu ulangi yang salah. Pelan-pelan pasti nempel!";
    return nWrong + " soal masih salah 😆 Tenang, justru ini gunanya latihan. Mulai dari modul topik yang skornya paling rendah ya, semangaaat! 💪";
  }
  function typeText(target, caret, text) {
    clearInterval(typeTimer);
    var chars = Array.from(text), i = 0;
    caret.classList.remove("done");
    if (REDUCED) { target.textContent = text; caret.classList.add("done"); return; }
    target.textContent = "";
    typeTimer = setInterval(function () { target.textContent += chars[i++]; if (i >= chars.length) { clearInterval(typeTimer); caret.classList.add("done"); } }, 40);
  }
  function rainHearts() {
    if (REDUCED) return;
    var old = document.querySelector(".hearts"); if (old) old.remove();
    var box = el("div", "hearts"), kinds = ["❤️", "💖", "💕", "💗", "💘", "🩷"];
    for (var i = 0; i < 60; i++) {
      var h = el("span", "heart", kinds[i % kinds.length]);
      h.style.left = (Math.random() * 100) + "vw"; h.style.fontSize = (18 + Math.random() * 26) + "px";
      h.style.setProperty("--d", (4 + Math.random() * 3).toFixed(2) + "s"); h.style.setProperty("--delay", (Math.random() * 3.5).toFixed(2) + "s");
      h.style.setProperty("--x", ((Math.random() - 0.5) * 160).toFixed(0) + "px"); h.style.setProperty("--r", ((Math.random() - 0.5) * 70).toFixed(0) + "deg");
      box.appendChild(h);
    }
    box.appendChild(el("span", "big-heart", "💖"));
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 11000);
  }
  function celebrate(nWrong, total) { $("#funBox").hidden = false; typeText($("#funText"), $("#funCaret"), funMessage(nWrong, total)); if (!nWrong) rainHearts(); }
  function demoResult(kind) {
    var saved = store.get(KEY.session, null);
    var ids = shuffle(ALL.map(function (q) { return q.id; })).slice(0, 10), answers = {};
    ids.forEach(function (id, i) { var q = BY_ID[id]; answers[id] = kind === "salah" && i < 3 ? (q.answer + 1) % 4 : q.answer; });
    S = { ids: ids, perm: {}, idx: ids.length - 1, answers: answers, label: "Contoh hasil" };
    ids.forEach(function (id) { S.perm[id] = [0, 1, 2, 3]; });
    showResult();
    if (saved) store.set(KEY.session, saved);
  }
  function bindKuis() {
    $("#allBtn").addEventListener("click", function () { Array.prototype.forEach.call(document.querySelectorAll("#topicGrid input"), function (i) { i.checked = true; }); updateStartInfo(); });
    $("#noneBtn").addEventListener("click", function () { Array.prototype.forEach.call(document.querySelectorAll("#topicGrid input"), function (i) { i.checked = false; }); updateStartInfo(); });
    $("#countSel").addEventListener("change", updateStartInfo);
    $("#onlyWrongChk").addEventListener("change", updateStartInfo);
    $("#startBtn").addEventListener("click", startFromHome);
    $("#resumeBtn").addEventListener("click", function () { S = store.get(KEY.session, null); if (S) { renderQuestion(); kshow("quiz"); } });
    $("#discardBtn").addEventListener("click", function () { store.del(KEY.session); renderHome(); });
    $("#resetStatsBtn").addEventListener("click", function () { if (confirm("Hapus semua riwayat jawaban kuis?")) { stats = {}; store.del(KEY.stats); renderHome(); } });
    $("#nextBtn").addEventListener("click", next);
    $("#prevBtn").addEventListener("click", prev);
    $("#exitBtn").addEventListener("click", function () { save(); renderHome(); });
    $("#retryWrongBtn").addEventListener("click", function () { var ids = lastSession.ids.filter(function (id) { return !isCorrect(id, lastSession); }); startQuiz(shuffle(ids), "Ulangi soal yang salah"); });
    $("#retrySameBtn").addEventListener("click", function () { startQuiz(shuffle(lastSession.ids), lastSession.label); });
    $("#homeBtn").addEventListener("click", renderHome);
  }
  document.addEventListener("keydown", function (e) {
    var quiz = $("#quiz");
    if (!quiz || quiz.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key.toLowerCase(), map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
    if (map.hasOwnProperty(k)) { var btn = document.querySelectorAll("#opts .opt")[map[k]]; if (btn && !btn.disabled) { e.preventDefault(); btn.click(); } }
    else if (k === "enter" || k === "arrowright") { if (k === "enter" && e.target.tagName === "BUTTON") return; if (!$("#nextBtn").hidden) { e.preventDefault(); next(); } }
    else if (k === "arrowleft") { e.preventDefault(); prev(); }
  });

  route();
})();
