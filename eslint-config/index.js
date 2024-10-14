module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // MAKE SURE THIS IS LAST!
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    curly: ['error', 'all'],
    semi: ['error', 'always'],
    eqeqeq: ['error', 'always'],
    'max-len': 'off',
    'no-console': 'error',
    'no-plusplus': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'no-prototype-builtins': 'off',
    'class-methods-use-this': 'off',
    'no-extra-boolean-cast': [
      'error',
      {
        enforceForLogicalOperands: true,
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-named-as-default': 'off',
    'sort-imports': 'off',
    'import/named': 'off',
    'import/namespace': 'off',
    'constructor-super': 'off',
    'no-this-before-super': 'off',
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array',
        readonly: 'array',
      },
    ],
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'local',
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: false,
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        // enforce variables/functions to camelCase
        selector: ['variable', 'function'],
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: ['parameter'],
        format: ['camelCase'],
      },
      {
        // Force destructured params to camel case
        selector: ['parameter'],
        modifiers: ['destructured'],
        format: ['camelCase'],
      },
      {
        // Allow certain params to pascal case
        selector: ['parameter', 'typeProperty', 'objectLiteralProperty'],
        format: ['PascalCase', 'camelCase'],
        filter: {
          regex: '(Icon|Component|Story|BoosterIcon)$',
          match: true,
        },
      },
      {
        // Allow certain destructured params to pascal case
        selector: ['parameter'],
        modifiers: ['destructured'],
        format: ['PascalCase', 'camelCase'],
        filter: {
          regex: '(Icon|Component|Story)$',
          match: true,
        },
      },
      {
        // Force unused params to have leading underscore
        selector: ['parameter', 'variable'],
        modifiers: ['unused'],
        leadingUnderscore: 'require',
        format: ['camelCase'],
      },
      {
        // allow styled components to uppercase
        selector: ['variable', 'function'],
        modifiers: ['global'],
        format: ['camelCase', 'PascalCase'],
      },
      {
        // enforce global constants as UPPER_CASE
        selector: 'variable',
        modifiers: ['global', 'const'],
        types: ['boolean', 'string', 'number'],
        format: ['UPPER_CASE'],
        leadingUnderscore: 'allowSingleOrDouble',
      },
      {
        // Ignore properties that require quotes
        selector: [
          'classProperty',
          'objectLiteralProperty',
          'typeProperty',
          'classMethod',
          'objectLiteralMethod',
          'typeMethod',
          'accessor',
          'enumMember',
        ],
        format: null,
        modifiers: ['requiresQuotes'],
      },
      {
        // Enums
        selector: ['enum', 'enumMember'],
        format: ['PascalCase'],
      },
      {
        // Classes
        selector: ['class', 'interface', 'typeAlias'],
        format: ['PascalCase'],
      },
      {
        // Properties
        selector: ['property', 'accessor'],
        modifiers: ['public'],
        format: ['camelCase'],
      },
      {
        // Private properties
        selector: ['property', 'method'],
        modifiers: ['private', 'protected'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      {
        // static properties
        selector: ['property', 'method'],
        modifiers: ['static', 'public'],
        format: ['PascalCase'],
      },
      {
        // Private static properties
        selector: ['classProperty'],
        modifiers: ['private', 'protected', 'static'],
        format: ['PascalCase'],
        leadingUnderscore: 'require',
      },
      {
        // Allow '__typename' property used in Apollo cache modifications and TypeScript types
        selector: ['objectLiteralProperty', 'typeProperty'],
        format: null,
        filter: {
          regex: '^__typename$',
          match: true
        }
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          constructors: 'off',
        },
      },
    ],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          // Index signature
          'signature',

          // Fields
          'public-field',
          'protected-field',
          'private-field',
          'field',
          'constructor',
          'private-method',
          'protected-method',
          'public-method',
          'method',
        ],
      },
    ],
    '@typescript-eslint/consistent-type-exports': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
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
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'block-like', next: 'block-like' },
      { blankLine: 'always', prev: 'const', next: 'return' },
    ],
    'import/no-absolute-path': 'error',
    'import/no-cycle': 'off',
    "@typescript-eslint/padding-line-between-statements": [
      "error",
      {
        "blankLine": "always",
        "prev": "*",
        "next": ["interface"]
      },
      {
        "blankLine": "always",
        "prev": ["interface"],
        "next": "*"
      }
    ]
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
