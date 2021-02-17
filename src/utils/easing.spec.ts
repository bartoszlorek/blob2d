import {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
} from './easing';

describe.each([
  [linear, 0, 0.5, 1],
  [easeInQuad, 0, 0.25, 1],
  [easeOutQuad, 0, 0.75, 1],
  [easeInOutQuad, 0, 0.5, 1],
  [easeInCubic, 0, 0.125, 1],
  [easeOutCubic, 0, 0.875, 1],
  [easeInOutCubic, 0, 0.5, 1],
  [easeInQuart, 0, 0.0625, 1],
  [easeOutQuart, 0, 0.9375, 1],
  [easeInOutQuart, 0, 0.5, 1],
  [easeInQuint, 0, 0.03125, 1],
  [easeOutQuint, 0, 0.96875, 1],
  [easeInOutQuint, 0, 0.5, 1],
  [easeInElastic, 0, 1.002652875894048, 1],
  [easeOutElastic, -0, -0.0026528758940480273, 1],
  [easeInOutElastic, 0, 0.5, 1],
])('%p', (fn, a, b, c) => {
  test(`returns ${a} for value 0`, () => {
    expect(fn(0)).toBe(a);
  });

  test(`returns ${b} for value 0.5`, () => {
    expect(fn(0.5)).toBe(b);
  });

  test(`returns ${c} for value 1`, () => {
    expect(fn(1)).toBe(c);
  });
});
