import phina from 'phina.js';
import { Container, RenderTexture } from 'pixi.js';
import { BaseApp } from './BaseApp';
import { PhinaEvent } from './types';

type Constructable = new (...args: any) => any;
type SceneLabel = string | number;

interface NextSceneOption {
  nextLabel: SceneLabel;
  [key: string]: any; // Other parameters
}

/**
 * Phixi.Scene
 */
export class Scene<A extends BaseApp = BaseApp> extends Container {
  /**
   * Core app reference: Not available until {@link enter}
   * App参照. {@link enter}が実行されるまでnull/undefined
   */
  protected _app?: A | null;

  /** Scene render texture */
  protected _renderTexture: RenderTexture = RenderTexture.create();

  /**
   * @virtual
   * @param _app
   */
  onUpdate(_app?: A) {}

  setApp(app: A | null) {
    this._app = app;
  }

  /**
   * アプリケーションクラスによるシーンenter処理
   * 通常はAppが内部的に実行
   *
   * @param param
   */
  enter(param: { app: BaseApp; prevScene: Scene }) {
    this.setApp(param.app as A);
    this.emit(PhinaEvent.EnterScene, param);
  }

  /**
   * Exit scene(via app.popScene)
   *
   * @param nextLabelOrOption
   * @param nextArguments Args for next Scene Constucting (For SequenceManagerScene)
   */
  exit(nextLabelOrOption?: string | NextSceneOption, nextArguments?: any) {
    if (!this.app) {
      // TODO: warning
      return;
    }

    const app = this.app;
    let nextlabel: SceneLabel | undefined;

    if (nextLabelOrOption) {
      if (typeof nextLabelOrOption === 'string') {
        nextlabel = nextLabelOrOption;
      } else {
        nextlabel = nextLabelOrOption.nextLabel;
        nextArguments = nextLabelOrOption;
      }
    }
    // this.nextLabel = nextlabel;
    // this.nextArguments = nextArguments;

    app.popScene();

    // phina.jsではpopScene側でやっている処理
    // ManagerSceneによる指定Sceneへの遷移
    if (app.currentScene instanceof SequenceManagerScene) {
      if (nextlabel) {
        app.currentScene.gotoScene(nextlabel, nextArguments);
      } else {
        app.currentScene.gotoNext(nextArguments);
      }
    }

    return this;
  }

  /**
   * Re-render renderTexture via App.renderer
   *
   * @param app App reference
   * @param resize Whether to resize texture to match app.canvas size.
   * default: true
   * @returns Updated RenderTexture
   */
  public updateRenderTexture(
    app: BaseApp,
    resize: boolean = true
  ): RenderTexture {
    if (resize) this._renderTexture.resize(app.view.width, app.view.height);
    app.renderer.render(this, this._renderTexture);
    return this._renderTexture;
  }

  /**
   * Returns renderTexture
   */
  public getRenderTexture() {
    return this._renderTexture;
  }

  /**
   * App reference
   */
  get app() {
    return this._app;
  }

  /**
   * 表示canvas要素領域の幅
   * scene enter後でないとアクセス不可
   */
  get viewportWidth() {
    if (!this._app) {
      // TODO warn
      return 0;
    }
    return this._app.renderer.view.width;
  }

  /**
   * 表示canvas要素領域の高さ
   * scene enter後でないとアクセス不可
   */
  get viewportHeight() {
    if (!this._app) {
      // TODO warn
      return 0;
    }
    return this._app.renderer.view.width;
  }

  /**
   * Return app.renderer.screen.width
   * If no app , returns Container.width (Variates by children)
   */
  get screenWidth() {
    if (this._app) {
      return this._app.renderer.screen.width;
    } else {
      return this.width;
    }
  }

  /**
   * Return app.renderer.screen.height
   * If no app , returns Container.height (Variates by children)
   */
  get screenHeight() {
    if (this._app) {
      return this._app.renderer.screen.height;
    } else {
      return this.height;
    }
  }
}

// ===========================
// SequenceManagerScene
// 循環参照避けるため、Sceneと同ファイルに定義する必要あり
// ===========================

export interface SceneData {
  className: string | Constructable;
  label: SceneLabel;
  arguments?: any;
  // nextLabel?: SceneLabel;
  // nextArguments?: any;
}

