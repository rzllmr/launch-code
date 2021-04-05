const CodeCheck = require('./codecheck');

class View {
  constructor() {
    this.code = new CodeCheck();
    this.animations = new Map();
    this.activeAnimations = new Set();
    this.addAnimations(this.registerAnimations());

    this.tests = new Map();
    this.addTests(this.registerTests());

    $(window).on('test', (_, testName) => {
      if (this.tests.has(testName) == false) return;
      this.runTest(this.tests.get(testName));
    });
  }

  registerTests() {
    throw Error('override registerTests() in ' + this.constructor.name);
  }

  registerAnimations() {
    throw Error('override registerAnimations() in ' + this.constructor.name);
  }

  addTests(tests) {
    for (const [name, object] of Object.entries(tests)) {
      this.tests.set(name, object);
    }
  }

  runTest(test) {
    let lastPromise = Promise.resolve();
    for (const check of test.checks) {
      lastPromise = lastPromise.then((input) => {
        return check.execute(input);
      }).then((output) => {
        check.success(output);
        return output;
      }).catch((error) => {
        check.failure(error);
      });
    }
    lastPromise.finally(test.finalize);
  }

  addAnimations(animations) {
    for (const [name, object] of Object.entries(animations)) {
      this.animations.set(name, object);
    }
  }

  startAnimation(name) {
    if (this.animations.has(name) == false) {
      throw new Error(`no such animation: ${name}`);
    }

    this.activeAnimations.add(name);
  }

  stopAnimation(name) {
    this.activeAnimations.delete(name);
  }

  update(delta) {
    for (const name of this.activeAnimations) {
      this.animations.get(name).run(delta);
    }
  }

  object(name) {
    return this.constructor.objects.get(name);
  }
}

View.objects = new Map();
View.objectsInfo = {};

module.exports = View;
