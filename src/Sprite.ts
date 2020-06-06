import * as PIXI from "pixi.js";
import * as phina from "phina.js";
import { AssetType } from "./types";

const PixiSprite = PIXI.Sprite
type TextureOrKey = PIXI.Texture | string

/**
 * helper 
 * @param texture 
 */
function _getTexture(texture: TextureOrKey) {
  if (typeof texture === 'string') {
    return Sprite.getTextureByKey(texture)
  } else {
    return texture
  }
}

/**
 * PIXI.Sprite拡張クラス
 * 文字列keyでの指定ができるなど、phina.js Spriteクラスの特徴を追加
 */
export class Sprite extends PixiSprite {

  constructor(texture: TextureOrKey) {
    super(_getTexture(texture))
  }

  setTexture(texture: TextureOrKey): this {
    this.texture = _getTexture(texture)
    return this
  }

  setFrameIndex() {
    // TODO
  }

  static getTextureByKey(key: string) {
    const resrc = phina.asset.AssetManager.get(AssetType.Pixi, key);
    if (resrc && resrc.texture) {
      return resrc.texture
    } else {
      // TODO： warning
      return PIXI.Texture.EMPTY
    }
  }

  static from(source: string | number | PIXI.BaseTexture | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) {
    return PixiSprite.from(source)
  }

}