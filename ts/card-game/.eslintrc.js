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
  globals: {
    NOICE: true,
  },
  rules: {
    "no-restricted-imports": ["error", {
      paths: [
        {
          name: "@noice-com/common-ui",
          importNames: ["usePlaySound", 'useListenToUIEvent', 'useTriggerUIEvent'],
          message: "Please import card-game own implementation from '@hooks' instead."
        },
        {
          name: "@noice-com/card-game",
          message: "You are probably refactoring and forgot to fix an import. Files in card-game should not import from external entry point."
        },
        {
          name: "@game-context",
          importNames: ["useCardGameAPI"],
          message: "Do not use the external API hook inside the package. It is meant to be used only outside this package."
        },
      ],
      patterns: [
        {
          group: ["src/*"],
          message: "You should import using alias or with relative path"
        },
        {
          group: ["@noice-com/*/dist/*"],
          message: "You should not import inside this package"
        }
      ]
    }],
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    "jsx-a11y/mouse-events-have-key-events": "warn",
    "import/no-restricted-paths": ["error", {
      "zones": [
        {
          "target": "./src/assets",
          "from": ["./src/classes", "./src/components", "./src/constants", "./src/context", "./src/events", "./src/hooks", "./src/game-logic", "./src/story-helpers", "./src/transform", "./src/types", "./src/utils"],
        },
        {
          "target": "./src/classes",
          "from": ["./src/classes/index.ts", "./src/assets", "./src/components", "./src/context", "./src/hooks", "./src/game-logic", "./src/story-helpers"],
        },
        {
          "target": "./src/components",
          "from": ["./src/components/index.ts", "./src/classes", "./src/transform"],
        },
        {
          "target": "./src/constants",
          "from": ["./src/constants/index.ts", "./src/assets", "./src/classes", "./src/components", "./src/context", "./src/events", "./src/hooks", "./src/game-logic", "./src/story-helpers", "./src/transform", "./src/types", "./src/utils"],
        },
        {
          "target": "./src/context",
          "from": ["./src/context/index.ts", "./src/assets", "./src/components", "./src/constants", "./src/events", "./src/story-helpers", "./src/transform", "./src/utils"],
        },
        {
          "target": "./src/events",
          "from": ["./src/events/index.ts", "./src/assets", "./src/components", "./src/constants", "./src/context", "./src/hooks", "./src/game-logic", "./src/story-helpers", "./src/transform", "./src/types", "./src/utils"],
        },
        {
          "target": "./src/hooks",
          "from": ["./src/hooks/index.ts", "./src/assets", "./src/classes", "./src/components", "./src/events", "./src/story-helpers", "./src/transform",],
        },
        {
          "target": "./src/game-logic",
          "from": ["./src/game-logic/index.ts", "./src/assets", "./src/classes", "./src/components", "./src/story-helpers", "./src/transform"],
        },
        {
          "target": "./src/story-helpers",
          "from": ["./src/story-helpers/index.ts", "./src/assets", "./src/classes", "./src/components", "./src/events", "./src/hooks", "./src/transform", "./src/utils"],
        },
        {
          "target": "./src/transform",
          "from": ["./src/transform/index.ts", "./src/assets", "./src/classes", "./src/components", "./src/constants", "./src/context", "./src/events", "./src/hooks", "./src/game-logic", "./src/story-helpers"],
        },
        {
          "target": "./src/types",
          "from": ["./src/types/index.ts", "./src/assets", "./src/classes", "./src/components", "./src/constants", "./src/context", "./src/events", "./src/hooks", "./src/game-logic", "./src/story-helpers", "./src/transform", "./src/utils"],
        },
        {
          "target": "./src/utils",
          "from": ["./src/utils/index.ts", "./src/classes", "./src/components", "./src/context", "./src/events", "./src/hooks", "./src/game-logic", "./src/story-helpers", "./src/transform"],
        },
      ],
    }],
  }
};
