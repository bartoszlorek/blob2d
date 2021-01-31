import {TVector2} from './_types';
import {IDisplayObject} from './_pixijs';
import {BoundingBox} from './BoundingBox';
import {Scene} from './Scene';

export class Element<
  TAddons extends {},
  TEvents extends string,
  TDisplay extends IDisplayObject = IDisplayObject
> extends BoundingBox {
  public readonly display: TDisplay;
  public scene: Scene<TAddons, TEvents> | null;
  public name: string | null;

  constructor(display: TDisplay, min?: TVector2, max?: TVector2) {
    super(min, max);

    this.display = display;
    this.scene = null;
    this.name = null;

    // every element should update position at least once
    this.updateDisplayPosition();
  }

  /**
   * Updates display object from bbox position.
   */
  public updateDisplayPosition() {
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
