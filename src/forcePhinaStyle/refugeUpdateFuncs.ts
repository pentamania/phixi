import { AnimatedSprite, Ticker, UPDATE_PRIORITY } from 'pixi.js';

/**
 * This will override AnimatedSprite methods to
 * avoid messing original "update" method by library user
 * defining their custom "update" method,
 * which is common in phina.js-style.
 *
 * @see https://pixijs.download/dev/docs/PIXI.AnimatedSprite.html#update
 */
export function refugeAnimatedSpriteUpdate() {
  // Maybe you don't need to bind
  const originalUpdate = AnimatedSprite.prototype.update;
  // const originalUpdate = AnimatedSprite.prototype.update.bind(
  //   AnimatedSprite.prototype
  // );

  AnimatedSprite.prototype.stop = function () {
    // @ts-ignore
    if (!this._playing) {
      return;
    }
    // @ts-ignore
    this._playing = false;
    // @ts-ignore
    if (this._autoUpdate && this._isConnectedToTicker) {
      Ticker.shared.remove(originalUpdate, this);
      // Ticker.shared.remove(this.update, this);

      // @ts-ignore
      this._isConnectedToTicker = false;
    }
  };

  AnimatedSprite.prototype.play = function () {
    // @ts-ignore
    if (this._playing) {
      return;
    }
    // @ts-ignore
    this._playing = true;
    // @ts-ignore
    if (this._autoUpdate && !this._isConnectedToTicker) {
      Ticker.shared.add(originalUpdate, this, UPDATE_PRIORITY.HIGH);
      // Ticker.shared.add(this.update, this, UPDATE_PRIORITY.HIGH);

      // @ts-ignore
      this._isConnectedToTicker = true;
    }
  };

  Object.defineProperty(AnimatedSprite.prototype, 'autoUpdate', {
    get: function () {
      return AnimatedSprite.prototype.autoUpdate;
    },
    set: function (this: AnimatedSprite, value: boolean) {
      // @ts-ignore
      if (value !== this._autoUpdate) {
        // @ts-ignore
        this._autoUpdate = value;
        // @ts-ignore
        if (!this._autoUpdate && this._isConnectedToTicker) {
          Ticker.shared.remove(originalUpdate, this);
          // Ticker.shared.remove(this.update, this);

          // @ts-ignore
          this._isConnectedToTicker = false;
        } else if (
          // @ts-ignore
          this._autoUpdate &&
          // @ts-ignore
          !this._isConnectedToTicker &&
          // @ts-ignore
          this._playing
        ) {
          Ticker.shared.add(originalUpdate, this);
          // Ticker.shared.add(this.update, this);

          // @ts-ignore
          this._isConnectedToTicker = true;
        }
      }
    },
  });
}
