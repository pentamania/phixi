import { Container } from 'pixi.js';
import { addMethod } from './utils';

declare module 'pixi.js' {
  export interface Container {
    /**
     * Sets anchor or pivot of the object.
     *
     * This method is usually for setting `anchor` (in Sprite and it's subclasses),
     * but will try to pretend same for objects that doesn't have `anchor` prop (i.e Graphics class)
     * by updating `pivot` using `width` & `height` props.
     *
     * If neither `anchor` nor `pivot` don't exist, it will do nothing.
     *
     * Chainable
     *
     * @param x origin point x: anchor.x or pivot.x will be updated
     * @param y origin point y: anchor.y or pivot.y will be updated
     * @returns Returns itself.
     */
    setOrigin(x: number, y: number): this;

    /**
     * Set the parent Container of this DisplayObject.
     * Similar to 'setParent', but this method returns itself, which means chainable
     *
     * @param {PIXI.Container} parent - The Container which is added
     * @returns Returns itself.
     */
    addChildTo(parent: PIXI.Container): this;

    /**
     * Remove itself from it's parent.
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

  // pixi will emit this in removeChild
  // this.emit(PhinaEvent.Removed)
  return this;
});
