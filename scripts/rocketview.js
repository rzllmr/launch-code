
const {Check, Test} = require('./test');
const View = require('./view');

class RocketView extends View {
  constructor() {
    super();

    this.object('rocket').visible = true;
    this.object('icons').y = -88;

    this.registerAnimations();
    this.timer = [0.0, 100.0, 100.0];

    this.tests = new Map([
      ['rocket', this.rocketTest()]
    ]);

    require('fake');
  }

  rocketTest() {
    return new Test({
      checks: [
        new Check({
          success: (output) => {
            this.object('check').visible = false;
            this.object('error').visible = false;
            this.object('spinner').visible = true;
            this.startAnimation('check');
          }
        }),
        new Check({
          execute: (input) => this.code.compile(['code/rocket.ts'])
        }),
        new Check({
          execute: (files) => this.code.require(files),
        }),
        new Check({
          execute: (modules) => this.code.instance(modules, 'Rocket'),
          success: (object) => {
            this.object('check').visible = true;
          },
          failure: (error) => {
            this.object('error').visible = true;
            throw new Error();
          }
        }),
        new Check({
          execute: (object) => this.code.property(object, 'ready'),
          success: (value) => this.startAnimation('launch')
        })
      ],
      finalize: () => {
        this.stopAnimation('check');
        this.object('spinner').visible = false;
        this.timer = [0.0, 100.0, 100.0];
      }
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
