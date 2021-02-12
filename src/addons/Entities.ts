import {IAddon} from '../types';
import {removeItem} from '../utils/array';
import {Entity} from '../Entity';
import {Scene} from '../Scene';

/**
 * Built-in addon updating traits of each entity.
 */
export class Entities<
  TAddons extends {},
  TTraits extends {},
  TEvents extends string
> implements IAddon {
  public readonly children: Entity<TAddons, TTraits, TEvents>[];

  constructor(scene: Scene<TAddons, TEvents>) {
    this.children = [];

    scene.on('elementRemoved', elem => {
      this.removeChild(elem);
    });
  }

  /**
   * Adds one or many children.
   */
  public addChild<T extends Entity<TAddons, TTraits, TEvents>[]>(...elems: T) {
    this.children.push(...elems);
  }

  /**
   * Removes one or many children.
   */
  public removeChild<T extends Entity<TAddons, TTraits, TEvents>[]>(
    ...elems: T
  ) {
    if (elems.length > 1) {
      for (let i = 0; i < elems.length; i++) {
        removeItem(this.children, elems[i]);
      }
    } else {
      removeItem(this.children, elems[0]);
    }
  }

  /**
   * Updates each child.
   */
  public update(deltaTime: number) {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].update(deltaTime);
    }
  }

  /**
   * Clears all children.
   */
  public destroy() {
    this.children.length = 0;
  }
}
