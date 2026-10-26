// render.js — menggambar blok papan dari solver.js menjadi HTML/SVG bergaya papan kapur.
(function () {
  "use strict";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function cls(k) { return k ? " k-" + k : ""; }

  /* ---------- tabel umum ---------- */
  function tabel(b) {
    var h = '<div class="tb-wrap">' + (b.judul ? '<div class="tb-title">' + esc(b.judul) + "</div>" : "") + '<div class="scroll"><table class="tb"><thead><tr>';
    b.head.forEach(function (x) { h += "<th>" + esc(x) + "</th>"; });
    h += "</tr></thead><tbody>";
    b.rows.forEach(function (r) {
      h += "<tr>";
      r.forEach(function (c) {
        if (c.k === "lab") h += '<th scope="row">' + esc(c.v) + "</th>";
        else h += '<td class="' + cls(c.k).trim() + '">' + esc(c.v) + "</td>";
      });
      h += "</tr>";
    });
    return h + "</tbody></table></div>" + (b.catatan ? '<div class="tb-note">' + esc(b.catatan) + "</div>" : "") + "</div>";
  }

  /* ---------- rumus ---------- */
  function rumus(b) {
    var h = '<div class="rumus">';
    b.baris.forEach(function (l, i) { h += '<div class="rl' + (b.sorot === i ? " k-hijau" : "") + '">' + esc(l) + "</div>"; });
    return h + "</div>";
  }

  /* ---------- tabel transportasi ---------- */
  function tp(b) {
    var m = b.kodeR.length, n = b.kodeK.length;
    var hasPR = b.pinaltiR && b.pinaltiR.some(function (x) { return x != null; });
    var hasPK = b.pinaltiK && b.pinaltiK.some(function (x) { return x != null; });
    var h = '<div class="tp-wrap"><div class="scroll"><div class="tp-inner"><table class="tb tp">';
    if (b.K) {
      h += '<tr class="uv"><th></th>' + (b.R ? "<th></th>" : "");
      b.K.forEach(function (k, j) { h += '<th class="k-biru">K' + (j + 1) + " = " + esc(k) + "</th>"; });
      h += "<th></th>" + (hasPR ? "<th></th>" : "") + "</tr>";
    }
    h += "<tr>" + (b.R ? "<th></th>" : "") + '<th class="corner">Dari \\ Ke</th>';
    for (var j = 0; j < n; j++) h += '<th title="' + esc(b.namaK[j]) + '"' + (j === b.dummyK ? ' class="dummy"' : "") + ">" + esc(b.kodeK[j]) + (b.namaK[j] !== b.kodeK[j] ? '<span class="nm">' + esc(b.namaK[j]) + "</span>" : "") + "</th>";
    h += "<th>Supply</th>" + (hasPR ? '<th class="pen">Pinalti</th>' : "") + "</tr>";
    for (var i = 0; i < m; i++) {
      h += "<tr>";
      if (b.R) h += '<th class="k-biru uvr">R' + (i + 1) + " = " + esc(b.R[i]) + "</th>";
      h += '<th scope="row" title="' + esc(b.namaR[i]) + '"' + (i === b.dummyR ? ' class="dummy"' : "") + ">" + esc(b.kodeR[i]) + (b.namaR[i] !== b.kodeR[i] ? '<span class="nm">' + esc(b.namaR[i]) + "</span>" : "") + "</th>";
      for (j = 0; j < n; j++) {
        var key = i + "," + j, a = b.alokasi[i][j];
        var k = b.sorot && b.sorot[key], tnd = b.tanda && b.tanda[key], idx = b.indeks && b.indeks[key], xx = b.x && b.x[key];
        var c = "tpc" + cls(k) + (a == null ? " kosong" : "") + (xx ? " silang" : "") + (tnd ? (tnd === "+" ? " plus" : " minus") : "");
        h += '<td class="' + c + '" data-r="' + i + '" data-c="' + j + '"><span class="cost">' + esc(b.biaya[i][j]) + "</span>";
        if (a != null) h += '<span class="alloc">' + esc(a) + "</span>";
        else if (xx) h += '<span class="xmark">×</span>';
        if (idx != null && a == null) h += '<span class="idx' + (/^[−-]/.test(idx) ? " neg" : /^0$/.test(idx) ? " nol" : "") + '">' + esc(idx) + "</span>";
        if (tnd) h += '<span class="sign">' + (tnd === "+" ? "+" : "−") + "</span>";
        h += "</td>";
      }
      h += '<td class="sup">' + esc(b.supply[i]) + (b.sisaS && b.sisaS[i] !== b.supply[i] ? '<span class="sisa">sisa ' + esc(b.sisaS[i]) + "</span>" : "") + "</td>";
      if (hasPR) h += '<td class="pen">' + (b.pinaltiR[i] == null ? "" : esc(b.pinaltiR[i])) + "</td>";
      h += "</tr>";
    }
    h += "<tr>" + (b.R ? "<th></th>" : "") + "<th>Demand</th>";
    for (j = 0; j < n; j++) h += '<td class="sup">' + esc(b.demand[j]) + (b.sisaD && b.sisaD[j] !== b.demand[j] ? '<span class="sisa">sisa ' + esc(b.sisaD[j]) + "</span>" : "") + "</td>";
    h += '<td class="sup tot">' + esc(b.total) + "</td>" + (hasPR ? "<td></td>" : "") + "</tr>";
    if (hasPK) {
      h += '<tr class="pen">' + (b.R ? "<th></th>" : "") + "<th>Pinalti</th>";
      for (j = 0; j < n; j++) h += '<td class="pen">' + (b.pinaltiK[j] == null ? "" : esc(b.pinaltiK[j])) + "</td>";
      h += "<td></td>" + (hasPR ? "<td></td>" : "") + "</tr>";
    }
    h += "</table>";
    if (b.jalur) h += '<svg class="jalur" data-jalur="' + esc(JSON.stringify(b.jalur)) + '"></svg>';
    return h + "</div></div></div>";
  }
  // gambar jalur stepping stone setelah tabel ada di halaman
  function drawJalur(root) {
    Array.prototype.forEach.call(root.querySelectorAll("svg.jalur"), function (svg) {
      var box = svg.parentNode, path = JSON.parse(svg.getAttribute("data-jalur"));
      var br = box.getBoundingClientRect();
      if (!br.width) return;
      var pts = path.concat([path[0]]).map(function (c) {
        var td = box.querySelector('td[data-r="' + c[0] + '"][data-c="' + c[1] + '"]');
        var r = td.getBoundingClientRect();
        return [(r.left + r.width / 2 - br.left).toFixed(1), (r.top + r.height / 2 - br.top).toFixed(1)];
      });
      svg.setAttribute("width", br.width); svg.setAttribute("height", br.height);
      svg.setAttribute("viewBox", "0 0 " + br.width + " " + br.height);
      var d = "M" + pts.map(function (p) { return p.join(","); }).join(" L");
      svg.innerHTML = '<path class="jl-bg" d="' + d + '"/><path class="jl" d="' + d + '"/>';
    });
  }

  /* ---------- tabel penugasan ---------- */
  function asg(b) {
    var n = b.baris.length, mK = b.kolom.length;
    var h = '<div class="scroll"><table class="tb asg"><thead><tr><th class="corner">' + esc(b.sudut || "") + "</th>";
    b.kolom.forEach(function (k, j) { h += "<th" + (b.dummyK >= 0 && j >= b.dummyK ? ' class="dummy"' : "") + ">" + esc(k) + "</th>"; });
    if (b.catR) h += '<th class="cat">min baris</th>';
    h += "</tr></thead><tbody>";
    for (var i = 0; i < n; i++) {
      h += "<tr><th scope=\"row\"" + (b.dummyR >= 0 && i >= b.dummyR ? ' class="dummy"' : "") + ">" + esc(b.baris[i]) + "</th>";
      for (var j = 0; j < mK; j++) {
        var key = i + "," + j, v = b.nilai[i][j];
        var c = "ac" + cls(b.sorot && b.sorot[key]) + (b.garisR && b.garisR[i] ? " lr" : "") + (b.garisK && b.garisK[j] ? " lc" : "") +
          (b.pilih && b.pilih[key] ? " pilih" : "") + (v === "0" ? " nol" : "") + (v === "M" ? " em" : "");
        h += '<td class="' + c + '"><span>' + esc(v) + "</span></td>";
      }
      if (b.catR) h += '<td class="cat">' + esc(b.catR[i]) + "</td>";
      h += "</tr>";
    }
    if (b.catK) { h += '<tr><th class="cat">min kolom</th>'; b.catK.forEach(function (x) { h += '<td class="cat">' + esc(x) + "</td>"; }); if (b.catR) h += "<td></td>"; h += "</tr>"; }
    return h + "</tbody></table></div>";
  }

  /* ---------- pohon keputusan ---------- */
  function pohon(b) {
    var F = window.SOLVER ? SOLVER.fmt : null, u = b.satuan || "", dp = b.dp;
    var shown = {}; (b.tampil || []).forEach(function (id) { shown[id] = true; });
    var cut = {}; (b.coret || []).forEach(function (id) { cut[id] = true; });
    var leaves = 0, depthMax = 0;
    (function count(nd, d) { depthMax = Math.max(depthMax, d); if (nd.jenis === "akhir") { nd._y = leaves++; return; } nd.cabang.forEach(function (c) { count(c.ke, d + 1); }); nd._y = (nd.cabang[0].ke._y + nd.cabang[nd.cabang.length - 1].ke._y) / 2; })(b.pohon, 0);
    var DX = 190, DY = 54, PADL = 30, PADT = 30, W = PADL + depthMax * DX + 190, H = PADT * 2 + Math.max(0, leaves - 1) * DY + 20;
    function X(d) { return PADL + d * DX; } function Y(nd) { return PADT + nd._y * DY; }
    var g = "";
    (function draw(nd, d) {
      var x = X(d), y = Y(nd);
      if (nd.jenis !== "akhir") nd.cabang.forEach(function (c) {
        var ch = c.ke, cx = X(d + 1), cy = Y(ch), mx = x + 40;
        var dead = cut[ch.id];
        g += '<path class="br' + (dead ? " dead" : "") + '" d="M' + (x + 14) + "," + y + " L" + mx + "," + cy + " L" + (cx - 14) + "," + cy + '"/>';
        var lbl = c.label + (c.p != null ? " (" + (F ? F.num(c.p) : c.p) + ")" : "");
        g += '<text class="bl" x="' + (mx + 6) + '" y="' + (cy - 7) + '">' + esc(lbl) + "</text>";
        if (dead) g += '<text class="cut" x="' + (cx - 40) + '" y="' + (cy + 7) + '">//</text>';
        draw(ch, d + 1);
      });
      if (nd.jenis === "keputusan") g += '<rect class="nd dn' + (shown[nd.id] ? " on" : "") + '" x="' + (x - 14) + '" y="' + (y - 14) + '" width="28" height="28" rx="3"/><text class="nk" x="' + x + '" y="' + (y + 5) + '">' + esc(nd.kode) + "</text>";
      else if (nd.jenis === "peluang") g += '<circle class="nd cn' + (shown[nd.id] ? " on" : "") + '" cx="' + x + '" cy="' + y + '" r="14"/><text class="nk" x="' + x + '" y="' + (y + 5) + '">' + esc(nd.kode) + "</text>";
      else g += '<text class="tv" x="' + (x - 8) + '" y="' + (y + 5) + '">' + esc(F ? F.val(nd.nilai, u, dp) : nd.nilai) + "</text>";
      if (nd.jenis !== "akhir" && shown[nd.id] && nd.nilai != null) g += '<text class="ev" x="' + x + '" y="' + (y - 20) + '">' + esc(F ? F.val(nd.nilai, u, dp) : nd.nilai) + "</text>";
    })(b.pohon, 0);
    return '<div class="scroll"><svg class="pohon" viewBox="0 0 ' + W + " " + H + '" style="min-width:' + Math.min(W, 760) + 'px">' + g + "</svg></div>";
  }

  /* ---------- grafik sensitivitas ---------- */
  function garis(b) {
    var W = 560, H = 300, L = 70, R = 20, T = 18, B = 40;
    var ys = []; b.garis.forEach(function (g) { ys.push(g.b, g.slope + g.b); });
    var lo = Math.min.apply(null, ys.concat([0])), hi = Math.max.apply(null, ys.concat([0]));
    if (hi - lo < 1e-9) hi = lo + 1;
    function px(P) { return L + P * (W - L - R); } function py(v) { return T + (hi - v) / (hi - lo) * (H - T - B); }
    var F = window.SOLVER ? SOLVER.fmt : null, u = b.satuan || "";
    var col = ["#f6dd76", "#9fd3f7", "#f4a3b8", "#a8e6a1", "#f7b267"];
    var s = '<svg class="graf" viewBox="0 0 ' + W + " " + H + '">';
    s += '<line class="ax" x1="' + L + '" y1="' + py(0) + '" x2="' + (W - R) + '" y2="' + py(0) + '"/><line class="ax" x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (H - B) + '"/>';
    [0, 0.25, 0.5, 0.75, 1].forEach(function (P) { s += '<text class="tk" x="' + px(P) + '" y="' + (H - B + 18) + '">' + (F ? F.num(P) : P) + "</text>"; });
    [lo, (lo + hi) / 2, hi].forEach(function (v) { s += '<text class="tk l" x="' + (L - 6) + '" y="' + (py(v) + 4) + '">' + esc(F ? F.val(v, u, 0) : v) + "</text>"; });
    (b.titik || []).forEach(function (P) { s += '<line class="tt" x1="' + px(P) + '" y1="' + T + '" x2="' + px(P) + '" y2="' + (H - B) + '"/><text class="tk y" x="' + px(P) + '" y="' + (T + 10) + '">P=' + (F ? F.num(P, 3) : P) + "</text>"; });
    b.garis.forEach(function (g, i) {
      s += '<line class="gl" style="stroke:' + col[i % col.length] + '" x1="' + px(0) + '" y1="' + py(g.b) + '" x2="' + px(1) + '" y2="' + py(g.slope + g.b) + '"/>';
      s += '<text class="glab" style="fill:' + col[i % col.length] + '" x="' + (px(1) - 4) + '" y="' + (py(g.slope + g.b) - 6 - i * 0) + '">' + esc(b.alt[i]) + "</text>";
    });
    s += '<text class="tk" x="' + (W - R) + '" y="' + (H - 6) + '">P</text>';
    return '<div class="scroll"><div class="graf-wrap">' + s + "</svg></div></div>";
  }

  function blok(b) {
    switch (b.t) {
      case "tabel": return tabel(b);
      case "rumus": return rumus(b);
      case "tp": return tp(b);
      case "asg": return asg(b);
      case "pohon": return pohon(b);
      case "garis": return garis(b);
      case "teks": return '<p class="bt">' + esc(b.isi) + "</p>";
      case "hasil": return '<div class="hasil">' + esc(b.isi) + "</div>";
      case "catatan": return '<div class="cat-box ' + (b.jenis === "jebakan" ? "jebakan" : "info") + '">' + esc(b.isi) + "</div>";
    }
    return "";
  }
  function papan(blocks) { return blocks.map(blok).join(""); }

  window.RENDER = { blok: blok, papan: papan, drawJalur: drawJalur, esc: esc };
})();
