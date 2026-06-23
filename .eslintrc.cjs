module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ]
  },
  env: {
    node: true,
    es2022: true
  },
  globals: {
    NodeJS: 'readonly',
    CloseEvent: 'readonly',
    path: 'readonly'
  },
  ignorePatterns: [
    'dist/**/*',
    'html/**/*',
    'node_modules/',
    '*.js.map',
    '*.d.ts.map',
    'scripts/build-api.ts',
    'scripts/cattedapi.json'
  ]
};
