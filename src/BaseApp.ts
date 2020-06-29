import { utils, Ticker as PixiTicker, Renderer } from "pixi.js";
import * as phina from "phina.js";
import { Updater } from "./Updater";
import { Scene } from "./Scene";
import { PhinaEvent } from "./types";
import { AppParam } from "./types";
const {
  Ticker: PhinaTicker,
} = phina.util;

const DEFAULT_PARAMS = {
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
  private _currentScene: Scene = new Scene();

  /**
   * @param params 
   */
  constructor(params?: AppParam) {
    super();
    params = Object.assign({}, DEFAULT_PARAMS, params);

    this.renderer = new Renderer(params);

    // ticker, updaterのセットアップ
    if (params.fps) this.ticker.fps = params.fps;
    this.ticker.tick(this._loop.bind(this));
    this.drawTicker.add(this.draw.bind(this));
    this.updater = new Updater(this);

    // シーン移動
    this.replaceScene(new Scene());
  }

  /**
   * updateループ
   */
  private _loop() {
    this.emit(PhinaEvent.Enterframe);
    this.updater.updateElement(this._currentScene);
  }

  /**
   * 任意ループ用
   */
  loop() {
    this._loop();
  }

  /**
   * 描画命令（基本ループ）
   */
  draw() {
    if (this._currentScene != null) {
      this.renderer.render(this._currentScene);
    }
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
    this._currentScene = scene;
    scene.setApp(this);
    scene.emit(PhinaEvent.EnterScene, this);
    return this;
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
    return this._currentScene;
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
}
