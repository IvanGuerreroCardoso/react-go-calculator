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

API examples (frontend -> backend)

If your backend runs on `http://localhost:8080` you can call the API directly from the frontend or with `curl`:

```bash
curl -X POST http://localhost:8080/api/multiply \
	-H 'Content-Type: application/json' \
	-d '{"a": 3, "b": 7}'
# { "result": 21 }
```

Design decisions & assumptions

- The frontend keeps presentation and input validation only — arithmetic is delegated to the backend so the same logic is used across clients.
- Environment: `VITE_API_BASE` controls the API base URL. Default is relative `/api` when unset.
- Inputs accept only digits and an optional single decimal point; invalid characters are ignored client-side to improve UX.
- Tests use `vitest` + `@testing-library/react` and mock `fetch` when exercising API calls.