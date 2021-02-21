import {Entity} from '../../Entity';
import {Scene} from '../../Scene';
import {Tilemap} from '../../Tilemap';
import {IAddon} from '../../types';
import {arrayRemove} from '../../utils/array';
import {dynamicResponse, staticResponse} from './responses';
import {ICollisionsGroup} from './types';

/**
 * Built-in addon for arcade collision detection.
 * Handles entity-entity and entity-tilemap collisions.
 */
export class Collisions<
  TAddons extends {},
  TTraits extends {},
  TEvents extends string
> implements IAddon {
  public static staticResponse = staticResponse;
  public static dynamicResponse = dynamicResponse;
  public readonly groups: Required<
    ICollisionsGroup<
      Entity<TAddons, TTraits, TEvents> | Tilemap<TAddons, TEvents>
    >
  >[] = [];

  constructor(scene: Scene<TAddons, TEvents>) {
    scene.on('elementRemoved', elem => {
      this.removeElementFromAllGroups(elem);
    });
  }

  /**
   * Adds entity-tilemap or entity-entity collisions group.
   *
   * @example
   * type: 'static'       // entity-tilemap
   * type: 'dynamic'      // entity-entity
   * type: 'self_dynamic' // entity-entity
   */
  public addGroup<
    T extends ICollisionsGroup<
      Entity<TAddons, TTraits, TEvents> | Tilemap<TAddons, TEvents>
    >
  >(group: T): T {
    group.validate();
    this.groups.push(group);
    return group;
  }

  /**
   * Resolves collisions groups at each game tick.
   */
  public update(deltaTime: number) {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].resolve(deltaTime);
    }
  }

  protected removeElementFromAllGroups(
    elem: Entity<TAddons, TTraits, TEvents> | Tilemap<TAddons, TEvents>
  ) {
    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i];

      // check if the group can run without the removed element
      if (group.removeChild(elem)) {
        try {
          group.validate();
        } catch {
          arrayRemove(this.groups, group);
        }
      }
    }
  }

  /**
   * Clears groups data.
   */
  public destroy() {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].destroy();
    }
    this.groups.length = 0;
  }
}
