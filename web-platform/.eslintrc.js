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
    "no-restricted-imports": ["error", { 
      paths: [
        {
          name: "@noice-com/common-ui",
          importNames: ["useListenToUIEvent", "useTriggerUIEvent", "usePlaySound", "CommonUIEventType"],
          message: "Please import app own implementation from '@common/*' instead."
        },
        {
          name: "@noice-com/card-game",
          importNames: ["useStreamGame"],
          message: "Please import app own implementation from '@context/*' instead."
        },
        {
          name: "lodash",
          message: "You should import function from lodash/[function]"
        }
      ], 
      patterns: [
        {
          group: ["src/*"],
          message: "You should import using alias or with relative path"
        },
        {
          group: ["@noice-com/*/dist/*"],
          message: "You should not import inside this package"
        },
        {
          group: ["@noice-com/*/src/*"],
          message: "You should not import inside this package"
        }
      ]
    }],
    "import/no-restricted-paths": ["error", {
      "zones": [
        {
          "target": "./src/__mocks__",
          "from": ["./src/assets", "./src/common", "./src/context", "./src/globals", "./src/hooks", "./src/page", "./src/story-helpers", "./src/types", "./src/utils", "./src/web"],
          "message": "Mocks should not depend on this"
        },
        {
          "target": "./src/assets",
          "from": ["./src/assets/index.ts", "./src/__mocks__", "./src/common", "./src/context", "./src/globals", "./src/hooks", "./src/page", "./src/story-helpers", "./src/types", "./src/utils", "./src/web"],
          "message": "Assets should not depend on this"
        },
        {
          "target": "./src/common",
          "from": ["./src/__mocks__", "./src/hooks", "./src/page", "./src/story-helpers", "./src/utils", "./src/web"],
          "message": "Common should not depend on this"
        },
        {
          "target": "./src/context",
          "from": ["./src/context/index.ts", "./src/__mocks__", "./src/assets", "./src/common", "./src/hooks", "./src/page", "./src/story-helpers", "./src/utils", "./src/web"],
          "message": "Context should not depend on this"
        },
        {
          "target": "./src/globals",
          "from": ["./src/__mocks__", "./src/common", "./src/context", "./src/hooks", "./src/page", "./src/story-helpers", "./src/utils", "./src/web"],
          "message": "Globals should not depend on this"
        },
        {
          "target": "./src/page",
          "from": ["./src/__mocks__", "./src/story-helpers", "./src/web"]
        },
        {
          "target": "./src/story-helpers",
          "from": ["./src/__mocks__", "./src/assets", "./src/common", "./src/globals", "./src/hooks", "./src/page", "./src/utils", "./src/web"],
          "message": "Story helpers should not depend on this"
        },
        {
          "target": "./src/types",
          "from": ["./src/types/index.ts", "./src/__mocks__", "./src/assets", "./src/common", "./src/context", "./src/globals", "./src/hooks", "./src/page", "./src/story-helpers", "./src/utils", "./src/web"],
          "message": "Types should not depend on this"
        },
        {
          "target": "./src/components",
          "from": ["./src/FTUE", "./src/layouts", "./src/pages", "./src/sound", "./src/WebRouteRedirects"],
        },
        {
          "target": "./src/FTUE",
          "from": ["./src/FTUE/index.ts", "./src/components",  "./src/hooks",  "./src/layouts", "./src/pages", "./src/sound", "./src/WebRouteRedirects"],
        },
        {
          "target": "./src/hooks",
          "from": ["./src/components", "./src/FTUE",  "./src/layouts", "./src/pages", "./src/sound", "./src/WebRouteRedirects"],
        },
        {
          "target": "./src/layouts",
          "from": ["./src/layouts/index.ts", "./src/components", "./src/FTUE",  "./src/hooks", "./src/pages", "./src/sound", "./src/WebRouteRedirects"],
        },
        {
          "target": "./src/pages",
          "from": ["./src/FTUE",  "./src/hooks", "./src/WebRouteRedirects"],
        },
        {
          "target": "./src/WebRouteRedirects",
          "from": ["./src/components", "./src/FTUE",  "./src/hooks",  "./src/layouts", "./src/pages", "./src/sound"],
        },
      ],
    }],
  }
}
