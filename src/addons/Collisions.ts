import {IAddon, TVector2} from '../_types';
import {refineArray, removeItem} from '../utils/array';
import {Entity} from '../Entity';
import {Scene} from '../Scene';
import {Tilemap} from '../Tilemap';

import {ICollisionGroup, TSeparation} from './CollisionsTypes';
import {
  resolveStaticGroup,
  resolveDynamicGroup,
  resolveSelfDynamicGroup,
} from './CollisionsResolvers';

/**
 * Built-in addon for arcade collision detection.
 * Handles entity-entity and entity-tilemap collisions.
 */
export class Collisions<
  TAddons extends {},
  TTraits extends {},
  TEvents extends string
> implements IAddon {
  public readonly groups: ICollisionGroup<TAddons, TTraits, TEvents>[];

  constructor(scene: Scene<TAddons, TEvents>) {
    scene.on('scene/removeElement', elem => {
      this.removeGroupElement(elem);
    });

    this.groups = [];
  }

  /**
   * Handles an entity-tilemap collision group.
   */
  public addStatic<
    A extends Entity<TAddons, TTraits, TEvents>,
    B extends Tilemap<TAddons, TEvents>
  >(
    entities: A | A[],
    tilemaps: B | B[],
    response: (entity: A, tilemap: B, separation: TSeparation<TVector2>) => void
  ) {
    this.groups.push(
      this.validateGroup({
        type: 'static',
        entities: refineArray(entities),
        tilemaps: refineArray(tilemaps),
        resolver: resolveStaticGroup,
        response,
      })
    );
  }

  /**
   * Handles an entity-entity collision group.
   */
  public addDynamic<
    A extends Entity<TAddons, TTraits, TEvents>,
    B extends Entity<TAddons, TTraits, TEvents>
  >(
    entitiesA: A | A[],
    entitiesB: B | B[],
    response: (entityA: A, entityB: B, separation: TSeparation<number>) => void
  ) {
    this.groups.push(
      this.validateGroup({
        type: 'dynamic',
        entitiesA: refineArray(entitiesA),
        entitiesB: refineArray(entitiesB),
        resolver: resolveDynamicGroup,
        response,
      })
    );
  }

  /**
   * Handles an entity-entity collision group where
   * each element should collide with each other.
   */
  public addSelfDynamic<A extends Entity<TAddons, TTraits, TEvents>>(
    entities: A[],
    response: (entityA: A, entityB: A, separation: TSeparation<number>) => void
  ) {
    this.groups.push(
      this.validateGroup({
        type: 'self_dynamic',
        entities: refineArray(entities),
        resolver: resolveSelfDynamicGroup,
        response,
      })
    );
  }

  /**
   * Resolves collisions groups at each game tick.
   */
  public update(deltaTime: number) {
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].resolver(this.groups[i], deltaTime);
    }
  }

  protected validateGroup(
    group: ICollisionGroup<TAddons, TTraits, TEvents>
  ): ICollisionGroup<TAddons, TTraits, TEvents> {
    switch (group.type) {
      case 'static':
        if (group.entities.length < 1 || group.tilemaps.length < 1) {
          throw new Error(
            'A static collision group requires at least one entity and tilemap.'
          );
        }
        break;

      case 'dynamic':
        if (group.entitiesA.length < 1 || group.entitiesB.length < 1) {
          throw new Error(
            'A dynamic collision group requires at least one entity from each sub-group.'
          );
        }
        break;

      case 'self_dynamic':
        if (group.entities.length < 2) {
          throw new Error(
            'A self dynamic collision group requires at least two entities.'
          );
        }
        break;

      default:
        assertNever(group);
    }

    return group;
  }

  protected removeGroupElement<
    A extends Entity<TAddons, TTraits, TEvents>,
    B extends Tilemap<TAddons, TEvents>
  >(element: A | B) {
    for (let i = 0; i < this.groups.length; i++) {
      let removed = false; // element can be a part of multiple groups
      const group = this.groups[i];

      if (element.type === 'entity') {
        if (group.type === 'dynamic') {
          if (
            removeItem(group.entitiesA, element) ||
            removeItem(group.entitiesB, element)
          ) {
            removed = true;
          }
        } else {
          if (removeItem(group.entities, element)) {
            removed = true;
          }
        }
      } else if (group.type === 'static') {
        if (removeItem(group.tilemaps, element)) {
          removed = true;
        }
      }

      if (removed) {
        try {
          // check if the group can run without the removed element
          this.validateGroup(group);
        } catch {
          removeItem(this.groups, group);
        }
      }
    }
  }

  /**
   * Built-in response for a static collision.
   */
  static staticResponse = staticResponse;

  /**
   * Built-in response for a dynamic collision.
   */
  static dynamicResponse = dynamicResponse;

  /**
   * Clears groups data.
   */
  public destroy() {
    this.groups.length = 0;
  }
}

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

function staticResponse<TAddons, TTraits, TEvents extends string>(
  entity: Entity<TAddons, TTraits, TEvents>,
  tilemap: Tilemap<TAddons, TEvents>,
  separation: TSeparation<TVector2>
) {
  const {magnitude, normal} = separation;
  if (normal[0] !== 0) entity.velocity[0] = magnitude[0] * normal[0];
  if (normal[1] !== 0) entity.velocity[1] = magnitude[1] * normal[1];
}

function dynamicResponse<TAddons, TTraitsA, TTraitsB, TEvents extends string>(
  entityA: Entity<TAddons, TTraitsA, TEvents>,
  entityB: Entity<TAddons, TTraitsB, TEvents>,
  separation: TSeparation<number>
) {
  const {magnitude, normal} = separation;
  const isDynamicA = entityA.physics === 'dynamic';
  const isDynamicB = entityB.physics === 'dynamic';

  if (isDynamicA > isDynamicB) {
    if (normal[0] !== 0) {
      entityA.velocity[0] = magnitude * normal[0];
    } else {
      entityA.velocity[1] = magnitude * normal[1];
    }
  } else if (isDynamicA < isDynamicB) {
    if (normal[0] !== 0) {
      entityB.velocity[0] = magnitude * -normal[0];
    } else {
      entityB.velocity[1] = magnitude * -normal[1];
    }
  } else {
    if (normal[0] !== 0) {
      entityA.velocity[0] = (magnitude / 2) * normal[0];
      entityB.velocity[0] = (magnitude / 2) * -normal[0];
    } else {
      entityA.velocity[1] = (magnitude / 2) * normal[1];
      entityB.velocity[1] = (magnitude / 2) * -normal[1];
    }
  }
}
