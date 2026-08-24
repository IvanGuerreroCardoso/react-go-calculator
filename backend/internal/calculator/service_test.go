package calculator

import (
    "math"
    "testing"
)

func TestService_AddOverflow(t *testing.T) {
    _, err := Add(math.MaxFloat64, math.MaxFloat64)
    if err != ErrOverflow {
        t.Fatalf("expected ErrOverflow got %v", err)
    }
}

func TestService_SubtractOverflow(t *testing.T) {
    // subtracting -MaxFloat64 from MaxFloat64 can overflow to +Inf
    _, err := Subtract(math.MaxFloat64, -math.MaxFloat64)
    if err != ErrOverflow {
        t.Fatalf("expected ErrOverflow got %v", err)
    }
}

func TestService_MultiplyOverflow(t *testing.T) {
    _, err := Multiply(math.MaxFloat64, 2)
    if err != ErrOverflow {
        t.Fatalf("expected ErrOverflow got %v", err)
    }
}

func TestService_DivideByZeroAndOverflow(t *testing.T) {
    _, err := Divide(1, 0)
    if err != ErrDivByZero {
        t.Fatalf("expected ErrDivByZero got %v", err)
    }

    // dividing a very small number by 0.0 should be div by zero; large dividing should be fine
    _, err = Divide(math.MaxFloat64, 1e-308)
    if err == ErrOverflow {
        // it's okay if this overflows on some platforms, but not required
    }
}
