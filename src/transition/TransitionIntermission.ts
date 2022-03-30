import { Container } from 'pixi.js';
import { BaseApp } from '../BaseApp';
import { Scene } from '../Scene';
import { Sprite } from '../Sprite';
import { TransitionScene } from './TransitionScene';

export interface Veil {
  open: (...param: any) => any;
  close: (...param: any) => any;
}

/**
 * @class
 * Transition scene which hides scenes until the next scene is ready
 *
 * @example
 * TODO
 *
 */
export class TransitionIntermission extends TransitionScene {
  protected sceneContainer = new Container().addChildTo(this);
  _veil: Veil = new (class implements Veil {
    async open() {}
    async close() {}
  })();

  setVeil(veil: Veil) {
    this._veil = veil;
  }

  async transit(prevScene: Scene<BaseApp>, nextScene: Scene<BaseApp>) {
    // Scene image sprites
    const nextSceneImageSprite = new Sprite(nextScene.getRenderTexture())
      .setOrigin(0, 0)
      .setVisible(false)
      .addChildTo(this.sceneContainer);
    const prevSceneImageSprite = new Sprite(prevScene.getRenderTexture())
      .setOrigin(0, 0)
      .addChildTo(this.sceneContainer);

    // 暗幕閉じる
    await this._veil.close();
    prevSceneImageSprite.visible = false;
    nextSceneImageSprite.visible = true;

    // nextSceneが用意できたら（イベント発火したら）暗幕開けて完了
    return new Promise<void>(resolve => {
      nextScene.once(TransitionIntermission.readyEvent, async () => {
        await this._veil.open();
        resolve();
      });
    });
  }

  /**
   * The name of event to detect preparation of nextScene
   */
  static readyEvent = 'ready';
}
