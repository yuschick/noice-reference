const { pathsToModuleNameMapper } = require('ts-jest');
const {
  compilerOptions: { paths: appPaths },
} = require('./tsconfig');
const {
  compilerOptions: { paths: commonPaths },
} = require('../../lib/ts/common-ui/tsconfig');

module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
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
    '\\.(png|css|svg(\\?url)?|mp4|webp)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(glsl|fbx|glb|exr|hdr)$': '<rootDir>/src/__mocks__/fileMock.js',
    ...pathsToModuleNameMapper(appPaths, { prefix: '<rootDir>/src' }),
    ...pathsToModuleNameMapper(commonPaths, {
      prefix: '<rootDir>/../../lib/ts/common-ui',
    }),
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest'],
  },
  testPathIgnorePatterns: ['mocks'],
  testEnvironment: 'jsdom',
};
