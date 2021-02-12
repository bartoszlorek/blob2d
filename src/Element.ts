import {DisplayObject} from 'pixi.js';
import {BoundingBox} from './BoundingBox';
import {Scene} from './Scene';

export class Element<
  TAddons extends {},
  TEvents extends string,
  TDisplay extends DisplayObject = DisplayObject
> extends BoundingBox {
  public name: string | null;
  public scene: Scene<TAddons, TEvents> | null;
  public readonly display: TDisplay;

  constructor(display: TDisplay) {
    super();

    this.name = null;
    this.scene = null;
    this.x = 0;
    this.y = 0;

    this.display = display;
    this.updateDisplay();
  }

  /**
   * Updates display based on the bounding box.
   */
  protected updateDisplay() {
    this.display.x = this.min[0];
    this.display.y = this.min[1];
  }

  /**
   * Removes this element from the parent scene.
   */
  public destroy() {
    this.scene?.removeElement(this);
  }
}
