class Check {
  constructor({
    execute = (input) => {},
    success = (output) => {},
    failure = (error) => {}}) {
    this.execute = execute;
    this.success = success;
    this.failure = failure;
  }
}

class Test {
  constructor({
    checks = [],
    finalize = () => {}}) {
    this.checks = checks;
    this.finalize = finalize;
  }
}

module.exports = {
  Check: Check,
  Test: Test
};
