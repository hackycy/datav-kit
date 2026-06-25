export type MaybeArray<T> = T | T[]

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount
}

export function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number')
    return Number.isFinite(value) ? value : fallback

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  return fallback
}

export function toBooleanAttribute(value: unknown): boolean {
  return value !== null && value !== undefined && value !== false && value !== 'false'
}
