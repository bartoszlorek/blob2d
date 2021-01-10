import {IComponent} from './types';
import {Entity} from './Entity';

export class Trait<
  AddonsType extends {},
  TraitsType extends {},
  EventsType extends string
> implements IComponent {
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
