module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es2021": true
  },
  "ignorePatterns": [
    ".eslintrc.js",
    "package.json",
    "dist/*"
  ],
  "extends": [
    "plugin:jsx-a11y/recommended",
    "@noice-com/react",
  ],
  "parser": "@typescript-eslint/parser",
  "settings": {
    "react": {
      "version": "detect"
    },
  },
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
    "import/no-restricted-paths": ["error", {
      "zones": [
        {
          "target": "./src/assets",
          "from": "./src/**/*",
          "message": "Assets should not depend on anything"
        },
        {
          "target": "./src/common",
          "from": "./src/!(common)/**/*",
          "message": "Common should not depend on anything else"
        },
        {
          "target": "./src/pages",
          "from": "./src/!(assets|common|pages)/**/*",
          "message": "Pages should not depend from this"
        },
        {
          "target": "./src/page",
          "from": "./src/!(assets|common|page)/**/*",
          "message": "page should not depend from this"
        },
      ],
    }],
    "no-restricted-imports": ["error", { 
      patterns: [
        {
          group: ["@noice-com/*/src/*"],
          message: "You should not import inside this package"
        }
      ]
    }],    
  }
}
