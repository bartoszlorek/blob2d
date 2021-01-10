import {Addon, Entity} from '../../src';
import {AddonsType, TraitsType, EventsType} from '../types';

export class Entities extends Addon<
  Entity<AddonsType, TraitsType, EventsType>
> {
  public update(deltaTime: number): void {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].update(deltaTime);
    }
  }
}
