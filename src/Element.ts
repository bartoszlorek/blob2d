import {DisplayObject} from 'pixi.js';
import {VectorType} from './types';
import {BoundingBox} from './BoundingBox';
import {Scene} from './Scene';

export class Element<EventType extends string> extends BoundingBox {
  public display: DisplayObject;
  public parent: Scene<EventType> | null;

  constructor(display: DisplayObject, min: VectorType, max: VectorType) {
    super(min, max);
    this.display = display;
    this.parent = null;

    // every element should update position at least once
    this.updateDisplayPosition();
  }

  public updateDisplayPosition(): void {
    this.display.x = this.min[0];
    this.display.y = this.min[1];
  }

  public destroy(): void {
    this.parent?.removeChild(this);
  }
}
