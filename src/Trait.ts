import {ITrait} from './_types';
import {Entity} from './Entity';

export abstract class Trait<
  TAddons extends {},
  TTraits extends {},
  TEvents extends string
> implements ITrait {
  public entity: Entity<TAddons, TTraits, TEvents>;

  constructor() {
    this.entity = Entity.EMPTY as Entity<TAddons, TTraits, TEvents>;
  }

  public update(deltaTime: number): void {
    // fill in subclass
  }

  public destroy(): void {
    // fill in subclass
  }
}
