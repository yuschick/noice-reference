const { pathsToModuleNameMapper } = require('ts-jest');
const {
  compilerOptions: { paths },
} = require('./tsconfig');
const {
  compilerOptions: { paths: rendererPaths },
} = require('../renderer/tsconfig.json');

module.exports = {
  setupFiles: ['<rootDir>/jest-setup.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.+(ts|tsx|js)',
    '<rootDir>/src/**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  moduleNameMapper: {
    '\\.(png|css|svg(\\?url)?|mp4|webp|webm)$': '<rootDir>/src/__mocks__/fileMock.js',
    ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>' }),
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      isolatedModules: true,
    }],
  },
  testPathIgnorePatterns: ['mocks'],
  testEnvironment: 'jsdom',
};
