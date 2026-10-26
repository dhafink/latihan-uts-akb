// player.js — pemutar animasi langkah (papan kapur) untuk hasil solver.js.
(function () {
  "use strict";
  var esc = function (s) { return window.RENDER.esc(s); };
  var VOICE = null, ACTIVE = [];
  function pickVoice() {
    if (!("speechSynthesis" in window)) return null;
    var vs = window.speechSynthesis.getVoices() || [];
    return vs.filter(function (v) { return /^id([-_]|$)/i.test(v.lang); })[0] || null;
  }
  if ("speechSynthesis" in window) {
    VOICE = pickVoice();
    window.speechSynthesis.addEventListener && window.speechSynthesis.addEventListener("voiceschanged", function () {
      VOICE = pickVoice(); ACTIVE.forEach(function (p) { p.refreshVoice(); });
    });
  }
  function stopSpeech() { try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch (e) {} }

  // animasi "ditulis kapur": elemen papan muncul bergantian
  function animate(board) {
    var els = board.querySelectorAll(".tb td, .tb th, .rl, .hasil, .cat-box, svg.pohon .ev, svg.pohon .on, .graf .gl");
    var d = 0;
    Array.prototype.forEach.call(els, function (e) {
      e.style.animationDelay = Math.min(d, 900) + "ms";
      e.classList.add("chalk");
      d += e.className && /k-|on|ev|hasil|rl/.test(e.className.baseVal || e.className) ? 70 : 12;
    });
  }

  function mount(el, steps, opt) {
    opt = opt || {};
    var N = steps.length;
    var st = { i: Math.min(opt.mulai || 0, N - 1), play: false, speed: 1, suara: false, timer: null, semua: !!opt.semua };
    el.innerHTML =
      '<div class="player" tabindex="0">' +
      '<div class="pl-top"><span class="pl-pos"></span><span class="chip pl-bag" hidden></span></div>' +
      '<h4 class="pl-judul"></h4>' +
      '<div class="pl-board board"></div>' +
      '<div class="pl-narasi"></div>' +
      '<div class="pl-ctrl">' +
        '<button type="button" class="pbtn" data-a="awal" title="Ke langkah pertama" aria-label="Ke langkah pertama">⏮</button>' +
        '<button type="button" class="pbtn" data-a="prev" title="Langkah sebelumnya" aria-label="Langkah sebelumnya">◀</button>' +
        '<button type="button" class="pbtn play" data-a="play" title="Putar otomatis">▶ Putar</button>' +
        '<button type="button" class="pbtn" data-a="next" title="Langkah berikutnya" aria-label="Langkah berikutnya">▶</button>' +
        '<button type="button" class="pbtn" data-a="akhir" title="Ke langkah terakhir" aria-label="Ke langkah terakhir">⏭</button>' +
        '<select class="pl-speed" aria-label="Kecepatan"><option value="0.75">0,75×</option><option value="1" selected>1×</option><option value="1.5">1,5×</option><option value="2">2×</option></select>' +
        '<label class="pl-voice" hidden><input type="checkbox"> Suara</label>' +
        '<button type="button" class="link pl-all" data-a="semua"></button>' +
      "</div>" +
      '<div class="pl-dots" role="tablist"></div>' +
      '<div class="pl-list" hidden></div>' +
      "</div>";
    var root = el.querySelector(".player"), board = root.querySelector(".pl-board");
    var dots = root.querySelector(".pl-dots");
    for (var k = 0; k < N; k++) {
      var b = document.createElement("button"); b.type = "button"; b.className = "dot"; b.title = "Langkah " + (k + 1) + ": " + steps[k].judul;
      b.setAttribute("aria-label", b.title); b.setAttribute("data-i", k); dots.appendChild(b);
    }
    function refreshVoice() { root.querySelector(".pl-voice").hidden = !VOICE; }
    refreshVoice();

    function render() {
      var s = steps[st.i];
      root.querySelector(".pl-pos").textContent = "Langkah " + (st.i + 1) + " / " + N;
      var bag = root.querySelector(".pl-bag"); bag.hidden = !s.bagian; bag.textContent = s.bagian || "";
      root.querySelector(".pl-judul").textContent = s.judul;
      board.innerHTML = window.RENDER.papan(s.papan);
      root.querySelector(".pl-narasi").textContent = s.narasi;
      Array.prototype.forEach.call(dots.children, function (d, j) { d.classList.toggle("on", j === st.i); d.classList.toggle("done", j < st.i); });
      root.querySelector('[data-a="prev"]').disabled = st.i === 0;
      root.querySelector('[data-a="awal"]').disabled = st.i === 0;
      root.querySelector('[data-a="next"]').disabled = st.i === N - 1;
      root.querySelector('[data-a="akhir"]').disabled = st.i === N - 1;
      animate(board);
      requestAnimationFrame(function () { window.RENDER.drawJalur(board); });
      if (opt.onStep) opt.onStep(st.i);
    }
    function renderAll() {
      var list = root.querySelector(".pl-list"), h = "";
      steps.forEach(function (s, j) {
        h += '<section class="pl-item"><div class="pl-top"><span class="pl-pos">Langkah ' + (j + 1) + " / " + N + "</span>" + (s.bagian ? '<span class="chip">' + esc(s.bagian) + "</span>" : "") +
          '</div><h4 class="pl-judul">' + esc(s.judul) + '</h4><div class="board">' + window.RENDER.papan(s.papan) + '</div><p class="pl-narasi">' + esc(s.narasi) + "</p></section>";
      });
      list.innerHTML = h;
      requestAnimationFrame(function () { window.RENDER.drawJalur(list); });
    }
    function setMode() {
      root.classList.toggle("mode-semua", st.semua);
      root.querySelector(".pl-list").hidden = !st.semua;
      root.querySelector(".pl-all").textContent = st.semua ? "Kembali ke mode putar" : "Tampilkan semua langkah";
      if (st.semua) { stop(); renderAll(); } else render();
    }
    function go(i) { st.i = Math.max(0, Math.min(N - 1, i)); stopSpeech(); render(); if (st.play) schedule(); }
    function stop() {
      st.play = false; clearTimeout(st.timer); stopSpeech();
      var pb = root.querySelector('[data-a="play"]'); pb.textContent = "▶ Putar"; pb.classList.remove("on");
    }
    function schedule() {
      clearTimeout(st.timer);
      var s = steps[st.i];
      var next = function () { if (!st.play) return; if (st.i < N - 1) go(st.i + 1); else stop(); };
      if (st.suara && VOICE) {
        stopSpeech();
        var u = new SpeechSynthesisUtterance(s.judul + ". " + s.narasi.replace(/×/g, " kali ").replace(/−/g, " minus ").replace(/→/g, ", "));
        u.voice = VOICE; u.lang = VOICE.lang; u.rate = Math.min(1.6, 0.95 * st.speed);
        u.onend = function () { st.timer = setTimeout(next, 700); };
        window.speechSynthesis.speak(u);
      } else {
        var ms = Math.max(3800, (s.narasi.length + s.judul.length) * 55) / st.speed;
        st.timer = setTimeout(next, ms);
      }
    }
    function play() {
      if (st.play) { stop(); return; }
      if (st.i === N - 1) go(0);
      st.play = true;
      var pb = root.querySelector('[data-a="play"]'); pb.textContent = "❚❚ Jeda"; pb.classList.add("on");
      schedule();
    }
    root.addEventListener("click", function (e) {
      var t = e.target.closest("[data-a],[data-i]"); if (!t || !root.contains(t)) return;
      if (t.hasAttribute("data-i")) { go(+t.getAttribute("data-i")); return; }
      var a = t.getAttribute("data-a");
      if (a === "prev") go(st.i - 1); else if (a === "next") go(st.i + 1);
      else if (a === "awal") go(0); else if (a === "akhir") go(N - 1);
      else if (a === "play") play();
      else if (a === "semua") { st.semua = !st.semua; setMode(); }
    });
    root.querySelector(".pl-speed").addEventListener("change", function (e) { st.speed = +e.target.value; if (st.play) schedule(); });
    root.querySelector(".pl-voice input").addEventListener("change", function (e) { st.suara = e.target.checked; if (!st.suara) stopSpeech(); if (st.play) schedule(); });
    root.addEventListener("keydown", function (e) {
      if (e.target.tagName === "SELECT" || e.target.tagName === "INPUT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(st.i + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(st.i - 1); }
      else if (e.key === " ") { e.preventDefault(); play(); }
    });
    var onResize = function () { window.RENDER.drawJalur(root); };
    window.addEventListener("resize", onResize);
    var api = { go: go, stop: stop, refreshVoice: refreshVoice, el: root, destroy: function () { stop(); window.removeEventListener("resize", onResize); ACTIVE = ACTIVE.filter(function (p) { return p !== api; }); } };
    ACTIVE.push(api);
    setMode();
    return api;
  }
  function stopAll() { ACTIVE.slice().forEach(function (p) { p.destroy(); }); stopSpeech(); }

  window.PLAYER = { mount: mount, stopAll: stopAll, adaSuara: function () { return !!VOICE; } };
})();
