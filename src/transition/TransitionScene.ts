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
    this.on(PhinaEvent.EnterScene, (e: EnterSceneParam) => {
      const updateDuringTransition = options.updateDuringTransition;
      const { app, prevScene } = e;

      // Render scenes once
      nextScene.updateRenderTexture(app);
      prevScene.updateRenderTexture(app);

      // Continually update scenes while transition
      let _enterframeHandler: () => any;
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

      // Go to nextScene after effect
      this.transit(prevScene, nextScene, () => {
        // Remove event listener
        if (_enterframeHandler)
          this.off(PhinaEvent.Enterframe, _enterframeHandler);

        // TODO: pushSceneで行われた場合はnextSceneもpushする？
        // TODO: Use "exit" for ManagerScene
        app.replaceScene(nextScene);
      });
    });
  }

  /**
   * @virtual
   * Override with your own transition process using scene references.
   * オーバーライドして自分オリジナルの処理を定義
   *
   * @param _prevSceneRef
   * @param _nextSceneRef
   * @param cb
   */
  transit(_prevSceneRef: Scene, _nextSceneRef: Scene, cb: Function): any {
    // 終了する際は必ずcbをcall
    cb();
  }
}
