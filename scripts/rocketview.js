
const View = require('./view');

class RocketView extends View {
  constructor() {
    super();

    this.object('rocket').visible = true;
    this.object('icons').y = -88;

    this.registerAnimations();

    this.timer = [0.0, 100.0, 100.0];
    $(window).on('compile', this.checkCode.bind(this));
  }

  checkCode() {
    this.object('check').visible = false;
    this.object('error').visible = false;
    this.object('spinner').visible = true;

    this.startAnimation('check');

    console.log('compiling', this.constructor.name);
    this.code.compile(['code/rocket.ts', 'code/subdir/part.ts']).then((jsFiles) => {
      console.log('files', jsFiles);
      return this.code.require(jsFiles);
    }).then((modules) => {
      console.log('modules', modules);
      return this.code.instance(modules, 'Rocket');
    }).then((object) => {
      console.log('object', object);
      this.object('check').visible = true;
      return this.code.property(object, 'ready');
    }).then((value) => {
      console.log('value', value);
      if (value === true) {
        this.startAnimation('launch');
      }
    }).catch((errors) => {
      this.object('error').visible = true;
      console.log(errors);
    }).finally(() => {
      this.stopAnimation('check');
      this.object('spinner').visible = false;
      this.timer = [0.0, 100.0, 100.0];
    });
  }

  registerAnimations() {
    this.addAnimations({
      check: (delta) => {
        const elapsed = delta * 16.66;
        this.timer[0] += elapsed;
        if (this.timer[0] > this.timer[1]) {
          this.timer[1] += this.timer[2];
          this.object('spinner').angle += 30;
        }
      },
      launch: (delta) => {
        this.object('rocket').y -= 1;
      }
    });
  }
}

RocketView.objectsInfo = {
  rocket: {parent: 'global', image: 'images/rocket.png'},
  icons: {parent: 'rocket'},
  check: {parent: 'icons', image: 'images/check.png'},
  error: {parent: 'icons', image: 'images/error.png'},
  spinner: {parent: 'icons', image: 'images/loading.png'}
};

module.exports = RocketView;
