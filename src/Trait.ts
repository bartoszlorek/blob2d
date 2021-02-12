import {ITrait} from './types';
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

  /**
   * It can be utilized by a subclass trait
   * for a particular functionality.
   */
  public update(deltaTime: number) {
    // fill in subclass
  }

  /**
   * Invoked by a parent entity when destroyed.
   */
  public destroy() {
    // fill in subclass
  }
}
