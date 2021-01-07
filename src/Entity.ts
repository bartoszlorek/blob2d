import {DisplayObject} from 'pixi.js';
import {Element} from './Element';

export class Entity<EventType extends string> extends Element<EventType> {
  public position: [number, number];
  public velocity: [number, number];

  constructor(sprite: DisplayObject, x: number = 0, y: number = 0) {
    super(sprite);
    this.position = [x, y];
    this.velocity = [0, 0];
  }

  public update(deltaTime: number): void {
    // fill in subclass
  }
}
