module.exports = {
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.tsx"],
  coverageReporters: ["text"],
  testEnvironment: "jsdom",
  testRunner: "jest-circus/runner",
};
