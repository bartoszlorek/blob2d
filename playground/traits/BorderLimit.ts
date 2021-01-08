import {Trait} from '../../src';
import {EventType} from '../types';

export class BorderLimit extends Trait<EventType> {
  constructor() {
    super('borderLimit');
  }

  update(deltaTime: number): void {
    if (!this.parent) return;

    const {
      min: [left, top],
      max: [right, bottom],
    } = this.parent;

    if (top < 0) {
      this.parent.alignTop(0);
      this.parent.velocity[1] = 0;
    } else if (bottom > window.innerHeight) {
      this.parent.alignBottom(window.innerHeight);
      this.parent.velocity[1] = 0;
    }

    if (left < 0) {
      this.parent.alignLeft(0);
      this.parent.velocity[0] = 0;
    } else if (right > window.innerWidth) {
      this.parent.alignRight(window.innerWidth);
      this.parent.velocity[0] = 0;
    }
  }
}
