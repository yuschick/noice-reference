const { pathsToModuleNameMapper } = require("ts-jest");
const {
  compilerOptions: { paths: appPaths },
} = require("./tsconfig");
const {
  compilerOptions: { paths: commonUIPaths },
} = require("../../lib/ts/common-ui/tsconfig");
const {
  compilerOptions: { paths: gamePaths },
} = require("../../lib/ts/card-game/tsconfig");
const {
  compilerOptions: { paths: streamPaths },
} = require("../../lib/ts/stream/tsconfig");
const {
  compilerOptions: { paths: socialPaths },
} = require("../../lib/ts/social/tsconfig");
const {
  compilerOptions: { paths: rendererPaths},
} = require("../../lib/ts/renderer/tsconfig");


module.exports = {
  setupFiles: ["<rootDir>/jest-setup.js"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.hook.ts"],
  coverageDirectory: "coverage",
  rootDir: ".",
  roots: ["<rootDir>/src"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.+(ts|tsx|js)",
    "<rootDir>/src/**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  moduleFileExtensions: ["js", "ts", "tsx", "yml"],
  moduleNameMapper: {
    "\\.(png|css|svg(\\?url)?|mp4|webp|webm)$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(glsl|fbx|glb|exr|hdr)$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(ts\\?worker&url)$": "<rootDir>/src/__mocks__/fileMock.js",
    ...pathsToModuleNameMapper(appPaths, { prefix: "<rootDir>" }),
    ...pathsToModuleNameMapper(commonUIPaths, {
      prefix: "<rootDir>/../../lib/ts/common-ui",
    }),
    ...pathsToModuleNameMapper(gamePaths, {
      prefix: "<rootDir>/../../lib/ts/card-game",
    }),
    ...pathsToModuleNameMapper(streamPaths, {
      prefix: "<rootDir>/../../lib/ts/stream",
    }),
    ...pathsToModuleNameMapper(socialPaths, {
      prefix: "<rootDir>/../../lib/ts/social",
    }),
    ...pathsToModuleNameMapper(rendererPaths, {
      prefix: "<rootDir>/../../lib/ts/renderer/src",
    }),
  },
  transform: {
    "^.+\\.(ts|tsx|js)$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
  testPathIgnorePatterns: ["mocks"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!three|crypto-hash)",
  ],
};
