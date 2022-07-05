const path = require('path');

module.exports = {
  displayName: '',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/__tests__/**/?(*.)+(spec|test).js',
  ],
  verbose: true,
  collectCoverage: true,
  clearMocks: true,
  globalTeardown: path.join(__dirname, '/teardown.js'),
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/templates/*',
    '!src/resources/*',
    '!**/coverage/**',
    '!**/migrations/**',
    '!**/seeders/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js',
    '!**/dist/**',
  ],
};
