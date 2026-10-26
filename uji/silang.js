// Ekspor semua soal transportasi & assignment di situs untuk diuji silang dengan scipy:
//   node uji/silang.js uji/silang.json && python -I uji/silang.py uji/silang.json
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: { MODUL: [], PEMBAHASAN: [], HITUNG: [], QUESTIONS: [], VIDEOS: [] }, console };
vm.createContext(ctx);
vm.runInContext("var module = undefined;", ctx);
const run = f => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
run("solver.js");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
[...html.matchAll(/<script src="((?:modul|data)\/[^"?]+)/g)].forEach(m => run(m[1]));
const W = ctx.window, S = W.SOLVER, out = [];
function add(tag, c) {
  if (!c || (c.metode !== "tp" && c.metode !== "asg")) return;
  if (c.opsi && c.opsi.tanpaOptimasi) return;
  const r = S.jalankan(c.metode, c.data, c.opsi);
  out.push({ tag, metode: c.metode, data: c.data, total: c.metode === "tp" ? r.total.c : r.total, m: c.metode === "tp" ? r.total.m : 0 });
}
W.MODUL.forEach(m => m.sub.forEach(s => { (s.contoh || []).forEach((c, i) => add(`modul ${m.id}/${s.id} contoh ${i + 1}`, c)); (s.variasi || []).forEach((v, i) => add(`modul ${m.id}/${s.id} variasi ${i + 1}`, v.contoh)); }));
W.PEMBAHASAN.forEach(p => (p.bagian || []).forEach((b, i) => add(`pembahasan ${p.id} bagian ${i + 1}`, b)));
W.HITUNG.forEach(x => (x.bagian || []).forEach((b, i) => add(`${x.id} bagian ${i + 1}`, b)));
W.QUESTIONS.forEach(q => q.cekNilai && add(`kuis ${q.id}`, q.cekNilai));
fs.writeFileSync(process.argv[2] || path.join(__dirname, "silang.json"), JSON.stringify(out));
console.log(out.length + " soal diekspor");
