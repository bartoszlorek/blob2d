// Set of easing functions for a smooth motion.
// https://gist.github.com/gre/1650294
// https://matthewlein.com/tools/ceaser

/**
 * no easing, no acceleration
 */
export function linear(t: number) {
  return t;
}

/**
 * accelerating from zero velocity
 */
export function easeInQuad(t: number) {
  return t * t;
}

/**
 * decelerating to zero velocity
 */
export function easeOutQuad(t: number) {
  return t * (2 - t);
}

/**
 * acceleration until halfway, then deceleration
 */
export function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * accelerating from zero velocity
 */
export function easeInCubic(t: number) {
  return t * t * t;
}

/**
 * decelerating to zero velocity
 */
export function easeOutCubic(t: number) {
  return --t * t * t + 1;
}

/**
 * acceleration until halfway, then deceleration
 */
export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

/**
 * accelerating from zero velocity
 */
export function easeInQuart(t: number) {
  return t * t * t * t;
}

/**
 * decelerating to zero velocity
 */
export function easeOutQuart(t: number) {
  return 1 - --t * t * t * t;
}

/**
 * acceleration until halfway, then deceleration
 */
export function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
}

/**
 * accelerating from zero velocity
 */
export function easeInQuint(t: number) {
  return t * t * t * t * t;
}

/**
 * decelerating to zero velocity
 */
export function easeOutQuint(t: number) {
  return 1 + --t * t * t * t * t;
}

/**
 * acceleration until halfway, then deceleration
 */
export function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

/**
 * elastic bounce effect at the beginning
 */
export function easeInElastic(t: number) {
  if (t === 0) return 0;
  return (0.04 - 0.04 / t) * Math.sin(25 * t) + 1;
}

/**
 * elastic bounce effect at the end
 */
export function easeOutElastic(t: number) {
  if (t === 1) return 1;
  return ((0.04 * t) / --t) * Math.sin(25 * t);
}

/**
 * elastic bounce effect at the beginning and end
 */
export function easeInOutElastic(t: number) {
  if (t === 0.5) return 0.5;
  return (t -= 0.5) < 0
    ? (0.02 + 0.01 / t) * Math.sin(50 * t)
    : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1;
}
