import {Trait} from '../../src';
import {AddonsType, TraitsType, EventsType} from '../types';

export class PatrolMove extends Trait<AddonsType, TraitsType, EventsType> {
  protected readonly speed: number;
  protected readonly limit: number;
  protected distance: number;
  protected direction: number;

  constructor(speed: number = 200) {
    super();

    this.speed = speed;
    this.limit = 96;
    this.distance = 0;
    this.direction = 1;
  }

  public update(deltaTime: number): void {
    this.distance += this.speed * deltaTime;
    this.entity.velocity[1] = this.speed * this.direction;

    if (this.distance >= this.limit) {
      this.direction = this.direction > 0 ? -1 : 1;
      this.distance = 0;
    }
  }
}
