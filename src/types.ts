export type VectorType = [number, number];

export interface IAddon {
  update(deltaTime: number): void;
  destroy(): void;
}
