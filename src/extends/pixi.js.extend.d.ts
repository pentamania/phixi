interface PhinaAccessoryOverride extends phina.accessory.Accessory {
  update?: (app?: any) => any
}

declare namespace PIXI {

  export interface DisplayObject extends utils.EventEmitter {

    attach(accessory: phina.accessory.Accessory): this

    detach(accessory: phina.accessory.Accessory): this

    _tweener?: phina.accessory.Tweener

    /**
     * Getter for phina.accessory.Tweener
     */
    tweener: phina.accessory.Tweener

    /**
     * Array of phina.accessory.Accessory
     */
    accessories?: PhinaAccessoryOverride[]

    /**
     * App-class driven update function.
     * Run by Updater if defined
     */
    onUpdate?(app: any): any
    // update?(app: any): any

    /**
     * Chainable object position setting method
     */
    setPosition(x?: number, y?: number): this;

    /**
     * Chainable object scale setting method
     */
    setScale(x: number, y?: number): this;

    /**
     * Chainable object alpha setting method
     */
    setAlpha(alpha: number): this;

    /**
     * Chainable object visibility setting method
     */
    setVisible(flag: boolean): this;

    /**
     * Chainable object interactivity setting method
     */
    setInteractive(flag: boolean): this;

    /**
     * Accessor for scale.x
     */
    scaleX: number

    /**
     * Accessor for scale.y
     */
    scaleY: number
  }

  export interface Container extends PIXI.DisplayObject {

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

  namespace utils {

    export interface EventEmitter {

      /**
       * Calls each of the listeners registered for a given event.
       * Alias method for `emit`
       * @alias this.emit
       */
      flare(event: string | symbol, ...args: any[]): boolean
    }

  }
}