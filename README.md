# Corporate Training Platform

Production-oriented monorepo for a company profile website, training management system, and admin CMS.

## Stack

- Frontend: Vite + React + TypeScript + TailwindCSS + React Router + Axios
- Backend: Fastify + Prisma + PostgreSQL + JWT + fastify-multer uploads
- Deployment: Docker Compose / CasaOS ready

## Workspaces

- `apps/frontend`
- `apps/backend`
- `deployment`
- `docs`

## Quick start

1. Install dependencies: `npm install`
2. Copy env files from examples in frontend and backend.
3. Run database migration and seed:
   - `npm run prisma:migrate`
   - `npm run prisma:seed`
4. Start development servers:
   - `npm run dev:backend`
   - `npm run dev:frontend`

## CasaOS / Docker Compose deployment

Repo ini sudah disiapkan untuk deployment via CasaOS memakai:
- `docker-compose.casaos.yml` untuk build image langsung di server
- `docker-compose.casaos.ghcr.yml` untuk pull image prebuilt dari GHCR
- `docker-compose.casaos.app.yml` untuk import sebagai custom CasaOS app
- `Dockerfile.backend`
- `Dockerfile.frontend`
- `.env.casaos.example`

### Yang perlu diisi

1. Copy `.env.casaos.example` menjadi `.env`
2. Ubah minimal nilai berikut:
   - `APP_URL=http://IP_CASAOS_ANDA:4174`
   - `POSTGRES_PASSWORD=...`
   - `JWT_SECRET=...`
   - `ADMIN_EMAIL=...`
   - `ADMIN_PASSWORD=...`

Biarkan `VITE_API_BASE_URL=/api` jika frontend dan backend tetap dipakai lewat compose bawaan ini.

### Opsi A — build image langsung di server

```bash
cp .env.casaos.example .env
npm install
sh scripts/deploy-casaos.sh
```

Script `scripts/deploy-casaos.sh` akan:
- membuat file `.env` jika belum ada
- menjalankan `docker compose -f docker-compose.casaos.yml up -d --build`

### Opsi B — pull image dari GHCR

Kalau workflow publish image sudah aktif di GitHub, pakai ini supaya CasaOS tidak perlu build image sendiri:

```bash
sh scripts/prepare-casaos-ghcr-env.sh rikoarik YOUR_CASAOS_IP
sh scripts/deploy-casaos-ghcr.sh
```

Script `scripts/prepare-casaos-ghcr-env.sh` akan:
- membuat `.env` dari template bila belum ada
- mengisi `BACKEND_IMAGE` dan `FRONTEND_IMAGE`
- mengisi `APP_URL`
- menghasilkan nilai aman untuk `POSTGRES_PASSWORD`, `JWT_SECRET`, dan `ADMIN_PASSWORD` jika masih placeholder

Kalau perlu edit manual, cek `.env` setelah script dijalankan.

Script `scripts/deploy-casaos-ghcr.sh` akan menjalankan `docker compose -f docker-compose.casaos.ghcr.yml up -d`.

Akses setelah berhasil:
- Frontend: `http://IP_CASAOS_ANDA:4174`
- API docs: `http://IP_CASAOS_ANDA:4174/docs/`
- Health check backend: `http://IP_CASAOS_ANDA:4174/api/health`

### Deploy di CasaOS

Pilihan paling mudah:
1. Upload repo ini ke server CasaOS atau clone dari Git.
2. Buka terminal/container shell di server.
3. Jalankan `sh scripts/deploy-casaos.sh`.
4. Jika `.env` baru dibuat, edit nilainya lalu jalankan lagi script yang sama.

Atau kalau mau import sebagai custom app CasaOS, gunakan `docker-compose.casaos.app.yml`.
File ini sudah memakai metadata `x-casaos` dan path volume `/DATA/AppData/$AppID/...` supaya lebih natural untuk CasaOS.

Service yang dibuat:
- `db` — PostgreSQL
- `backend` — Fastify + Prisma migration saat startup
- `frontend` — Nginx yang menyajikan hasil build frontend dan proxy ke backend

### Opsi CI/CD ringan

Workflow tersedia di:
- `.github/workflows/ci.yml` — test, build, dan validasi Docker build
- `.github/workflows/publish-images.yml` — publish image ke GHCR

Kalau repo ini ada di GitHub, alur paling praktis adalah:
1. push repo ke GitHub
2. biarkan workflow publish mendorong image ke GHCR
3. di CasaOS jalankan `sh scripts/prepare-casaos-ghcr-env.sh rikoarik YOUR_CASAOS_IP`
4. lanjut `sh scripts/deploy-casaos-ghcr.sh`

Dengan mode ini, server CasaOS tinggal pull image tanpa rebuild manual di server.

Kalau mau pengalaman yang lebih klik-klik, import `docker-compose.casaos.app.yml` sebagai custom app di CasaOS lalu isi variable yang diminta dari UI CasaOS.

### Persistensi data

Volume yang dipakai compose:
- `postgres_data` untuk database PostgreSQL
- `backend_uploads` untuk file upload backend

### Seed data

Default compose tidak menjalankan seed setiap startup.
Jika ingin seed awal sekali saja, set:

```env
RUN_PRISMA_SEED=true
```

Setelah data awal masuk, kembalikan ke `false` agar restart berikutnya tidak selalu menjalankan seed.

## CI

GitHub Actions workflow tersedia di `.github/workflows/ci.yml` untuk:
- install dependency
- typecheck
- build frontend + backend
- run backend smoke test
- build Docker images
