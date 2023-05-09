import { Point, TilingSprite } from 'pixi.js';
import { PhinaEvent } from '../core/types';

/**
 * @experimental
 * ScrollableSprite
 *
 * テクスチャが自動スクロールするSpriteクラス
 * アクションシーンの背景に利用
 *
 * スクロール速度やスクロール原点を設定可能
 */
export class ScrollableSprite extends TilingSprite {
  public readonly scrollVector = new Point(-1, 0);
  public readonly resetPoint = new Point(0, 0);
  public scrollEnabled = true;
  private _scrollingFunc?: () => void;

  constructor(...params: ConstructorParameters<typeof TilingSprite>) {
    super(...params);
    this.activateAutoScrolling();
  }

  setScrollVector(x = this.scrollVector.x, y = this.scrollVector.y) {
    this.scrollVector.set(x, y);
    return this;
  }

  tickScroll() {
    this.tileScale.x += this.scrollVector.x;
    this.tileScale.y += this.scrollVector.y;
  }

  resetScroll() {
    this.tileScale.copyFrom(this.resetPoint);
  }

  /**
   * Enable auto-scrolling using {@link BaseApp} class driven "enterframe" event
   */
  activateAutoScrolling() {
    if (this._scrollingFunc) return;

    this._scrollingFunc = () => {
      if (this.scrollEnabled) this.tickScroll();
    };
    this.on(PhinaEvent.Enterframe, this._scrollingFunc);
  }

  /**
   * Disable App driven auto-scrolling
   */
  killAutoScrolling() {
    if (!this._scrollingFunc) return;

    this.off(PhinaEvent.Enterframe, this._scrollingFunc);
    delete this._scrollingFunc;
  }
}
