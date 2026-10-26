@echo off
REM Menjalankan situs latihan di komputer sendiri (butuh Python), lalu buka http://localhost:8767
cd /d "%~dp0"
start "" http://localhost:8767
python -m http.server 8767
