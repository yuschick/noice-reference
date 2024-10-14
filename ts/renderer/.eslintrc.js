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
    "dist/*"
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
  "globals": {
    "NOICE": true
  },
  "rules": {
    "no-console": "warn",
     /* todo: remove this when no cycle in project */
    "import/no-cycle": "warn"
  }
}
