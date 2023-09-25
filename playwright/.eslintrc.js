module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  plugins:
  ['playwright'],
  extends: [`plugin:@typescript-eslint/recommended`],
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    semi: [`error`, `always`],
    "@typescript-eslint/no-floating-promises": ["error"],
    'playwright/await-async-selector': 'error'
  },
  ignorePatterns: ['**/*.js'],
  settings: {
    "playwright": {
      "additionalAssertFunctionNames": ["toBeSelected"]
    }
  }
}
