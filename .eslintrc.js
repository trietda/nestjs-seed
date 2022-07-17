const baseRules = require('eslint-config-airbnb-base/rules/style');

const [_, ...restricted] = baseRules.rules['no-restricted-syntax'];

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-syntax': [
      'error',
      ...restricted.filter((rule) => rule.selector !== 'ForOfStatement'),
    ],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/indent': 'off',
  },
};
