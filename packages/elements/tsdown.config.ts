import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/register.ts',
  ],
  dts: true,
  publint: true,
})
