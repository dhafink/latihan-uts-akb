// Validasi isi situs: node cek_soal.js   (tambahkan --ketat untuk mewajibkan jumlah soal sesuai target)
// Mengecek struktur modul, pembahasan, latihan hitung, kuis, dan menjalankan SEMUA contoh lewat solver.js.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const KETAT = process.argv.includes("--ketat");

const ctx = { window: { MODUL: [], PEMBAHASAN: [], HITUNG: [], QUESTIONS: [], VIDEOS: [] }, console };
ctx.globalThis = ctx;
vm.createContext(ctx);
const run = f => vm.runInContext(fs.readFileSync(path.join(__dirname, f), "utf8"), ctx, { filename: f });
// solver.js memasang dirinya ke window bila tidak ada module
vm.runInContext("var module = undefined;", ctx);
run("solver.js");
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script src="((?:modul|data)\/[^"?]+)/g)].map(m => m[1]);
scripts.forEach(run);
const W = ctx.window, S = W.SOLVER;
const errors = [], warn = [];
const TARGET = { 1: 24, 2: 16, 3: 20, 4: 20 };
const SRC = ["slide", "buku", "soal-dosen", "latihan"];

function get(obj, p) { return p.split(".").reduce((o, k) => (o == null ? o : o[k]), obj); }
function jalan(tag, c) {
  try {
    const r = S.jalankan(c.metode, c.data, c.opsi);
    if (!r.steps || !r.steps.length) errors.push(`${tag}: solver tidak menghasilkan langkah`);
    JSON.stringify(r.steps);
    return r;
  } catch (e) { errors.push(`${tag}: solver gagal — ${e.message}`); return null; }
}

/* ---------- modul ---------- */
const modulPaths = new Set();
let nContoh = 0;
const vids = new Set(W.VIDEOS.map(v => v.id));
W.MODUL.forEach(m => {
  if (!m.id || !m.topik || !Array.isArray(m.sub)) { errors.push(`modul ${m.id}: struktur salah`); return; }
  modulPaths.add(m.id);
  m.sub.forEach(s => {
    const tag = `modul ${m.id}/${s.id}`;
    modulPaths.add(m.id + "/" + s.id);
    ["judul", "ringkas", "gambaran", "ringkasan", "lembar"].forEach(k => { if (!s[k]) errors.push(`${tag}: ${k} kosong`); });
    if (!Array.isArray(s.istilah) || s.istilah.length < 2) errors.push(`${tag}: istilah minimal 2`);
    if (!Array.isArray(s.langkah) || s.langkah.length < 3) errors.push(`${tag}: langkah minimal 3`);
    if (!Array.isArray(s.contoh) || !s.contoh.length) errors.push(`${tag}: belum ada contoh`);
    if (!Array.isArray(s.jebakan) || s.jebakan.length < 3) errors.push(`${tag}: jebakan minimal 3`);
    if (!Array.isArray(s.cek) || s.cek.length < 2) errors.push(`${tag}: cek pemahaman minimal 2`);
    if (s.video && !vids.has(s.video)) errors.push(`${tag}: video ${s.video} tidak ada di data/video.js`);
    (s.contoh || []).forEach((c, i) => { nContoh++; if (!c.soal) errors.push(`${tag} contoh ${i + 1}: soal kosong`); jalan(`${tag} contoh ${i + 1}`, c); });
    (s.variasi || []).forEach((v, i) => { if (v.contoh) { nContoh++; jalan(`${tag} variasi ${i + 1}`, v.contoh); } });
  });
});
W.VIDEOS.forEach(v => { if (v.modul && !modulPaths.has(v.modul)) warn.push(`video ${v.id}: modul ${v.modul} belum ada`); });

