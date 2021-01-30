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
  public node: HTMLElement | null;
  public destroy: () => void;

  constructor(key: TKey, node: HTMLElement) {
    this.key = key;
    this.node = node;

    let timeoutRequest: IAnimationFrameRequest | void;
    let intervalRequest: IAnimationFrameRequest | void;

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
      this.node = null;
    };
  }

  protected handleEvent(type: 'keydown' | 'keyup') {
    if (this.node === null) return;

    const event = new KeyboardEvent(type, {
      key: this.key,
    });

    // simulate the click of a physical keyboard
    window.dispatchEvent(event);

    if (type === 'keydown') {
      this.onKeydown(this.node);
    } else {
      this.onKeyup(this.node);
    }
  }

  public onKeydown(node: HTMLElement) {
    // fill in subclass
  }

  public onKeyup(node: HTMLElement) {
    // fill in subclass
  }
}
