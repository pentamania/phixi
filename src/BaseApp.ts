import { utils, Ticker as PixiTicker, Renderer } from 'pixi.js';
import phina from 'phina.js';
import { Updater } from './Updater';
import { Scene } from './Scene';
import { PhinaEvent, RendererOptions } from './types';
import { toHex } from './utils';
const { Ticker: PhinaTicker } = phina.util;

interface BaseAppExtendedParams {
  fps?: number;
}
export type BaseAppOptions = RendererOptions & BaseAppExtendedParams;

const DEFAULT_PARAMS: Required<BaseAppExtendedParams> = {
  fps: 60,
};

/**
 * @class BaseApp
 */
export class BaseApp extends utils.EventEmitter {
  renderer: Renderer;
  updater: Updater;
  ticker = new PhinaTicker(); // 更新用ticker： 任意のタイミングで更新
  drawTicker = new PixiTicker(); // 描画用ticker：RAFベース（端末によって更新タイミング変わる）
  private _scenes: Scene<BaseApp>[] = [new Scene()];
  private _sceneIndex: number = 0;

  /**
   * @param options
   */
  constructor(options?: BaseAppOptions) {
    super();
    const optionsFulfilled = {
      ...DEFAULT_PARAMS,
      ...options,
    };

    this.renderer = new Renderer(optionsFulfilled as RendererOptions);

    // ticker, updaterのセットアップ
    this.ticker.fps = optionsFulfilled.fps;
    this.ticker.tick(this._loop.bind(this));
    this.drawTicker.add(this.draw.bind(this));
    this.updater = new Updater(this);

    // シーン移動
    this.replaceScene(new Scene());

    BaseApp._instances.push(this);
  }

  /**
   * updateループ
   */
  private _loop() {
    this.emit(PhinaEvent.Enterframe);
    this.updater.updateElement(this.currentScene);
  }

  /**
   * 任意ループ用
   */
  loop() {
    this._loop();
  }

  /**
   * 描画命令（基本ループ）
   * Sceneスタックを順番にscene描画を行う
   */
  draw() {
    this._scenes.forEach((scene, i) => {
      if (i === 0) {
        // 最初のscene描画の時だけclear
        this.renderer.render(scene);
      } else {
        // 後のsceneは上書き
        this.renderer.render(scene, undefined, false);
      }
    });
  }

  run() {
    this.ticker.start();
    this.drawTicker.start();
  }

  stop() {
    this.ticker.stop();
    this.drawTicker.stop();
  }

  replaceScene(scene: Scene) {
    const prevScene = this.currentScene;
    this.currentScene = scene;
    scene.enter({ app: this, prevScene });
    return this;
  }

  /**
   * scenesスタックにsceneを追加し、それをcurrentSceneとする
   * - push前のsceneは保持され、popSceneメソッドで容易に戻ることが可能
   * - ポーズやオブション画面など一時的なSceneに使用
   *
   * @param scene
   */
  pushScene(scene: Scene) {
    this.flare(PhinaEvent.AppPushScene);
    this.flare(PhinaEvent.AppChangeScene);

    const prevScene = this.currentScene;
    this.currentScene.flare(PhinaEvent.ScenePaused, {
      app: this,
    });

    this._scenes.push(scene);
    ++this._sceneIndex;

    this.flare(PhinaEvent.AppScenePushed);

    scene.enter({ app: this, prevScene });

    return this;
  }

  /**
   * scenesスタックから現在のsceneを取り出す（取り除く）
   * ポーズやオブション画面など一時的なSceneに対して使用
   */
  popScene(): Scene | undefined {
    this.flare(PhinaEvent.AppPopScene);
    this.flare(PhinaEvent.AppChangeScene);

    const scene = this._scenes.pop();
    if (!scene) {
      // TODO: No scene error
      return;
    }
    --this._sceneIndex;

    scene.flare(PhinaEvent.ExitScene, {
      app: this,
    });
    scene.setApp(null);

    this.flare(PhinaEvent.AppScenePoped);

    return scene;
  }

  private static _instances: BaseApp[] = [];

  /**
   * 生成済みインスタンスを返す
   *
   * @param index
   */
  static getInstance(index = 0) {
    return this._instances[index];
  }

  /**
   * App本体のcanvas要素を返します
   * @alias domElement
   */
  get view(): HTMLCanvasElement {
    return this.renderer.view;
  }

  /**
   * App本体のcanvas要素を返します
   * @alias view
   */
  get domElement(): HTMLCanvasElement {
    return this.renderer.view;
  }

  get currentScene(): Scene {
    return this._scenes[this._sceneIndex];
  }
  set currentScene(v: Scene) {
    this._scenes[this._sceneIndex] = v;
  }

  get frame(): number {
    return this.ticker.frame;
  }

  /**
   * fps設定を返す
   * tweenerの設定によっては必須
   * @see https://runstant.com/pentamania/projects/64c0f4ab
   */
  get fps(): number {
    return this.ticker.fps;
  }

  set backgroundColor(v: number | string) {
    this.renderer.backgroundColor = toHex(v);
  }
}
