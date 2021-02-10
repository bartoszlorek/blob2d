import {TAnyEntity, TAnyTilemap, TVector2} from '../../_types';
import {Entity} from '../../Entity';
import {Tilemap} from '../../Tilemap';

export interface ICollisionStaticGroup<A, T, E extends string> {
  readonly type: 'static';
  readonly entities: Entity<A, T, E>[];
  readonly tilemaps: Tilemap<A, E>[];
  readonly resolver: TCollisionResolver<ICollisionStaticGroup<A, T, E>>;
  readonly response: TCollisionStaticResponse<any, any>;
}

export interface ICollisionDynamicGroup<A, T, E extends string> {
  readonly type: 'dynamic';
  readonly entitiesA: Entity<A, T, E>[];
  readonly entitiesB: Entity<A, T, E>[];
  readonly resolver: TCollisionResolver<ICollisionDynamicGroup<A, T, E>>;
  readonly response: TCollisionDynamicResponse<any, any>;
}

export interface ICollisionSelfDynamicGroup<A, T, E extends string> {
  readonly type: 'self_dynamic';
  readonly entities: Entity<A, T, E>[];
  readonly resolver: TCollisionResolver<ICollisionSelfDynamicGroup<A, T, E>>;
  readonly response: TCollisionDynamicResponse<any, any>;
}

export type ICollisionGroup<A, T, E extends string> =
  | ICollisionStaticGroup<A, T, E>
  | ICollisionDynamicGroup<A, T, E>
  | ICollisionSelfDynamicGroup<A, T, E>;

export type TCollisionResolver<T> = (group: T, deltaTime: number) => void;

export type TCollisionStaticResponse<
  A extends TAnyEntity = TAnyEntity,
  B extends TAnyTilemap = TAnyTilemap
> = (entity: A, tilemap: B, separation: ISeparation<TVector2>) => void;

export type TCollisionDynamicResponse<
  A extends TAnyEntity = TAnyEntity,
  B extends TAnyEntity = TAnyEntity
> = (entityA: A, entityB: B, separation: ISeparation<number>) => void;

export interface ISeparation<T extends number | TVector2> {
  magnitude: T;
  normal: TVector2;
}
