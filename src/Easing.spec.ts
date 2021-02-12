import {Easing} from './Easing';

describe('class Easing', () => {
  it('transforms duration from milliseconds to seconds', () => {
    const easing = new Easing(250);
    expect(easing.duration).toBe(0.25);
  });

  it('increases lerp value by a given delta time', () => {
    const easing = new Easing(500);
    const deltaTime = 0.16;

    expect(easing.easeInQuad(deltaTime)).toBe(0);
    expect(easing.easeInQuad(deltaTime)).toBe(0.1024);
    expect(easing.easeInQuad(deltaTime)).toBe(0.4096);
    expect(easing.easeInQuad(deltaTime)).toBe(0.9216);
    expect(easing.easeInQuad(deltaTime)).toBe(1);
  });
});
