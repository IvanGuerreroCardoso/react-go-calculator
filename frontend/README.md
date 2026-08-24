# Frontend

React + TypeScript app bootstrapped for Vite.

## Run locally:

```bash
cd frontend
npm install
npm run dev
```

Environment

Create environment files in `frontend/` to configure the API base URL. Use:

- `.env.local` — for local development (not committed). Example:

```text
VITE_API_BASE=http://localhost:8080
```

- `.env.production` — for production build:

```text
VITE_API_BASE=https://api.example.com
```

Vite loads `.env` and mode-specific files automatically (`.env`, `.env.local`, `.env.production`). Prefix client-exposed vars with `VITE_`. After changing env files, restart the dev server.
## Run the tests
```bash
npm run test
```

or to get code coverage:
```bash
npx vitest run --coverage
```