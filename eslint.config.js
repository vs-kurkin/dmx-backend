import js from '@eslint/js'
import tsLintPlugin from '@typescript-eslint/eslint-plugin'
import tsLintParser from '@typescript-eslint/parser'
import globals from 'globals'

export default [
  {
    ...js.configs.recommended,
    ...tsLintPlugin.configs.strictTypeChecked,
    ...tsLintPlugin.configs.stylisticTypeChecked,
  },

  {
    files: [ 'src/**/*.ts' ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsLintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: true,
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: tsLintPlugin,
  },

  {
    files: [ 'test/**/*' ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },
]
