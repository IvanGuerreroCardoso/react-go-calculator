package main

import (
    "log"
    "net/http"
    "os"

    "github.com/go-chi/chi/v5"
    chiCors "github.com/go-chi/cors"

    "react-go-calculator/backend/internal/calculator"
)

func main() {
    r := chi.NewRouter()

    // CORS: allow only the origin configured by ALLOWED_ORIGIN environment variable.
    // Set ALLOWED_ORIGIN to the frontend base (for example the VITE_API_BASE value).
    allowed := os.Getenv("ALLOWED_ORIGIN")
    if allowed == "" {
        allowed = "http://localhost:5173" // sensible default for Vite dev server
    }

    r.Use(chiCors.Handler(chiCors.Options{
        AllowedOrigins:   []string{allowed},
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
        ExposedHeaders:   []string{"Link"},
        AllowCredentials: true,
        MaxAge:           300, // 5 minutes
    }))

    r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(`{"status":"ok"}`))
    })

    // calculator endpoints
    r.Post("/api/add", calculator.AddHandler)
    r.Post("/api/subtract", calculator.SubtractHandler)
    r.Post("/api/multiply", calculator.MultiplyHandler)
    r.Post("/api/divide", calculator.DivideHandler)

    log.Println("backend listening on :8080")
    http.ListenAndServe(":8080", r)
}
