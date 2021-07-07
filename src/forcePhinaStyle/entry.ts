import { Container, DisplayObject } from 'pixi.js';
import { PhinaEvent } from '../types';
import { Updater } from '../Updater';
import { refugeAnimatedSpriteUpdate } from './refugeUpdateFuncs';

let isExecuted = false;

// Extend declaration
declare module 'pixi.js' {
  export interface DisplayObject {
    /**
     * **(phixi extended: only active when phixi.forcePhinaStyle is executed)**
     *
     * App-class driven update function.
     * Run by Updater if defined
     */
    update?(app?: any): any;
  }
}

/**
 * Apply phina.js style
 *
 * - "rotation" to degree base
 * - Enable executing Element "update" method
 * - Refuge original "update" funcs used in pixi objects
 *
 * @caveats
 * This feature is experimental
 *
 */
export default function () {
  if (isExecuted) return;
  isExecuted = true;

  // Override "rotation" setter to recognize value as degree unit
  Object.defineProperty(DisplayObject.prototype, 'rotation', {
    set: function (v: number) {
      this.angle = v;
    },
    enumerable: false,
    configurable: true,
  });

  // Override "setRotation" to recognize value as degree unit
  DisplayObject.prototype.setRotation = function (v: number) {
    this.angle = v;
    return this;
  };

  // "update" method refuging
  refugeAnimatedSpriteUpdate();

  // Let Updater execute "update" too
  Updater.prototype.updateElement = function (obj: Container) {
    if (obj.awake === false) return;

    obj.emit(PhinaEvent.Enterframe, { app: this.app });

    // Add
    if ((obj as any).update) (obj as any).update(this.app);
    if (obj.onUpdate) obj.onUpdate(this.app);

    if (obj.children && obj.children.length) {
      const cloneChildren = obj.children.slice(0);
      for (let i = 0, len = cloneChildren.length; i < len; i++) {
        const ch = cloneChildren[i] as Container;
        this.updateElement(ch);
      }
    }
  };
}
