# react-go-calculator (monorepo)

Minimal monorepo with two apps:

- `frontend/` — React + TypeScript + Vite
- `backend/` — Go + chi

Getting started

Prerequisites
- Node.js (16+) + npm or pnpm
- Go 1.20+ (module-aware)

Setup

```bash
# from repo root
# install frontend deps
cd frontend
npm ci

# prepare backend modules
cd ../backend
go mod tidy
```

Run locally

Frontend (dev server):

```bash
cd frontend
npm run dev
# opens on http://localhost:5173 by default
```

Backend (dev server):

```bash
cd backend
ALLOWED_ORIGIN=http://localhost:5173 go run .
# server listens on :8080 by default
```

API examples

Add (POST /api/add):

```bash
curl -sS -X POST http://localhost:8080/api/add \
	-H 'Content-Type: application/json' \
	-d '{"a": 2, "b": 3}'
# { "result": 5 }
```

Design decisions & assumptions

- Simple REST API: one endpoint per operation (`/api/add`, `/api/subtract`, `/api/multiply`, `/api/divide`).
- JSON request shape: `{ "a": number, "b": number }`. Fields are required and validated server-side.
- Server rejects unknown JSON fields (uses `DisallowUnknownFields`) to catch client typos.
- Backend performs overflow and division-by-zero checks and returns HTTP 400 with a JSON error message for invalid inputs.
- Frontend is a small Vite + React app that delegates arithmetic to the backend to keep business logic centralized and testable.

Folder layout

- `frontend/` — Vite + React app (TypeScript)
- `backend/` — Go HTTP server using `chi`
