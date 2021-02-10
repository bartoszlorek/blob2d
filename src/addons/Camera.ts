import {IAddon} from '../_types';
import {Scene} from '../Scene';

/**
 * Built-in addon positioning the scene on the screen.
 */
export class Camera<TAddons extends {}, TEvents extends string>
  implements IAddon {
  public readonly scene: Scene<TAddons, TEvents>;
  public offsetX: number;
  public offsetY: number;

  constructor(scene: Scene<TAddons, TEvents>) {
    this.scene = scene;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  update(deltaTime: number): void {
    // throw new Error('Method not implemented.');
  }

  destroy(): void {
    // throw new Error('Method not implemented.');
  }
}
