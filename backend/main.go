package main

import (
    "log"
    "net/http"
    "github.com/go-chi/chi/v5"
    "react-go-calculator/backend/internal/calculator"
)

func main() {
    r := chi.NewRouter()

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
