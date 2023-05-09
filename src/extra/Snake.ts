import { SimpleRope, Texture, Point, RopeGeometry } from 'pixi.js';

// Params: default
const DEFAULT_POINT_NUM = 8;

// Create default rect canvas texture
const defaultTexture: Texture = (() => {
  const defaultTextureWidth = 8;
  const defaultTextureHeight = 16;

  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  c.width = defaultTextureWidth;
  c.height = defaultTextureHeight;
  ctx.fillStyle = 'magenta';
  ctx.fillRect(0, 0, defaultTextureWidth, defaultTextureHeight);
  return Texture.from(c);
})();

/**
 * @class
 * SimpleRope extended class with more features.
 *
 * @example
 * // phixi
 * class MyScene extends phixi.Scene {
 *  constructor(params) {
 *    super(params);
 *    const snake = new phixi.Snake().addChildTo(this);
 *    snake.onUpdate = function (app) {
 *      const p = app.pointer;
 *      if (p.getPointing()) this.pushPath(p.x, p.y);
 *    };
 *  }
 * }
 *
 * @example
 * // pixiJS only
 * const app = new PIXI.Application();
 * const snake = new phixi.Snake();
 * app.stage.addChild(snake);
 * const mouse = app.renderer.plugins.interaction.mouse.global;
 * app.ticker.add(() => {
 *   snake.pushPath(mouse.x, mouse.y);
 * });
 *
 */
export class Snake extends SimpleRope {
  declare geometry: RopeGeometry;

  /**
   * @param texture
   * @param pointNum default: 8
   * @param textureScale @see SimpleRope
   */
  constructor(
    texture: Texture = defaultTexture,
    pointNum: number = DEFAULT_POINT_NUM,
    textureScale?: number
  ) {
    super(texture, Snake.createPaths(pointNum), textureScale);
  }

  /**
   * Push new path.
   * Number of path is keeped by adding/swaping points.
   *
   * @param x
   * @param y
   */
  pushPath(x: number, y: number) {
    // Get last point
    let next = this.points.shift();
    if (!next) next = this.createPath();

    // Reset last point and shift to top
    next.x = x;
    next.y = y;
    this.points.push(next);
  }

  /**
   *
   * Path用として別のオブジェクトを指定したい場合はオーバーライドする
   *
   * @param x
   * @param y
   * @returns
   */
  createPath(x = 0, y = 0) {
    return new Point(x, y);
  }

  /**
   * Get geometry points reference
   */
  get points() {
    return this.geometry.points;
  }

  /**
   * Util: Create PIXI.Point array
   * @param n
   */
  static createPaths(n: number): Point[] {
    const arr: Point[] = new Array(n);
    for (let i = 0; i < n; i++) arr[i] = new Point(0, 0);
    return arr;
  }
}
