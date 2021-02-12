/**
 * Match the best easing type for your animation.
 *
 * @constructor
 * @param {number} duration - milliseconds
 *
 * @link https://gist.github.com/gre/1650294
 * @link https://matthewlein.com/tools/ceaser
 */
export class Easing {
  public readonly duration: number;
  private _accumulatedTime: number;

  constructor(duration: number) {
    this.duration = duration / 1000;
    this._accumulatedTime = 0;
  }

  protected getTime(deltaTime: number) {
    const time = this._accumulatedTime / this.duration;

    if (time >= 1) {
      this._accumulatedTime = 0;
      return 1;
    }

    this._accumulatedTime += deltaTime;
    return time;
  }

  public linear(deltaTime: number) {
    return Easing.linear(this.getTime(deltaTime));
  }

  public easeInQuad(deltaTime: number) {
    return Easing.easeInQuad(this.getTime(deltaTime));
  }

  public easeOutQuad(deltaTime: number) {
    return Easing.easeOutQuad(this.getTime(deltaTime));
  }

  public easeInOutQuad(deltaTime: number) {
    return Easing.easeInOutQuad(this.getTime(deltaTime));
  }

  public easeInCubic(deltaTime: number) {
    return Easing.easeInCubic(this.getTime(deltaTime));
  }

  public easeOutCubic(deltaTime: number) {
    return Easing.easeOutCubic(this.getTime(deltaTime));
  }

  public easeInOutCubic(deltaTime: number) {
    return Easing.easeInOutCubic(this.getTime(deltaTime));
  }

  public easeInQuart(deltaTime: number) {
    return Easing.easeInQuart(this.getTime(deltaTime));
  }

  public easeOutQuart(deltaTime: number) {
    return Easing.easeOutQuart(this.getTime(deltaTime));
  }

  public easeInOutQuart(deltaTime: number) {
    return Easing.easeInOutQuart(this.getTime(deltaTime));
  }

  public easeInQuint(deltaTime: number) {
    return Easing.easeInQuint(this.getTime(deltaTime));
  }

  public easeOutQuint(deltaTime: number) {
    return Easing.easeOutQuint(this.getTime(deltaTime));
  }

  public easeInOutQuint(deltaTime: number) {
    return Easing.easeInOutQuint(this.getTime(deltaTime));
  }

  public easeInElastic(deltaTime: number) {
    return Easing.easeInElastic(this.getTime(deltaTime));
  }

  public easeOutElastic(deltaTime: number) {
    return Easing.easeOutElastic(this.getTime(deltaTime));
  }

  public easeInOutElastic(deltaTime: number) {
    return Easing.easeInOutElastic(this.getTime(deltaTime));
  }

  /**
   * no easing, no acceleration
   */
  static linear(t: number) {
    return t;
  }

  /**
   * accelerating from zero velocity
   */
  static easeInQuad(t: number) {
    return t * t;
  }

  /**
   * decelerating to zero velocity
   */
  static easeOutQuad(t: number) {
    return t * (2 - t);
  }

  /**
   * acceleration until halfway, then deceleration
   */
  static easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * accelerating from zero velocity
   */
  static easeInCubic(t: number) {
    return t * t * t;
  }

  /**
   * decelerating to zero velocity
   */
  static easeOutCubic(t: number) {
    return --t * t * t + 1;
  }

  /**
   * acceleration until halfway, then deceleration
   */
  static easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  /**
   * accelerating from zero velocity
   */
  static easeInQuart(t: number) {
    return t * t * t * t;
  }

  /**
   * decelerating to zero velocity
   */
  static easeOutQuart(t: number) {
    return 1 - --t * t * t * t;
  }

  /**
   * acceleration until halfway, then deceleration
   */
  static easeInOutQuart(t: number) {
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  }

  /**
   * accelerating from zero velocity
   */
  static easeInQuint(t: number) {
    return t * t * t * t * t;
  }

  /**
   * decelerating to zero velocity
   */
  static easeOutQuint(t: number) {
    return 1 + --t * t * t * t * t;
  }

  /**
   * acceleration until halfway, then deceleration
   */
  static easeInOutQuint(t: number) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }

  /**
   * elastic bounce effect at the beginning
   */
  static easeInElastic(t: number) {
    return (0.04 - 0.04 / t) * Math.sin(25 * t) + 1;
  }

  /**
   * elastic bounce effect at the end
   */
  static easeOutElastic(t: number) {
    return ((0.04 * t) / --t) * Math.sin(25 * t);
  }

  /**
   * elastic bounce effect at the beginning and end
   */
  static easeInOutElastic(t: number) {
    return (t -= 0.5) < 0
      ? (0.02 + 0.01 / t) * Math.sin(50 * t)
      : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1;
  }
}
