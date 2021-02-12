import {IAddon, ICamera} from '../types';
import {BoundingBox} from '../BoundingBox';
import {Scene} from '../Scene';

/**
 * Built-in addon positioning the scene on the screen.
 */
export class Camera<TAddons extends {}, TEvents extends string>
  implements IAddon, ICamera {
  public offsetX: number;
  public offsetY: number;

  protected scene: Scene<TAddons, TEvents>;

  constructor(scene: Scene<TAddons, TEvents>) {
    this.scene = scene;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  /**
   * Positions the given BoundingBox in the center of the screen.
   */
  public focus(bbox: BoundingBox) {
    this.offsetX += window.innerWidth / 2 - bbox.centerX;
    this.offsetY += window.innerHeight / 2 - bbox.centerY;
  }

  public follow() {}
  public followFixed() {}

  public update(deltaTime: number) {
    this.scene.foreground.x = this.offsetX;
    this.scene.foreground.y = this.offsetY;
  }

  public destroy() {}
}
