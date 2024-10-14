module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['@noice-com/react'],
  parser: '@typescript-eslint/parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@noice-com/common-ui',
            message: "This package can not use the common-ui package.",
          },
        ],
        patterns: [
          {
            group: ['src/*'],
            message: 'You should import using alias or with relative path',
          },
          {
            group: ['@noice-com/*/dist/*'],
            message: 'You should not import inside this package',
          },
        ],
      },
    ],
  },
};
