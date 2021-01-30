import {IAddon} from '../_types';
import {removeItem} from '../utils/array';
import {Entity} from '../Entity';
import {Scene} from '../Scene';

export class Entities<
  TAddons extends {},
  TTraits extends {},
  TEvents extends string
> implements IAddon {
  protected readonly children: Entity<TAddons, TTraits, TEvents>[];

  constructor(scene: Scene<TAddons, TEvents>) {
    this.children = [];

    scene.on('scene/removeChild', (child) => {
      this.removeChild(child);
    });
  }

  public addChild<T extends Entity<TAddons, TTraits, TEvents>[]>(...elems: T) {
    this.children.push(...elems);
  }

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

  public update(deltaTime: number) {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].update(deltaTime);
    }
  }

  public destroy() {
    this.children.length = 0;
  }
}
