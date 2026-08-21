import React, { useState } from 'react'
import './calculator.css'
import * as api from '../api/calculator'

type Op = 'add' | 'subtract' | 'multiply' | 'divide'

export default function Calculator() {
  const [a, setA] = useState<string>('')
  const [b, setB] = useState<string>('')
  const [op, setOp] = useState<Op>('add')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function parseNumber(n: string) {
    if (n.trim() === '') return null
    const v = Number(n)
    return Number.isFinite(v) ? v : null
  }

  async function calculate() {
    setError(null)
    setResult(null)
    const va = parseNumber(a)
    const vb = parseNumber(b)
    if (va === null || vb === null) {
      setError('Please enter valid numbers')
      return
    }
    if (op === 'divide' && vb === 0) {
      setError('Division by zero')
      return
    }

    setLoading(true)
    try {
      let out: number
      switch (op) {
        case 'add':
          out = await api.add(va, vb)
          break
        case 'subtract':
          out = await api.subtract(va, vb)
          break
        case 'multiply':
          out = await api.multiply(va, vb)
          break
        case 'divide':
          out = await api.divide(va, vb)
          break
        default:
          out = 0
      }
      setResult(out)
    } catch (e: any) {
      setError(e?.message || 'request failed')
    } finally {
      setLoading(false)
    }
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
          <option value="subtract">-</option>
          <option value="multiply">×</option>
          <option value="divide">÷</option>
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
        <button onClick={calculate} disabled={loading}>
          {loading ? 'Calculating…' : 'Calculate'}
        </button>
      </div>

      <div className="result">
        {error ? <div className="error">{error}</div> : result !== null ? <div>Result: {String(result)}</div> : <div />}
      </div>
    </div>
  )
}
