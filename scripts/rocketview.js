const View = require('./view');
const {Check, Test} = require('./test');
const Animation = require('./animation');

class RocketView extends View {
  constructor() {
    super();

    this.object('rocket').visible = true;
    this.object('icons').y = -88;
  }

  registerTests() {
    return {
      rocket: this.rocketTest()
    };
  }

  registerAnimations() {
    return {
      check: this.checkAnimation(),
      launch: this.launchAnimation()
    };
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
      }
    });
  }

  checkAnimation() {
    this.nextStep = 100.0;
    return new Animation({
      run: (delta, time) => {
        if (time > this.nextStep) {
          this.nextStep += 100.0;
          this.object('spinner').angle += 30;
        }
      }
    });
  }

  launchAnimation() {
    return new Animation({
      run: (delta, time) => {
        this.object('rocket').y -= 1 * delta;
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