/* ---------- pembahasan ---------- */
const pids = new Set();
W.PEMBAHASAN.forEach(p => {
  const tag = `pembahasan ${p.id}`;
  if (pids.has(p.id)) errors.push(`${tag}: ID duplikat`); pids.add(p.id);
  ["grup", "judul", "soal", "jawaban"].forEach(k => { if (!p[k]) errors.push(`${tag}: ${k} kosong`); });
  if (p.modul && !modulPaths.has(p.modul)) errors.push(`${tag}: modul ${p.modul} tidak ada`);
  (p.bagian || []).forEach((b, i) => { nContoh++; const r = jalan(`${tag} bagian ${i + 1}`, b); cekKunci(`${tag} bagian ${i + 1}`, r, b.kunciCek); });
});
function cekKunci(tag, r, list) {
  if (!r || !list) return;
  list.forEach(k => {
    const v = get(r, k.path);
    const ok = typeof k.nilai === "number" ? Math.abs(v - k.nilai) <= (k.tol || 1e-6) : JSON.stringify(v) === JSON.stringify(k.nilai);
    if (!ok) errors.push(`${tag}: ${k.path} = ${JSON.stringify(v)}, kunci tertulis ${JSON.stringify(k.nilai)}`);
  });
}

/* ---------- latihan hitung ---------- */
const hids = new Set();
W.HITUNG.forEach(x => {
  const tag = x.id || "(hitung tanpa id)";
  if (hids.has(x.id)) errors.push(`${tag}: ID duplikat`); hids.add(x.id);
  if (!/^H[1-4]-\d{2}$/.test(x.id)) errors.push(`${tag}: format ID salah`);
  if (+String(x.id).slice(1, 2) !== x.topik) errors.push(`${tag}: topik tidak cocok`);
  if (x.modul && !modulPaths.has(x.modul)) errors.push(`${tag}: modul ${x.modul} tidak ada`);
  const res = (x.bagian || []).map((b, i) => { nContoh++; return jalan(`${tag} bagian ${i + 1}`, b); });
  (x.tanya || []).forEach(q => {
    if (q.tipe === "pilih") { if (!q.opsi || q.opsi.indexOf(q.kunci) === -1) errors.push(`${tag}(${q.id}): kunci tidak ada di opsi`); }
    else if (typeof q.kunci !== "number") errors.push(`${tag}(${q.id}): kunci harus angka`);
    if (q.dari) {
      const r = res[q.dari.bagian || 0];
      let v = r ? get(r, q.dari.path) : undefined;
      if (q.dari.nama && v != null) v = [].concat(v).map(i => q.dari.nama[i]);   // indeks alternatif → nama
      const ok = q.tipe === "pilih" ? v === q.kunci || (Array.isArray(v) && v.indexOf(q.kunci) !== -1) : Math.abs(v - q.kunci) <= (q.tol != null ? q.tol : 1e-6);
      if (!ok) errors.push(`${tag}(${q.id}): solver ${q.dari.path} = ${JSON.stringify(v)}, kunci ${JSON.stringify(q.kunci)}`);
    } else warn.push(`${tag}(${q.id}): kunci tidak diverifikasi solver (tidak ada "dari")`);
  });
});

