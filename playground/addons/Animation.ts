import {Addon, Entity} from '../../src';
import {AddonsType, TraitsType, EventsType} from '../types';

export class Animation extends Addon<
  Entity<AddonsType, TraitsType, EventsType>
> {
  public update(deltaTime: number): void {
    // ...
  }

  public animate(): void {
    console.log('animate');
  }
}
