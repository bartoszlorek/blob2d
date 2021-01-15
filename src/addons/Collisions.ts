import {IAddon} from '../types';
import {Entity} from '../Entity';
import {Tilemap} from '../Tilemap';
import {RefineArrayType, refineArray, concatArray} from '../utils/array';
import {getTileSeparation} from './TilemapCollisions';

interface ICollisionGroup<A, T, E extends string> {
  readonly entities: Entity<A, T, E>[];
  readonly tilemaps: Tilemap<A, E>[];
  callback(
    bodyA: Entity<A, T, E>,
    bodyB: Entity<A, T, E> | Tilemap<A, E>
  ): boolean;
}

export class Collisions<
  AddonsType extends {},
  TraitsType extends {},
  EventsType extends string
> implements IAddon {
  protected groups: ICollisionGroup<AddonsType, TraitsType, EventsType>[];

  constructor() {
    // todo: add scene removeChild listener and update groups each time
    this.groups = [];
  }

  /**
   * @param bodyA - a single `Entity` or array of them
   * @param bodyB - other `Entity`, `Tilemap` or array of each
   * @param callback - returns `boolean`
   *
   * @example
   * // e - Entity, t - Tilemap
   * collisions.add(player, ground, (e, t) => true);
   * collisions.add(player, enemy, (e, e) => true);
   * collisions.add(player, [ground, ground], (e, t) => true);
   * collisions.add([player, player], ground, (e, t) => true);
   * collisions.add([player, player], [enemy, enemy], (e, e) => true);
   */
  public add<
    BodyA extends
      | Entity<AddonsType, TraitsType, EventsType>
      | Entity<AddonsType, TraitsType, EventsType>[],
    BodyB extends
      | Entity<AddonsType, TraitsType, EventsType>
      | Entity<AddonsType, TraitsType, EventsType>[]
      | Tilemap<AddonsType, EventsType>
      | Tilemap<AddonsType, EventsType>[]
  >(
    bodyA: BodyA,
    bodyB: BodyB,
    callback: (
      bodyA: RefineArrayType<BodyA, Entity<AddonsType, TraitsType, EventsType>>,
      bodyB: RefineArrayType<
        BodyB,
        | Entity<AddonsType, TraitsType, EventsType>
        | Tilemap<AddonsType, EventsType>
      >
    ) => boolean
  ): void {
    const arrA = refineArray(bodyA);
    const arrB = refineArray<
      | Entity<AddonsType, TraitsType, EventsType>
      | Tilemap<AddonsType, EventsType>
    >(bodyB);

    if (arrA.length === 1 && arrB.length === 0) {
      throw new Error('collision group with only one entity requires tilemap');
    }

    if (arrB[0].type === 'entity') {
      this.groups.push({
        entities: concatArray(
          arrA,
          arrB as Entity<AddonsType, TraitsType, EventsType>[]
        ),
        tilemaps: [],
        callback,
      });
    } else {
      this.groups.push({
        entities: arrA,
        tilemaps: arrB as Tilemap<AddonsType, EventsType>[],
        callback,
      });
    }
  }

  public update(deltaTime: number): void {
    for (let i = 0; i < this.groups.length; i++) {
      const {entities, tilemaps, callback} = this.groups[i];

      // for one argument we can bypass looping through them
      if (entities.length > 1) {
        // todo: handle more entities
      } else {
        const entity = entities[0];

        if (tilemaps.length > 1) {
          for (let j = 0; j < tilemaps.length; j++) {
            this.detectTileCollision(entity, tilemaps[j], deltaTime, callback);
          }
        } else {
          this.detectTileCollision(entity, tilemaps[0], deltaTime, callback);
        }
      }
    }
  }

  protected detectTileCollision<
    EntityType extends Entity<AddonsType, TraitsType, EventsType>,
    TilemapType extends Tilemap<AddonsType, EventsType>
  >(
    entity: EntityType,
    tilemap: TilemapType,
    deltaTime: number,
    callback: (entity: EntityType, tilemap: TilemapType) => boolean
  ): void {
    if (!entity.intersects(tilemap, tilemap.tilesize)) return;

    const separation = getTileSeparation(tilemap, entity, deltaTime);
    if (separation[2] && callback(entity, tilemap)) {
      entity.velocity[0] = separation[0];
      entity.velocity[1] = separation[1];
    }
  }

  public destroy(): void {
    this.groups.length = 0;
  }
}
