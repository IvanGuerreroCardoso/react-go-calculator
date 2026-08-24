import React, { useEffect, useRef, useState } from 'react'
import './calculator.css'
import Display from './Display'
import Keypad from './Keypad'
import Operators from './Operators'
import * as api from '../api/calculator'

type Op = 'add' | 'subtract' | 'multiply' | 'divide'

export default function Calculator() {
  const [a, setA] = useState<string>('')
  const [b, setB] = useState<string>('')
  const [op, setOp] = useState<Op>('add')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState<'a' | 'b'>('a')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputARef = useRef<HTMLInputElement | null>(null)
  const inputBRef = useRef<HTMLInputElement | null>(null)

  function appendToActive(ch: string) {
    // only allow digits or period from keypad
    if (!/^\d|\.$/.test(ch)) return
    if (active === 'a') setA((s) => s + ch)
    else setB((s) => s + ch)
  }

  function backspaceActive() {
    if (active === 'a') setA((s) => s.slice(0, -1))
    else setB((s) => s.slice(0, -1))
  }

  function onKeypadPress(k: string) {
    if (k === '⌫') return backspaceActive()
    appendToActive(k)
  }

  function isValidInputValue(v: string) {
    // allow empty or only digits with optional single decimal point
    return /^$|^\d*\.?\d*$/.test(v)
  }

  function handleOperatorKey(key: string) {
    const map: Record<string, Op> = {
      '+': 'add',
      '-': 'subtract',
      '*': 'multiply',
      'x': 'multiply',
      'X': 'multiply',
      '/': 'divide',
    }
    const sel = map[key]
    if (sel) {
      setOp(sel)
      setActive('b')
      inputBRef.current?.focus()
      return true
    }
    return false
  }

  async function doCalculate() {
    setError(null)
    setResult(null)
    const va = a.trim() === '' ? null : Number(a)
    const vb = b.trim() === '' ? null : Number(b)
    if (va === null || vb === null || !Number.isFinite(va) || !Number.isFinite(vb)) {
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
    <div className="calc" ref={containerRef}>
      <div className="top">
        <div className="inputs-row">
          <input
            ref={inputARef}
            aria-label="input-a"
            value={a}
            onFocus={() => setActive('a')}
            onChange={(e) => {
              const v = e.target.value
              if (isValidInputValue(v)) setA(v)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') return void doCalculate()
              if (handleOperatorKey(e.key)) e.preventDefault()
            }}
          />
          <div className="op-inline">{op === 'add' ? '+' : op === 'subtract' ? '−' : op === 'multiply' ? '×' : '÷'}</div>
          <input
            ref={inputBRef}
            aria-label="input-b"
            value={b}
            onFocus={() => setActive('b')}
            onChange={(e) => {
              const v = e.target.value
              if (isValidInputValue(v)) setB(v)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') return void doCalculate()
              if (handleOperatorKey(e.key)) e.preventDefault()
            }}
          />
        </div>

        <div className="display-row">
          <Display value={loading ? 'Loading...' : error ? error : result !== null ? result : ''} />
        </div>
      </div>

      <div className="main">
        <Keypad onPress={onKeypadPress} />
        <div className="side">
          <Operators selected={op} onSelect={(k) => { setOp(k as Op); setActive('b'); inputBRef.current?.focus() }} onEquals={doCalculate} />
        </div>
      </div>
    </div>
  )
}
