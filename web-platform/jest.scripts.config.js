module.exports = {
  "collectCoverage": false,
  "rootDir": "./scripts",
  "testMatch": [
      "<rootDir>/**/__tests__/**/*.+(ts|tsx|js)",
      "<rootDir>/**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "testPathIgnorePatterns": ["mocks"],
};
