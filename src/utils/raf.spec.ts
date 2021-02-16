import {clearFrameRequest, setFrameInterval, setFrameTimeout} from './raf';

let timestamp = 0;
const now = jest.spyOn(window.performance, 'now');
const raf = jest.spyOn(window, 'requestAnimationFrame');

now.mockReturnValue(timestamp);
raf.mockImplementation(() => 12340); // request id

const advanceAnimationFrames = value => {
  const calls = raf.mock.calls;
  const listener = calls[calls.length - 1][0];
  timestamp += value;
  listener(timestamp);
};

beforeEach(() => {
  jest.clearAllMocks();
  timestamp = 0;
});

describe('setFrameTimeout()', () => {
  it('fires callback after a delay', () => {
    const callback = jest.fn();

    setFrameTimeout(callback, 300);
    advanceAnimationFrames(100);
    advanceAnimationFrames(100);
    advanceAnimationFrames(100);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not fire callback before a delay', () => {
    const callback = jest.fn();

    setFrameTimeout(callback, 300);
    advanceAnimationFrames(100);
    advanceAnimationFrames(100);

    expect(callback).toHaveBeenCalledTimes(0);
  });
});

describe('setFrameInterval()', () => {
  it('fires callback after each cycle', () => {
    const callback = jest.fn();

    setFrameInterval(callback, 200);
    advanceAnimationFrames(100); // first cycle
    advanceAnimationFrames(100);
    advanceAnimationFrames(100); // second cycle
    advanceAnimationFrames(100);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('does not fire callback before a delay', () => {
    const callback = jest.fn();

    setFrameTimeout(callback, 300);
    advanceAnimationFrames(100);
    advanceAnimationFrames(100);

    expect(callback).toHaveBeenCalledTimes(0);
  });
});

describe('clearFrameRequest()', () => {
  it('does not throw an error when request is undefined', () => {
    expect(() => {
      clearFrameRequest(undefined);
    }).not.toThrowError();
  });

  it('prevents setFrameTimeout to execute', () => {
    const callback = jest.fn();
    const request = setFrameTimeout(callback, 300);

    clearFrameRequest(request);
    advanceAnimationFrames(500);
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('prevents setFrameInterval to execute', () => {
    const callback = jest.fn();
    const request = setFrameInterval(callback, 300);

    clearFrameRequest(request);
    advanceAnimationFrames(500);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
