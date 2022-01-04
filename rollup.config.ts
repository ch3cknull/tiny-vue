import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

const exportDir = `lib`
const exportFile = `mini-vue`

export default defineConfig({
  input: 'index.ts',
  output: [
    {
      format: 'cjs',
      file: `${exportDir}/${exportFile}.cjs.js`,
    },
    {
      format: 'es',
      file: `${exportDir}/${exportFile}.esm.js`,
    },
  ],
  plugins: [typescript()],
})
