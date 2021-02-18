import {lerp, sign, randomInt, randomFloat} from './math';

const random = jest.spyOn(Math, 'random');

describe('lerp()', () => {
  it('returns start when bias equals 0', () => {
    expect(lerp(3.33, 5, 0)).toBe(3.33);
  });

  it('returns end when bias equals 1', () => {
    expect(lerp(3.33, 5, 1)).toBe(5);
  });

  it('returns value in the middle when bias equals 0.5', () => {
    expect(lerp(3.33, 5, 0.5)).toBe(4.165);
  });

  it('returns start value when bias is smaller than error', () => {
    expect(lerp(3.33, 5, 0.001, 0.01)).toBe(3.33);
  });

  it('returns end value when bias is greater than 1-error', () => {
    expect(lerp(3.33, 5, 0.999, 0.01)).toBe(5);
  });
});

describe('sign()', () => {
  it('returns -1 for a negative value', () => {
    expect(sign(-3.33)).toBe(-1);
  });

  it('returns 1 for a positive value', () => {
    expect(sign(3.33)).toBe(1);
  });

  it('returns 0 for a zero value', () => {
    expect(sign(0)).toBe(0);
  });
});

describe('randomInt()', () => {
  beforeEach(() => {
    random.mockReturnValue(0.25);
  });

  it('returns value between 0 and 1 when min and max are omitted', () => {
    expect(randomInt()).toBe(0);
  });

  it('returns value between 0 and first argument when second is omitted', () => {
    expect(randomInt(15)).toBe(4);
  });

  it('returns value between min and max', () => {
    expect(randomInt(10, 20)).toBe(12);
  });
});

describe('randomFloat()', () => {
  beforeEach(() => {
    random.mockReturnValue(0.25);
  });

  it('returns value between 0 and 1 when min and max are omitted', () => {
    expect(randomFloat()).toBe(0.25);
  });

  it('returns value between 0 and first argument when second is omitted', () => {
    expect(randomFloat(15)).toBe(3.75);
  });

  it('returns value between min and max', () => {
    expect(randomFloat(10, 20)).toBe(12.5);
  });
});
