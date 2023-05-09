import { Graphics } from 'pixi.js';
import { Rad360, clamp } from '../math';

export interface RingGaugeOptions {
  value?: number;
  maxValue?: number;
  /** Hex */
  color: number;
  radius: number;
  thickness: number;
  alignment: number;
  antiClockWise: boolean;
}

/**
 * RingGauge
 *
 * @example
 * const gauge = new phixi.RingGauge(options);
 * gauge.value = 10;
 *
 * @see https://codesandbox.io/s/pixi-v6-arc-gauge-sample-sjws6?file=/src/RingGauge.ts:0-1985
 */
export class RingGauge extends Graphics {
  protected _value: number = RingGauge.defaultParams.value;
  protected _maxValue: number = RingGauge.defaultParams.maxValue;
  // We use color instead of "fill" which is used in Base class
  protected _color: number = RingGauge.defaultParams.color;
  protected _radius: number = RingGauge.defaultParams.radius;
  protected _thickness: number = RingGauge.defaultParams.thickness;
  protected _alignment: number = RingGauge.defaultParams.alignment;
  protected _antiClockWise = RingGauge.defaultParams.antiClockWise;

  constructor(options: RingGaugeOptions) {
    super();
    const optionsFulfilled = { ...RingGauge.defaultParams, ...options };
    this._color = optionsFulfilled.color;
    this._radius = optionsFulfilled.radius;
    this._thickness = optionsFulfilled.thickness;
    this._alignment = optionsFulfilled.alignment;
    this._maxValue = optionsFulfilled.maxValue;
    this._antiClockWise = optionsFulfilled.antiClockWise;
    this._updateView();
  }

  protected _updateView() {
    const ratio = this._value / this._maxValue;
    const arcRadian = clamp(Rad360 * ratio, 0, Rad360);

    const startAngle = 0;
    const endAngle = !this._antiClockWise ? arcRadian : -arcRadian;

    // We have to use "fill" instead of "stroke" to achieve precised line edges
    // see https://github.com/pixijs/pixijs/issues/5533 for details
    const alignFactor = this._thickness * this._alignment;
    const outerArcRadius = this._radius + this._thickness - alignFactor;
    const innerArcRadius = this._radius - alignFactor;

    this.clear()
      .beginFill(this._color)
      .arc(0, 0, outerArcRadius, startAngle, endAngle, this._antiClockWise)
      .lineTo(
        Math.cos(endAngle) * innerArcRadius,
        Math.sin(endAngle) * innerArcRadius
      )
      .arc(0, 0, innerArcRadius, endAngle, startAngle, !this._antiClockWise)
      .closePath()
      .endFill();
  }

  public setValue(v: number) {
    this._value = v;
    this._updateView();
  }

  get value() {
    return this._value;
  }
  set value(v) {
    this.setValue(v);
  }

  get color(): number {
    return this._color;
  }
  set color(value: number) {
    this._color = value;
    this._updateView();
  }

  get radius(): number {
    return this._radius;
  }
  set radius(value: number) {
    this._radius = value;
    this._updateView();
  }

  get thickness(): number {
    return this._thickness;
  }
  set thickness(value: number) {
    this._thickness = value;
    this._updateView();
  }

  /** 0 ~ 1 */
  get alignment(): number {
    return this._alignment;
  }
  set alignment(value: number) {
    this._alignment = value;
    this._updateView();
  }

  get antiClockWise() {
    return this._antiClockWise;
  }
  set antiClockWise(v) {
    this._antiClockWise = v;
    this._updateView();
  }

  static defaultParams: Required<RingGaugeOptions> = {
    value: 0,
    maxValue: 100,
    color: 0xfeeb77,
    radius: 64,
    thickness: 12,
    alignment: 0.5,
    antiClockWise: false,
  };
}
