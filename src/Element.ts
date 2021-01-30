import {Vector2Type} from './_types';
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

  constructor(display: TDisplay, min?: Vector2Type, max?: Vector2Type) {
    super(min, max);

    this.display = display;
    this.scene = null;
    this.name = null;

    // every element should update position at least once
    this.updateDisplayPosition();
  }

  public updateDisplayPosition() {
    this.display.x = this.min[0];
    this.display.y = this.min[1];
  }

  public destroy() {
    this.scene?.removeChild(this);
  }
}
