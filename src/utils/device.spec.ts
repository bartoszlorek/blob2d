import {isTouchDevice} from './device';

const maxTouchPoints = jest.fn();

Object.defineProperty(window.navigator, 'maxTouchPoints', {
  get: maxTouchPoints,
});

describe('isTouchDevice()', () => {
  beforeEach(() => {
    delete window.ontouchstart;
    maxTouchPoints.mockReset();
  });

  it('returns true when window has ontouchstart property', () => {
    window.ontouchstart = jest.fn();
    expect(isTouchDevice()).toBe(true);
  });

  it('returns true when navigator has maxTouchPoints property', () => {
    maxTouchPoints.mockReturnValue(2);
    expect(isTouchDevice()).toBe(true);
  });

  it('returns false otherwise', () => {
    expect(isTouchDevice()).toBe(false);
  });
});
