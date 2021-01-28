import {Vector2Type} from './_types';
import {IDisplayObject} from './_pixijs';
import {BoundingBox} from './BoundingBox';
import {Scene} from './Scene';

export class Element<
  AddonsType extends {},
  EventsType extends string,
  DisplayType extends IDisplayObject = IDisplayObject
> extends BoundingBox {
  public readonly display: DisplayType;
  public scene: Scene<AddonsType, EventsType> | null;
  public name: string | null;

  constructor(display: DisplayType, min?: Vector2Type, max?: Vector2Type) {
    super(min, max);

    this.display = display;
    this.scene = null;
    this.name = null;

    // every element should update position at least once
    this.updateDisplayPosition();
  }

  public updateDisplayPosition(): void {
    this.display.x = this.min[0];
    this.display.y = this.min[1];
  }

  public destroy(): void {
    this.scene?.removeChild(this);
  }
}
