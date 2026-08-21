package calculator

import (
    "encoding/json"
    "math"
    "net/http"
)

func decodeRequest(r *http.Request) (*CalcRequest, error) {
    var req CalcRequest
    dec := json.NewDecoder(r.Body)
    dec.DisallowUnknownFields()
    if err := dec.Decode(&req); err != nil {
        return nil, err
    }
    if req.A == nil || req.B == nil {
        return nil, ErrInvalidInput
    }
    // reject non-finite numbers coming from JSON (e.g., 1e400 -> +Inf)
    if math.IsInf(*req.A, 0) || math.IsInf(*req.B, 0) || math.IsNaN(*req.A) || math.IsNaN(*req.B) {
        return nil, ErrOverflow
    }
    return &req, nil
}

var ErrInvalidInput = &badRequestError{"invalid input"}

type badRequestError struct{ msg string }

func (b *badRequestError) Error() string { return b.msg }

// writeJSON writes a JSON response with the given HTTP status and payload.
// 'status' is the HTTP status code and 'payload' is the value to encode as JSON.
func writeJSON(w http.ResponseWriter, status int, payload any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(payload)
}

func AddHandler(w http.ResponseWriter, r *http.Request) {
    req, err := decodeRequest(r)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: err.Error()})
        return
    }
    out, err := Add(*req.A, *req.B)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: err.Error()})
        return
    }
    res := CalcResponse{Result: out}
    writeJSON(w, http.StatusOK, res)
}

func SubtractHandler(w http.ResponseWriter, r *http.Request) {
    req, err := decodeRequest(r)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: err.Error()})
        return
    }
    out, err := Subtract(*req.A, *req.B)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: err.Error()})
        return
    }
    res := CalcResponse{Result: out}
    writeJSON(w, http.StatusOK, res)
}

func MultiplyHandler(w http.ResponseWriter, r *http.Request) {
    req, err := decodeRequest(r)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: err.Error()})
        return
    }
    out, err := Multiply(*req.A, *req.B)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: err.Error()})
        return
    }
    res := CalcResponse{Result: out}
    writeJSON(w, http.StatusOK, res)
}

func DivideHandler(w http.ResponseWriter, r *http.Request) {
    req, err := decodeRequest(r)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: err.Error()})
        return
    }
    out, err := Divide(*req.A, *req.B)
    if err != nil {
        writeJSON(w, http.StatusBadRequest, ErrorResponse{Error: err.Error()})
        return
    }
    res := CalcResponse{Result: out}
    writeJSON(w, http.StatusOK, res)
}
