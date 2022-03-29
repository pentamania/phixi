import { Sprite } from 'pixi.js';
import { Scene } from '../Scene';
import { TransitionScene, TransitionSceneOptions } from './TransitionScene';

export interface TransitionFadeOptions extends TransitionSceneOptions {
  fadeTime: number;
}
const defaultOptions: TransitionFadeOptions = {
  fadeTime: 1000,
  updateDuringTransition: 'both',
};

/**
 * Crossfade scenes
 */
export class TransitionFade extends TransitionScene {
  fadeTime: number;

  constructor(nextScene: Scene, options: TransitionFadeOptions) {
    const optionsFulfilled = {
      ...defaultOptions,
      ...options,
    };
    super(nextScene, optionsFulfilled);
    this.fadeTime = optionsFulfilled.fadeTime;
  }

  /**
   * @override
   */
  transit(prevScene: Scene, nextScene: Scene) {
    // Set up scene view sprites
    const nextSceneSprite = new Sprite(nextScene.getRenderTexture())
      .setOrigin(0, 0)
      .setAlpha(0)
      .addChildTo(this);
    const prevSceneSprite = new Sprite(prevScene.getRenderTexture())
      .setOrigin(0, 0)
      .addChildTo(this);

    return new Promise(cb => {
      // Cross-fade sprites with tweener
      const fadeTime = this.fadeTime;
      prevSceneSprite.tweener.to(
        {
          alpha: 0,
        },
        fadeTime
      );
      nextSceneSprite.tweener
        .to(
          {
            alpha: 1,
          },
          fadeTime
        )
        .call(cb);
    });
  }
}
