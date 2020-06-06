/// <reference path='./pixi.js.extend.d.ts'/>
import * as PIXI from "pixi.js"
import * as phina from "phina.js"
import { addGetter, addMethod, addAccessor } from "./utils"
import { PhinaEvent } from "../types";

/**
 * PIXI.DisplayObject.attach
 * accessoryを追加する。また初めて追加する場合、毎フレームaccessoryのupdateメソッドを呼び出す処理をセットする
 * @see https://github.com/phinajs/phina.js/blob/230927a700a970e89cddb32921b56926bc3f2e8b/src/accessory/accessory.js#L42
 * 
 * @param accessory phina.accessory.Accessory派生クラス（tweenerなど）
 * @returns this
 */
addMethod(PIXI.DisplayObject.prototype, 'attach', function (accessory: phina.accessory.Accessory) {
  if (!this.accessories) {
    this.accessories = [];
    this.on(PhinaEvent.Enterframe, (e) => {
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
addMethod(PIXI.DisplayObject.prototype, 'detach', function (accessory: phina.accessory.Accessory) {
  if (this.accessories) {
    // this.accessories.erase(accessory);
    this.accessories.splice(this.accessories.indexOf(accessory), 1);
    accessory.setTarget(null);
    accessory.flare(PhinaEvent.AccessoryDetached);
  }
  return this;
});

/**
 * PIXI.DisplayObject getter
 * tweener
 */
addGetter(PIXI.DisplayObject.prototype, 'tweener', function () {
  if (!this._tweener) {
    this._tweener = phina.accessory.Tweener().attachTo(this as unknown as phina.app.Element);
  }
  return this._tweener;
});

/**
 * PIXI.DisplayObject getter
 * scaleX
 */
addAccessor(PIXI.DisplayObject.prototype, "scaleX", {
  get: function () { return this.scale.x },
  set: function (v: number) { this.scale.x = v },
})

/**
 * PIXI.DisplayObject getter
 * scaleY
 */
addAccessor(PIXI.DisplayObject.prototype, "scaleY", {
  get: function () { return this.scale.y },
  set: function (v: number) { this.scale.y = v },
})

/**
 * PIXI.DisplayObject.setPosition
 */
addMethod(PIXI.DisplayObject.prototype, "setPosition", function (x: number = 0, y: number = 0) {
  this.position.set(x, y);
  return this;
})

/**
 * PIXI.DisplayObject.setScale
 */
addMethod(PIXI.DisplayObject.prototype, "setScale", function (x: number, y = x) {
  this.scale.set(x, y);
  return this;
})

/**
 * PIXI.DisplayObject.setAlpha
 */
addMethod(PIXI.DisplayObject.prototype, "setAlpha", function (a: number) {
  this.alpha = a;
  return this;
})

/**
 * PIXI.DisplayObject.setVisible
 */
addMethod(PIXI.DisplayObject.prototype, "setVisible", function (flag: boolean) {
  this.visible = flag;
  return this;
})

/**
 * PIXI.DisplayObject.setInteractive
 */
addMethod(PIXI.DisplayObject.prototype, "setInteractive", function (flag: boolean) {
  this.interactive = flag;
  return this;
})
