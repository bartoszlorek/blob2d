import {Entity} from './Entity';

export class Trait<EventType extends string> {
  public name: string;
  public parent: Entity<EventType> | null;

  constructor(name: string) {
    this.name = name;
    this.parent = null;
  }

  public update(deltaTime: number): void {
    // fill in subclass
  }

  public destroy(): void {
    // fill in subclass
  }
}
