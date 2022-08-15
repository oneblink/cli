import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  external: 'url,process,path,module',
  input: './dist/api/scripts/api-handler.js',
  output: {
    file: './dist/api-handler.js',
    format: 'es',
  },
  plugins: [
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
  ],
}
export default config
