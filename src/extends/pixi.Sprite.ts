import { BLEND_MODES, Sprite } from 'pixi.js';
import { addMethod } from './utils';

declare module 'pixi.js' {
  export interface Sprite {
    /**
     * Chainable util method for setting blendMode.
     *
     * Supported modes are restricted for WebGL renderer
     * @see https://pixijs.download/dev/docs/PIXI.html#BLEND_MODES
     *
     * > IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
     * > Anything else will silently act like NORMAL.
     *
     * @example
     * const sprite = Sprite.from("path/to/image")
     *   .setBlendMode('ADD');
     *
     * @param mode Various blend modes supported by PIXI.
     */
    setBlendMode(mode: keyof typeof BLEND_MODES): this;
  }
}

/**
 * PIXI.Sprite.setBlendMode
 */
addMethod(
  Sprite.prototype,
  'setBlendMode',
  function (mode: keyof typeof BLEND_MODES) {
    this.blendMode = BLEND_MODES[mode];
    return this;
  }
);
