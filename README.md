# react-go-calculator (monorepo)

Minimal monorepo with two apps:

- `frontend/` — React + TypeScript + Vite
- `backend/` — Go + chi

Getting started

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
go mod tidy
go run .
```

Folder layout

- `frontend/` — Vite + React app (TypeScript)
- `backend/` — Go HTTP server using `chi`
