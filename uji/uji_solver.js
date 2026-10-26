// Uji regresi solver.js terhadap angka di slide dan buku: node uji/uji_solver.js
const S = require("../solver.js");
let gagal = 0, lulus = 0;
function cek(nama, dapat, harap, tol) {
  tol = tol == null ? 1e-6 : tol;
  const ok = typeof harap === "number" ? Math.abs(dapat - harap) <= tol : JSON.stringify(dapat) === JSON.stringify(harap);
  if (ok) lulus++; else { gagal++; console.log("GAGAL  " + nama + "\n   dapat: " + JSON.stringify(dapat) + "\n   harap: " + JSON.stringify(harap)); }
}
const names = (r, alt) => r.idx.map(i => alt[i]);

/* ---------- Decision Analysis ---------- */
const thompson = { alt: ["Pabrik besar", "Pabrik kecil", "Tidak membangun"], state: ["Pasar baik", "Pasar buruk"],
  payoff: [[200000, -180000], [100000, -20000], [0, 0]], goal: "max", alpha: 0.8, satuan: "$" };
let u = S.DA.ketidakpastian(thompson);
cek("Thompson maximax", names(u.keputusan.optimis, thompson.alt), ["Pabrik besar"]);
cek("Thompson maximin", names(u.keputusan.pesimis, thompson.alt), ["Tidak membangun"]);
cek("Thompson hurwicz nilai", u.keputusan.realisme.nilai, 124000);
cek("Thompson laplace", names(u.keputusan.laplace, thompson.alt), ["Pabrik kecil"]);
cek("Thompson regret", u.keputusan.regret.nilai, 100000);
let r = S.DA.risiko(Object.assign({}, thompson, { prob: [0.5, 0.5] }));
cek("Thompson EMV kecil", r.emv[1], 40000);
cek("Thompson EVwPI", r.evwpi, 100000);
cek("Thompson EVPI", r.evpi, 60000);
cek("Thompson EOL min", r.eolMin.nilai, 60000);
let sens = S.DA.sensitivitas(thompson);
cek("Thompson titik 1", +sens.titik[0].P.toFixed(3), 0.167);
cek("Thompson titik 2", +sens.titik[1].P.toFixed(3), 0.615);
cek("Thompson rentang", sens.rentang.map(g => thompson.alt[g.alt]), ["Tidak membangun", "Pabrik kecil", "Pabrik besar"]);

const copier = { alt: ["Mesin A", "Mesin B", "Mesin C"], state: ["10.000", "20.000", "30.000"],
  payoff: [[950, 1050, 1150], [850, 1100, 1350], [700, 1000, 1300]], goal: "min", alpha: 0.7, satuan: "$" };
u = S.DA.ketidakpastian(copier);
cek("Fotokopi optimis", names(u.keputusan.optimis, copier.alt), ["Mesin C"]);
cek("Fotokopi pesimis", names(u.keputusan.pesimis, copier.alt), ["Mesin A"]);
cek("Fotokopi hurwicz", u.keputusan.realisme.nilai, 880);
cek("Fotokopi laplace", u.keputusan.laplace.nilai, 1000);
cek("Fotokopi regret", [names(u.keputusan.regret, copier.alt), u.keputusan.regret.nilai], [["Mesin C"], 150]);
r = S.DA.risiko(Object.assign({}, copier, { prob: [0.4, 0.3, 0.3] }));
cek("Fotokopi EMV C", r.emv[2], 970);
cek("Fotokopi EVwPI", r.evwpi, 925);
cek("Fotokopi EVPI", r.evpi, 45);
cek("Fotokopi EOL C", r.eol[2], 45);

let sv = S.DA.survei(Object.assign({}, thompson, { prior: [0.5, 0.5],
  survei: { label: "Survei", biaya: 10000, hasil: ["Positif", "Negatif"], likelihood: [[0.7, 0.3], [0.2, 0.8]], bulat: 2 } }));
cek("Thompson P(positif)", sv.pHasil[0], 0.45);
cek("Thompson posterior", sv.posterior, [[0.78, 0.22], [0.27, 0.73]]);
cek("Thompson EV dengan SI", sv.evDenganSI, 49200, 1e-6);
cek("Thompson EV tanpa SI", sv.evTanpaSI, 40000);
cek("Thompson EVSI", sv.evsi, 19200, 1e-6);
cek("Thompson efisiensi", +sv.efisiensi.toFixed(2), 0.32);
const t = sv.pohon;
cek("Thompson simpul 2", t.cabang[0].ke.cabang[0].ke.cabang[0].ke.nilai, 106400, 1e-6);
cek("Thompson simpul 5", t.cabang[0].ke.cabang[1].ke.cabang[1].ke.nilai, 2400, 1e-6);

