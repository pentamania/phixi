/// <reference path='./pixi.js.extend.d.ts'/>
import { DisplayObject } from "pixi.js"
import phina from "phina.js"
import { addGetter, addMethod, addAccessor } from "./utils"
import { PhinaEvent } from "../types";
import { BaseApp } from "../BaseApp";

/**
 * PIXI.DisplayObject.attach
 * accessoryを追加する。また初めて追加する場合、毎フレームaccessoryのupdateメソッドを呼び出す処理をセットする
 * @see https://github.com/phinajs/phina.js/blob/230927a700a970e89cddb32921b56926bc3f2e8b/src/accessory/accessory.js#L42
 * 
 * @param accessory phina.accessory.Accessory派生クラス（tweenerなど）
 * @returns this
 */
addMethod(DisplayObject.prototype, 'attach', function (accessory: phina.accessory.Accessory) {
  if (!this.accessories) {
    this.accessories = [];
    this.on(PhinaEvent.Enterframe, (e: {app: BaseApp}) => {
      if (!this.accessories) return;
      this.accessories.forEach((accessory) => {
        accessory.update && accessory.update(e.app);
      });
    });
  }

  this.accessories.push(accessory);
  accessory.setTarget(this as unknown as phina.app.Element);
  accessory.flare(PhinaEvent.AccessoryAttached);

  return this;
});

/**
 * PIXI.DisplayObject.detach
 * 指定accessoryを削除する
 * 
 * @param accessory phina.accessory.Accessory派生クラス（tweenerなど）
 * @returns this
 */
addMethod(DisplayObject.prototype, 'detach', function (accessory: phina.accessory.Accessory) {
  if (this.accessories) {
    // this.accessories.erase(accessory);
    this.accessories.splice(this.accessories.indexOf(accessory), 1);
    accessory.target = undefined;
    accessory.flare(PhinaEvent.AccessoryDetached);
  }
  return this;
});

/**
 * PIXI.DisplayObject getter
 * tweener
 */
addGetter(DisplayObject.prototype, 'tweener', function () {
  if (!this._tweener) {
    this._tweener = phina.accessory.Tweener().attachTo(this as unknown as phina.app.Element);
  }
  return this._tweener;
});

/**
 * PIXI.DisplayObject getter
 * scaleX
 */
addAccessor(DisplayObject.prototype, "scaleX", {
  get: function () { return this.scale.x },
  set: function (v: number) { this.scale.x = v },
})

/**
 * PIXI.DisplayObject getter
 * scaleY
 */
addAccessor(DisplayObject.prototype, "scaleY", {
  get: function () { return this.scale.y },
  set: function (v: number) { this.scale.y = v },
})

/**
 * PIXI.DisplayObject.setPosition
 */
addMethod(DisplayObject.prototype, "setPosition", function (x: number = 0, y: number = 0) {
  this.position.set(x, y);
  return this;
})

/**
 * PIXI.DisplayObject.setScale
 */
addMethod(DisplayObject.prototype, "setScale", function (x: number, y = x) {
  this.scale.set(x, y);
  return this;
})

/**
 * PIXI.DisplayObject.setAlpha
 */
addMethod(DisplayObject.prototype, "setAlpha", function (a: number) {
  this.alpha = a;
  return this;
})

/**
 * PIXI.DisplayObject.setVisible
 */
addMethod(DisplayObject.prototype, "setVisible", function (flag: boolean) {
  this.visible = flag;
  return this;
})

/**
 * PIXI.DisplayObject.setInteractive
 */
addMethod(DisplayObject.prototype, "setInteractive", function (flag: boolean) {
  this.interactive = flag;
  return this;
})
