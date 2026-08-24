import { render, screen, fireEvent } from '@testing-library/react'
import Calculator from '../components/Calculator'
import { test, expect, vi } from 'vitest'
import { act } from 'react-dom/test-utils'

test('calls backend and shows result', async () => {
  // mock fetch to return result = 5
    (globalThis as any).fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ result: 5 }),
  })

  render(<Calculator />)

  const inputA = screen.getByLabelText('input-a') as HTMLInputElement
  const inputB = screen.getByLabelText('input-b') as HTMLInputElement
  const plus = screen.getByRole('button', { name: '+' })
  const eq = screen.getByRole('button', { name: '=' })

  fireEvent.change(inputA, { target: { value: '2' } })
  fireEvent.change(inputB, { target: { value: '3' } })
  // select plus
  fireEvent.click(plus)
  // trigger calculation via equals and wrap async update
  await act(async () => {
    fireEvent.click(eq)
  })

  const display = await screen.findByLabelText('result')
  expect(display).toHaveTextContent('5')
    vi.restoreAllMocks()
})
