module.exports = {
  // root: true,
  "settings": {
    "import/resolver": {
      "typescript": {}
    },
  },
  env: {
    browser: true,
    es2021: true
  },
  plugins: [
    'playwright',
    "@typescript-eslint",
    "import",
  ],
  extends: [
    `plugin:@typescript-eslint/recommended`,
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
  ],
  parser: `@typescript-eslint/parser`,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    semi: [`error`, `always`],
    "@typescript-eslint/no-floating-promises": ["error"],
'playwright/await-async-selector': 'error',
    "block-spacing": ["error"],
    "space-before-blocks": ["error"],
    "object-curly-spacing": ["error", "always", { "objectsInObjects": true }],
    "no-multiple-empty-lines": ["error"],
    "indent": ["error", 2],
    "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }]
  },
  ignorePatterns: ['**/*.js'],
  settings: {
    "playwright": {
      "additionalAssertFunctionNames": ["toBeSelected"]
    }
  }
}
