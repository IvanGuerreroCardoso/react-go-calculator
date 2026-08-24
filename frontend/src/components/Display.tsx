import React from 'react'
import './display.css'

export default function Display({ value }: { value: string | number | null }) {
  return (
    <div className="display" role="status" aria-label="result">
      {value === null ? '' : String(value)}
    </div>
  )
}
