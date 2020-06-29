import { Container } from 'pixi.js'
import { BaseApp } from "./BaseApp";
import { PhinaEvent } from "./types";

export class Updater {

  app: BaseApp

  constructor(app: BaseApp) {
    this.app = app;
  }

  updateElement(obj: Container) {
    // フレーム毎更新
    obj.emit(PhinaEvent.Enterframe, {app: this.app});
    // if (obj.update) obj.update(this.app);
    if (obj.onUpdate) obj.onUpdate(this.app);
    
    if (obj.children && obj.children.length) {
      const cloneChildren = obj.children.slice(0)
      for (let i = 0, len = cloneChildren.length; i < len; i++) {
        const ch = cloneChildren[i] as Container;
        this.updateElement(ch);
      }
    }
  }
}
