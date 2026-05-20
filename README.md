# 🕌 Baitul SmartFlow

**Sistem Manajemen Masjid Modern** — Dibangun dengan MERN Stack (MongoDB, Express.js, React, Node.js)

## ✨ Fitur

| Modul | Deskripsi |
|---|---|
| 🔐 **Auth** | Registrasi, Login JWT, Role-based (Admin / Jamaah) |
| 💰 **Kas / Infaq** | Catat pemasukan & pengeluaran, ringkasan keuangan |
| 🤲 **Zakat** | Pembayaran zakat (Fitrah/Maal), verifikasi admin, distribusi ke mustahik |
| 📦 **Inventaris** | CRUD aset masjid, tracking kondisi |
| 🐄 **Qurban** | Stok hewan, pendaftaran peserta, status pembayaran |
| 📊 **Dashboard** | Grafik arus kas, statistik zakat |

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** running locally atau MongoDB Atlas URI

### 1. Clone & Install

```bash
git clone https://github.com/tsaqibfs/baitul-smartflow.git
cd baitul-smartflow

# Install semua dependencies
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Setup Environment

```bash
# Copy dan edit file .env
cp .env.example .env
```

Edit `.env` sesuai konfigurasi MongoDB Anda:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/baitul-smartflow
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Jalankan Aplikasi

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Akses di browser: **http://localhost:5173**

## 📁 Struktur Proyek

```
baitul-smartflow/
├── client/                    # React Frontend (Vite)
│   └── src/
│       ├── components/        # Reusable components
│       ├── context/           # React Context (Auth)
│       ├── pages/             # Route pages
│       ├── services/          # API call functions
│       └── utils/             # Helpers
├── server/                    # Express.js Backend
│   ├── config/                # DB & env config
│   ├── models/                # 9 Mongoose schemas
│   ├── routes/                # Express routers
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── middlewares/           # Auth, RBAC, validation
│   └── utils/                 # Error handling helpers
├── .env.example
└── README.md
```

## 🗄️ Database Collections

| Collection | Deskripsi |
|---|---|
| `users` | Admin & Jamaah accounts |
| `cashtransactions` | Pemasukan & pengeluaran kas |
| `muzakkis` | Pembayar zakat |
| `mustahiks` | Penerima zakat (8 asnaf) |
| `zakattransactions` | Transaksi pembayaran zakat |
| `zakatdistributions` | Distribusi zakat ke mustahik |
| `assets` | Inventaris masjid |
| `qurbananimals` | Stok hewan qurban |
| `qurbanparticipants` | Peserta qurban |

## 🔑 API Endpoints

| Endpoint | Method | Role | Deskripsi |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Registrasi |
| `/api/auth/login` | POST | Public | Login |
| `/api/auth/me` | GET | All | Profil |
| `/api/kas` | CRUD | Admin | Transaksi kas |
| `/api/kas/summary` | GET | Admin | Ringkasan keuangan |
| `/api/zakat/pay` | POST | Jamaah | Bayar zakat |
| `/api/zakat/verify/:id` | PATCH | Admin | Verifikasi |
| `/api/zakat/distribute` | POST | Admin | Distribusi |
| `/api/aset` | CRUD | Admin | Inventaris |
| `/api/qurban/animals` | CRUD | Mixed | Hewan qurban |
| `/api/qurban/register` | POST | Jamaah | Daftar qurban |

## 👥 User Roles

- **Admin (Pengurus):** Full access — kelola kas, zakat, inventaris, qurban
- **Jamaah:** Bayar zakat, daftar qurban, lihat riwayat transaksi

## 📄 License

MIT License — [Tsaqib](https://github.com/tsaqibfs)
