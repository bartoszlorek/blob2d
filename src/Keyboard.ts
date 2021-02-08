import {refineArray} from './utils/array';

type TEventCallback = (pressed: boolean) => void;

export class Keyboard<TKey extends string = string> {
  public destroy: () => void;

  protected states: Map<TKey, boolean>;
  protected events: Map<TKey, TEventCallback>;

  constructor() {
    this.states = new Map();
    this.events = new Map();

    const listener = (event: KeyboardEvent) => {
      this.handleEvent(event);
    };

    window.addEventListener('keydown', listener);
    window.addEventListener('keyup', listener);

    this.destroy = () => {
      window.removeEventListener('keydown', listener);
      window.removeEventListener('keyup', listener);
      this.events.clear();
    };
  }

  public on(keys: TKey | TKey[], callback: TEventCallback) {
    refineArray(keys).forEach(key => {
      this.events.set(key, callback);
    });
  }

  public off(keys: TKey | TKey[]) {
    refineArray(keys).forEach(key => {
      this.events.delete(key);
    });
  }

  protected handleEvent(event: KeyboardEvent) {
    event.preventDefault();
    const key = event.key as TKey;

    if (!this.events.has(key)) {
      return;
    }
    const pressed = event.type === 'keydown';

    // shouldn't invoke keyup before keydown
    if (!pressed && !this.states.get(key)) {
      return;
    }

    if (this.states.get(key) !== pressed) {
      this.states.set(key, pressed);

      const callback = this.events.get(key);
      if (callback) callback(pressed);
    }
  }
}
