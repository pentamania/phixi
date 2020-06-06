import * as phina from "phina.js";
import { BaseApp } from "./BaseApp";
import { PhinaEvent } from "./types";
import { AppParam } from "./types";
const {
  Mouse: MouseInput, // m as n の代わり
  Touch, 
  TouchList, 
  Keyboard 
} = phina.input;

/**
 * phina.app.DomAppクラスに相当
 * ただしaccelerometerはない
 */
export class DomApp extends BaseApp {
  // TODO:型
  mouse;
  touch;
  touchList;
  keyboard;
  pointer;
  pointers: any[];

  constructor(params?: AppParam) {
    super(params);

    // interaction setup
    this.mouse = new MouseInput(this.domElement);
    this.touch = new Touch(this.domElement, false);
    this.touchList = new TouchList(this.domElement);
    this.keyboard = new Keyboard(document.body);

    // ポインタをセット(PCではMouse, MobileではTouch)
    this.pointer = this.touch;
    this.pointers = this.touchList.touches;
    this.domElement.addEventListener(
      "touchstart",
      function () {
        this.pointer = this.touch;
        this.pointers = this.touchList.touches;
      }.bind(this)
    );
    this.domElement.addEventListener(
      "mouseover",
      function () {
        this.pointer = this.mouse;
        this.pointers = [this.mouse];
      }.bind(this)
    );

    // keyboard event
    this.keyboard.on("keydown", (e) => {
      this.currentScene &&
        this.currentScene.emit("keydown", {
          keyCode: e.keyCode,
        });
    });
    this.keyboard.on("keyup", (e) => {
      this.currentScene &&
        this.currentScene.emit("keyup", {
          keyCode: e.keyCode,
        });
    });
    this.keyboard.on("keypress", (e) => {
      this.currentScene &&
        this.currentScene.emit("keypress", {
          keyCode: e.keyCode,
        });
    });

    // click 対応
    // var eventName = phina.isMobile() ? 'touchend' : 'mouseup';
    // this.domElement.addEventListener(eventName, this._checkClick.bind(this));

    // // 決定時の処理をオフにする(iPhone 時のちらつき対策)
    // this.domElement.addEventListener("touchstart", e => e.stop());
    // this.domElement.addEventListener("touchmove", e => e.stop());

    // ウィンドウフォーカス時イベントリスナを登録
    window.addEventListener(
      "focus",
      () => {
        this.emit("focus");
        this.currentScene.emit("focus");
      },
      false
    );

    // ウィンドウブラー時イベントリスナを登録
    window.addEventListener(
      "blur",
      () => {
        this.emit("blur");
        this.currentScene.emit("blur");
      },
      false
    );

    // 更新関数を登録
    this.on(PhinaEvent.Enterframe, () => {
      this.mouse.update();
      this.touch.update();
      this.touchList.update();
      this.keyboard.update();
    });
  }

  mount(element: Element) {
    element.appendChild(this.renderer.view);
    return this;
  }
}