/* ---------- kuis pilihan ganda ---------- */
const ids = new Set(), perTopic = {}, levels = {}, srcCount = {}, answerPos = [0, 0, 0, 0];
let calc = 0;
W.QUESTIONS.forEach(q => {
  const tag = q.id || "(tanpa id)";
  if (ids.has(q.id)) errors.push(`${tag}: ID duplikat`); ids.add(q.id);
  if (!/^T[1-4]-\d{2}$/.test(q.id)) errors.push(`${tag}: format ID salah`);
  if (+String(q.id).slice(1, 2) !== q.topic) errors.push(`${tag}: topic tidak cocok dengan ID`);
  if (!["konsep", "aplikasi", "kasus"].includes(q.level)) errors.push(`${tag}: level tidak dikenal (${q.level})`);
  if (!SRC.includes(q.src)) errors.push(`${tag}: src tidak dikenal (${q.src})`);
  if (!q.q || !q.q.trim()) errors.push(`${tag}: teks soal kosong`);
  if (/menurut (materi|slide|dosen|buku)|berdasarkan (materi|slide)/i.test(q.q)) errors.push(`${tag}: teks soal menyebut sumber (gaya soal)`);
  if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`${tag}: harus 4 opsi`);
  else if (new Set(q.options).size !== 4) errors.push(`${tag}: ada opsi kembar`);
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push(`${tag}: answer tidak valid`);
  if (!q.explain || q.explain.length < 40) errors.push(`${tag}: pembahasan terlalu pendek/kosong`);
  if (!Array.isArray(q.why) || q.why.length !== 4) errors.push(`${tag}: why harus 4 elemen`);
  else q.why.forEach((w, i) => {
    if (i === q.answer && w) errors.push(`${tag}: why[${i}] harus null (jawaban benar)`);
    if (i !== q.answer && !w) errors.push(`${tag}: why[${i}] kosong`);
  });
  if (q.level === "kasus" && !q.ctx) errors.push(`${tag}: soal kasus tanpa ctx`);
  if (q.lihat && !modulPaths.has(q.lihat)) errors.push(`${tag}: lihat "${q.lihat}" bukan subbab modul`);
  if (q.papan) { try { JSON.stringify(q.papan); } catch (e) { errors.push(`${tag}: papan tidak valid`); } }
  if (q.cekNilai) {
    calc++;
    const c = q.cekNilai, r = jalan(tag, c);
    if (r) {
      const v = get(r, c.path);
      const F = S.fmt, s = c.format === "num" ? F.num(v, c.dp) : c.format === "fix" ? F.fix(v, c.dp) : c.format === "pct" ? F.pct(v, c.dp) : c.format === "raw" ? String(v) : F.val(v, c.satuan || "", c.dp);
      if (q.options && !String(q.options[q.answer]).includes(s)) errors.push(`${tag}: jawaban benar harus memuat "${s}" (hasil solver ${c.path})`);
      q.options && q.options.forEach((o, i) => { if (i !== q.answer && String(o).includes(s) && !c.bolehSama) errors.push(`${tag}: opsi salah ${i} juga memuat "${s}"`); });
    }
  }
  perTopic[q.topic] = (perTopic[q.topic] || 0) + 1;
  if (q.answer >= 0 && q.answer < 4) answerPos[q.answer]++;
  levels[q.level] = (levels[q.level] || 0) + 1;
  srcCount[q.src] = (srcCount[q.src] || 0) + 1;
});
if (KETAT) for (const t of Object.keys(TARGET)) if ((perTopic[t] || 0) !== TARGET[t]) errors.push(`Kuis topik ${t}: ${perTopic[t] || 0} soal (target ${TARGET[t]})`);

console.log(`Modul          : ${W.MODUL.length} topik, ${W.MODUL.reduce((n, m) => n + m.sub.length, 0)} subbab`);
console.log(`Contoh solver  : ${nContoh} dijalankan`);
console.log(`Video          : ${W.VIDEOS.length} (${W.VIDEOS.filter(v => v.ada).length} sudah ada)`);
console.log(`Pembahasan     : ${W.PEMBAHASAN.length}`);
console.log(`Latihan hitung : ${W.HITUNG.length} soal`);
console.log(`Kuis PG        : ${W.QUESTIONS.length} soal · ${Object.entries(perTopic).map(([t, n]) => `T${t}=${n}`).join("  ")} · hitungan dicek solver: ${calc}`);
if (W.QUESTIONS.length) {
  console.log(`Level PG       : ${Object.entries(levels).map(([l, n]) => `${l}=${n}`).join("  ")}`);
  console.log(`Sumber         : ${Object.entries(srcCount).map(([s, n]) => `${s}=${n}`).join("  ")}`);
  console.log(`Posisi kunci   : A=${answerPos[0]} B=${answerPos[1]} C=${answerPos[2]} D=${answerPos[3]} (diacak lagi saat tampil)`);
}
if (warn.length) { console.log(`\n${warn.length} catatan:`); warn.forEach(w => console.log(" · " + w)); }
if (errors.length) { console.log(`\n${errors.length} masalah:`); errors.forEach(e => console.log(" - " + e)); process.exit(1); }
console.log("\nOK — semua valid.");
