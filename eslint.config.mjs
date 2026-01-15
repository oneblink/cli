import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import pluginMicrosoftSdl from '@microsoft/eslint-plugin-sdl'

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
const compat = new FlatCompat({
  baseDirectory: _dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['./node_modules/**', './examples/**', './docs/**', './dist/**'],
  },
  ...pluginMicrosoftSdl.configs.recommended,
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ),
  {
    plugins: { prettier },

    languageOptions: {
      globals: {
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },

      parser: tsParser,
      ecmaVersion: 2024,

      parserOptions: { project: './tsconfig.eslint.json' },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
