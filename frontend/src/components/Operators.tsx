import React from 'react'
import './operators.css'

const ops = [
  { key: 'add', label: '+' },
  { key: 'subtract', label: '−' },
  { key: 'multiply', label: '×' },
  { key: 'divide', label: '÷' },
]

export default function Operators({ selected, onSelect, onEquals }: { selected: string; onSelect: (k: string) => void; onEquals: () => void }) {
  return (
    <div className="ops">
      {ops.map((o) => (
        <button key={o.key} className={`op-btn ${selected === o.key ? 'op-selected' : ''}`} onClick={() => onSelect(o.key)}>
          {o.label}
        </button>
      ))}
      <button className="op-eq" onClick={onEquals}>=</button>
    </div>
  )
}
