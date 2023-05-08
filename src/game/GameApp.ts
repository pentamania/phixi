import phina from 'phina.js';
import { BaseAppOptions } from '../app/BaseApp';
import { DomApp } from '../app/DomApp';
import { LoadingScene } from './LoadingScene';
import { ResultScene } from './ResultScene';
import { SceneData, ManagerSceneParam, SequenceManagerScene } from '../app/Scene';
import { TitleScene } from './TitleScene';
import { PhinaAssetLoaderLoadParam, PhinaEvent } from '../types';
const { Canvas: PhinaCanvas } = phina.graphics;

// Default parameters
const DEFAULT_START_LABEL = 'title';
const defaultScenes: SceneData[] = [
  {
    className: TitleScene,
    label: DEFAULT_START_LABEL,
  },
  {
    className: 'MainScene',
    label: 'main',
  },
  {
    className: ResultScene,
    label: 'result',
  },
];

export interface GameAppOption extends ManagerSceneParam, BaseAppOptions {
  assets?: PhinaAssetLoaderLoadParam;
  append?: boolean;
  fit?: boolean;
}

/**
 * phina.js GameApp相当のクラス
 * ただしCanvasAppが無い分、append等の一部オプションはこちらで管理
 */
export class GameApp extends DomApp {
  /**
   * @param options
   */
  constructor(options: GameAppOption) {
    super(options);
    const scenes = options.scenes || defaultScenes;
    const startLabel = options.startLabel || DEFAULT_START_LABEL;

    // appendフラグでbodyに追加
    const appendToBody = options.append != null ? options.append : true;
    if (appendToBody) {
      document.body.appendChild(this.domElement);
    }

    // fitScreen flag
    const fitToScreen = options.fit != null ? options.fit : true;
    if (fitToScreen) this.fitScreen();

    // デフォルトargumentsの継承
    scenes.forEach(s => {
      s.arguments = s.arguments || options;
    });

    const baseScene = new SequenceManagerScene({
      scenes: scenes,
      startLabel: startLabel,
    });
    this._tryAssetLoad(options.assets)
      .then(() => {
        this.replaceScene(baseScene);
      })
      .catch(err => {
        // TODO
      });
  }

  /**
   * アセットロードを試す
   * @param assets 無指定の時はすぐに切り替え
   */
  private _tryAssetLoad(assets?: PhinaAssetLoaderLoadParam): Promise<void> {
    return new Promise((resolve, _reject) => {
      if (assets) {
        const loadingScene = new LoadingScene();
        // loadedイベント発火をもってpromise解決
        loadingScene.on(PhinaEvent.LoadingSceneLoaded, () => {
          resolve();
        });
        loadingScene.load(assets);
        this.replaceScene(loadingScene);
      } else {
        resolve();
      }
    });
  }

  /**
   * 画面（ウィンドウ）に合わせてcanvas要素をリサイズ
   * phina.graphics.Canvas.fitScreenを流用
   * @param isEver windowリサイズ時に合わせてサイズをリセットするかどうか
   */
  fitScreen(isEver?: boolean) {
    if (!this.domElement) {
      // TODO: warning
      return;
    }
    PhinaCanvas.prototype.fitScreen.call(this, isEver);
  }
}
