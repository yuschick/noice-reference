module.exports = {
    "collectCoverage": true,
    "collectCoverageFrom": [
        "<rootDir>/**/*.ts"
    ],
    "coverageDirectory": "../coverage",
    "rootDir": "./src",
    "testMatch": [
        "<rootDir>/**/__tests__/**/*.+(ts|tsx|js)",
        "<rootDir>/**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testPathIgnorePatterns": ["mocks"],
};
