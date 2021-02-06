import {IAddon, TVector2} from '../_types';
import {refineArray, removeItem} from '../utils/array';
import {BoundingBox} from '../BoundingBox';
import {Entity} from '../Entity';
import {Scene} from '../Scene';
import {Tilemap} from '../Tilemap';

import {getEntitySeparation} from './CollisionsEntity';
import {getTileSeparation} from './CollisionsTilemap';
import {ICollisionGroup, TSeparation} from './CollisionsTypes';

// pre-allocated data
const _cloneA = new BoundingBox();
const _cloneB = new BoundingBox();

/**
 * Built-in addon for arcade collision detection.
 * Handles entity-entity and entity-tilemap collisions.
 */
export class Collisions<
  TAddons extends {},
  TTraits extends {},
  TEvents extends string
> implements IAddon {
  protected groups: ICollisionGroup<TAddons, TTraits, TEvents>[];

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
    callback: (entity: A, tilemap: B, separation: TSeparation<TVector2>) => void
  ) {
    this.groups.push(
      this.validateGroup({
        type: 'static',
        entities: refineArray(entities),
        tilemaps: refineArray(tilemaps),
        callback,
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
    callback: (entityA: A, entityB: B, separation: TSeparation<number>) => void
  ) {
    this.groups.push(
      this.validateGroup({
        type: 'dynamic',
        entitiesA: refineArray(entitiesA),
        entitiesB: refineArray(entitiesB),
        callback,
      })
    );
  }

  /**
   * Handles an entity-entity collision group where
   * each element should collide with each other.
   */
  public addSelfDynamic<A extends Entity<TAddons, TTraits, TEvents>>(
    entities: A[],
    callback: (entityA: A, entityB: A, separation: TSeparation<number>) => void
  ) {
    this.groups.push(
      this.validateGroup({
        type: 'self_dynamic',
        entities: refineArray(entities),
        callback,
      })
    );
  }

  /**
   * Resolves collisions groups at each game tick.
   */
  public update(deltaTime: number) {
    for (let i = 0; i < this.groups.length; i++) {
      this.resolveGroup(this.groups[i], deltaTime);
    }
  }

  protected resolveGroup(
    group: ICollisionGroup<TAddons, TTraits, TEvents>,
    deltaTime: number
  ) {
    // TODO: (optimization) create resolving method separately
    // for each group type and call it directly
    switch (group.type) {
      case 'static': {
        const {entities, tilemaps, callback} = group;

        if (entities.length > 1) {
          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];

            // bypass loop for one element
            if (tilemaps.length > 1) {
              for (let j = 0; j < tilemaps.length; j++) {
                this.collideTile(entity, tilemaps[j], deltaTime, callback);
              }
            } else {
              this.collideTile(entity, tilemaps[0], deltaTime, callback);
            }
          }
        } else {
          // a single entity collision
          const entity = entities[0];

          // bypass loop for one element
          if (tilemaps.length > 1) {
            for (let j = 0; j < tilemaps.length; j++) {
              this.collideTile(entity, tilemaps[j], deltaTime, callback);
            }
          } else {
            this.collideTile(entity, tilemaps[0], deltaTime, callback);
          }
        }

        break;
      }

      case 'dynamic': {
        const {entitiesA, entitiesB, callback} = group;

        // it is optimized for the first subgroup,
        // which often has only one element
        if (entitiesA.length > 1) {
          for (let i = 0; i < entitiesA.length; i++) {
            const entity = entitiesA[i];

            // bypass loop for one element
            if (entitiesB.length > 1) {
              for (let j = 0; j < entitiesB.length; j++) {
                this.collideEntity(entity, entitiesB[j], deltaTime, callback);
              }
            } else {
              this.collideEntity(entity, entitiesB[0], deltaTime, callback);
            }
          }
        } else {
          // a single entity collision
          const entity = entitiesA[0];

          // bypass loop for one element
          if (entitiesB.length > 1) {
            for (let j = 0; j < entitiesB.length; j++) {
              this.collideEntity(entity, entitiesB[j], deltaTime, callback);
            }
          } else {
            this.collideEntity(entity, entitiesB[0], deltaTime, callback);
          }
        }

        break;
      }

      case 'self_dynamic': {
        const {entities, callback} = group;

        for (let i = 0; i < entities.length; i++) {
          for (let j = i + 1; j < entities.length; j++) {
            this.collideEntity(entities[i], entities[j], deltaTime, callback);
          }
        }

        break;
      }

      default:
        assertNever(group);
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

  protected collideTile<
    A extends Entity<TAddons, TTraits, TEvents>,
    B extends Tilemap<TAddons, TEvents>
  >(
    entity: A,
    tilemap: B,
    deltaTime: number,
    callback: (entity: A, tilemap: B, separation: TSeparation<TVector2>) => void
  ) {
    _cloneA.copy(entity);
    _cloneA.translateX(entity.velocity[0] * deltaTime);
    _cloneA.translateY(entity.velocity[1] * deltaTime);

    if (_cloneA.intersects(tilemap.actualBounds)) {
      const separation = getTileSeparation(tilemap, entity, deltaTime);

      if (separation) {
        callback(entity, tilemap, separation);
      }
    }
  }

  protected collideEntity<
    A extends Entity<TAddons, TTraits, TEvents>,
    B extends Entity<TAddons, TTraits, TEvents>
  >(
    entityA: A,
    entityB: B,
    deltaTime: number,
    callback: (entity: A, tilemap: B, separation: TSeparation<number>) => void
  ) {
    _cloneA.copy(entityA);
    _cloneA.translateX(entityA.velocity[0] * deltaTime);
    _cloneA.translateY(entityA.velocity[1] * deltaTime);

    _cloneB.copy(entityB);
    _cloneB.translateX(entityB.velocity[0] * deltaTime);
    _cloneB.translateY(entityB.velocity[1] * deltaTime);

    if (_cloneA.intersects(_cloneB)) {
      const isDynamicA = entityA.physics === 'dynamic';
      const isDynamicB = entityB.physics === 'dynamic';
      let separation;

      if (isDynamicA > isDynamicB) {
        separation = getEntitySeparation(entityA, _cloneB, deltaTime);
      } else if (isDynamicA < isDynamicB) {
        separation = getEntitySeparation(_cloneA, entityB, deltaTime);
      } else {
        separation = getEntitySeparation(entityA, entityB, deltaTime);
      }

      callback(entityA, entityB, separation);
    }
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
   * Clears all groups data.
   */
  public destroy() {
    this.groups.length = 0;
  }

  /**
   * Built-in response for a static collision.
   */
  static staticResponse<TAddons, TTraits, TEvents extends string>(
    entity: Entity<TAddons, TTraits, TEvents>,
    tilemap: Tilemap<TAddons, TEvents>,
    separation: TSeparation<TVector2>
  ): void {
    const {length, normal} = separation;
    if (normal[0] !== 0) entity.velocity[0] = normal[0] * length[0];
    if (normal[1] !== 0) entity.velocity[1] = normal[1] * length[1];
  }

  /**
   * Built-in response for a dynamic collision.
   */
  static dynamicResponse<TAddons, TTraitsA, TTraitsB, TEvents extends string>(
    entityA: Entity<TAddons, TTraitsA, TEvents>,
    entityB: Entity<TAddons, TTraitsB, TEvents>,
    separation: TSeparation<number>
  ): void {
    const {length, normal} = separation;
    const isDynamicA = entityA.physics === 'dynamic';
    const isDynamicB = entityB.physics === 'dynamic';

    if (isDynamicA > isDynamicB) {
      if (normal[0] !== 0) {
        entityA.velocity[0] = normal[0] * length;
      } else {
        entityA.velocity[1] = normal[1] * length;
      }
    } else if (isDynamicA < isDynamicB) {
      if (normal[0] !== 0) {
        entityB.velocity[0] = -normal[0] * length;
      } else {
        entityB.velocity[1] = -normal[1] * length;
      }
    } else {
      if (normal[0] !== 0) {
        entityA.velocity[0] = (normal[0] * length) / 2;
        entityB.velocity[0] = (-normal[0] * length) / 2;
      } else {
        entityA.velocity[1] = (normal[1] * length) / 2;
        entityB.velocity[1] = (-normal[1] * length) / 2;
      }
    }
  }
}

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}
