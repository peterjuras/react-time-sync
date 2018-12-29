module.exports = {
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  setupFiles: [
    "<rootDir>/test/requestAnimationFrame-shim.ts",
    "<rootDir>/test/setup-enzyme.ts"
  ],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.tsx"],
  coverageReporters: ["text"]
};