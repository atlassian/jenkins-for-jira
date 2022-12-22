module.exports = {
    roots: [
      'src',
    ],
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/typings/', '/support/', '/dist/', '/fixtures/', '/helpers/'],
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*',
    ],
    coverageReporters: ['html', 'lcov'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    coverageDirectory: 'coverage',
    setupFilesAfterEnv: ['./jest-setup.js']
  };
