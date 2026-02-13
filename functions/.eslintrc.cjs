const path = require('path');

module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: [
      path.join(__dirname, 'tsconfig.json'),
      path.join(__dirname, 'tsconfig.dev.json'),
    ],
  },
  ignorePatterns: ['dist/**', 'lib/**', '.eslintrc.cjs'],
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    'no-unused-vars': 'off',
    quotes: ['warn', 'single', { avoidEscape: true }],
    indent: ['error', 2, { SwitchCase: 1 }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/no-unresolved': 'off',
  },
};
