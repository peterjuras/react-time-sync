module.exports = {
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.tsx"],
  coverageReporters: ["text"]
};
