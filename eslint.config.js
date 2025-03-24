// eslint.config.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  files: ["src/**/*.ts", "tests/**/*.ts"],
  ignores: [".default.env"],
  rules: {
    // Add your custom rules here
  },
};
