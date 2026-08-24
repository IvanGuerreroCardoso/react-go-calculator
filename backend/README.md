# Backend

Go HTTP server using `chi`.

## Run locally:

```bash
cd backend
go mod tidy
go run .
```

The server listens on `:8080` and exposes `GET /api/health`.

Cross-origin (CORS)

To restrict which frontend origin can call this API, set the `ALLOWED_ORIGIN` environment variable before starting the server. For example, if your frontend runs on `http://localhost:5173`, start the server like:

```bash
ALLOWED_ORIGIN=http://localhost:5173 go run .
```

The backend will default to allowing `http://localhost:5173` when `ALLOWED_ORIGIN` is not set.

## Run tests:

```bash
cd backend
go mod tidy
go test ./... -cover
```
