module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "ignorePatterns": [
    ".babelrc",
    ".eslintrc.json",
    "package.json",
    "webpack.*.js",
    "dist/*"
  ],
  "extends": [
    "@noice-com",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["./tsconfig.json"],
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [],
  "globals": {
    "NOICE": true
  },
  "rules": {
    "no-console": "warn",
  }
}
