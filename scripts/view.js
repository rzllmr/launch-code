const CodeCheck = require('./codecheck');

class View {
  constructor() {
    this.code = new CodeCheck();
    this.animations = new Map();
    this.activeAnimations = new Set();
  }

  addAnimations(animations) {
    for (const [name, method] of Object.entries(animations)) {
      this.animations.set(name, method);
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
      this.animations.get(name)(delta);
    }
  }

  object(name) {
    return this.constructor.objects.get(name);
  }
}

View.objects = new Map();
View.objectsInfo = {};

module.exports = View;
