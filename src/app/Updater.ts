import { Container } from 'pixi.js';
import { BaseApp } from './BaseApp';
import { LibConfig } from '../libConfig';
import { PhinaEvent } from '../core/types';

export class Updater {
  app: BaseApp;

  constructor(app: BaseApp) {
    this.app = app;
  }

  /**
   * This method will
   *
   * - let object emit "enterframe" event
   * - run object's "onUpdate" method when it is defined
   *
   * and recursively apply same method against child elements.
   *
   * If object's "awake" prop is set to false, these processes will be skipped.
   *
   * @param obj
   */
  public updateElement(obj: Container) {
    if (obj.awake === false) return;

    obj.emit(PhinaEvent.Enterframe, { app: this.app });

    // Run update & onUpdate func if exists
    if (LibConfig.enableUpdateFunc && obj.update) obj.update(this.app);
    if (obj.onUpdate) obj.onUpdate(this.app);

    if (obj.children && obj.children.length) {
      const cloneChildren = obj.children.slice(0);
      for (let i = 0, len = cloneChildren.length; i < len; i++) {
        const ch = cloneChildren[i] as Container;
        this.updateElement(ch);
      }
    }
  }
}
