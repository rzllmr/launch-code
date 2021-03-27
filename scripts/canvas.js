const RocketView = require('./rocketview');

class Canvas {
  constructor() {
    this.type = PIXI.utils.isWebGLSupported() ? 'WebGL' : 'canvas';
    this.app = new PIXI.Application({
      backgroundColor: 0xFFFFFF,
      antialias: true
    });
    document.body.appendChild(this.app.view);

    this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.display = 'block';
    this.app.renderer.autoResize = true;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    this.views = [RocketView];
    this.loader = PIXI.Loader.shared;
    this.loadImages();
  }

  scaleToWindow() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }

  loadImages() {
    this.loader.onProgress.add((_, resource) => {
      console.log('loading', resource.url);
    });

    for (const View of this.views) {
      for (const info of Object.values(View.objectsInfo)) {
        if ('image' in info) {
          this.loader.add(info['image']);
        }
      }
    }
    this.loader.add('missing', 'images/missing.png');

    this.loader.load((_, resources) => {
      const missingResource = resources['missing'];

      for (const View of this.views) {
        for (const [name, info] of Object.entries(View.objectsInfo)) {
          const parent = info['parent'];
          const image = info['image'];

          let object;
          if (image == undefined) {
            object = new PIXI.Container();
          } else {
            const resource = resources[image];
            object = new PIXI.Sprite(
              resource.error == null ? resource.texture : missingResource.texture
            );
            object.visible = false;
            object.anchor.set(0.5);
          }
          object.setParent(
            parent == 'global' ? this.app.stage : View.objects.get(parent)
          );
          View.objects.set(name, object);
        }
      }

      for (const View of this.views) {
        const view = new View();
        this.app.ticker.add((delta) => view.update(delta));
      }
    });

    this.app.stage.pivot.set(
      - this.app.renderer.view.width / 2,
      - this.app.renderer.view.height / 2
    );
  }
}

module.exports = Canvas;
