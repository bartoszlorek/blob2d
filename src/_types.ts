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
  getTextureByGID(gid: number): Texture | null;
  destroy(): void;
}
