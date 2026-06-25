import { describe, expect, it } from 'vitest'
import { elementMetadata, register } from '../src/index'

describe('@datav-kit/elements', () => {
  it('exposes an empty registration surface before MVP elements are added', () => {
    expect(elementMetadata).toEqual([])
    expect(register()).toEqual({ defined: [], skipped: [] })
  })
})
