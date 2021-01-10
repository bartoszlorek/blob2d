import {DisplayObject} from 'pixi.js';
import {BoundingBox} from './BoundingBox';
import {Scene} from './Scene';

export class Element<
  AddonsType extends {},
  EventsType extends string
> extends BoundingBox {
  public display: DisplayObject;
  public scene: Scene<AddonsType, EventsType> | null;

  constructor(display: DisplayObject) {
    super();

    this.display = display;
    this.scene = null;

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
