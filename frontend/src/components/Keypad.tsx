import React from 'react'
import './keypad.css'

const keys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
]

export default function Keypad({ onPress }: { onPress: (k: string) => void }) {
  return (
    <div className="keypad">
      {keys.map((row, i) => (
        <div className="kp-row" key={i}>
          {row.map((k) => (
            <button key={k} className={`kp-btn ${k === '⌫' ? 'kp-op' : 'kp-num'}`} onClick={() => onPress(k)}>
              {k}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