const monica = { alt: ["Fasilitas kecil", "Fasilitas besar", "Tanpa fasilitas"], state: ["Pasar baik", "Pasar buruk"],
  payoff: [[60000, -20000], [90000, -30000], [0, 0]], prior: [0.6, 0.4], goal: "max", satuan: "$",
  survei: { label: "Studi", biaya: 10000, hasil: ["Studi baik", "Studi buruk"], pHasil: [0.65, 0.35], posterior: [[0.8, 0.2], [0.1, 0.9]] } };
sv = S.DA.survei(monica);
cek("Monica EV tanpa", sv.evTanpaSI, 42000);
cek("Monica EV studi", sv.evDenganSI, 32900, 1e-6);
cek("Monica EVSI", sv.evsi, 900, 1e-6);

const golf = S.DA.bayes({ state: ["Sukses", "Gagal"], prior: [0.4, 0.6], hasil: ["Survei baik", "Survei buruk"], likelihood: [[0.9, 0.1], [0.2, 0.8]] });
cek("Golf P(sukses|baik)", golf.posterior[0][0], 0.75);
cek("Golf P(baik)", golf.pHasil[0], 0.48);

const mark = S.DA.pohon({ jenis: "keputusan", cabang: [
  { label: "Main", ke: { jenis: "peluang", cabang: [{ label: "Menang", p: 0.45, ke: { jenis: "akhir", nilai: 0.30 } }, { label: "Kalah", p: 0.55, ke: { jenis: "akhir", nilai: 0.05 } }] } },
  { label: "Tidak main", ke: { jenis: "akhir", nilai: 0.15 } }] }, { goal: "max", utilitas: true });
cek("Mark utilitas", mark.nilai, 0.1625, 1e-9);

/* ---------- AHP ---------- */
const third = 1 / 3;
const car = S.AHP.lengkap({
  kriteria: ["Harga", "MPG", "Kenyamanan", "Gaya"],
  matKriteria: [[1, 3, 2, 2], [null, 1, 0.25, 0.25], [null, 4, 1, 0.5], [null, 4, 2, 1]],
  alternatif: ["Mobil A", "Mobil B", "Mobil C"],
  matAlternatif: [
    [[1, third, 0.25], [3, 1, 0.5], [4, 2, 1]],
    [[1, 0.25, 1 / 6], [4, 1, third], [6, 3, 1]],
    [[1, 2, 8], [0.5, 1, 6], [0.125, 1 / 6, 1]],
    [[1, third, 4], [3, 1, 7], [0.25, 1 / 7, 1]]] });
cek("Mobil bobot kriteria", car.kriteria.bobot.map(x => +x.toFixed(4)), [0.3982, 0.0851, 0.2179, 0.2988]);
cek("Mobil λmax", +car.kriteria.lambda.toFixed(2), 4.18);
cek("Mobil CR dosen (slide membulatkan CI ke 0,06 → 0,068)", +car.kriteria.CR.toFixed(3), 0.069);
cek("Mobil skor akhir", car.sintesis.total.map(x => +x.toFixed(3)), [0.265, 0.421, 0.314]);
cek("Mobil urutan", car.sintesis.urutan, [1, 2, 0]);
cek("Mobil harga bobot", car.alternatif[0].bobot.map(x => +x.toFixed(4)), [0.1226, 0.3202, 0.5571]);
const hw = S.AHP.matriks({ item: ["S1", "S2", "S3"], matriks: [[1, 3, 9], [null, 1, 6], [null, null, 1]] });
cek("Judy bobot", hw.bobot.map(x => +x.toFixed(4)), [0.6583, 0.2819, 0.0598]);
cek("Judy CI", +hw.CI.toFixed(3), 0.027);
cek("Judy CR buku", +hw.CRbuku.toFixed(3), 0.047);
const mfep = S.AHP.mfep({ faktor: ["Gaji", "Karier", "Lokasi"], bobot: [0.3, 0.6, 0.1], alternatif: ["AA", "EDS", "PW"], evaluasi: [[0.7, 0.9, 0.6], [0.8, 0.7, 0.8], [0.9, 0.6, 0.9]] });
cek("MFEP total", mfep.total.map(x => +x.toFixed(2)), [0.81, 0.74, 0.72]);

