import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(\\@t3-oss/env-core)/)",
  ],
  testMatch: [
    "**/__test__/**/*.test.ts",
    "**/__tests__/**/*.test.ts",
    "**/?(*.)+(spec|test).ts",
  ],
  coverageReporters: ["json", "lcov", "text", "html"],
};
