const { pathsToModuleNameMapper } = require('ts-jest');
const {
  compilerOptions: { paths: appPaths },
} = require('./tsconfig');
const {
  compilerOptions: { paths: commonPaths },
} = require('../../lib/ts/common-ui/tsconfig');

module.exports = {
  setupFiles: ['<rootDir>/jest-setup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.+(ts|tsx|js)',
    '<rootDir>/src/**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  moduleNameMapper: {
    '\\.(png|css|svg(\\?url)?|mp4|yml|webp)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(glsl|fbx|glb|exr|hdr)$': '<rootDir>/src/__mocks__/fileMock.js',
    ...pathsToModuleNameMapper(appPaths, { prefix: '<rootDir>' }),
    ...pathsToModuleNameMapper(commonPaths, {
      prefix: '<rootDir>/../../lib/ts/common-ui',
    }),
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      isolatedModules: true,
    }],
  },
  testPathIgnorePatterns: ['mocks'],
  testEnvironment: 'jsdom',
};
