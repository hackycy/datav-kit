export const themeNames = [
  'cyber-blue',
  'neon-magenta',
  'matrix-green',
  'solar-gold',
  'ice-white',
] as const

export type ThemeName = typeof themeNames[number]
