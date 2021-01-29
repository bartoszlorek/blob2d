import {IAddon, Container, Entity, Scene} from '../../src';
import {Addons, Traits, Events} from '../types';

export class Entities
  extends Container<Entity<Addons, Traits, Events>>
  implements IAddon {
  constructor(scene: Scene<Addons, Events>) {
    super();

    scene.on('scene/removeChild', (child) => {
      this.removeChild(child);
    });
  }

  public update(deltaTime: number): void {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].update(deltaTime);
    }
  }
}
