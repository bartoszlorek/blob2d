export type Vector2Type = [number, number];
export type Vector3Type = [number, number, number];

export interface IAddon {
  update(deltaTime: number): void;
  destroy(): void;
}

export interface ITrait {
  update(deltaTime: number): void;
  destroy(): void;
}

export interface ISpriteSheet<Texture> {
  getTextureById(id: number): Texture | null;
  destroy(): void;
}

export interface IKeyframes {
  currentFrame: number;
  readonly firstgid: number;
  readonly lastgid: number;
}

export type IKeyframesDictionary<TKeys extends string> = {
  [K in TKeys]: IKeyframes | null;
};
