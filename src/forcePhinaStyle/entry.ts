import { DisplayObject } from 'pixi.js';
import { LibConfig } from 'src/libConfig';
import { refugeAnimatedSpriteUpdate } from './refugeUpdateFuncs';
import { StyleOption, defaultOption } from './styleOption';

/**
 * Apply phina.js style
 *
 * - Override "rotation" to degree base
 * - Enable executing Element "update" method
 *   + Refuge original "update" funcs used in pixi objects
 *
 * @caveats
 * This feature is experimental
 *
 */
export default function (options: Partial<StyleOption>) {
  const optionFulFulled: StyleOption = Object.assign(
    {},
    defaultOption,
    options
  );

  if (optionFulFulled.rotationAsDegree) {
    // Override rotation setter
    Object.defineProperty(DisplayObject.prototype, 'rotation', {
      set: function (v: number) {
        this.angle = v;
      },
      enumerable: false,
      configurable: true,
    });
    LibConfig.setRotationAsDegree = true;
  }

  if (optionFulFulled.enableUpdateMethod) {
    // "update" method refuging
    refugeAnimatedSpriteUpdate();

    LibConfig.enableUpdateFunc = true;
  }
}
