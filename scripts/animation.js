class Animation {
  constructor({
    run = (delta) => {}}) {
    this.run = this.animate(run);

    this.time = 0.0;
  }

  animate(procedure) {
    return (delta) => {
      this.time += delta * 16.66;
      procedure(delta, this.time);
    };
  }
}

module.exports = Animation;
