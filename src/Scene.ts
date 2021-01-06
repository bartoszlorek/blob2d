import {EventEmitter} from 'eventemitter3';

export class Scene<
  EventTypes extends string = 'scene/eventName'
> extends EventEmitter<EventTypes> {
  constructor() {
    super();
  }

  public update(deltaTime: number): void {
    // fill in
  }

  public destroy(): void {
    this.removeAllListeners();
  }
}
