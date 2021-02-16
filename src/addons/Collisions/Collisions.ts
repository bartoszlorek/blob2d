import {Entity} from '../../Entity';
import {Scene} from '../../Scene';
import {Tilemap} from '../../Tilemap';
import {IAddon} from '../../types';
import {refineArray, removeItem} from '../../utils/array';
import {
  resolveDynamicGroup,
  resolveSelfDynamicGroup,
  resolveStaticGroup,
} from './GroupResolvers';
import {dynamicResponse, staticResponse} from './GroupResponses';
import {
  ICollisionGroup,
  TCollisionDynamicResponse,
  TCollisionStaticResponse,
} from './types';

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
  public readonly groups: ICollisionGroup<TAddons, TTraits, TEvents>[];

  constructor(scene: Scene<TAddons, TEvents>) {
    scene.on('elementRemoved', elem => {
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
    response: TCollisionStaticResponse<A, B>
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
    response: TCollisionDynamicResponse<A, B>
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
    response: TCollisionDynamicResponse<A, A>
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
      // @ts-ignore we can assert the resolver will match own group type
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
   * Clears groups data.
   */
  public destroy() {
    this.groups.length = 0;
  }
}

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}
