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
          "message": "Assets should depend on nothing"
        },
        {
          "target": "./src/common",
          "from": "./src/!(common)/**/*",
          "message": "Common should not depend on anything else"
        },
        {
          "target": "./src/module-common",
          "from":  "./src/!(common|module-common|modules)/**/*",
          "message": "Module common should not depend from this"
        },
        {
          "target": "./src/modules",
          "from":  "./src/!(common|modules)/**/*",
          "message": "Modules should not depend from this"
        },
        {
          "target": "./src/pages",
          "from": "./src/!(common|pages)/**/*",
          "message": "Pages should not depend from this"
        },
      ],
    }],
    "no-restricted-imports": ["error", { 
      paths: [
        {
          name: "react-router-dom",
          importNames: ["Link"],
          message: "Please use the PermissionLink instead."
        }
      ], 
      patterns: [
        {
          group: ["@noice-com/*/src/*"],
          message: "You should not import inside this package"
        }
      ]
    }],
  }
}
