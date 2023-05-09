import { Graphics, Text } from 'pixi.js';
import { Scene } from '../app/Scene';
import { PhinaEvent } from '../core/types';

/**
 * Built-in title scene
 * WIP
 */
export class TitleScene extends Scene {
  titleLabel: Text;

  constructor(options?: any) {
    options = Object.assign({}, { title: 'phixi game' }, options);
    super();
    this.titleLabel = new Text(options.title, {
      fill: 0xffffff,
      fontSize: 46,
    }).setOrigin(0.5, 0.5);
    this.on(PhinaEvent.EnterScene, this._onEnter.bind(this));
  }

  _onEnter() {
    const width = this.screenWidth;
    const height = this.screenHeight;

    // Background
    new Graphics()
      .beginFill(0x323232)
      .drawRect(0, 0, width, height)
      .endFill()
      .addChildTo(this)
      .setInteractive(true)
      .on('pointerup', () => {
        // タップで次シーン移動
        this.exit();
      });

    this.titleLabel.addChildTo(this).setPosition(width / 2, height * 0.33);

    // TapStart
    new Text('Tap to start', {
      fill: 0xffffff,
      fontSize: 24,
    })
      .setOrigin(0.5, 0.5)
      .setPosition(width / 2, height * 0.66)
      .addChildTo(this);
  }
}
