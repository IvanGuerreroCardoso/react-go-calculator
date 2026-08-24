import { test, expect, vi } from 'vitest'
import { add, subtract, multiply, divide } from '../api/calculator'

test('api.add posts to /api/add and returns result', async () => {
  ;(globalThis as any).fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ result: 7 }),
  })

  const r = await add(3, 4)
  expect(r).toBe(7)
  vi.restoreAllMocks()
})

test('api returns error on non-ok response', async () => {
  ;(globalThis as any).fetch = vi.fn().mockResolvedValue({
    ok: false,
    statusText: 'bad',
    json: async () => ({ error: 'oops' }),
  })

  await expect(add(1, 2)).rejects.toThrow('oops')
  vi.restoreAllMocks()
})

test('api falls back to statusText when json() fails', async () => {
  ;(globalThis as any).fetch = vi.fn().mockResolvedValue({
    ok: false,
    statusText: 'server error',
    json: async () => {
      throw new Error('parse error')
    },
  })

  await expect(add(1, 2)).rejects.toThrow('server error')
  vi.restoreAllMocks()
})

test('api falls back to generic message when no error/statusText', async () => {
  ;(globalThis as any).fetch = vi.fn().mockResolvedValue({
    ok: false,
    statusText: '',
    json: async () => {
      throw new Error('parse error')
    },
  })

  await expect(add(1, 2)).rejects.toThrow('request failed')
  vi.restoreAllMocks()
})
