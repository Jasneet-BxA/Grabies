// jest.config.ts
import { createDefaultPreset } from 'ts-jest';
 
const tsJestTransformCfg = createDefaultPreset().transform;
 
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
 
  // Setup files for testing library/react or similar
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
 
  // Transform settings
  transform: {
    ...tsJestTransformCfg,
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },
 
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
 
  // Path alias support
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Alias support
    '^(\\.{1,2}/.*)\\.js$': '$1',    // Remove .js from ESM imports
    '\\.(css|scss|sass)$': 'identity-obj-proxy', // CSS mocking for frontend
    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js', // Optional image mocks
  },
 
  transformIgnorePatterns: [
    '/node_modules/(?!(\\@t3-oss/env-core)/)', // allow env-core to be transformed
  ],
 
  testMatch: [
    '**/__tests__/**/*.(test|spec).ts?(x)',
    '**/?(*.)+(test|spec).ts?(x)',
  ],
 
  // Coverage reports
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'html'],
};