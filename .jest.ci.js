const config = require("./.jest.js");

module.exports = {
  ...config,
  coverageReporters: ["lcov"],
  reporters: ["default", "jest-junit"]
};
