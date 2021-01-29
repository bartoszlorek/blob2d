import {Trait} from '../../src';
import {Addons, Traits, Events} from '../types';

export class BorderLimit extends Trait<Addons, Traits, Events> {
  public update(deltaTime: number): void {
    if (this.entity.top < 0) {
      this.entity.top = 0;
      this.entity.velocity[1] = 0;
    } else if (this.entity.bottom > window.innerHeight) {
      this.entity.bottom = window.innerHeight;
      this.entity.velocity[1] = 0;
    }

    if (this.entity.left < 0) {
      this.entity.left = 0;
      this.entity.velocity[0] = 0;
    } else if (this.entity.right > window.innerWidth) {
      this.entity.right = window.innerWidth;
      this.entity.velocity[0] = 0;
    }
  }
}
