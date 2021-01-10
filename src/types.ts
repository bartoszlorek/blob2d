export type VectorType = [number, number];

export interface IComponent {
  update(deltaTime: number): void;
  destroy(): void;
}
