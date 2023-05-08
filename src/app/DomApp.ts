import phina from 'phina.js';
import { BaseApp, BaseAppOptions } from './BaseApp';
import { PhinaEvent, PhinaKeyBoardEvent } from '../types';
import { stopEvent } from '../utils';
const {
  Mouse: MouseInput, // m as n の代わり
  Touch,
  TouchList,
  Keyboard,
} = phina.input;

/**
 * phina.app.DomAppクラスに相当
 * domElement(renderer.view)に各種Inputクラスを付与する
 * ただしaccelerometerはない
 */
export class DomApp extends BaseApp {
  mouse: phina.input.Mouse;
  touch: phina.input.Touch;
  touchList: phina.input.TouchList;
  keyboard: phina.input.Keyboard;
  pointer: phina.input.Touch | phina.input.Mouse;
  pointers: (phina.input.Touch | phina.input.Mouse)[];

  constructor(params?: BaseAppOptions) {
    super(params);

    // interaction setup
    this.mouse = new MouseInput(this.domElement);
    this.touch = new Touch(this.domElement, false);
    // TODO: fix phina.js.d.ts TouchList assign
    this.touchList = (new TouchList(
      this.domElement
    ) as unknown) as phina.input.TouchList;
    this.keyboard = new Keyboard(document.body);

    // Assign pointer props
    this.pointer = this.touch;
    this.pointers = this.touchList.touches;
    // For mobile: Use Touch
    this.domElement.addEventListener('touchstart', () => {
      this.pointer = this.touch;
      this.pointers = this.touchList.touches;
    });
    // For desktop: Use Mouse
    this.domElement.addEventListener('mouseover', () => {
      this.pointer = this.mouse;
      this.pointers = [this.mouse];
    });

    // keyboard event
    this.keyboard.on('keydown', (e: PhinaKeyBoardEvent) => {
      this.currentScene &&
        this.currentScene.emit('keydown', {
          keyCode: e.keyCode,
        });
    });
    this.keyboard.on('keyup', (e: PhinaKeyBoardEvent) => {
      this.currentScene &&
        this.currentScene.emit('keyup', {
          keyCode: e.keyCode,
        });
    });
    this.keyboard.on('keypress', (e: PhinaKeyBoardEvent) => {
      this.currentScene &&
        this.currentScene.emit('keypress', {
          keyCode: e.keyCode,
        });
    });

    // click 対応
    // var eventName = phina.isMobile() ? 'touchend' : 'mouseup';
    // this.domElement.addEventListener(eventName, this._checkClick.bind(this));

    // Avoid unnecessary default action by touching app domElement
    this.domElement.addEventListener('touchstart', e => stopEvent(e));
    this.domElement.addEventListener('touchmove', e => stopEvent(e));

    // ウィンドウフォーカス時イベントリスナを登録
    window.addEventListener(
      'focus',
      () => {
        this.emit('focus');
        this.currentScene.emit('focus');
      },
      false
    );

    // ウィンドウブラー時イベントリスナを登録
    window.addEventListener(
      'blur',
      () => {
        this.emit('blur');
        this.currentScene.emit('blur');
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
