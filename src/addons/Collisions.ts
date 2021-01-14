import {IAddon} from '../types';
import {Entity} from '../Entity';
import {Tilemap} from '../Tilemap';
import {getTileSeparation} from './TilemapCollisions';

type Collider<A, T, E extends string> = Entity<A, T, E> | Tilemap<A, E>;

export class Collisions<
  AddonsType extends {},
  TraitsType extends {},
  EventsType extends string
> implements IAddon {
  protected entries: Collider<AddonsType, TraitsType, EventsType>[][];

  constructor() {
    this.entries = [];
    // todo: add scene removeChild listener and update entries each time
  }

  public add(
    ...colliders: Collider<AddonsType, TraitsType, EventsType>[]
  ): void {
    this.entries.push(colliders);
  }

  public update(deltaTime: number): void {
    for (let i = 0; i < this.entries.length; i++) {
      const [a, b] = this.entries[i];

      // todo: add more cases where two or more elements can collide
      if (
        a.type === 'entity' &&
        b.type === 'tilemap' &&
        a.intersects(b, b.tilesize)
      ) {
        const separation = getTileSeparation(b, a, deltaTime);
        a.velocity[0] = separation[0];
        a.velocity[1] = separation[1];
      }
    }
  }

  public destroy(): void {
    this.entries.length = 0;
  }
}
