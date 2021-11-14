# phixi.js

Bridge library to use pixi.js like phina.js

# Install

`npm i phixi pixi.js phina.js`

npm v6.9+ required

# Features

## pixi.js extension

```js
const app = new PIXI.Application();
const sprite = PIXI.Sprite.from("./assets/player.png");

// pixi.js only
sprite.position.set(128, 128);
sprite.anchor.set(0.5, 0.5);
app.stage.addChild(sprite);
// When removing
app.stage.removeChild(sprite);

// With phixi
sprite
  .setPosition((128, 128)
  .setOrigin(0.5, 0.5)
  .addChildTo(app.stage)
;
// When removing
sprite.remove();
```

## Using phina.js features

```js
const sprite = PIXI.Sprite.from('./assets/player.png');

// Using phina.js Tweener feature
sprite.tweener
  .clear()
  .to({ x: 256 })
  .call(() => console.log('tweener end'));
```

## phina-like app cycle

```js
const ImageDic = {
  logo: 'logo',
};

/**
 * Params for app
 * This option is also used for scene constructor
 */
const appOptions = {
  width: 512,
  height: 512,
  assets: {
    // Use PIXI.Loader to load image assets
    pixi: {
      [ImageDic.logo]: 'path/to/logo.png',
    },
  },
};

// global "MainScene" class will be automatically detected and use
window.MainScene = class extends phixi.Scene {
  constructor(appOptionRef) {
    super();

    // Create Sprite (Pure pixi.Sprite can be also used)
    const logoSprite = new phixi.Sprite(ImageDic.logo)
      .setOrigin(0.5, 0.5)
      .addChildTo(this);

    // Access to App class is available after "enter" event
    this.on('enter', () => {
      const view = this.app.view;
      logoSprite.setPosition(view.width * 0.5, view.height * 0.5);
    });
  }

  /**
   * Called every frame (60 times/sec in default) if the scene is active
   * This is like Unity's "OnUpdate"
   */
  onUpdate(app) {
    // Detect keyboard input
    const kb = app.keyboard;
    if (kb.getKeyDown('space')) {
      // Go to next scene
      this.exit({ score: 2000 });
    }
  }
};

// Create App and run
const app = new phixi.GameApp(appOptions);
app.run();
```

## Apply phina features (experimental)

You can apply some features
(This feature is experimental, and the behavior or method name may change)

```js
phixi.applyPhinaFeature({
  rotationAsDegree: true,
  enableUpdateMethod: true,
});
```

### Option: rotationAsDegree

In pixi.js, DisplayObject's `rotation` property is radian-base, but setting this option to true will override property to degree-base, which is how phina.js treats `rotation`.

(You have to use `angle` to achieve this with pure pixi.js)

```js
// radian-base
sprite.rotation = (Math.PI * 1) / 2;
```

```js
// to degree-base
sprite.rotation = 90;
```

### Option: enableUpdateMethod

In phina.js, the name of method used for every-frame update is `update`, but this is avoided for phixi since some pixi.js classes already occupies `update` (ex. [pixi.AnimatedSprite](https://pixijs.download/dev/docs/PIXI.AnimatedSprite.html#update))

Despite, you can force to use `"update"` by turning this option to true.

```js
class FooSprite extends phixi.Sprite {
  onUpdate(app) {
    // do something every frame
  }
}
```

to

```js
class FooSprite extends phixi.Sprite {
  update(app) {
    // do something every frame
  }
}
```

This is achieved by manually refusing the pixi class's original `update` method, but make sure that if pixi adds `update` to another class in future, this option may not work properly.

# License

MIT

# Other features

- Typescript typing supported
