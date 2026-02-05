/**
 * Jest configuration for Integration Tests
 * Use with: npm run test:integration
 * Note: Database must be running (PostgreSQL on localhost:5432)
 */

export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  coverageDirectory: 'coverage/integration',
  testMatch: [
    '**/__tests__/integration/**/*.test.ts'
  ],
  testPathIgnorePatterns: [
    '__tests__/utils/',
    '__tests__/services/',
    '__tests__/setup/'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/setup/integration-setup.ts'
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        isolatedModules: true,
        tsconfig: {
          module: 'esnext',
          moduleResolution: 'node',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true
        }
      }
    ]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testTimeout: 60000,
  maxWorkers: 1,
  bail: 0,
  forceExit: true,
  detectOpenHandles: false,
  verbose: true
};
