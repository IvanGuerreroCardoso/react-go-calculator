package calculator

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
)

func mustBody(v any) *bytes.Reader {
    b, _ := json.Marshal(v)
    return bytes.NewReader(b)
}

func TestAddHandler_Success(t *testing.T) {
    httpReq := httptest.NewRequest(http.MethodPost, "/api/add", mustBody(map[string]float64{"a": 2, "b": 3}))
    rr := httptest.NewRecorder()
    AddHandler(rr, httpReq)
    resp := rr.Result()
    if resp.StatusCode != http.StatusOK {
        t.Fatalf("expected 200 got %d", resp.StatusCode)
    }
    var got CalcResponse
    if err := json.NewDecoder(resp.Body).Decode(&got); err != nil {
        t.Fatalf("decode: %v", err)
    }
    if got.Result != 5 {
        t.Fatalf("expected 5 got %v", got.Result)
    }
}

func TestSubtractHandler_Success(t *testing.T) {
    httpReq := httptest.NewRequest(http.MethodPost, "/api/subtract", mustBody(map[string]float64{"a": 10, "b": 4}))
    rr := httptest.NewRecorder()
    SubtractHandler(rr, httpReq)
    resp := rr.Result()
    if resp.StatusCode != http.StatusOK {
        t.Fatalf("expected 200 got %d", resp.StatusCode)
    }
    var got CalcResponse
    if err := json.NewDecoder(resp.Body).Decode(&got); err != nil {
        t.Fatalf("decode: %v", err)
    }
    if got.Result != 6 {
        t.Fatalf("expected 6 got %v", got.Result)
    }
}

func TestMultiplyHandler_Success(t *testing.T) {
    httpReq := httptest.NewRequest(http.MethodPost, "/api/multiply", mustBody(map[string]float64{"a": 3, "b": 7}))
    rr := httptest.NewRecorder()
    MultiplyHandler(rr, httpReq)
    resp := rr.Result()
    if resp.StatusCode != http.StatusOK {
        t.Fatalf("expected 200 got %d", resp.StatusCode)
    }
    var got CalcResponse
    if err := json.NewDecoder(resp.Body).Decode(&got); err != nil {
        t.Fatalf("decode: %v", err)
    }
    if got.Result != 21 {
        t.Fatalf("expected 21 got %v", got.Result)
    }
}

func TestMultiplyHandler_ResultOverflow(t *testing.T) {
    // Multiply MaxFloat64 by 2 should overflow
    httpReq := httptest.NewRequest(http.MethodPost, "/api/multiply", mustBody(map[string]float64{"a": 1.7976931348623157e+308, "b": 2}))
    rr := httptest.NewRecorder()
    MultiplyHandler(rr, httpReq)
    resp := rr.Result()
    if resp.StatusCode != http.StatusBadRequest {
        t.Fatalf("expected 400 got %d", resp.StatusCode)
    }
    var got ErrorResponse
    if err := json.NewDecoder(resp.Body).Decode(&got); err != nil {
        t.Fatalf("decode: %v", err)
    }
    if got.Error == "" {
        t.Fatalf("expected error message, got empty")
    }
}

func TestHandler_InputOverflow(t *testing.T) {
    // send a number larger than float64 via raw JSON literal (1e400)
    httpReq := httptest.NewRequest(http.MethodPost, "/api/add", bytes.NewReader([]byte("{"+"\"a\":1e400,\"b\":1}")))
    rr := httptest.NewRecorder()
    AddHandler(rr, httpReq)
    resp := rr.Result()
    if resp.StatusCode != http.StatusBadRequest {
        t.Fatalf("expected 400 got %d", resp.StatusCode)
    }
    var got ErrorResponse
    if err := json.NewDecoder(resp.Body).Decode(&got); err != nil {
        t.Fatalf("decode: %v", err)
    }
    if got.Error == "" {
        t.Fatalf("expected error message, got empty")
    }
}

func TestDivideHandler_DivByZero(t *testing.T) {
    httpReq := httptest.NewRequest(http.MethodPost, "/api/divide", mustBody(map[string]float64{"a": 2, "b": 0}))
    rr := httptest.NewRecorder()
    DivideHandler(rr, httpReq)
    resp := rr.Result()
    if resp.StatusCode != http.StatusBadRequest {
        t.Fatalf("expected 400 got %d", resp.StatusCode)
    }
    var got ErrorResponse
    if err := json.NewDecoder(resp.Body).Decode(&got); err != nil {
        t.Fatalf("decode: %v", err)
    }
    if got.Error == "" {
        t.Fatalf("expected error message, got empty")
    }
}

func TestHandler_InvalidInput(t *testing.T) {
    // missing fields
    httpReq := httptest.NewRequest(http.MethodPost, "/api/add", mustBody(map[string]float64{"a": 1}))
    rr := httptest.NewRecorder()
    AddHandler(rr, httpReq)
    resp := rr.Result()
    if resp.StatusCode != http.StatusBadRequest {
        t.Fatalf("expected 400 got %d", resp.StatusCode)
    }
    var got ErrorResponse
    if err := json.NewDecoder(resp.Body).Decode(&got); err != nil {
        t.Fatalf("decode: %v", err)
    }
    if got.Error == "" {
        t.Fatalf("expected error message, got empty")
    }
}

func TestDecodeRequest_UnknownField(t *testing.T) {
    // extra field 'c' should cause DisallowUnknownFields to error
    rr := httptest.NewRequest("POST", "/api/add", bytes.NewReader([]byte("{\"a\":1,\"b\":2,\"c\":3}")))
    _, err := decodeRequest(rr)
    if err == nil {
        t.Fatalf("expected error for unknown field, got nil")
    }
}

func TestDecodeRequest_MalformedJSON(t *testing.T) {
    rr := httptest.NewRequest("POST", "/api/add", bytes.NewReader([]byte("{bad json")))
    _, err := decodeRequest(rr)
    if err == nil {
        t.Fatalf("expected error for malformed json, got nil")
    }
}

func TestWriteJSON_SetsHeadersAndBody(t *testing.T) {
    w := httptest.NewRecorder()
    writeJSON(w, 201, CalcResponse{Result: 3.14})
    resp := w.Result()
    if resp.StatusCode != 201 {
        t.Fatalf("expected status 201 got %d", resp.StatusCode)
    }
    if ct := resp.Header.Get("Content-Type"); ct != "application/json" {
        t.Fatalf("expected content-type application/json got %s", ct)
    }
}
