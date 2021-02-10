import {Entity} from './Entity';
import {Tilemap} from './Tilemap';

export type TAnyEntity = Entity<any, any, any>;
export type TAnyTilemap = Tilemap<any, any>;

export type TVector2 = [number, number];
export type TVector3 = [number, number, number];

export interface IAddon {
  update(deltaTime: number): void;
  destroy(): void;
}

export interface ITrait {
  update(deltaTime: number): void;
  destroy(): void;
}

export interface ISpriteSheet<Texture> {
  getTexture(id: number): Texture | null;
  destroy(): void;
}
