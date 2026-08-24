export type ApiError = { error?: string }

// Read base URL from Vite env var `VITE_API_BASE` (e.g. http://localhost:8080)
const BASE = ((import.meta as any).env && (import.meta as any).env.VITE_API_BASE) || ''

async function postOp(op: string, a: number, b: number): Promise<number> {
  const url = BASE ? `${BASE.replace(/\/$/, '')}/api/${op}` : `/api/${op}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ a, b }),
  })

  if (!res.ok) {
    const data: ApiError = await res.json().catch(() => ({}))
    throw new Error(data.error || res.statusText || 'request failed')
  }

  const data = await res.json()
  return data.result as number
}

export const add = (a: number, b: number) => postOp('add', a, b)
export const subtract = (a: number, b: number) => postOp('subtract', a, b)
export const multiply = (a: number, b: number) => postOp('multiply', a, b)
export const divide = (a: number, b: number) => postOp('divide', a, b)
