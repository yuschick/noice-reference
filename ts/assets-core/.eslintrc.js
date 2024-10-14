module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "ignorePatterns": [
    ".eslintrc.json",
    "package.json",
    "node_modules/*"
  ],
  "extends": [
    "@noice-com",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["./tsconfig.json"],
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [],
  "rules": {}
}
