const { pathsToModuleNameMapper } = require('ts-jest');
const {
  compilerOptions: { paths: appPaths },
} = require('./tsconfig');
const {
  compilerOptions: { paths: commonUIPaths },
} = require('../common-ui/tsconfig');

module.exports = {
  setupFiles: ['<rootDir>/jest-setup.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/transform/**/*.ts'],
  coverageDirectory: 'coverage',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.+(ts|tsx|js)',
    '<rootDir>/src/**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  moduleNameMapper: {
    '\\.(png|css|svg(\\?url)?|mp4|webp|webm)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(glsl|fbx|glb|exr|hdr)$': '<rootDir>/src/__mocks__/fileMock.js',
    ...pathsToModuleNameMapper(appPaths, { prefix: '<rootDir>' }),
    ...pathsToModuleNameMapper(commonUIPaths, {
      prefix: '<rootDir>/../common-ui',
    }),
  },
  transform: {
    '^.+\\.(ts|tsx|js)$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  testPathIgnorePatterns: ['mocks'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    "node_modules/(?!three|crypto-hash)",
  ],
};
