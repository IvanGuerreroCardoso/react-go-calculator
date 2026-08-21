import { render, screen, fireEvent } from '@testing-library/react'
import Calculator from '../components/Calculator'
import { test, expect, vi } from 'vitest'

test('calls backend and shows result', async () => {
  // mock fetch to return result = 5
    (globalThis as any).fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ result: 5 }),
  })

  render(<Calculator />)

  const inputA = screen.getByLabelText('input-a') as HTMLInputElement
  const inputB = screen.getByLabelText('input-b') as HTMLInputElement
  const op = screen.getByLabelText('op') as HTMLSelectElement
  const btn = screen.getByText('Calculate')

  fireEvent.change(inputA, { target: { value: '2' } })
  fireEvent.change(inputB, { target: { value: '3' } })
  fireEvent.change(op, { target: { value: 'add' } })
  fireEvent.click(btn)

  expect(await screen.findByText(/Result:/)).toHaveTextContent('5')
    vi.restoreAllMocks()
})
