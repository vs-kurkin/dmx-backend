import eslintJs from '@eslint/js';
import eslintTsPlugin from '@typescript-eslint/eslint-plugin';
import eslintTsParser from '@typescript-eslint/parser';
import globalVariables from 'globals';

export default [
  {
    ...eslintJs.configs.recommended,
    ...eslintTsPlugin.configs.strictTypeChecked,
    ...eslintTsPlugin.configs.stylisticTypeChecked,
  },

  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: { ...globalVariables.node },
      parser: eslintTsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: eslintTsPlugin,
    rules: {
      '@typescript-eslint/no-explicit-any': [ 'warn', { fixToUnknown: true } ],
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-vars': 'off',
      'quotes': [ 'error', 'single', { 'avoidEscape': true } ],
    },
  },

  {
    files: ['test/**/*'],
    languageOptions: {
      globals: { ...globalVariables.jest, ...globalVariables.node },
    },
  },
];
