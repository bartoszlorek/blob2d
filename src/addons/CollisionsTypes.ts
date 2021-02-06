import {TVector2} from '../_types';
import {Entity} from '../Entity';
import {Tilemap} from '../Tilemap';

interface ICollisionStaticGroup<A, T, E extends string> {
  readonly type: 'static';
  readonly entities: Entity<A, T, E>[];
  readonly tilemaps: Tilemap<A, E>[];
  response(
    entity: Entity<A, T, E>,
    tilemap: Tilemap<A, E>,
    separation: TSeparation<TVector2>
  ): void;
}

interface ICollisionDynamicGroup<A, T, E extends string> {
  readonly type: 'dynamic';
  readonly entitiesA: Entity<A, T, E>[];
  readonly entitiesB: Entity<A, T, E>[];
  response(
    entityA: Entity<A, T, E>,
    entityB: Entity<A, T, E>,
    separation: TSeparation<number>
  ): void;
}

interface ICollisionSelfDynamicGroup<A, T, E extends string> {
  readonly type: 'self_dynamic';
  readonly entities: Entity<A, T, E>[];
  response(
    entityA: Entity<A, T, E>,
    entityB: Entity<A, T, E>,
    separation: TSeparation<number>
  ): void;
}

export type ICollisionGroup<A, T, E extends string> =
  | ICollisionStaticGroup<A, T, E>
  | ICollisionDynamicGroup<A, T, E>
  | ICollisionSelfDynamicGroup<A, T, E>;

export type TSeparation<T extends number | TVector2> = {
  magnitude: T;
  normal: TVector2;
};
