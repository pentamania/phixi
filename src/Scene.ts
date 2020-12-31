import { Container } from "pixi.js"
import { BaseApp } from "./BaseApp";

/**
 * Phixi.Sceneクラス
 */
export class Scene<A extends BaseApp = BaseApp> extends Container {

  // enter後にアクセス可能
  protected _app?: A | null

  constructor() {
    super();
    // this.width = params.width;
    // this.height = params.height;
    // console.log(params.width, this.width); // this.widthは０になる
  }

  /**
   * @virtual
   * @param app 
   */
  onUpdate(_app?: A) {}

  setApp(app: A | null) {
    this._app = app;
  }

  /**
   * @property app
   * TODO: _appが存在しないときはエラー吐く？
   */
  get app() { return this._app }

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

  get screenWidth() {
    if (this._app) {
      return this._app.renderer.screen.width;
    } else {
      // Container.widthを返す。childrenの状態によって変わる
      return this.width;
    }
  }

  get screenHeight() {
    if (this._app) {
      return this._app.renderer.screen.height;
    } else {
      return this.height;
    }
  }

}
