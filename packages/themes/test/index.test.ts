import { describe, expect, it } from 'vitest'
import { themeNames } from '../src/index'

describe('@datav-kit/themes', () => {
  it('exports the planned first-party theme names', () => {
    expect(themeNames).toEqual([
      'cyber-blue',
      'neon-magenta',
      'matrix-green',
      'solar-gold',
      'ice-white',
    ])
  })
})
