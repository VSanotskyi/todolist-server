import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    node: true,
    es2020: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
});
