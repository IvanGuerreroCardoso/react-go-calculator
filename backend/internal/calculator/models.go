package calculator

// CalcRequest represents the input JSON for calculator operations.
type CalcRequest struct {
    A *float64 `json:"a"`
    B *float64 `json:"b"`
}

// CalcResponse represents a successful response.
type CalcResponse struct {
    Result float64 `json:"result"`
}

// ErrorResponse for returning errors.
type ErrorResponse struct {
    Error string `json:"error"`
}
