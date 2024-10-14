module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ["./tsconfig.json"],
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        '@noice-com'
    ],
    "rules": {
        "no-restricted-imports": ["error", { 
          paths: [
            {
              name: "@noice-com/utils",
              message: "Package is not used in this project. If you need logger, this project has own logger"
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
            }
          ]
        }],
        "no-console": "warn",
      }
};