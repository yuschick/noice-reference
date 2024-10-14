const { pathsToModuleNameMapper } = require("ts-jest");
const {
  compilerOptions: { paths: appPaths },
} = require("./tsconfig");

module.exports = {
	preset: "jest-expo",
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/utils/**/*.ts"],
  coverageDirectory: "coverage",
  rootDir: ".",
  roots: ["<rootDir>/src"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.+(ts|tsx|js)",
    "<rootDir>/src/**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "yml"],
  moduleNameMapper: {
    "\\.(png|svg(\\?url)?|mp4|webm)$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(glsl|fbx|glb|exr|hdr)$": "<rootDir>/src/__mocks__/fileMock.js",
    ...pathsToModuleNameMapper(appPaths, { prefix: "<rootDir>" }),
		"^gen$": [
			"<rootDir>/gen/graphql.ts",
		],
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
				tsconfig: "tsconfig.spec.json",
        isolatedModules: true,
      },
    ],
  },
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@notifee)"
  ],
  testPathIgnorePatterns: ["mocks"],
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.ts", "../../node_modules/react-native-gesture-handler/jestSetup.js"],
};
