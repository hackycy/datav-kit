import { describe, expect, it } from 'vitest'
import { clamp, lerp, toBooleanAttribute, toNumber } from '../src/index'

describe('@datav-kit/shared', () => {
  it('clamps numbers into the requested range', () => {
    expect(clamp(12, 0, 10)).toBe(10)
    expect(clamp(-2, 0, 10)).toBe(0)
    expect(clamp(4, 0, 10)).toBe(4)
  })

  it('interpolates and parses primitive attributes', () => {
    expect(lerp(10, 20, 0.25)).toBe(12.5)
    expect(toNumber('2.5', 1)).toBe(2.5)
    expect(toNumber('nope', 1)).toBe(1)
    expect(toBooleanAttribute('false')).toBe(false)
    expect(toBooleanAttribute('')).toBe(true)
  })
})