/* ---------- Transportasi ---------- */
const exec = { sumber: [{ nama: "Des Moines", kode: "D", supply: 100 }, { nama: "Evansville", kode: "E", supply: 300 }, { nama: "Fort Lauderdale", kode: "F", supply: 300 }],
  tujuan: [{ nama: "Albuquerque", kode: "A", demand: 300 }, { nama: "Boston", kode: "B", demand: 200 }, { nama: "Cleveland", kode: "C", demand: 200 }],
  biaya: [[5, 4, 3], [8, 4, 3], [9, 7, 5]], goal: "min", satuan: "$" };
let tp = S.TP.selesaikan(exec, { awal: "nwc", evaluasi: "stepping" });
cek("Exec NWC awal", tp.biayaAwal.c, 4200);
cek("Exec iter1 indeks", tp.iterasi[0].indeks, { "0,1": "+3", "0,2": "+4", "1,2": "+1", "2,0": "−2" });
cek("Exec iter2 indeks", tp.iterasi[1].indeks, { "0,1": "+3", "0,2": "+2", "1,2": "−1", "2,1": "+2" });
cek("Exec iter3 indeks", tp.iterasi[2].indeks, { "0,1": "+2", "0,2": "+2", "1,0": "+1", "2,1": "+1" });
cek("Exec optimal", tp.total.c, 3900);
cek("Exec alokasi", tp.A, [[100, null, null], [null, 200, 100], [200, null, 100]]);
tp = S.TP.selesaikan(exec, { awal: "nwc", evaluasi: "modi" });
cek("Exec MODI R K iter1", [tp.iterasi[0].R.map(x => x.c), tp.iterasi[0].K.map(x => x.c)], [[0, 3, 6], [5, 1, -1]]);
cek("Exec MODI R K iter3", [tp.iterasi[2].R.map(x => x.c), tp.iterasi[2].K.map(x => x.c)], [[0, 2, 4], [5, 2, 1]]);
cek("Exec MODI iter2 indeks (slide salah tulis)", tp.iterasi[1].indeks, { "0,1": "+3", "0,2": "+2", "1,2": "−1", "2,1": "+2" });
cek("Exec MODI optimal", tp.total.c, 3900);
tp = S.TP.selesaikan(exec, { awal: "vam", evaluasi: "modi" });
cek("Exec VAM awal", tp.biayaAwal.c, 3900);
cek("Exec VAM alokasi awal", tp.awal, [[100, null, null], [null, 200, 100], [200, null, 100]]);

const happy = { sumber: [{ nama: "Plant W", kode: "W", supply: 200 }, { nama: "Plant X", kode: "X", supply: 175 }, { nama: "Plant Y", kode: "Y", supply: 75 }],
  tujuan: [{ nama: "A", demand: 250 }, { nama: "B", demand: 100 }, { nama: "C", demand: 150 }], biaya: [[6, 4, 9], [10, 5, 8], [12, 7, 6]], goal: "min" };
tp = S.TP.selesaikan(happy, { awal: "nwc", tanpaOptimasi: true });
cek("Happy dummy baris", tp.P.dummyR, 3);
cek("Happy NWC awal", tp.biayaAwal.c, 2850);

const martin = { sumber: [{ nama: "Gudang 1", kode: "G1", supply: 100 }, { nama: "Gudang 2", kode: "G2", supply: 120 }, { nama: "Gudang 3", kode: "G3", supply: 80 }],
  tujuan: [{ nama: "Pelanggan 1", kode: "P1", demand: 100 }, { nama: "Pelanggan 2", kode: "P2", demand: 100 }, { nama: "Pelanggan 3", kode: "P3", demand: 100 }],
  biaya: [[8, 2, 6], [10, 9, 9], [7, 10, 7]], goal: "min" };
tp = S.TP.selesaikan(martin, { awal: "nwc", tanpaOptimasi: true });
cek("Martin NWC degenerasi", tp.awal, [[100, 0, null], [null, 100, 20], [null, null, 80]]);

const bag = { sumber: [{ nama: "Pabrik A", kode: "A", supply: 70 }, { nama: "Pabrik B", kode: "B", supply: 130 }, { nama: "Pabrik C", kode: "C", supply: 80 }],
  tujuan: [{ nama: "Gudang 1", kode: "1", demand: 150 }, { nama: "Gudang 2", kode: "2", demand: 80 }, { nama: "Gudang 3", kode: "3", demand: 50 }],
  biaya: [[8, 5, 16], [15, 10, 7], [3, 9, 10]], goal: "min" };
