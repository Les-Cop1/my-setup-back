import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '@helpers': '<rootDir>/src/helpers',
    '@controllers': '<rootDir>/src/controllers',
    '@models': '<rootDir>/src/models',
    '@routes': '<rootDir>/src/routes',
    '@types': '<rootDir>/src/types',
  },
  testTimeout: 10000,
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'text'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/types/',
    '<rootDir>/src/models/',
    '<rootDir>/src/index.ts',
    'databaseConnection.ts',
    'getCorsOptions.ts',
    'test.config.ts',
  ],
}

export default config
