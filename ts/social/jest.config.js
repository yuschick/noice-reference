const { pathsToModuleNameMapper } = require('ts-jest');
const {
  compilerOptions: { paths: socialPaths },
} = require('./tsconfig');
const {
  compilerOptions: { paths: commonPaths },
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
    '\\.(png|css|svg(\\?url)?|mp4|webp)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(glsl|fbx|glb|exr|hdr)$': '<rootDir>/src/__mocks__/fileMock.js',
    ...pathsToModuleNameMapper(socialPaths, { prefix: '<rootDir>' }),
    ...pathsToModuleNameMapper(commonPaths, {
      prefix: '<rootDir>/../common-ui',
    }),
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  testPathIgnorePatterns: ['mocks'],
  testEnvironment: 'jsdom',
};