const bp = S.TP.siapkan(bag);
const bo = S.TP.optimalkan(bp, [[70, null, null], [50, 80, null], [30, null, 50]], "stepping");
cek("Bagwell indeks", bo.iterasi[0].indeks, { "0,1": "+2", "0,2": "+1", "1,2": "−15", "2,1": "+11" });
cek("Bagwell setelah pivot", bo.iterasi[0].A, [[70, null, null], [null, 80, 50], [80, null, 0]]);

const hard = { sumber: [{ nama: "Plant 1", kode: "1", supply: 70 }, { nama: "Plant 2", kode: "2", supply: 50 }, { nama: "Plant 3", kode: "3", supply: 30 }],
  tujuan: [{ nama: "Project A", kode: "A", demand: 40 }, { nama: "Project B", kode: "B", demand: 50 }, { nama: "Project C", kode: "C", demand: 60 }],
  biaya: [[10, 4, 11], [12, 5, 8], [9, 7, 6]], goal: "min" };
tp = S.TP.selesaikan(hard, { awal: "nwc", evaluasi: "stepping" });
cek("Hardrock awal = optimal", [tp.biayaAwal.c, tp.total.c, tp.iterasi.length], [1040, 1040, 1]);
cek("Hardrock indeks", tp.iterasi[0].indeks, { "0,2": "+4", "1,0": "+1", "2,0": "0", "2,1": "+4" });
cek("Hardrock optimal ganda", tp.optimalGanda, true);

/* ---------- Assignment ---------- */
const fix = { baris: ["Adams", "Brown", "Cooper"], kolom: ["Proyek 1", "Proyek 2", "Proyek 3"], nilai: [[11, 14, 6], [8, 10, 11], [9, 12, 7]], goal: "min", satuan: "$" };
let as = S.ASG.selesaikan(fix);
cek("Fix-It total", as.total, 25);
cek("Fix-It penempatan", as.penempatan, [[0, 2], [1, 1], [2, 0]]);
const fixLines = as.steps.filter(s => s.kunci === "tes-garis")[0].papan[0];
cek("Fix-It garis pertama", [fixLines.garisR, fixLines.garisK], [[false, true, false], [false, false, true]]);
const ships = { baris: ["Kapal 1", "Kapal 2", "Kapal 3", "Kapal 4"], kolom: ["A", "B", "C", "D"], nilai: [[20, 60, 50, 55], [60, 30, 80, 75], [80, 100, 90, 80], [65, 80, 75, 70]], goal: "max" };
as = S.ASG.selesaikan(ships);
cek("British total", as.total, 300);
cek("British penempatan", as.penempatan, [[0, 3], [1, 2], [2, 1], [3, 0]]);
const reloc = { baris: ["Jones", "Smith", "Wilson"], kolom: ["Omaha", "Miami", "Dallas", "New York"], nilai: [[800, 1100, 1200, 1000], [500, 1600, 1300, 800], [500, 1000, 2300, 1500]], goal: "min", satuan: "$" };
as = S.ASG.selesaikan(reloc);
cek("Relokasi total", as.total, 2400);
const davis = { baris: ["Adams", "Brown", "Cooper", "Davis"], kolom: ["P1", "P2", "P3"], nilai: [[11, 14, 6], [8, 10, 11], [9, 12, 7], [10, 13, 8]], goal: "min" };
as = S.ASG.selesaikan(davis);
cek("Davis total (Davis ke dummy)", as.total, 25);
const tugas1 = { baris: ["Jocelyn", "Ceasar", "Joseph", "Dio"], kolom: ["Tugas 1", "Tugas 2", "Tugas 3", "Tugas 4", "Tugas 5"],
  nilai: [[33, 28, 31, 31, 30], [23, 22, 28, 26, 22], [26, 32, "M", 24, 27], [24, 18, 21, 22, 23]], goal: "min", satuan: "hari" };
as = S.ASG.selesaikan(tugas1);
cek("Tugas 1 total", as.total, 95);
const tugas2 = { baris: ["Susy", "Katie", "Brando", "Elina", "Vlad"], kolom: ["Kebun 1", "Kebun 2", "Kebun 3", "Kebun 4"],
  nilai: [[81, 97, 89, 90], [72, 89, 77, 63], [92, 105, 89, 84], ["M", 76, 68, 90], [92, 101, 89, 86]], goal: "max", satuan: "kg" };
as = S.ASG.selesaikan(tugas2);
cek("Tugas 2 total", as.total, 376);

console.log(`\n${lulus} lulus, ${gagal} gagal`);
process.exit(gagal ? 1 : 0);
