import * as phina from "phina.js";
import { BaseApp } from "./BaseApp";
import { PhinaEvent, PhinaKeyBoardEvent } from "./types";
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
  mouse: phina.input.Mouse;
  touch: phina.input.Touch;
  touchList: phina.input.TouchList;
  keyboard: phina.input.Keyboard;
  pointer: phina.input.Touch | phina.input.Mouse;
  pointers: (phina.input.Touch | phina.input.Mouse)[];

  constructor(params?: AppParam) {
    super(params);

    // interaction setup
    this.mouse = new MouseInput(this.domElement);
    this.touch = new Touch(this.domElement, false);
    // TODO: fix phina.js.d.ts TouchList assign
    this.touchList = new TouchList(this.domElement) as unknown as phina.input.TouchList;
    this.keyboard = new Keyboard(document.body);

    // ポインタをセット(PCではMouse, MobileではTouch)
    this.pointer = this.touch;
    this.pointers = this.touchList.touches;
    this.domElement.addEventListener(
      "touchstart",
      ()=> {
        this.pointer = this.touch;
        this.pointers = this.touchList.touches;
      }
    );
    this.domElement.addEventListener(
      "mouseover",
      () => {
        this.pointer = this.mouse;
        this.pointers = [this.mouse];
      }
    );

    // keyboard event
    this.keyboard.on("keydown", (e: PhinaKeyBoardEvent) => {
      this.currentScene &&
        this.currentScene.emit("keydown", {
          keyCode: e.keyCode,
        });
    });
    this.keyboard.on("keyup", (e: PhinaKeyBoardEvent) => {
      this.currentScene &&
        this.currentScene.emit("keyup", {
          keyCode: e.keyCode,
        });
    });
    this.keyboard.on("keypress", (e: PhinaKeyBoardEvent) => {
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
