// @flow strict

import {Global} from './Global';

export class Scene<CustomEventType> {
  global: Global<CustomEventType> | null;

  constructor() {
    this.global = null;
  }

  update(deltaTime: number) {}

  destroy() {}
}