export interface ManagerSceneParam {
  startLabel: SceneLabel;
  scenes: SceneData[];
}

/**
 * phina.game.ManagerScene相当のクラス
 * Sceneクラスを継承するが、自身はSceneとしての機能を持たず、
 * app本体のpushScene, popSceneを操作することで子Sceneを入れ替え管理を行う
 */
export class SequenceManagerScene extends Scene {
  protected _sceneDataList!: SceneData[];
  protected _sceneIndex!: number;

  /**
   * @constructor
   * @param params
   */
  constructor(params: ManagerSceneParam) {
    super();
    this.setScenes(params.scenes);

    this.on(PhinaEvent.EnterScene, () => {
      this.gotoScene(params.startLabel || 0);
    });
  }

  /**
   * sceneリストセットアップ
   * @param scenes
   */
  setScenes(scenes: SceneData[]) {
    this._sceneDataList = scenes;
    this._sceneIndex = 0;

    return this;
  }

  /**
   * Sceneクラスをインスタンス化
   * @param data
   * @param args
   */
  private _instantiateScene(data: SceneData, args: any) {
    const initArguments = Object.assign({}, data.arguments, args);

    let scene: Scene;
    let ClassConstructor: Constructable;
    if (typeof data.className === 'string') {
      // phina.define、あるいはglobal(window)に直接定義されたクラスの文字列
      ClassConstructor = phina.using(data.className);
      if (typeof ClassConstructor !== 'function') {
        ClassConstructor = phina.using('phina.game.' + data.className);
      }
    } else if (typeof data.className === 'function') {
      // 関数の場合、純粋なclassと見なす
      ClassConstructor = data.className;
    } else {
      return false;
    }
    scene = new ClassConstructor(initArguments);

    // if (!scene.nextLabel) {
    //   scene.nextLabel = data.nextLabel;
    // }
    // if (!scene.nextArguments) {
    //   scene.nextArguments = data.nextArguments;
    // }

    return scene;
  }

  /**
   * index(or label) のシーンへ飛ぶ
   * @param label
   * @param args
   */
  gotoScene(label: SceneLabel, args?: any) {
    if (!this.app) {
      console.error('App is not ready');
      return this;
    }

    const index =
      typeof label == 'string' ? this.labelToIndex(label) : label || 0;
    if (!this._sceneDataList[index]) {
      console.error(`Scene "${label}" does not exist`);
      return this;
    }
    const scene = this._instantiateScene(this._sceneDataList[index], args);
    if (!scene) {
      console.error(`Scene "${label}" does not exist`);
      return;
    }
    this.app.pushScene(scene);
    this._sceneIndex = index;

    return this;
  }

  /**
   * 次のシーンへ飛ぶ
   * @param args
   */
  gotoNext(args: any) {
    // シンプル版
    let nextIndex = this._sceneIndex + 1;
    if (nextIndex < this._sceneDataList.length) {
      this.gotoScene(nextIndex, args);
    } else {
      this.flare('finish');
    }

    // オリジナル版
    // const currentSceneData = this._sceneDataList[this._sceneIndex];
    // let nextIndex;

    // if (currentSceneData.nextLabel) {
    //   // 次のラベルが設定されていた場合
    //   nextIndex = this.labelToIndex(currentSceneData.nextLabel);
    // } else if (this._sceneIndex + 1 < this._sceneDataList.length) {
    //   // 次インデックスのシーンに遷移
    //   nextIndex = this._sceneIndex + 1;
    // }
    // if (nextIndex != null) {
    //   this.gotoScene(nextIndex, args);
    // } else {
    //   this.flare('finish');
    // }

    return this;
  }

  /**
   * シーンインデックスを取得
   */
  getCurrentIndex(): number {
    return this._sceneIndex;
  }

  /**
   * シーンラベルを取得
   */
  getCurrentLabel(): SceneLabel {
    return this._sceneDataList[this._sceneIndex].label;
  }

  /**
   * ラベルからインデックスに変換
   */
  labelToIndex(label: SceneLabel) {
    const sceneData = this._sceneDataList.filter(
      data => data.label === label
    )[0];
    return this._sceneDataList.indexOf(sceneData);
  }

  /**
   * インデックスからラベルに変換
   * @param index
   * @returns label
   */
  indexToLabel(index: number): SceneLabel {
    return this._sceneDataList[index].label;
  }
}
