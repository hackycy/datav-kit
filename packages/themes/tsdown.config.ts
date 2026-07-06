import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cyber-blue.ts',
    'src/neon-magenta.ts',
    'src/matrix-green.ts',
    'src/solar-gold.ts',
    'src/ice-white.ts',
  ],
  css: {
    splitting: true,
  },
  dts: true,
})
