import {TAnyEntity, TAnyTilemap, TVector2} from '../../types';

export interface ICollisionGroup<TChild> {
  resolve(deltaTime: number): void;
  removeChild(child: TChild): boolean;
  validate(): void;
  destroy(): void;
}

export interface ISeparation<T extends number | TVector2> {
  magnitude: T;
  normal: TVector2;
}

export type TCollisionStaticResponse<
  A extends TAnyEntity = TAnyEntity,
  B extends TAnyTilemap = TAnyTilemap
> = (entity: A, tilemap: B, separation: ISeparation<TVector2>) => void;

export type TCollisionDynamicResponse<
  A extends TAnyEntity = TAnyEntity,
  B extends TAnyEntity = TAnyEntity
> = (entityA: A, entityB: B, separation: ISeparation<number>) => void;
