const config = require("./.jest.js");

module.exports = {
  ...config,
  coverageReporters: ["lcov"],
};
