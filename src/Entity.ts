import {DisplayObject} from 'pixi.js';
import {VectorType} from './types';
import {Element} from './Element';
import {Trait} from './Trait';

export class Entity<EventType extends string> extends Element<EventType> {
  public velocity: VectorType;
  public traits: Trait[];

  constructor(
    display: DisplayObject,
    x: number = 0,
    y: number = 0,
    size: number = 32
  ) {
    super(display, [x, y], [x + size, y + size]);
    this.velocity = [0, 0];
    this.traits = [];
  }

  public update(deltaTime: number): void {
    // update position from the previous frame
    this.updateDisplayPosition();

    // update traits
    for (let i = 0; i < this.traits.length; i++) {
      this.traits[i].update(deltaTime);
    }

    // update velocity from the current frame
    this.translateX(this.velocity[0] * deltaTime);
    this.translateY(this.velocity[1] * deltaTime);
  }
}
