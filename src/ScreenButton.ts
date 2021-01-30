// @flow strict

import {
  IAnimationFrameRequest,
  setFrameTimeout,
  setFrameInterval,
  clearFrameRequest,
} from './utils/raf';

const INITIAL_DELAY = 500;
const REPEATS_DELAY = 80;

export class ScreenButton<TKey extends string = string> {
  public readonly key: TKey;
  public destroy: () => void;

  constructor(key: TKey, node: HTMLElement) {
    this.key = key;

    let timeoutRequest: IAnimationFrameRequest;
    let intervalRequest: IAnimationFrameRequest;

    function clearFrameRequests() {
      clearFrameRequest(timeoutRequest);
      clearFrameRequest(intervalRequest);
    }

    const startListener = (event: TouchEvent) => {
      event.preventDefault();
      clearFrameRequests();

      timeoutRequest = setFrameTimeout(() => {
        intervalRequest = setFrameInterval(() => {
          this.handleEvent('keydown');
        }, REPEATS_DELAY);

        this.handleEvent('keydown');
      }, INITIAL_DELAY);

      this.handleEvent('keydown');
    };

    const endListener = () => {
      this.handleEvent('keyup');
      clearFrameRequests();
    };

    node.addEventListener('touchstart', startListener);
    node.addEventListener('touchend', endListener);

    this.destroy = () => {
      node.removeEventListener('touchstart', startListener);
      node.removeEventListener('touchend', endListener);
    };
  }

  protected handleEvent(type: 'keydown' | 'keyup') {
    const event = new KeyboardEvent(type, {
      key: this.key,
    });

    // simulate the click of a physical keyboard
    window.dispatchEvent(event);

    if (type === 'keydown') {
      this.onKeydown();
    } else {
      this.onKeyup();
    }
  }

  public onKeydown() {
    // fill in subclass
  }

  public onKeyup() {
    // fill in subclass
  }
}
