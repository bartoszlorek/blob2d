/**
 * Linear interpolation between two values.
 *
 * @param start returned when bias = 0
 * @param end returned when bias = 1
 * @param bias [0-1] interpolation between start and end
 * @param error snaps bias to the start or end
 */
export function lerp(
  start: number,
  end: number,
  bias: number,
  error: number = 0
) {
  if (error > 0) {
    if (bias <= error) bias = 0;
    else if (bias >= 1 - error) bias = 1;
  }
  return start * (1 - bias) + end * bias;
}

/**
 * Returns the sign of the number. It indicates whether
 * the given number is positive, negative or zero.
 */
export function sign(value: number) {
  return value ? (value < 0 ? -1 : 1) : 0;
}

/**
 * Returns a random integer number between minimum
 * (inclusive) and maximum (inclusive) values.
 *
 * @param min equals 0 when the second argument is omitted
 * @param max equals 1 when both arguments are omitted, otherwise is the first argument
 */
export function randomInt(min?: number, max?: number) {
  const a = (max !== undefined ? min : 0) as number;
  const b = max !== undefined ? max : min ?? 1;
  return Math.floor(Math.random() * (b - a + 1) + a);
}

/**
 * Returns a random float number between minimum
 * (inclusive) and maximum (inclusive) values.
 *
 * @param min equals 0 when the second argument is omitted
 * @param max equals 1 when both arguments are omitted, otherwise is the first argument
 */
export function randomFloat(min?: number, max?: number) {
  const a = (max !== undefined ? min : 0) as number;
  const b = max !== undefined ? max : min ?? 1;
  return Math.random() * (b - a) + a;
}
