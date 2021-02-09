import {TVector2} from './_types';
import {IDisplayObject} from './_pixijs';
import {BoundingBox} from './BoundingBox';
import {Scene} from './Scene';

export class Element<
  TAddons extends {},
  TEvents extends string,
  TDisplay extends IDisplayObject = IDisplayObject
> extends BoundingBox {
  public name: string | null;
  public scene: Scene<TAddons, TEvents> | null;
  public readonly display: TDisplay;

  constructor(display: TDisplay, min?: TVector2, max?: TVector2) {
    super(min, max);

    this.name = null;
    this.scene = null;
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
