import React, { useState } from 'react'
import './calculator.css'

type Op = 'add' | 'sub' | 'mul' | 'div'

export default function Calculator() {
  const [a, setA] = useState<string>('')
  const [b, setB] = useState<string>('')
  const [op, setOp] = useState<Op>('add')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function parse(n: string) {
    if (n.trim() === '') return null
    const v = Number(n)
    return Number.isFinite(v) ? v : null
  }

  function calculate() {
    setError(null)
    const va = parse(a)
    const vb = parse(b)
    if (va === null || vb === null) {
      setResult(null)
      setError('Please enter valid numbers')
      return
    }
    if (op === 'div' && vb === 0) {
      setResult(null)
      setError('Division by zero')
      return
    }
    let res: number
    switch (op) {
      case 'add':
        res = va + vb
        break
      case 'sub':
        res = va - vb
        break
      case 'mul':
        res = va * vb
        break
      case 'div':
        res = va / vb
        break
      default:
        res = 0
    }
    setResult(String(res))
  }

  return (
    <div className="calc">
      <div className="inputs">
        <input
          aria-label="input-a"
          inputMode="decimal"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="First number"
        />
        <select aria-label="op" value={op} onChange={(e) => setOp(e.target.value as Op)}>
          <option value="add">+</option>
          <option value="sub">-</option>
          <option value="mul">×</option>
          <option value="div">÷</option>
        </select>
        <input
          aria-label="input-b"
          inputMode="decimal"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Second number"
        />
      </div>

      <div className="actions">
        <button onClick={calculate}>Calculate</button>
      </div>

      <div className="result">
        {error ? <div className="error">{error}</div> : result !== null ? <div>Result: {result}</div> : <div />}
      </div>
    </div>
  )
}
