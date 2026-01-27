/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  external: ['url', 'process', 'path'],
  input: './dist/api/scripts/api-handler.js',
  output: {
    importAttributesKey: 'with',
    file: './dist/api-handler.js',
    format: 'es',
  },
}
export default config
