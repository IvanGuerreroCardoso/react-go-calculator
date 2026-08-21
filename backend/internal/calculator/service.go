package calculator

import (
    "errors"
    "math"
)

var ErrDivByZero = errors.New("division by zero")
var ErrOverflow = errors.New("numeric overflow")

func Add(a, b float64) (float64, error) {
    res := a + b
    if math.IsInf(res, 0) || math.IsNaN(res) {
        return 0, ErrOverflow
    }
    return res, nil
}

func Subtract(a, b float64) (float64, error) {
    res := a - b
    if math.IsInf(res, 0) || math.IsNaN(res) {
        return 0, ErrOverflow
    }
    return res, nil
}

func Multiply(a, b float64) (float64, error) {
    res := a * b
    if math.IsInf(res, 0) || math.IsNaN(res) {
        return 0, ErrOverflow
    }
    return res, nil
}

func Divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, ErrDivByZero
    }
    res := a / b
    if math.IsInf(res, 0) || math.IsNaN(res) {
        return 0, ErrOverflow
    }
    return res, nil
}
