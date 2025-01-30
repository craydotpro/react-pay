module.exports = {
  env: {
    browser: true, // Includes browser globals
    es2021: true, // Supports ECMAScript 2021 features
    node: true // Includes Node.js globals
  },
  extends: [
    'eslint:recommended', // Use recommended ESLint rules
    'plugin:@typescript-eslint/recommended', // Use recommended rules from `@typescript-eslint`
    'prettier' // Integrate Prettier for code formatting
  ],
  parser: '@typescript-eslint/parser', // Use TypeScript parser
  parserOptions: {
    ecmaVersion: 12, // Specify ECMAScript version
    sourceType: 'module' // Use ES module syntax
  },
  plugins: ['@typescript-eslint'], // Include the TypeScript plugin
  rules: {
    'no-console': 'warn', // Warn on `console` usage
    'no-unused-vars': 'off', // Disable default rule (handled by TS)
    '@typescript-eslint/no-unused-vars': ['error'], // Enforce unused variables rule
    '@typescript-eslint/no-explicit-any': 'warn', // Warn on `any` usage
    '@typescript-eslint/explicit-module-boundary-types': 'off' // Optional, depending on your preferences
  }
}
