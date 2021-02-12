import {ScreenButton} from './ScreenButton';

const simulateTouchStart = node => {
  node.dispatchEvent(new TouchEvent('touchstart'));
};

const simulateTouchEnd = node => {
  node.dispatchEvent(new TouchEvent('touchend'));
};

describe('class ScreenButton', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('adds keydown and keyup listeners on construct', () => {
    const node = document.createElement('div');
    const addEvent = jest.spyOn(node, 'addEventListener');

    new ScreenButton('ArrowLeft', node);
    expect(addEvent).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addEvent).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(addEvent).toHaveBeenCalledWith('touchstart', expect.any(Function));
    expect(addEvent).toHaveBeenCalledWith('touchend', expect.any(Function));
  });

  it('removes keydown and keyup listeners when destroyed', () => {
    const node = document.createElement('div');
    const removeEvent = jest.spyOn(node, 'removeEventListener');
    const button = new ScreenButton('ArrowLeft', node);

    button.destroy();
    expect(removeEvent).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEvent).toHaveBeenCalledWith('mouseup', expect.any(Function));
    // prettier-ignore
    expect(removeEvent).toHaveBeenCalledWith('touchstart',expect.any(Function));
    expect(removeEvent).toHaveBeenCalledWith('touchend', expect.any(Function));
  });

  it('simulates pressing a physical key', () => {
    const callback = jest.fn();
    const node = document.createElement('div');
    new ScreenButton('ArrowLeft', node);

    window.addEventListener('keydown', callback);
    simulateTouchStart(node);
    simulateTouchStart(node);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('fires onKeydown method with node argument on press', () => {
    const node = document.createElement('div');
    const button = new ScreenButton('ArrowLeft', node);
    const onKeydown = jest.spyOn(button, 'onKeydown');

    simulateTouchStart(node);
    expect(onKeydown).toHaveBeenCalledWith(node);
  });

  it('fires onKeyup method with node argument on release', () => {
    const node = document.createElement('div');
    const button = new ScreenButton('ArrowLeft', node);
    const onKeyup = jest.spyOn(button, 'onKeyup');

    simulateTouchEnd(node);
    expect(onKeyup).toHaveBeenCalledWith(node);
  });
});
