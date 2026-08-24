# Backend

Go HTTP server using `chi`.

## Run locally:

```bash
cd backend
go mod tidy
go run .
```

The server listens on `:8080` and exposes `GET /api/health`.

API endpoints

- `POST /api/add` — body: `{ "a": number, "b": number }` → `{ "result": number }`
- `POST /api/subtract`
- `POST /api/multiply`
- `POST /api/divide` — returns 400 for division by zero

Example request

```bash
curl -X POST http://localhost:8080/api/divide \
	-H 'Content-Type: application/json' \
	-d '{"a": 10, "b": 2}'
# { "result": 5 }
```

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

Design decisions & assumptions

- Handlers validate JSON strictly with `json.Decoder` and `DisallowUnknownFields` to catch client mistakes early.
- Numeric overflow and NaN are treated as errors (HTTP 400) to avoid returning invalid results to clients.
- The service layer (`service.go`) returns well-known sentinel errors (`ErrDivByZero`, `ErrOverflow`) which handlers map to HTTP 400 responses.
