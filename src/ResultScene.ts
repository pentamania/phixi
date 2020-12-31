import { Text } from 'pixi.js';
import { Scene } from './Scene';
import { PhinaEvent } from './types';

/**
 * Built-in result scene
 * WIP
 */
export class ResultScene extends Scene {
  label: Text;
  scoreLabel: Text;
  retryButton: Text;

  constructor(options?: { score: number | string }) {
    options = Object.assign({}, { score: 42 }, options);
    super();

    this.label = new Text('Result', {
      fill: 0xffffff,
      fontSize: 32,
    }).setOrigin(0.5, 0.5);

    this.scoreLabel = new Text(`${options.score}`, {
      fill: 0xffffff,
      fontSize: 32,
    }).setOrigin(0.5, 0.5);

    this.retryButton = new Text('Retry', {
      fill: 0xffffff,
      fontSize: 32,
    })
      .setInteractive(true)
      .setOrigin(0.5, 0.5);
    this.retryButton.buttonMode = true;

    this.on(PhinaEvent.EnterScene, this._onEnter.bind(this));
  }

  _onEnter() {
    const width = this.viewportWidth;
    const height = this.viewportHeight;

    this.label.addChildTo(this).setPosition(width / 2, height * 0.25);
    this.scoreLabel.addChildTo(this).setPosition(width / 2, height * 0.5);
    this.retryButton
      .addChildTo(this)
      .setPosition(width / 2, height * 0.75)
      .on('pointerup', () => {
        // Back to title scene
        this.exit('title');
      });
  }
}
