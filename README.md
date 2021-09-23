# phixi.js

Bridge library to use pixi.js like phina.js

# Install

## npm

### v6.9+ (minimum required)

peerDependencies should be maually installed

`npm i phixi@npm:@pentamania/phixi pixi.js phina.js@npm:@pentamania/phina`

### v7.x

peerDependencies are automatically installed

`npm i phixi@npm:@pentamania/phixi`

## yarn

peerDependencies should be maually added

`yarn add phixi@npm:@pentamania/phixi pixi.js phina.js@npm:@pentamania/phina`

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

// phina.js Tweener feature
sprite.tweener
  .clear()
  .to({ x: 256 })
  .call(() => console.log('end'));
```

## phina-like app cycle

```js
// TODO
```

# License

MIT

# Other features

- Typescript typing supported
