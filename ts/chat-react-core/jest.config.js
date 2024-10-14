const {
  compilerOptions: { paths: packagePaths },
} = require('./tsconfig');

module.exports = {
  collectCoverage: true,
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
