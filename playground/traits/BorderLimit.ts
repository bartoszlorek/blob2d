import {Trait} from '../../src';
import {AddonsType, TraitsType, EventsType} from '../types';

export class BorderLimit extends Trait<AddonsType, TraitsType, EventsType> {
  public update(deltaTime: number): void {
    const {
      min: [left, top],
      max: [right, bottom],
    } = this.entity;

    if (top < 0) {
      this.entity.alignTop(0);
      this.entity.velocity[1] = 0;
    } else if (bottom > window.innerHeight) {
      this.entity.alignBottom(window.innerHeight);
      this.entity.velocity[1] = 0;
    }

    if (left < 0) {
      this.entity.alignLeft(0);
      this.entity.velocity[0] = 0;
    } else if (right > window.innerWidth) {
      this.entity.alignRight(window.innerWidth);
      this.entity.velocity[0] = 0;
    }
  }
}
