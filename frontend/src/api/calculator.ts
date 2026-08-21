export type ApiError = { error?: string }

async function postOp(op: string, a: number, b: number): Promise<number> {
  const res = await fetch(`/api/${op}`, {
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
