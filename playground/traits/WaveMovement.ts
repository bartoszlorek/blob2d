import {Trait} from 'blob2d';
import {Addons, Events, Traits} from '../types';

export class WaveMovement extends Trait<Addons, Traits, Events> {
  protected readonly center: number;
  protected readonly offset: number;
  protected readonly speed: number;
  protected direction: number;

  constructor(center: number, offset: number, speed: number = 100) {
    super();

    this.center = center;
    this.offset = offset;
    this.speed = speed;
    this.direction = 1;
  }

  public update(deltaTime: number) {
    this.entity.velocity[0] = 0;
    this.entity.velocity[1] = this.speed * this.direction;

    if (this.direction > 0) {
      // going down
      if (this.entity.y > this.center + this.offset) {
        this.changeDirection();
      }
    } else {
      // going up
      if (this.entity.y < this.center - this.offset) {
        this.changeDirection();
      }
    }
  }

  protected changeDirection() {
    this.direction = this.direction > 0 ? -1 : 1;
  }
}
