# PAPS — Platform Akademik Penalaran Sinonim

Web app untuk persiapan Tes Potensi Akademik (TPA), fokus pada **Penalaran Verbal** — dimulai dari **Sinonim**.

## Fitur

| Mode | Fungsi |
|------|--------|
| **Flashcard** | Kartu belajar kata & sinonim (klik untuk balik) |
| **Quiz** | 10 soal acak + timer + skor akhir |
| **Latihan** | Semua soal, sistem ronde berulang untuk jawaban salah sampai benar semua |

### Fitur Pendukung
- **Tracking Kata Lemah** — kata yang sering salah tercatat, ditampilkan di Beranda, bisa diklik ke flashcard
- **Progress Tersimpan** — progress latihan otomatis ke localStorage (tahan refresh/hilang halaman)
- **Multi Paket** — pilih paket soal sebelum mulai (siap untuk Paket 2, 3, dst.)

## Tech Stack

- **Vite** + **React** + **Tailwind CSS v4**
- **react-router-dom** (routing SPA)
- Data: file JSON lokal (`src/data/`)
- Persistence: localStorage

## Struktur Folder

```
PAPS/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              # Entry + BrowserRouter
│   ├── App.jsx                # Routing
│   ├── index.css              # Tailwind import
│   ├── data/
│   │   ├── paket.js           # Registry semua paket soal
│   │   ├── paket1.json        # 412 soal sinonim
│   │   └── stats.js           # Tracker kata lemah (localStorage)
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Card.jsx           # Flip card
│   │   ├── Timer.jsx
│   │   ├── ScoreDisplay.jsx
│   │   └── PackagePicker.jsx  # Pemilih paket soal
│   ├── pages/
│   │   ├── Home.jsx           # Dashboard + kata lemah
│   │   ├── Flashcard.jsx      # Mode flashcard
│   │   ├── Quiz.jsx           # Mode quiz + timer
│   │   └── Latihan.jsx        # Mode latihan dengan ronde
│   └── hooks/
│       └── useTimer.js
└── memory/
    └── DESIGN.md              # Dokumen desain awal
```

## Cara Pakai

```bash
npm install
npm run dev        # development server → http://localhost:5173
npm run build      # build production → dist/
```

## Menambah Paket Baru

1. Taruh file JSON di `src/data/paket2.json`
2. Buka `src/data/paket.js` dan tambah:
   ```js
   import paket2 from './paket2.json'
   // di array:
   { id: 'paket2', name: 'Paket 2', data: paket2, desc: 'N soal ...' }
   ```

Format JSON:
```json
[
  { "kata": "Abolisi", "sinonim": "Penghapusan Hukuman" },
  { "kata": "Abrasi", "sinonim": "Pengikisan" }
]
```

## Lisensi

Hak cipta © 2026 — Dibuat untuk persiapan TPA S2 pribadi.
