import { BaseApp } from "./BaseApp";
const Container = PIXI.Container

/**
 * Phixi.Sceneクラス
 */
export class Scene<A extends BaseApp = BaseApp> extends Container {

  // enter後にアクセス可能
  protected _app: A = null

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
  onUpdate(app: A) {}

  setApp(app: A) {
    this._app = app;
  }

  /**
   * @property app
   * TODO: _appが存在しないときはエラー吐く？
   */
  get app(): A { return this._app }

  get screenWidth() {
    if (this._app) {
      return this._app.renderer.screen.width
    } else {
      // Container.widthを返す。childrenの状態によって変わる
      return this.width;
    }
  }

  get screenHeight() {
    if (this._app) {
      return this._app.renderer.screen.height
    } else {
      return this.height;
    }
  }

}
