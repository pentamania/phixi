import { Container } from 'pixi.js';
import { addMethod } from './utils';

declare module 'pixi.js' {
  export interface Container {
    /**
     * Sets pivot or anchor (if exists, i.e. Sprite class) of the object.
     * Chainable
     */
    setOrigin(x: number, y: number): this;

    /**
     * Set the parent Container of this DisplayObject.
     * Similar to 'setParent', but this method returns itself and is chainable
     *
     * @param {PIXI.Container} container - The Container which is added
     * @returns {this} Returns itself.
     */
    addChildTo(container: PIXI.Container): this;

    /**
     * Remove itself from the parent.
     *
     * @returns {this} Returns itself.
     */
    remove(): this;
  }
}

/**
 * PIXI.Container.setOrigin
 */
addMethod<PIXI.Container | PIXI.Sprite>(
  Container.prototype,
  'setOrigin',
  function (x: number, y: number) {
    if ('anchor' in this) {
      this.anchor.set(x, y);
    } else if (this.pivot) {
      this.pivot.set(this.width * x, this.height * y);
    }
    return this;
  }
);

/**
 * PIXI.Container.addChildTo
 */
addMethod(Container.prototype, 'addChildTo', function (parent: PIXI.Container) {
  this.setParent(parent);
  return this;
});

/**
 * PIXI.Container.remove
 */
addMethod(Container.prototype, 'remove', function () {
  this.parent.removeChild(this);
  // this.emit(PhinaEvent.Removed) // 元々removedイベントはpixiも発火するため不要
  return this;
});
