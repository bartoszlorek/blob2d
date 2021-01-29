import {IAddon, Vector2Type} from '../_types';
import {refineArray, removeItem} from '../utils/array';
import {Entity} from '../Entity';
import {Scene} from '../Scene';
import {Tilemap} from '../Tilemap';

import {getEntitySeparation} from './CollisionsEntity';
import {getTileSeparation} from './CollisionsTilemap';
import {ICollisionGroup} from './CollisionsTypes';

export class Collisions<
  TAddons extends {},
  TTraits extends {},
  TEvents extends string
> implements IAddon {
  protected groups: ICollisionGroup<TAddons, TTraits, TEvents>[];

  constructor(scene: Scene<TAddons, TEvents>) {
    scene.on('scene/removeChild', (child) => {
      this.removeGroupElement(child);
    });

    this.groups = [];
  }

  public addStatic<
    A extends Entity<TAddons, TTraits, TEvents>,
    B extends Tilemap<TAddons, TEvents>
  >(
    entities: A | A[],
    tilemaps: B | B[],
    callback: (entity: A, tilemap: B, separation: Vector2Type) => boolean
  ): void {
    this.groups.push(
      this.validateGroup({
        type: 'static',
        entities: refineArray(entities),
        tilemaps: refineArray(tilemaps),
        callback,
      })
    );
  }

  public addDynamic<
    A extends Entity<TAddons, TTraits, TEvents>,
    B extends Entity<TAddons, TTraits, TEvents>
  >(
    entitiesA: A | A[],
    entitiesB: B | B[],
    callback: (entityA: A, entityB: B, separation: Vector2Type) => boolean
  ): void {
    this.groups.push(
      this.validateGroup({
        type: 'dynamic',
        entitiesA: refineArray(entitiesA),
        entitiesB: refineArray(entitiesB),
        callback,
      })
    );
  }

  public addSelfDynamic<A extends Entity<TAddons, TTraits, TEvents>>(
    entities: A[],
    callback: (entityA: A, entityB: A, separation: Vector2Type) => boolean
  ): void {
    this.groups.push(
      this.validateGroup({
        type: 'self_dynamic',
        entities: refineArray(entities),
        callback,
      })
    );
  }

  public update(deltaTime: number): void {
    for (let i = 0; i < this.groups.length; i++) {
      this.resolveGroup(this.groups[i], deltaTime);
    }
  }

  protected resolveGroup(
    group: ICollisionGroup<TAddons, TTraits, TEvents>,
    deltaTime: number
  ): void {
    switch (group.type) {
      case 'static': {
        const {entities, tilemaps, callback} = group;

        if (entities.length > 1) {
          for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];

            // bypass loop
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

          // bypass loop
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

            // bypass loop
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

          // bypass loop
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
    callback: (entity: A, tilemap: B, separation: Vector2Type) => boolean
  ): void {
    if (entity.intersects(tilemap.actualBounds, tilemap.tilesize)) {
      const separation = getTileSeparation(tilemap, entity, deltaTime);

      if (separation && callback(entity, tilemap, separation)) {
        entity.velocity[0] = separation[0];
        entity.velocity[1] = separation[1];
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
    callback: (entity: A, tilemap: B, separation: Vector2Type) => boolean
  ): void {
    if (entityA.intersects(entityB)) {
      const separation = getEntitySeparation(entityA, entityB, deltaTime);

      if (callback(entityA, entityB, separation)) {
        // todo: use velocity instead of position
        entityA.translateX(separation[0] / 2);
        entityA.translateY(separation[1] / 2);
        entityB.translateX(-separation[0] / 2);
        entityB.translateY(-separation[1] / 2);
      }
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

  public destroy(): void {
    this.groups.length = 0;
  }
}

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}
