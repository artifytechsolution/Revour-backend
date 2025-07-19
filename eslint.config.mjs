import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config} */
const config = {
  overrides: [
    {
      files: ['**/*.{js,mjs,cjs,ts}'],
    },
    {
      files: ['**/*.js'],
      languageOptions: {
        sourceType: 'module',
      },
    },
    {
      files: ['**/*.ts'],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: './tsconfig.json',
          tsconfigRootDir: process.cwd(),
        },
      },
    },
  ],
  languageOptions: {
    globals: globals.browser,
  },
  rules: {
    eqeqeq: 'off',
    'no-unused-vars': 'error',
    'no-duplicate-imports': 'error',
    'import/no-unused-modules': 'error',
    'no-unused-vars': 'error',
    'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
  },
  ignores: ['node_modules/', 'dist/', 'build/'], // Fix ignore syntax
  plugins: {
    '@typescript-eslint': tseslint,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
};

export default config;
