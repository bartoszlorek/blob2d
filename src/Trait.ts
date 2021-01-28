import {ITrait} from './_types';
import {Entity} from './Entity';

export abstract class Trait<
  AddonsType extends {},
  TraitsType extends {},
  EventsType extends string
> implements ITrait {
  public entity: Entity<AddonsType, TraitsType, EventsType>;

  constructor() {
    this.entity = Entity.EMPTY as Entity<AddonsType, TraitsType, EventsType>;
  }

  public update(deltaTime: number): void {
    // fill in subclass
  }

  public destroy(): void {
    // fill in subclass
  }
}
