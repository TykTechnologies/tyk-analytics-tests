module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [`plugin:@typescript-eslint/recommended`],
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    semi: [`error`, `always`],
    "@typescript-eslint/no-floating-promises": ["error"]
  },
  ignorePatterns: ['**/*.js']
}
