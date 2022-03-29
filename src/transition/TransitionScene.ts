import { Scene } from '../Scene';
import { PhinaEvent } from '../types';

export type SceneUpdateType = 'both' | 'prev' | 'next' | 'none' | undefined;

export interface TransitionSceneOptions {
  updateDuringTransition?: SceneUpdateType;
}

const defaultUpdateType: SceneUpdateType = 'both';
type EnterSceneParam = Parameters<typeof Scene.prototype.enter>[0];

/**
 * Special scene for transition effect
 * シーン間を遷移エフェクトで橋渡しする特殊シーン
 *
 * ## references
 * - https://github.com/cocos2d/cocos2d-x/blob/95e5d868ce5958c0dadfc485bdda52f1bc404fe0/cocos/2d/CCTransition.cpp#L158
 */
export class TransitionScene extends Scene {
  constructor(nextScene: Scene, options: TransitionSceneOptions) {
    super();
    options = {
      ...{
        updateDuringTransition: defaultUpdateType,
      },
      ...options,
    };

    // After entering scene
    this.on(PhinaEvent.EnterScene, async (e: EnterSceneParam) => {
      const updateDuringTransition = options.updateDuringTransition;
      const { app, prevScene } = e;

      // Render scenes once
      nextScene.updateRenderTexture(app);
      prevScene.updateRenderTexture(app);

      // Continually update scenes while transition
      let _enterframeHandler: (() => any) | undefined;
      if (updateDuringTransition && updateDuringTransition !== 'none') {
        _enterframeHandler = () => {
          // Prev scene update
          if (
            updateDuringTransition === 'both' ||
            updateDuringTransition === 'prev'
          ) {
            app.updater.updateElement(prevScene);
            prevScene.updateRenderTexture(app);
          }

          // Next scene update
          if (
            updateDuringTransition === 'both' ||
            updateDuringTransition === 'next'
          ) {
            app.updater.updateElement(nextScene);
            nextScene.updateRenderTexture(app);
          }
        };
        this.on(PhinaEvent.Enterframe, _enterframeHandler);
      }

      await this.transit(prevScene, nextScene);

      // Remove scene-updating listener
      if (_enterframeHandler)
        this.off(PhinaEvent.Enterframe, _enterframeHandler);

      // Go to nextScene next frame
      this.once(PhinaEvent.Enterframe, () => {
        app.replaceScene(nextScene);
      });
    });
  }

  /**
   * @virtual
   * Override with your own transition process using scene references.
   * Always return Promise (or define as async func)
   *
   * オーバーライドして自分オリジナルの処理を定義。
   * Promiseを返すかasyncメソッドとして定義する
   *
   * @param _prevSceneRef
   * @param _nextSceneRef
   * @returns Promise to be resolved
   */
  async transit(_prevSceneRef: Scene, _nextSceneRef: Scene): Promise<any> {}
}
