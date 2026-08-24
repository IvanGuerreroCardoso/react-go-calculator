import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Calculator from '../components/Calculator'
import { test, expect, vi } from 'vitest'
import { act } from 'react-dom/test-utils'

test('keypad buttons append to focused input and equals calls API', async () => {
  ;(globalThis as any).fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ result: 42 }) })

  render(<Calculator />)

  const inputA = screen.getByLabelText('input-a') as HTMLInputElement
  const inputB = screen.getByLabelText('input-b') as HTMLInputElement
  const btn2 = screen.getByText('2')
  const btn4 = screen.getByText('4')
  const eq = screen.getByRole('button', { name: '=' })

  // focus A and press 2 then 4 -> "24"
  fireEvent.focus(inputA)
  fireEvent.click(btn2)
  fireEvent.click(btn4)
  expect(inputA.value).toBe('24')

  // switch to B and type 3
  fireEvent.focus(inputB)
  const btn3 = screen.getByText('3')
  fireEvent.click(btn3)
  expect(inputB.value).toBe('3')

  // set op to multiply and press equals
  const mul = screen.getByRole('button', { name: '×' })
  fireEvent.click(mul)
  // wrap equals which triggers async update
  await act(async () => {
    fireEvent.click(eq)
  })

  const display = await screen.findByLabelText('result')
  expect(display).toHaveTextContent('42')
  vi.restoreAllMocks()
})

test('keyboard input works and Enter triggers calculate', async () => {
  ;(globalThis as any).fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ result: 7 }) })

  render(<Calculator />)
  const inputA = screen.getByLabelText('input-a') as HTMLInputElement
  const inputB = screen.getByLabelText('input-b') as HTMLInputElement
  // simulate typing using change events (JSDOM doesn't update inputs from key events)
  await act(async () => {
    fireEvent.change(inputA, { target: { value: '12' } })
  })
  expect(inputA.value).toBe('12')

  await act(async () => {
    fireEvent.change(inputB, { target: { value: '3' } })
  })
  expect(inputB.value).toBe('3')

  // trigger calculate via Enter on focused input
  await act(async () => {
    fireEvent.keyDown(inputB, { key: 'Enter' })
  })
  const display = await screen.findByLabelText('result')
  expect(display).toHaveTextContent('7')
  vi.restoreAllMocks()
})

test('selecting an operation while in input A focuses input B', async () => {
  render(<Calculator />)
  const inputA = screen.getByLabelText('input-a') as HTMLInputElement
  const inputB = screen.getByLabelText('input-b') as HTMLInputElement
  const plus = screen.getByRole('button', { name: '+' })

  // focus A (use DOM focus inside act and wait)
  await act(async () => {
    inputA.focus()
  })
  await waitFor(() => expect(document.activeElement).toBe(inputA))

  // click plus -> should focus B (wait for async focus/setState)
  fireEvent.click(plus)
  
  await waitFor(() => expect(document.activeElement).toBe(inputB))
})

test('inputs ignore invalid characters', async () => {
  render(<Calculator />)
  const inputA = screen.getByLabelText('input-a') as HTMLInputElement

  // start with empty, change to '1'
  fireEvent.change(inputA, { target: { value: '1' } })
  expect(inputA.value).toBe('1')

  // attempt to change to invalid value '1a' -> should be ignored
  fireEvent.change(inputA, { target: { value: '1a' } })
  expect(inputA.value).toBe('1')

  // attempt to set purely invalid 'a' -> should remain unchanged
  fireEvent.change(inputA, { target: { value: 'a' } })
  expect(inputA.value).toBe('1')
})

test('keypad backspace deletes last char', async () => {
  render(<Calculator />)

  const inputA = screen.getByLabelText('input-a') as HTMLInputElement
  const btn2 = screen.getByText('2')
  const back = screen.getByText('⌫')

  // focus and type 22
  fireEvent.focus(inputA)
  fireEvent.click(btn2)
  fireEvent.click(btn2)
  expect(inputA.value).toBe('22')

  // backspace -> '2'
  fireEvent.click(back)
  expect(inputA.value).toBe('2')
})

test('operator keydown (x/X) sets multiply and focuses input B', async () => {
  render(<Calculator />)
  const inputA = screen.getByLabelText('input-a') as HTMLInputElement
  const inputB = screen.getByLabelText('input-b') as HTMLInputElement
  const opInline = document.querySelector('.op-inline') as HTMLElement

  // focus A and press 'x'
  fireEvent.focus(inputA)
  fireEvent.keyDown(inputA, { key: 'x' })

  await waitFor(() => expect(document.activeElement).toBe(inputB))
  expect(opInline.textContent).toBe('×')

  // now try uppercase 'X'
  fireEvent.focus(inputA)
  fireEvent.keyDown(inputA, { key: 'X' })
  await waitFor(() => expect(document.activeElement).toBe(inputB))
  expect(opInline.textContent).toBe('×')
})
