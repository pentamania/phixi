import { Mouse as MouseInput, Touch, TouchList, Keyboard } from 'phina.js';
import { BaseApp, BaseAppOptions } from './BaseApp';
import { PhinaEvent } from './types';
import { stopEvent } from './utils';

/**
 * phina.app.DomAppクラスに相当
 * domElement(renderer.view)に各種Inputクラスを付与する
 * ただしaccelerometerはない
 */
export class DomApp extends BaseApp {
  mouse: MouseInput;
  touch: Touch;
  touchList: TouchList;
  keyboard: Keyboard;
  pointer: Touch | MouseInput;
  pointers: (Touch | MouseInput)[];

  constructor(params?: BaseAppOptions) {
    super(params);

    // interaction setup
    this.mouse = new MouseInput(this.domElement);
    this.touch = new Touch(this.domElement, false);
    this.touchList = new TouchList(this.domElement);
    this.keyboard = new Keyboard(document);

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
    this.keyboard.on('keydown', e => {
      this.currentScene &&
        this.currentScene.emit('keydown', {
          keyCode: e.keyCode,
        });
    });
    this.keyboard.on('keyup', e => {
      this.currentScene &&
        this.currentScene.emit('keyup', {
          keyCode: e.keyCode,
        });
    });
    this.keyboard.on('keypress', e => {
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
