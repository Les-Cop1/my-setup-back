/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@helpers': '<rootDir>/src/helpers',
    '@controllers': '<rootDir>/src/controllers',
    '@models': '<rootDir>/src/models',
    '@routes': '<rootDir>/src/routes',
    '@types': '<rootDir>/src/types',
  },
  testTimeout: 50000,
}
