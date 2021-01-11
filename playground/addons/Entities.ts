import {IAddon, Container, Entity, Scene} from '../../src';
import {AddonsType, TraitsType, EventsType} from '../types';

export class Entities
  extends Container<Entity<AddonsType, TraitsType, EventsType>>
  implements IAddon {
  constructor(scene: Scene<AddonsType, EventsType>) {
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
