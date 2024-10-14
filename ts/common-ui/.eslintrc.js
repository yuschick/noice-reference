module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["@noice-com/react"],
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    project: ["./tsconfig.json"],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [],
  rules: {
    "no-restricted-imports": ["error", { 
      paths: [
        {
          name: "@noice-com/common-ui",
          message: "You are probably refactoring and forgot to fix an import. Files in common-ui should not import from external entry point."
        },
        {
          name: "lodash",
          message: "You should import function from lodash/[function]"
        }
      ],
      patterns: [
        {
          group: ["src/**/*", "src"],
          message: "You should import using alias or with relative path"
        },
        {
          group: ["@noice-com/*/dist/*"],
          message: "You should not import inside this package"
        },
        {
          group: ['@common-assets/icons/**/*'],
          message: "You should import "
        }
      ]
    }],
    "import/no-restricted-paths": ["error", {
      zones: [
        {
          target: "./src/analytics",
          from: "./src/!(analytics)/*",
          message: "Analytics should depend on nothing"
        },
        {
          target: "./src/assets",
          from: "./src/!(assets)/*",
          message: "Assets should depend on nothing"
        },
        {
          target: "./src/classes",
          from: "./src/!(assets|classes|components|constants|transform|types|utils)/**/*",
          message: "Classes should not depend from this"
        },
        {
          target: "./src/components",
          from: "./src/!(assets|classes|components|context|hooks|story-helpers|types|utils)/*",
          message: "Components should not depend from this"
        },
        {
          target: "./src/config",
          from: "./src/!(classes|config|types)/*",
          message: "Config should not depend from this"
        },
        {
          target: "./src/constants",
          from: "./src/!(constants)/*",
          message: "Constants should depend on nothing"
        },
        {
          target: "./src/context",
          from: "./src/!(classes|context|types|utils)/*",
          message: "Context should not depend from this"
        },
        {
          target: "./src/hooks",
          from: "./src/!(classes|config|context|hooks|types|utils)/*",
          message: "Hooks should not depend from this"
        },
        {
          target: "./src/story-helpers",
          from: "./src/!(story-helpers|types|context)/*",
          message: "Story helpers should not depend from this"
        },
        {
          target: "./src/styles",
          from: "./src/!(styles)/*",
          message: "Styles should depend on nothing"
        },
        {
          target: "./src/transform",
          from: "./src/!(constants|transform|types|utils)/*",
          message: "Transform should not depend from this"
        },
        {
          target: "./src/types",
          from: "./src/!(types)/*",
          message: "Types should depend on nothing"
        },
        {
          target: "./src/utils",
          from: "./src/!(assets|types|utils)/*",
          message: "Utils should not depend from this"
        },
      ],
    }],
  }
};
