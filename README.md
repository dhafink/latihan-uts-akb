# Latihan UTS AKB

Situs belajar UTS **Analisa Kuantitatif Bisnis** (Manajemen UNPAR) bergaya papan tulis kapur.
Cakupan: Decision Analysis, AHP, Transportasi, dan Assignment.

**Buka situsnya:** https://dhafink.github.io/latihan-uts-akb/

| Menu | Isi |
|---|---|
| Modul | Penjelasan lengkap per metode: gambaran, istilah, rumus, langkah, contoh yang bisa diputar langkah demi langkah, variasi, jebakan, cek pemahaman, dan cara menulis jawaban di lembar ujian. Ada lembar rumus yang bisa dicetak. |
| Video | Video ilustrasi papan kapur bernarasi untuk setiap metode. |
| Pembahasan Soal Dosen | Latihan Decision Analysis, PR AKB, dan Tugas Assignment, dibahas langkah demi langkah. |
| Kuis | 80 soal pilihan ganda (konsep + hitungan cepat) dengan pembahasan setiap opsi. |
| Latihan Hitung | 16 soal cerita gaya UTS. Isi jawaban akhir, lalu putar langkah penyelesaiannya. |
| Kalkulator | Ketik soal sendiri (misalnya dari buku), lalu lihat langkah penyelesaiannya. |

Semua tabel, langkah, dan kunci jawaban dihitung oleh satu mesin hitung (`solver.js`), lalu diuji silang dengan angka di slide/buku dan dengan scipy.
Kunci AHP memakai RI versi kelas (0,52 untuk n = 3; 0,89 untuk n = 4; batas CR 0,05 / 0,08 / 0,10). Versi buku Render (RI 0,58 / 0,90, batas 0,10) ditulis sebagai catatan.

Progres modul, riwayat kuis, dan jawaban latihan tersimpan di browser masing-masing. Tidak perlu akun.
Soal-soal ini adalah bahan latihan, bukan bocoran soal ujian. Tetap cocokkan dengan materi kuliah.

## Menjalankan di komputer sendiri
Double-click `jalankan.bat` (butuh Python), lalu buka http://localhost:8767.

## Struktur
- `solver.js`: mesin hitung (Decision Analysis, AHP, transportasi NWC/VAM/stepping stone/MODI, Hungarian) yang menghasilkan langkah-langkah.
- `render.js`, `player.js`: menggambar papan dan memutar langkah.
- `app.js`, `kalkulator.js`, `index.html`, `style.css`: tampilan situs.
- `modul/`: isi modul per topik dan lembar rumus.
- `data/`: pembahasan soal dosen, kuis (`t1`–`t4`), latihan hitung (`hitung_t1`–`t4`), daftar video.
- `video/`: video MP4 dan poster.

## Mengecek setelah mengedit
```
node uji/uji_solver.js   # angka solver vs contoh di slide/buku
node cek_soal.js --ketat # struktur isi + semua kunci dihitung ulang dengan solver
```
Halaman `uji/pratinjau.html?c=exec` menampilkan semua langkah satu contoh sekaligus.
