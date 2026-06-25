import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/register.ts',
    'src/fit-screen/index.ts',
    'src/border-box-8/index.ts',
  ],
  dts: true,
  publint: true,
})
