import { Graphics } from 'pixi.js';
import { toHex, clamp } from './utils';

export interface GaugeOptions {
  width?: number;
  height?: number;
  value?: number;
  max?: number;
  min?: number;
  visualMax?: number;
  visualMin?: number;
  color?: string | number;
  bgColor?: string | number;
}

// Const
const DEFAULT_WIDTH = 128;
const DEFAULT_HEIGHT = 16;
const DEFAULT_MAX_VALUE = 100;
const DEFAULT_MIN_VALUE = 0;
const DEFAULT_COLOR_MAIN = 0xffffff;
const DEFAULT_COLOR_BG = 0x222222;

/**
 * Gauge drawing class with PIXI.Graphics
 *
 * ### TODO
 * - Add stroke drawing feature
 * - Add cornerRadius feature
 * - Add value change animation feature
 */
export class Gauge extends Graphics {
  /**
   * The ratio which shows the gauge visible value.
   * The actual drawing uses this value.
   */
  private _visualRatio: number = 0;

  protected _value: number = 0;
  protected _gaugeWidth: number = DEFAULT_WIDTH;
  protected _gaugeHeight: number = DEFAULT_HEIGHT;
  protected _maxValue: number = DEFAULT_MAX_VALUE;
  protected _minValue: number = DEFAULT_MIN_VALUE;
  protected _visualMaxValue: number = DEFAULT_MAX_VALUE; // 見かけ上の最大値
  protected _visualMinValue: number = DEFAULT_MIN_VALUE; // 見かけ上の最小値
  protected _mainColor: number = DEFAULT_COLOR_MAIN;
  protected _bgColor: number = DEFAULT_COLOR_BG;
  private _gaugeAlpha: number = 1.0;

  /**
   * @params params
   */
  constructor(params: GaugeOptions = {}) {
    super();
    if (params.width) this._gaugeWidth = params.width;
    if (params.height) this._gaugeHeight = params.height;
    if (params.max != null) this._maxValue = this._visualMaxValue = params.max;
    if (params.min != null) this._minValue = this._visualMinValue = params.min;
    if (params.visualMax != null) this._visualMaxValue = params.visualMax;
    if (params.visualMin != null) this._visualMinValue = params.visualMin;
    if (params.value != null) this.value = params.value;
    this.setColor(params.color, params.bgColor);
  }

  /**
   * update gauge image
   */
  private _drawGauge() {
    this.clear()

      // background
      .beginFill(this._bgColor, 1)
      .drawRect(0, 0, this._gaugeWidth, this._gaugeHeight)
      .endFill()

      // main
      .beginFill(this._mainColor, this._gaugeAlpha)
      .drawRect(0, 0, this._gaugeWidth * this._visualRatio, this._gaugeHeight)
      .endFill();
  }

  /**
   * 見かけ上のゲージ率値を再セット=>再描画
   */
  private _updateVisualRatio() {
    // 見かけ最小値と実際値の差分から比率を計算、それを0 ~ 1.0の範囲にclamp
    const delta = this._value - this._visualMinValue;
    const tempRatio = delta / (this._visualMaxValue - this._visualMinValue);
    this._visualRatio = clamp(tempRatio, 0, 1);
    this._drawGauge();
  }

  /**
   * set value
   *
   * @param v 指定値。未指定で内部値の再計算・再描画のみを行うことも可能
   * @param clampWithinRange 値がminValue ~ maxValueの範囲に収まるよう制限する。デフォルトはtrue
   */
  setValue(v: number = this._value, clampWithinRange: boolean = true) {
    if (clampWithinRange) v = clamp(v, this._minValue, this._maxValue);
    this._value = v;
    this._updateVisualRatio();
    return this;
  }

  /**
   * 最大値をセット
   * @param v 実際の最大値
   * @param updateVisualValueToo 見かけ上の値も更新するかどうか（デフォルト: true）。数字を指定した場合、その数字を代入。
   */
  setMax(v: number, updateVisualValueToo: number | boolean = true) {
    this._maxValue = v;
    if (typeof updateVisualValueToo === 'number') {
      this._visualMaxValue = updateVisualValueToo;
    } else if (updateVisualValueToo === true) {
      this._visualMaxValue = v;
    }
    this._updateVisualRatio();
    return this;
  }

  /**
   * 最小値セット
   * @param v 実際値セット
   * @param updateVisualValueToo 見かけ上の値も更新するかどうか（デフォルト: true）。数字を指定した場合、その数字を代入。
   */
  setMin(v: number, updateVisualValueToo: number | boolean = true) {
    this._minValue = v;
    if (typeof updateVisualValueToo === 'number') {
      this._visualMinValue = updateVisualValueToo;
    } else if (updateVisualValueToo === true) {
      this._visualMinValue = v;
    }
    this._updateVisualRatio();
    return this;
  }

  /**
   * set the value to max
   */
  refill() {
    this.setValue(this._maxValue);
    return this;
  }

  /**
   * set gauge and background color
   *
   * @param mainColor hex
   * @param bgColor hex
   */
  setColor(mainColor?: number | string, bgColor?: number | string): this {
    let isDirty = false;

    if (mainColor != null) {
      mainColor = toHex(mainColor);
      if (mainColor !== this._mainColor) {
        this._mainColor = mainColor;
        isDirty = true;
      }
    }

    if (bgColor != null) {
      bgColor = toHex(bgColor);
      if (bgColor !== this._bgColor) {
        this._bgColor = bgColor;
        isDirty = true;
      }
    }

    if (isDirty) this._drawGauge();
    return this;
  }

  /**
   * @property
   * @readonly
   * 見かけ上のゲージ率。0 ~ 1.0の値を返す
   */
  get visualRatio() {
    return this._visualRatio;
  }

  /**
   * @property
   * 実際値。setの際はmin~max間にclampされることを留意。
   */
  get value() {
    return this._value;
  }
  set value(v: number) {
    this.setValue(v);
  }

  /**
   * @property
   * @readonly
   * ゲージの最大値（実際値）
   * 見かけの最大値（visualMaxValue）とは区別される
   * setの際は {@link Gauge#setMax} を使用
   */
  get maxValue() {
    return this._maxValue;
  }

  /**
   * @property
   * @readonly
   * ゲージの最小値（実際値）
   * 見かけの最小値（visualMinValue）とは区別される
   * setの際は {@link Gauge#setMin} を使用
   */
  get minValue() {
    return this._minValue;
  }

  /**
   * ゲージの透明度
   */
  get gaugeAlpha() {
    return this._gaugeAlpha;
  }
  set gaugeAlpha(v: number) {
    if (this._gaugeAlpha === v) return;
    this._gaugeAlpha = v;
    this._drawGauge();
  }

  /**
   * @readonly
   * valueが最大値以上かどうか
   */
  get isMax() {
    return this._value >= this._maxValue;
  }

  /**
   * @readonly
   * valueが負数かどうか
   */
  get isNeg() {
    return this._value < 0;
  }
}
