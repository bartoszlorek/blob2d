import {Keyboard} from './Keyboard';

const simulateKeydown = (key: string) => {
  window.dispatchEvent(new KeyboardEvent('keydown', {key}));
};

const simulateKeyup = (key: string) => {
  window.dispatchEvent(new KeyboardEvent('keyup', {key}));
};

describe('class Keyboard', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('adds keydown and keyup listeners on construct', () => {
    const addEvent = jest.spyOn(global, 'addEventListener');

    new Keyboard();
    expect(addEvent).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(addEvent).toHaveBeenCalledWith('keyup', expect.any(Function));
  });

  it('removes keydown and keyup listeners when destroyed', () => {
    const removeEvent = jest.spyOn(global, 'removeEventListener');
    const keyboard = new Keyboard();

    keyboard.destroy();
    expect(removeEvent).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEvent).toHaveBeenCalledWith('keyup', expect.any(Function));
  });

  it('fires callback with `true` when button is pressed', () => {
    const keyboard = new Keyboard();
    const callback = jest.fn();

    keyboard.on('ArrowLeft', callback);
    simulateKeydown('ArrowLeft');

    expect(callback).toHaveBeenCalledWith(true);
  });

  it('fires callback with `false` when button is released', () => {
    const keyboard = new Keyboard();
    const callback = jest.fn();

    keyboard.on('ArrowLeft', callback);
    simulateKeydown('ArrowLeft');
    simulateKeyup('ArrowLeft');

    expect(callback).toHaveBeenCalledWith(false);
  });

  it('fires callback only once when pressing', () => {
    const keyboard = new Keyboard();
    const callback = jest.fn();

    keyboard.on('ArrowLeft', callback);
    simulateKeydown('ArrowLeft');
    simulateKeydown('ArrowLeft');
    simulateKeydown('ArrowLeft');
    simulateKeydown('ArrowLeft');

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('fires released callback only when it was pressed before', () => {
    const keyboard = new Keyboard();
    const callback = jest.fn();

    keyboard.on('ArrowLeft', callback);
    simulateKeyup('ArrowLeft');

    expect(callback).toHaveBeenCalledTimes(0);
  });
});
