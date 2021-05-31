import {
  Sprite as PixiSprite,
  LoaderResource,
  Rectangle,
  Texture,
} from 'pixi.js';
import phina from 'phina.js';
import { AssetType } from './types';
const { FrameAnimation } = phina.accessory;
const { AssetManager } = phina.asset;

type PixiTextureOrKey = Texture | string;

// Override phina FrameAnimation._updateFrame
FrameAnimation.prototype._updateFrame = function (): void {
  if (!this.currentAnimation) return;

  var anim = this.currentAnimation;
  if (this.currentFrameIndex >= anim.frames.length) {
    if (anim.next) {
      this.gotoAndPlay(anim.next);
      return;
    } else {
      this.paused = true;
      this.finished = true;
      return;
    }
  }

  var index = anim.frames[this.currentFrameIndex];
  var frame = this.ss.getFrame(index);

  // this.target.srcRect.set(frame.x, frame.y, frame.width, frame.height);
  const sprite = this.target as Sprite;
  sprite.texture.frame.x = frame.x;
  sprite.texture.frame.y = frame.y;
  sprite.texture.frame.width = frame.width;
  sprite.texture.frame.height = frame.height;
  sprite.texture.updateUvs();

  // if (this.fit) {
  //   this.target.width = frame.width;
  //   this.target.height = frame.height;
  // }
};

/**
 * @param texture 
 */
function _cloneTexture(texture: PixiTextureOrKey): Texture {
  if (typeof texture === 'string') {
    return Sprite.getTextureByKey(texture).clone()
  } else {
    return texture.clone();
  }
}

/**
 * PIXI.Sprite+α class
 * 文字列keyでの指定ができるなど、phina.js Spriteクラスの特徴を追加
 * textureはframe更新処理のため、cloneする
 */
export class Sprite extends PixiSprite {
  _frameIndex: number = 0;

  /**
   * @param texture Texture will be cloned
   * @returns
   */
  constructor(texture: PixiTextureOrKey) {
    super(_cloneTexture(texture));
  }

  setTexture(texture: PixiTextureOrKey): this {
    this.texture = _cloneTexture(texture);
    return this;
  }

  /**
   * @param index Index of frame. Number loops when it exceeds max index
   * @param frameWidth
   * @param frameHeight
   * @returns
   */
  setFrameIndex(
    index: number,
    frameWidth: number = this._width,
    frameHeight: number = this._height
  ) {
    const row = ~~(this.texture.baseTexture.width / frameWidth);
    const col = ~~(this.texture.baseTexture.height / frameHeight);
    const maxIndex = row * col;
    index = index % maxIndex;

    const x = index % row;
    const y = ~~(index / row);
    const srcRect = this.srcRect;
    srcRect.x = x * frameWidth;
    srcRect.y = y * frameHeight;
    srcRect.width = frameWidth;
    srcRect.height = frameHeight;

    this.texture.updateUvs();

    this._frameIndex = index;

    return this;
  }

  get srcRect(): Rectangle {
    return this.texture.frame;
  }

  static getTextureByKey(key: string) {
    const resrc = (AssetManager.get(
      AssetType.Pixi,
      key
    ) as unknown) as LoaderResource;
    if (resrc && resrc.texture) {
      return resrc.texture;
    } else {
      // TODO： warning
      return PIXI.Texture.EMPTY;
    }
  }

  static from(
    source: string | PIXI.Texture | HTMLCanvasElement | HTMLVideoElement
  ) {
    return PixiSprite.from(source);
  }
}
